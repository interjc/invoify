"use client";



// Components
import {
    PdfViewer,
    BaseButton,
    NewInvoiceAlert,
    InvoiceLoaderModal,
    InvoiceExportModal,
} from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { FileInput, FolderUp, Import, Plus } from "lucide-react";

const InvoiceActions = () => {
    const { invoicePdfLoading } = useInvoiceContext();

    const { _t } = useTranslationContext();
    return (
        <div className="flex h-full w-full flex-col bg-muted/30 lg:w-[45%] xl:w-[50%]">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                    {_t("actions.title")}
                </h2>
                <div className="flex items-center gap-1">
                    {/* Load modal button */}
                    <InvoiceLoaderModal>
                        <BaseButton
                            variant="ghost"
                            size="sm"
                            tooltipLabel="Open load invoice menu"
                            disabled={invoicePdfLoading}
                        >
                            <FolderUp className="h-4 w-4" />
                            <span className="hidden sm:inline">{_t("actions.loadInvoice")}</span>
                        </BaseButton>
                    </InvoiceLoaderModal>

                    {/* Export modal button */}
                    <InvoiceExportModal>
                        <BaseButton
                            variant="ghost"
                            size="sm"
                            tooltipLabel="Export invoice"
                            disabled={invoicePdfLoading}
                        >
                            <Import className="h-4 w-4" />
                            <span className="hidden sm:inline">{_t("actions.exportInvoice")}</span>
                        </BaseButton>
                    </InvoiceExportModal>

                    {/* New invoice button */}
                    <NewInvoiceAlert>
                        <BaseButton
                            variant="ghost"
                            size="sm"
                            tooltipLabel="Get a new invoice form"
                            disabled={invoicePdfLoading}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">{_t("actions.newInvoice")}</span>
                        </BaseButton>
                    </NewInvoiceAlert>

                    {/* Generate pdf button */}
                    <BaseButton
                        type="submit"
                        size="sm"
                        tooltipLabel="Generate your invoice"
                        loading={invoicePdfLoading}
                        loadingText="Generating..."
                    >
                        <FileInput className="h-4 w-4" />
                        <span className="hidden sm:inline">{_t("actions.generatePdf")}</span>
                    </BaseButton>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-hidden p-4 lg:p-6">
                <PdfViewer />
            </div>
        </div>
    );
};

export default InvoiceActions;
