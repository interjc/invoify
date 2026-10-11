import { setRequestLocale } from "next-intl/server";
import InvoiceMain from "@/app/components/invoice/InvoiceMain";

export default async function Home({ params }: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex-1 overflow-hidden">
            <InvoiceMain />
        </main>
    );
}
