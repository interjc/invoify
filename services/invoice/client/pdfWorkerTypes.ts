import type { InvoiceType } from "@/types";

export type PdfWorkerRequest = InvoiceType;

export type PdfWorkerResponse =
  | { success: true; blob: Blob }
  | { success: false; error: string };
