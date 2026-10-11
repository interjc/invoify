"use client";

// Debounce
import { useDebounce } from "use-debounce";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// Components
import FinalPdf from "./FinalPdf";
import LivePreview from "./LivePreview";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const PdfViewer = () => {
    const { invoicePdf } = useInvoiceContext();

    const { control } = useFormContext<InvoiceType>();
    const formValues = useWatch({ control });
    const [debouncedValues] = useDebounce(formValues, 300);

    return (
        <div className="h-full">
            {invoicePdf.size == 0 ? (
                <LivePreview data={debouncedValues as InvoiceType} />
            ) : (
                <FinalPdf />
            )}
        </div>
    );
};

export default PdfViewer;
