import type { MetadataRoute } from "next";

import { languageAlternates, localeUrl } from "@/lib/seo";
import { LOCALES } from "@/lib/variables";

export default function sitemap(): MetadataRoute.Sitemap {
    const languages = languageAlternates();

    return LOCALES.map(({ code }) => ({
        url: localeUrl(code),
        changeFrequency: "monthly" as const,
        priority: 1,
        alternates: { languages },
    }));
}
