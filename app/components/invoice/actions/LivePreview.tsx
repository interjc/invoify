"use client";

// Components
import { DynamicInvoiceTemplate, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Types
import { InvoiceType } from "@/types";

type LivePreviewProps = {
    data: InvoiceType;
};

export default function LivePreview({ data }: LivePreviewProps) {
    const { _t } = useTranslationContext();

    return (
        <div className="flex h-full flex-col">
            <Subheading>{_t("actions.livePreview")}</Subheading>
            <div className="flex-1 overflow-y-auto rounded-xl border border-border">
                <DynamicInvoiceTemplate {...data} />
            </div>
        </div>
    );
}
