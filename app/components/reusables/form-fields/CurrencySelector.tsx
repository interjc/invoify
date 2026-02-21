"use client";

import { useEffect } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Next Intl
import { useLocale } from "next-intl";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Hooks
import useCurrencies from "@/hooks/useCurrencies";

// Variables
import { LOCALE_CURRENCY_MAP, MAIN_CURRENCIES } from "@/lib/variables";

// Types
import { CurrencyType, NameType } from "@/types";

type CurrencySelectorProps = {
    name: NameType;
    label?: string;
    placeholder?: string;
};

const CurrencySelector = ({
    name,
    label,
    placeholder,
}: CurrencySelectorProps) => {
    const { control, setValue, watch } = useFormContext();
    const locale = useLocale();

    const { currencies, currenciesLoading } = useCurrencies();

    // Set default currency based on locale
    useEffect(() => {
        const currentCurrency = watch(name);
        // Only set default if currency is empty or USD (default)
        if (!currentCurrency || currentCurrency === "USD") {
            const defaultCurrency = LOCALE_CURRENCY_MAP[locale] || "USD";
            setValue(name, defaultCurrency, { shouldValidate: false });
        }
    }, [locale, name, setValue, watch]);

    // Filter currencies to show only main world currencies
    const filteredCurrencies = currencies.filter((currency: CurrencyType) =>
        MAIN_CURRENCIES.includes(currency.code)
    );

    // Sort: default currency for current locale first, then alphabetically
    const sortedCurrencies = [...filteredCurrencies].sort((a: CurrencyType, b: CurrencyType) => {
        const defaultCurrency = LOCALE_CURRENCY_MAP[locale] || "USD";
        if (a.code === defaultCurrency) return -1;
        if (b.code === defaultCurrency) return 1;
        return a.code.localeCompare(b.code);
    });

    return (
        <div>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <FormLabel>{label}:</FormLabel>
                            </div>
                            <div>
                                <Select
                                    {...field}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[13rem]">
                                            <SelectValue
                                                placeholder={placeholder}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                        className="max-h-[200px]"
                                    >
                                        <SelectGroup>
                                            <SelectLabel>
                                                Currencies
                                            </SelectLabel>
                                            {!currenciesLoading &&
                                                sortedCurrencies.map(
                                                    (
                                                        currency: CurrencyType,
                                                        idx: number
                                                    ) => (
                                                        <SelectItem
                                                            key={idx}
                                                            value={
                                                                currency.code
                                                            }
                                                        >
                                                            {currency.name}{" "}
                                                            {`(${currency.code})`}
                                                        </SelectItem>
                                                    )
                                                )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CurrencySelector;
