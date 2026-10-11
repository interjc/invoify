// Variables
import { EXPORT_INVOICE_API } from "@/lib/variables";

// Types
import { ExportTypes, InvoiceType } from "@/types";

/**
 * Download JSON locally, or request a converted invoice from the server.
 *
 * @param {ExportTypes} exportAs - The format in which to export the invoice (e.g., JSON, CSV).
 * @param {InvoiceType} formValues - The invoice form data to be exported.
 * @throws {Error} If there is an error during the export process.
 * @returns {Promise<void>} A promise that resolves when the export is completed.
 */
export const exportInvoice = async (
    exportAs: ExportTypes,
    formValues: InvoiceType
) => {
    try {
        const blob = exportAs === ExportTypes.JSON
            ? new Blob([JSON.stringify(formValues)], { type: "application/json" })
            : await fetch(`${EXPORT_INVOICE_API}?format=${exportAs}`, {
                method: "POST",
                body: JSON.stringify(formValues),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (!res.ok) throw new Error(`Invoice export failed (${res.status})`);
                return res.blob();
            });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice.${exportAs.toLowerCase()}`;
        document.body.appendChild(a);
        try {
            a.click();
        } finally {
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Error downloading:", error);
    }
};
