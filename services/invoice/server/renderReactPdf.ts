import ReactPDFInvoiceTemplate1 from "@/app/components/templates/invoice-pdf-react/ReactPDFInvoiceTemplate1";
import type { InvoiceType } from "@/types";

// This module loads only after validation; its static imports let OpenNext
// bundle the renderer with regular React rather than the RSC runtime.
export async function renderReactPdf(data: InvoiceType) {
  return renderToBuffer(ReactPDFInvoiceTemplate1(data));
}
import { renderToBuffer } from "@react-pdf/renderer";
