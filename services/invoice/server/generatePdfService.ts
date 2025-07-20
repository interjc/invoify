import { NextRequest, NextResponse } from "next/server";

// React PDF Service
import { generateReactPdfService } from "./generateReactPdfService";

// Types
import { InvoiceType } from "@/types";

/**
 * Generate a PDF document of an invoice using React-PDF.
 * This is the main entry point that delegates to the React-PDF service.
 *
 * @async
 * @param {NextRequest} req - The Next.js request object.
 * @throws {Error} If there is an error during the PDF generation process.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object containing the generated PDF.
 */
export async function generatePdfService(req: NextRequest) {
	try {
		// Use React-PDF for all PDF generation
		return await generateReactPdfService(req);
	} catch (error) {
		console.error("PDF Generation Service Error:", error);
		return new NextResponse(
			JSON.stringify({ 
				error: "Failed to generate PDF", 
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
