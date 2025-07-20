"use client";

// React
import { use } from "react";

// Next
import dynamic from "next/dynamic";

// RHF
import { useFormContext } from "react-hook-form";

// Types
import { InvoiceType } from "@/types";

type ViewTemplatePageProps = {
    params: Promise<{ id: string }>;
};

const ViewTemplate = ({ params }: ViewTemplatePageProps) => {
    const { id } = use(params);
    const templateNumber = id;

    const DynamicComponent = dynamic<InvoiceType>(
        () =>
            import(
                `@/app/components/templates/invoice-pdf/InvoiceTemplate${templateNumber}`
            )
    );

    const { getValues } = useFormContext();
    const formValues = getValues();

    return (
        <div className="container">
            <DynamicComponent
                sender={formValues.sender}
                receiver={formValues.receiver}
                details={formValues.details}
            />
        </div>
    );
};

export default ViewTemplate;
