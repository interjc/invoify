import { NextRequest } from "next/server";

// Nodemailer
import nodemailer, { SendMailOptions } from "nodemailer";

// React-email
import { render } from "@react-email/render";
import { z } from "zod";

// Components
import SendPdfEmail from "@/app/components/templates/email/SendPdfEmail";

// Helpers
import { InvoiceInputError, MAX_EMAIL_BODY_BYTES, MAX_EMAIL_PDF_BYTES, readBoundedBody } from "@/lib/invoiceRequest";

// Variables
import { NODEMAILER_EMAIL, NODEMAILER_PW } from "@/lib/variables";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PW,
    },
});

const emailFieldsSchema = z.object({
    email: z.string().email().max(254),
    invoiceNumber: z.string().max(200),
});

/**
 * Send a PDF as an email attachment.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean, indicating whether the email was sent successfully.
 * @throws {Error} Throws an error if there is an issue with sending the email.
 */
export async function sendPdfToEmailService(
    req: NextRequest
): Promise<boolean> {
    const bytes = await readBoundedBody(req, MAX_EMAIL_BODY_BYTES);
    let fd: FormData;
    try {
        fd = await new Response(bytes, { headers: req.headers }).formData();
    } catch {
        throw new InvoiceInputError("Invalid email form data");
    }

    // Get form data values
    const fields = emailFieldsSchema.safeParse({ email: fd.get("email"), invoiceNumber: fd.get("invoiceNumber") });
    const invoicePdf = fd.get("invoicePdf");
    if (!fields.success || !(invoicePdf instanceof Blob) || invoicePdf.size === 0) {
        throw new InvoiceInputError("Invalid email or PDF attachment");
    }
    if (invoicePdf.size > MAX_EMAIL_PDF_BYTES) {
        throw new InvoiceInputError("PDF attachment is too large", 413);
    }
    const { email, invoiceNumber } = fields.data;
    const invoiceBuffer = Buffer.from(await invoicePdf.arrayBuffer());
    if (invoiceBuffer.toString("ascii", 0, 5) !== "%PDF-") {
        throw new InvoiceInputError("Invalid PDF attachment");
    }

    // Get email html content
    const emailHTML = await render(SendPdfEmail({ invoiceNumber }));

    try {
        const mailOptions: SendMailOptions = {
            from: "Invoify",
            to: email,
            subject: `Invoice Ready: #${invoiceNumber}`,
            html: emailHTML,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: invoiceBuffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email", error);
        return false;
    }
}
