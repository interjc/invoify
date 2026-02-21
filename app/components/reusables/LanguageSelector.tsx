"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

// ShadCn
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Variables
import { LOCALES } from "@/lib/variables";

const LanguageSelector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const handleLanguageChange = (lang: string) => {
        // Use the i18n-aware router to switch locale
        router.replace(pathname, { locale: lang });
    };

    const currentLocale = LOCALES.find((l) => l.code === locale);
    
    return (
        <Select
            value={locale}
            onValueChange={(lang) => handleLanguageChange(lang)}
        >
            <SelectTrigger
                className="h-8 w-[8rem] border-0 bg-transparent text-sm hover:bg-accent"
                aria-label="Select language"
            >
                <SelectValue placeholder={currentLocale?.name || "Language"} />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectGroup>
                    <SelectLabel className="text-xs">Languages</SelectLabel>
                    {LOCALES.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code} className="text-sm">
                            {locale.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
