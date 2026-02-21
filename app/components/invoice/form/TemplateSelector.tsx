"use client";

import Image from "next/image";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import {
    InvoiceTemplate1,
    InvoiceTemplate2,
} from "@/app/components";

// Template images
import template1 from "@/public/assets/img/invoice-1-example.png";
import template2 from "@/public/assets/img/invoice-2-example.png";

// Icons
import { Check } from "lucide-react";

// Types
import { InvoiceType } from "@/types";

const TemplateSelector = () => {
    const { watch, setValue } = useFormContext<InvoiceType>();
    const formValues = watch();
    const templates = [
        {
            id: 1,
            name: "Template 1",
            description: "Template 1 description",
            img: template1,
            component: <InvoiceTemplate1 {...formValues} />,
        },
        {
            id: 2,
            name: "Template 2",
            description: "Second template",
            img: template2,
            component: <InvoiceTemplate2 {...formValues} />,
        },
    ];
    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Invoice Template:</Label>

            <div className="grid gap-3">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        type="button"
                        onClick={() => setValue("details.pdfTemplate", template.id)}
                        className={`relative flex items-center gap-4 rounded-lg border p-3 text-left transition-all hover:border-primary/50 ${
                            formValues.details.pdfTemplate === template.id
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                        }`}
                    >
                        {/* Template Preview Image */}
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                                src={template.img}
                                alt={template.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>

                        {/* Template Info */}
                        <div className="flex flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{template.name}</span>
                                {formValues.details.pdfTemplate === template.id && (
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {template.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
