"use client";

import { useMemo } from "react";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import { Badge } from "@/components/ui/badge";

// React Wizard
import { Wizard } from "react-use-wizard";

// Components
import {
    WizardStep,
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    PaymentInformation,
    InvoiceSummary,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const InvoiceForm = () => {
    const { _t } = useTranslationContext();

    const { control } = useFormContext();

    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return _t("form.newInvBadge");
        }
    }, [invoiceNumber]);

    return (
        <div className="flex h-full w-full flex-col border-r border-border/40 bg-card lg:w-[55%] xl:w-[50%]">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide">
                        {_t("form.title")}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                        {invoiceNumberLabel}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                    {_t("form.description")}
                </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-6">
                    <Wizard>
                        <WizardStep>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <BillFromSection />
                                <BillToSection />
                            </div>
                        </WizardStep>
                        
                        <WizardStep>
                            <InvoiceDetails />
                        </WizardStep>

                        <WizardStep>
                            <Items />
                        </WizardStep>

                        <WizardStep>
                            <PaymentInformation />
                        </WizardStep>

                        <WizardStep>
                            <InvoiceSummary />
                        </WizardStep>
                    </Wizard>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
