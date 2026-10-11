import type { PdfWorkerRequest, PdfWorkerResponse } from "./pdfWorkerTypes";

const workerScope = self as unknown as {
  onmessage: (event: MessageEvent<PdfWorkerRequest>) => void;
  postMessage: (response: PdfWorkerResponse) => void;
};

workerScope.onmessage = async ({ data }) => {
  try {
    // The renderer and template stay in the worker, outside the UI thread.
    const [{ pdf }, { default: Template }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/app/components/templates/invoice-pdf-react/ReactPDFInvoiceTemplate1"),
    ]);
    const blob = await pdf(Template(data)).toBlob();
    if (blob.size === 0 || blob.type !== "application/pdf") {
      throw new Error("The renderer returned an invalid PDF");
    }
    workerScope.postMessage({ success: true, blob });
  } catch (error) {
    workerScope.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "PDF rendering failed",
    });
  }
};
