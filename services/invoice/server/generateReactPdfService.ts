import { NextRequest, NextResponse } from "next/server";

// Types
import { invoiceInputErrorResponse, readInvoiceRequest } from "@/lib/invoiceRequest";

/**
 * Generate a PDF document using React-PDF
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generateReactPdfService(req: NextRequest) {
  try {
    const body = await readInvoiceRequest(req, true);
    const { renderReactPdf } = await import("./renderReactPdf");
    const pdfBuffer = await renderReactPdf(body);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
      status: 200,
    });
  } catch (error) {
    const inputError = invoiceInputErrorResponse(error);
    if (inputError) return inputError;
    console.error("React PDF Generation Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to generate PDF with React-PDF", 
        details: error instanceof Error ? error.message : String(error)
      }), 
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
