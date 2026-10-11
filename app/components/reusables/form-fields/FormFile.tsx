"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

// Image processing
import {
    ImageOptimizationError,
    optimizeUploadedImage,
    readImageAsDataUrl,
    type ImageOptimizationErrorCode,
} from "@/lib/optimizeUploadedImage";
import { useTranslationContext } from "@/contexts/TranslationContext";

// RHF
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { ImageMinus, Image } from "lucide-react";

// Types
import { NameType } from "@/types";

type FormFileProps = {
    name: NameType;
    label?: string;
    placeholder?: string;
};

const FormFile = ({ name, label, placeholder }: FormFileProps) => {
    const { control, setValue, watch } = useFormContext();

    const logoImage = useWatch({
        name: name,
        control,
    });

    const base64Image = logoImage ?? "";
    const [uploadError, setUploadError] = useState<ImageOptimizationErrorCode | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadSequenceRef = useRef(0);

    const { _t } = useTranslationContext();

    useEffect(() => {
        const subscription = watch((_, { name }) => {
            // RHF emits a values event without a field name for reset().
            // Named field updates, including this upload's own setValue, leave it alone.
            if (name !== undefined) return;
            uploadSequenceRef.current += 1;
            setUploadError(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        });

        return () => {
            uploadSequenceRef.current += 1;
            subscription.unsubscribe();
        };
    }, [watch]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const input = e.currentTarget;
        const sequence = ++uploadSequenceRef.current;
        setUploadError(null);
        try {
            const optimizedFile = await optimizeUploadedImage(file);
            const dataUrl = await readImageAsDataUrl(optimizedFile);
            if (sequence !== uploadSequenceRef.current) return;
            setValue(name, dataUrl);
        } catch (error) {
            if (sequence !== uploadSequenceRef.current) return;
            setUploadError(
                error instanceof ImageOptimizationError
                    ? error.code
                    : "processingFailed"
            );
            input.value = "";
        }
    };

    const removeLogo = () => {
        uploadSequenceRef.current += 1;
        setValue(name, "");
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <Label>{label}:</Label>
                        {base64Image ? (
                            <img
                                id="logoImage"
                                src={base64Image}
                                style={{
                                    objectFit: "contain",
                                    width: "10rem",
                                    height: "7rem",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    objectFit: "contain",
                                    width: "10rem",
                                    height: "7rem",
                                }}
                            >
                                <Label
                                    htmlFor={name}
                                    className="flex justify-center items-center h-[7rem] w-[10rem] cursor-pointer rounded-md bg-gray-100 dark:bg-slate-800 border border-black dark:border-white hover:border-blue-500"
                                >
                                    <>
                                        <div className="flex flex-col items-center">
                                            <Image />
                                            <p>{placeholder}</p>
                                        </div>
                                        <FormControl>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id={name}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                </Label>
                            </div>
                        )}
                        {uploadError && (
                            <p className="text-sm font-medium text-destructive" role="alert">
                                {_t(`form.steps.summary.signature.imageUpload.${uploadError}`)}
                            </p>
                        )}
                    </FormItem>
                )}
            />
            {base64Image && (
                <div>
                    <BaseButton variant="destructive" onClick={removeLogo}>
                        <ImageMinus />
                        Remove logo
                    </BaseButton>
                </div>
            )}
        </>
    );
};

export default FormFile;
