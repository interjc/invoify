import { GENERATE_PDF_API } from "@/lib/variables";
import type { InvoiceType } from "@/types";
import type { PdfWorkerResponse } from "./pdfWorkerTypes";

function renderInWorker(data: InvoiceType, signal: AbortSignal): Promise<Blob> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const worker = new Worker(new URL("./generatePdf.worker.ts", import.meta.url));

    const cleanup = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
      worker.terminate();
    };
    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onAbort = () => fail(new DOMException("PDF generation cancelled", "AbortError"));
    // A crashed or blocked worker must not leave the form permanently loading.
    const timeout = setTimeout(() => fail(new Error("PDF worker timed out")), 120_000);
    signal.addEventListener("abort", onAbort, { once: true });
    worker.onmessage = ({ data: result }: MessageEvent<PdfWorkerResponse>) => {
      if (!result.success) {
        fail(new Error(result.error));
        return;
      }
      if (!(result.blob instanceof Blob) || result.blob.size === 0 || result.blob.type !== "application/pdf") {
        fail(new Error("PDF worker returned an invalid PDF"));
        return;
      }
      cleanup();
      resolve(result.blob);
    };
    worker.onerror = () => fail(new Error("PDF worker could not run"));
    worker.onmessageerror = () => fail(new Error("PDF worker response could not be read"));
    try {
      worker.postMessage(data);
    } catch (error) {
      fail(error instanceof Error ? error : new Error("PDF worker could not receive the invoice"));
    }
  });
}

export async function generateInvoicePdf(data: InvoiceType, signal: AbortSignal): Promise<Blob> {
  signal.throwIfAborted();
  if (typeof Worker !== "undefined") {
    try {
      return await renderInWorker(data, signal);
    } catch (error) {
      signal.throwIfAborted();
      // Keep generation available when a browser or CSP cannot run the worker.
      console.warn("Browser PDF generation failed; using the server fallback", error);
    }
  }

  const response = await fetch(GENERATE_PDF_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });
  if (!response.ok || !response.headers.get("Content-Type")?.toLowerCase().startsWith("application/pdf")) {
    throw new Error(`PDF generation failed (HTTP ${response.status})`);
  }
  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("The server returned an empty PDF");
  }
  return blob;
}
