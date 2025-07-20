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
import { Badge } from "@/components/ui/badge";

// Variables
import { LOCALES } from "@/lib/variables";

const LanguageSelector = () => {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const handleLanguageChange = (lang: string) => {
        console.log(lang);
        // Use the i18n-aware router to switch locale
        router.replace(pathname, { locale: lang });
    };
    
    return (
        <Select
            value={locale}
            onValueChange={(lang) => handleLanguageChange(lang)}
        >
            <SelectTrigger
                className="w-[10rem] relative"
                aria-label="Languages"
            >
                <Badge className="position: absolute -top-4 -left-2 font-normal">
                    BETA
                </Badge>
                <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent
                style={{
                    overflowY: "hidden",
                    height: "min-content",
                }}
            >
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>

                    {LOCALES.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                            {locale.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;
