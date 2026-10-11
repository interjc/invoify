import { NextRequest, NextResponse } from "next/server";

import { invoiceInputErrorResponse, readInvoiceRequest } from "@/lib/invoiceRequest";
import { ExportTypes } from "@/types";

/** Export only bounded invoice data, loading a serializer when it is requested. */
export async function exportInvoiceService(req: NextRequest) {
    const format = req.nextUrl.searchParams.get("format");
    if (format !== ExportTypes.JSON && format !== ExportTypes.CSV && format !== ExportTypes.XML) {
        return NextResponse.json({ error: "Unsupported export format" }, { status: 400 });
    }

    try {
        const body = await readInvoiceRequest(req);
        switch (format) {
            case ExportTypes.JSON:
                return new NextResponse(JSON.stringify(body), {
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Disposition": "attachment; filename=invoice.json",
                    },
                });
            case ExportTypes.CSV: {
                const { AsyncParser } = await import("@json2csv/node");
                const csv = await new AsyncParser().parse(body).promise();
                return new NextResponse(csv, {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition": "attachment; filename=invoice.csv",
                    },
                });
            }
            case ExportTypes.XML: {
                const { Builder } = await import("xml2js");
                return new NextResponse(new Builder().buildObject(body), {
                    headers: {
                        "Content-Type": "application/xml",
                        "Content-Disposition": "attachment; filename=invoice.xml",
                    },
                });
            }
        }
    } catch (error) {
        const inputError = invoiceInputErrorResponse(error);
        if (inputError) return inputError;
        console.error("Invoice export failed", error);
        return NextResponse.json({ error: "Failed to export invoice" }, { status: 500 });
    }
}
