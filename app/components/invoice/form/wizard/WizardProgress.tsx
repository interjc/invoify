"use client";

// RHF
import { useFormContext } from "react-hook-form";

// React Wizard
import { WizardValues } from "react-use-wizard";



// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Types
import { InvoiceType, WizardStepType } from "@/types";

type WizardProgressProps = {
    wizard: WizardValues;
};

const WizardProgress = ({ wizard }: WizardProgressProps) => {
    const { activeStep, stepCount } = wizard;

    const {
        formState: { errors },
    } = useFormContext<InvoiceType>();

    const { _t } = useTranslationContext();

    const step1Valid = !errors.sender && !errors.receiver;
    const step2Valid =
        !errors.details?.invoiceNumber &&
        !errors.details?.dueDate &&
        !errors.details?.invoiceDate &&
        !errors.details?.currency;

    const step3Valid = !errors.details?.items;
    const step4Valid = !errors.details?.paymentInformation;
    const step5Valid =
        !errors.details?.paymentTerms &&
        !errors.details?.subTotal &&
        !errors.details?.totalAmount &&
        !errors.details?.discountDetails?.amount &&
        !errors.details?.taxDetails?.amount &&
        !errors.details?.shippingDetails?.cost;

    /**
     * Determines the button variant based on the given WizardStepType.
     *
     * @param {WizardStepType} step - The wizard step object
     * @returns The button variant ("destructive", "default", or "outline") based on the step's validity and active status.
     */
    const returnButtonVariant = (step: WizardStepType) => {
        if (!step.isValid) {
            return "destructive";
        }
        if (step.id === activeStep) {
            return "default";
        } else {
            return "outline";
        }
    };

    /**
     * Checks whether the given WizardStepType has been passed or not.
     *
     * @param {WizardStepType} currentStep - The WizardStepType object
     * @returns `true` if the step has been passed, `false` if it hasn't, or `undefined` if the step is not valid.
     */
    const stepPassed = (currentStep: WizardStepType) => {
        if (currentStep.isValid) {
            return activeStep > currentStep.id ? true : false;
        }
    };

    const steps: WizardStepType[] = [
        {
            id: 0,
            label: _t("form.wizard.fromAndTo"),
            isValid: step1Valid,
        },
        {
            id: 1,
            label: _t("form.wizard.invoiceDetails"),
            isValid: step2Valid,
        },
        {
            id: 2,
            label: _t("form.wizard.lineItems"),
            isValid: step3Valid,
        },
        {
            id: 3,
            label: _t("form.wizard.paymentInfo"),
            isValid: step4Valid,
        },
        {
            id: 4,
            label: _t("form.wizard.summary"),
            isValid: step5Valid,
        },
    ];

    return (
        <div className="flex items-center justify-center gap-1 border-b border-border/40 pb-4">
            {steps.map((step) => (
                <button
                    key={step.id}
                    onClick={() => wizard.goToStep(step.id)}
                    className={`
                        flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors
                        ${step.id === activeStep
                            ? "bg-primary text-primary-foreground"
                            : step.isValid
                                ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                                : "text-destructive hover:bg-destructive/10"
                        }
                    `}
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px]">
                        {step.id + 1}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                </button>
            ))}
        </div>
    );
};

export default WizardProgress;
