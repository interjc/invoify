"use client";

import React from "react";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { WizardNavigation, WizardProgress } from "@/app/components";

type WizardStepProps = {
    children: React.ReactNode;
};

const WizardStep = ({ children }: WizardStepProps) => {
    const wizard = useWizard();
    return (
        <div className="flex h-full flex-col">
            <WizardProgress wizard={wizard} />
            <div className="flex-1 py-4">{children}</div>
            <WizardNavigation />
        </div>
    );
};

export default WizardStep;
