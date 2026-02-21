"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";

// Components
import { InvoiceActions, InvoiceForm } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const InvoiceMain = () => {
    const { handleSubmit } = useFormContext<InvoiceType>();

    // Get the needed values from invoice context
    const { onFormSubmit } = useInvoiceContext();

    return (
        <Form {...useFormContext<InvoiceType>()}>
            <form
                onSubmit={handleSubmit(onFormSubmit, (err) => {
                    console.log(err);
                })}
                className="h-full"
            >
                <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
                    <InvoiceForm />
                    <InvoiceActions />
                </div>
            </form>
        </Form>
    );
};

export default InvoiceMain;
