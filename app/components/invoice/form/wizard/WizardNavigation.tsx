"use client";

// React Wizard
import { useWizard } from "react-use-wizard";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { ArrowLeft, ArrowRight } from "lucide-react";

const WizardNavigation = () => {
    const { isFirstStep, isLastStep, handleStep, previousStep, nextStep } =
        useWizard();

    const { _t } = useTranslationContext();
    return (
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
            <div>
                {!isFirstStep && (
                    <button
                        onClick={previousStep}
                        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {_t("form.wizard.back")}
                    </button>
                )}
            </div>
            <button
                onClick={nextStep}
                disabled={isLastStep}
                className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
                {_t("form.wizard.next")}
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default WizardNavigation;
