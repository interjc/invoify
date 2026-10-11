import { NextRequest, NextResponse } from "next/server";

// Services
import { sendPdfToEmailService } from "@/services/invoice/server/sendPdfToEmailService";
import { invoiceInputErrorResponse } from "@/lib/invoiceRequest";

export async function POST(req: NextRequest) {
    try {
        const emailSent = await sendPdfToEmailService(req);

        if (emailSent) {
            return new NextResponse("Email sent successfully", {
                status: 200,
            });
        } else {
            return new NextResponse("Failed to send email", {
                status: 500,
            });
        }
    } catch (err) {
        const inputError = invoiceInputErrorResponse(err);
        if (inputError) return inputError;
        console.log(err);
        return new NextResponse("Failed to send email", { status: 500 });
    }
}
