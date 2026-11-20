import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import InvoiceMain from "@/app/components/invoice/InvoiceMain";
import {
    buildHomeMetadata,
    buildJsonLd,
    isSupportedLocale,
    jsonLdScript,
} from "@/lib/seo";

// Canonical, hreflang, Open Graph and JSON-LD belong to the home page only;
// in the layout they leaked onto 404s and /[locale]/template/[id].
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    if (!isSupportedLocale(locale)) notFound();

    return buildHomeMetadata(locale);
}

export default async function Home({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex-1 overflow-hidden">
            <script
                type="application/ld+json"
                id="json-ld"
                dangerouslySetInnerHTML={{ __html: jsonLdScript(buildJsonLd(locale)) }}
            />
            <InvoiceMain />
        </main>
    );
}
