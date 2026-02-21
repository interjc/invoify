"use client";

import { useState } from "react";

// Next
import Link from "next/link";

// RHF
import { useFormContext } from "react-hook-form";

// Icons
import { Bug, Eraser, FileText } from "lucide-react";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

type DevDebugProps = {};

const DevDebug = ({}: DevDebugProps) => {
    const { reset, formState } = useFormContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                    formState.isDirty
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
                title="Dev Tools"
            >
                <Bug className="h-3.5 w-3.5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-2 shadow-md">
                    <div className="mb-2 border-b border-border pb-2 text-xs text-muted-foreground">
                        Form: {formState.isDirty ? "Dirty" : "Clean"}
                    </div>

                    <button
                        onClick={() => {
                            reset(FORM_FILL_VALUES);
                            setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                    >
                        <Eraser className="h-3.5 w-3.5" />
                        Fill form
                    </button>

                    <div className="my-1 border-t border-border" />

                    <Link
                        href="/template/1"
                        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                    >
                        <FileText className="h-3.5 w-3.5" />
                        Template 1
                    </Link>

                    <Link
                        href="/template/2"
                        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                    >
                        <FileText className="h-3.5 w-3.5" />
                        Template 2
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DevDebug;
