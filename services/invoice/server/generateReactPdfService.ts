import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from '@react-pdf/renderer';

// Types
import { InvoiceType } from "@/types";

// React PDF Templates
import ReactPDFInvoiceTemplate1 from "@/app/components/templates/invoice-pdf-react/ReactPDFInvoiceTemplate1";

/**
 * Get the React PDF template component by ID
 */
function getReactPDFTemplate(templateId: number) {
  switch (templateId) {
    case 1:
    default:
      return ReactPDFInvoiceTemplate1;
  }
}

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
    const body: InvoiceType = await req.json();
    const templateId = body.details.pdfTemplate;
    
    // Get the React PDF template
    const TemplateComponent = getReactPDFTemplate(templateId);
    const document = TemplateComponent(body);
    
    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(document);
    
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