import { Buffer } from "node:buffer";
import { z } from "zod";

import type { InvoiceType } from "@/types";

// Bound work before JSON parsing, image decoding, or PDF layout begins.
export const MAX_INVOICE_BODY_BYTES = 6 * 1024 * 1024;
export const MAX_EMAIL_BODY_BYTES = 12 * 1024 * 1024;
export const MAX_EMAIL_PDF_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 4_000_000;
const MAX_IMAGE_STRING_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 64;

export class InvoiceInputError extends Error {
    constructor(message: string, public readonly status: 400 | 413 = 400) {
        super(message);
        this.name = "InvoiceInputError";
    }
}

export function invoiceInputErrorResponse(error: unknown): Response | undefined {
    if (error instanceof InvoiceInputError) {
        return Response.json({ error: error.message }, { status: error.status });
    }
}

/** Count actual stream bytes as Content-Length may be missing or inaccurate. */
export async function readBoundedBody(request: Request, maxBytes: number) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > maxBytes) {
        throw new InvoiceInputError("Request body is too large", 413);
    }
    if (!request.body) {
        throw new InvoiceInputError("Request body is required");
    }

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > maxBytes) {
                await reader.cancel().catch(() => undefined);
                throw new InvoiceInputError("Request body is too large", 413);
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return body;
}

const shortText = z.string().max(200);
const number = z.coerce.number().finite().min(-Number.MAX_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER);
const party = z.object({
    name: shortText,
    address: z.string().max(500),
    zipCode: shortText,
    city: shortText,
    country: shortText,
    email: shortText,
    phone: shortText,
    customInputs: z.array(z.object({ key: shortText, value: z.string().max(1000) })).max(20).optional(),
});

// This is a wire schema, distinct from the form schema's Date inputs and
// required-field rules. Empty drafts must still be exportable.
const invoiceRequestSchema = z.object({
    sender: party,
    receiver: party,
    details: z.object({
        invoiceLogo: z.string().max(MAX_IMAGE_STRING_LENGTH).optional(),
        invoiceNumber: shortText,
        invoiceDate: z.string().max(100),
        dueDate: z.string().max(100),
        purchaseOrderNumber: shortText.optional(),
        currency: z.string().max(20),
        language: z.string().max(100),
        items: z.array(z.object({
            name: z.string().max(500),
            description: z.string().max(2000).optional(),
            quantity: number,
            unitPrice: number,
            total: number,
        })).max(200),
        paymentInformation: z.object({ bankName: shortText, accountName: shortText, accountNumber: shortText }).optional(),
        taxDetails: z.object({ amount: number, taxID: shortText, amountType: shortText }).optional(),
        discountDetails: z.object({ amount: number, amountType: shortText }).optional(),
        shippingDetails: z.object({ cost: number, costType: shortText }).optional(),
        subTotal: number.default(0),
        totalAmount: number.default(0),
        totalAmountInWords: z.string().max(1000),
        additionalNotes: z.string().max(5000).optional(),
        paymentTerms: z.string().max(5000),
        // Clearing the signature in the form uses an empty string. Preserve
        // export support for that draft state while normalizing it to absent.
        signature: z.preprocess(
            (value) => value === "" ? undefined : value,
            z.object({ data: z.string().max(MAX_IMAGE_STRING_LENGTH), fontFamily: shortText.optional() }).optional()
        ),
        updatedAt: z.string().max(100).optional(),
        // Preserve fallback to template 1 for unsupported IDs.
        pdfTemplate: z.number().int().finite(),
    }),
});

function imageDimensions(bytes: Buffer): { width: number; height: number } | undefined {
    if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString("ascii", 12, 16) === "IHDR") {
        return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    }
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return;
    let offset = 2;
    while (offset < bytes.length) {
        if (bytes[offset++] !== 0xff) return;
        while (offset < bytes.length && bytes[offset] === 0xff) offset++;
        const marker = bytes[offset++];
        if (marker === 0xd9 || marker === 0xda) return;
        if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
        if (offset + 2 > bytes.length) return;
        const length = bytes.readUInt16BE(offset);
        if (length < 2 || offset + length > bytes.length) return;
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
            if (length < 8) return;
            return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
        }
        offset += length;
    }
}

function validatePdfImage(value: string) {
    if (!value) return;
    const match = /^data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
    if (!match || match[2].length % 4 !== 0) {
        throw new InvoiceInputError("PDF images must be embedded PNG or JPEG data URLs");
    }
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length > MAX_IMAGE_BYTES) throw new InvoiceInputError("PDF image is too large", 413);
    const dimensions = imageDimensions(bytes);
    const matchesFormat = match[1] === "png" ? bytes[0] === 137 : bytes[0] === 0xff;
    if (!matchesFormat || !dimensions || !dimensions.width || !dimensions.height) {
        throw new InvoiceInputError("Invalid PDF image");
    }
    if (dimensions.width * dimensions.height > MAX_IMAGE_PIXELS) {
        throw new InvoiceInputError("PDF image has too many pixels", 413);
    }
}

export async function readInvoiceRequest(request: Request, forPdf = false): Promise<InvoiceType> {
    const bytes = await readBoundedBody(request, MAX_INVOICE_BODY_BYTES);
    let body: unknown;
    try {
        body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        throw new InvoiceInputError("Invalid JSON body");
    }
    const result = invoiceRequestSchema.safeParse(body);
    if (!result.success) {
        const oversized = result.error.issues.some((issue) => issue.code === "too_big");
        throw new InvoiceInputError(oversized ? "Invoice exceeds supported limits" : "Invalid invoice data", oversized ? 413 : 400);
    }
    const invoice = result.data;
    if (forPdf) {
        for (const date of [invoice.details.invoiceDate, invoice.details.dueDate]) {
            if (!date || !Number.isFinite(Date.parse(date))) throw new InvoiceInputError("Invalid invoice dates");
        }
        validatePdfImage(invoice.details.invoiceLogo ?? "");
        const signature = invoice.details.signature?.data ?? "";
        if (signature.startsWith("data:")) validatePdfImage(signature);
        else if (signature.length > 200) throw new InvoiceInputError("Signature text is too long", 413);

        const { invoiceLogo, signature: omittedSignature, ...textDetails } = invoice.details;
        // Also cap aggregate layout work, even when every individual field fits.
        if (JSON.stringify({ sender: invoice.sender, receiver: invoice.receiver, details: textDetails }).length > 100_000) {
            throw new InvoiceInputError("Invoice contains too much text", 413);
        }
    }
    return invoice;
}
