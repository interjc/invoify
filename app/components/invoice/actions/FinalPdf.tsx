"use client";

// Components
import { BaseButton, SendPdfToEmailModal, Subheading } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import {
    BookmarkIcon,
    DownloadCloudIcon,
    Eye,
    Mail,
    MoveLeft,
    Printer,
} from "lucide-react";

export default function FinalPdf() {
    const {
        pdfUrl,
        removeFinalPdf,
        previewPdfInTab,
        downloadPdf,
        printPdf,
        saveInvoice,
        sendPdfToMail,
    } = useInvoiceContext();

    const { _t } = useTranslationContext();

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <Subheading>{_t("actions.finalPdf")}</Subheading>
                <BaseButton
                    variant="ghost"
                    size="sm"
                    onClick={removeFinalPdf}
                >
                    <MoveLeft className="h-4 w-4" />
                    {_t("actions.backToLivePreview")}
                </BaseButton>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 py-3">
                <BaseButton
                    tooltipLabel="Preview invoice in new tab"
                    onClick={previewPdfInTab}
                    size="sm"
                    variant="outline"
                >
                    <Eye className="h-4 w-4" />
                    Preview
                </BaseButton>
                <BaseButton
                    tooltipLabel="Download invoice PDF"
                    onClick={downloadPdf}
                    size="sm"
                    variant="outline"
                >
                    <DownloadCloudIcon className="h-4 w-4" />
                    Download
                </BaseButton>

                <BaseButton
                    tooltipLabel="Print invoice"
                    onClick={printPdf}
                    size="sm"
                    variant="outline"
                >
                    <Printer className="h-4 w-4" />
                    Print
                </BaseButton>

                <BaseButton
                    tooltipLabel="Save invoice in website"
                    onClick={saveInvoice}
                    size="sm"
                    variant="outline"
                >
                    <BookmarkIcon className="h-4 w-4" />
                    Save
                </BaseButton>

                <SendPdfToEmailModal sendPdfToMail={sendPdfToMail}>
                    <BaseButton
                        tooltipLabel="Send invoice PDF to mail"
                        size="sm"
                        variant="outline"
                    >
                        <Mail className="h-4 w-4" />
                        Send to mail
                    </BaseButton>
                </SendPdfToEmailModal>
            </div>

            {/* PDF Viewer with internal scroll */}
            <div className="flex-1 overflow-y-auto rounded-xl border border-border">
                <iframe
                    className="h-[800px] w-full"
                    src={`${pdfUrl}#toolbar=0`}
                    title="PDF Preview"
                />
            </div>
        </div>
    );
}
