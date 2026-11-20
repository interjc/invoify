import type { Metadata } from "next";

import { AUTHOR_WEBSITE, BASE_URL, DEFAULT_LOCALE, LOCALES } from "@/lib/variables";

export const SITE_NAME = "Vibany";

export const ROOTKEYWORDS = [
    "invoice",
    "invoice generator",
    "invoice generating",
    "invoice app",
    "invoice generator app",
    "free invoice generator",
];

type LocaleSeo = { title: string; description: string };

/**
 * Per-locale <title> and meta description. Each page is canonical to itself,
 * so the title has to be written in the page's own language.
 */
export const LOCALE_SEO: Record<string, LocaleSeo> = {
    en: {
        title: "Free Invoice Generator (PDF) | Vibany",
        description:
            "Create professional invoices online for free. Fill in the form, preview live and download a PDF invoice in seconds. No sign-up required.",
    },
    de: {
        title: "Kostenloser Rechnungsgenerator (PDF) | Vibany",
        description:
            "Erstellen Sie kostenlos professionelle Rechnungen online. Formular ausfüllen, live ansehen und in Sekunden als PDF herunterladen – ohne Anmeldung.",
    },
    it: {
        title: "Generatore di Fatture Gratis (PDF) | Vibany",
        description:
            "Crea fatture professionali online gratis. Compila il modulo, guarda l'anteprima in tempo reale e scarica la fattura in PDF in pochi secondi, senza registrazione.",
    },
    es: {
        title: "Generador de Facturas Gratis (PDF) | Vibany",
        description:
            "Crea facturas profesionales online gratis. Rellena el formulario, mira la vista previa en tiempo real y descarga tu factura en PDF en segundos, sin registro.",
    },
    ca: {
        title: "Generador de Factures Gratuït (PDF) | Vibany",
        description:
            "Crea factures professionals en línia de franc. Omple el formulari, mira la vista prèvia en temps real i descarrega la factura en PDF en segons, sense registre.",
    },
    fr: {
        title: "Générateur de Factures Gratuit (PDF) | Vibany",
        description:
            "Créez gratuitement des factures professionnelles en ligne. Remplissez le formulaire, prévisualisez en direct et téléchargez votre facture PDF en quelques secondes, sans inscription.",
    },
    ar: {
        title: "مولد فواتير مجاني (PDF) | Vibany",
        description:
            "أنشئ فواتير احترافية عبر الإنترنت مجانًا. املأ النموذج وشاهد المعاينة مباشرة ثم نزّل الفاتورة بصيغة PDF خلال ثوانٍ، دون الحاجة إلى تسجيل.",
    },
    pl: {
        title: "Darmowy Generator Faktur (PDF) | Vibany",
        description:
            "Twórz profesjonalne faktury online za darmo. Wypełnij formularz, sprawdź podgląd na żywo i pobierz fakturę PDF w kilka sekund – bez rejestracji.",
    },
    "pt-BR": {
        title: "Gerador de Invoice Grátis (PDF) | Vibany",
        description:
            "Crie invoices e faturas profissionais online de graça. Preencha o formulário, veja a prévia em tempo real e baixe o PDF em segundos, sem cadastro.",
    },
    tr: {
        title: "Ücretsiz Fatura Oluşturucu (PDF) | Vibany",
        description:
            "Profesyonel faturaları çevrimiçi ve ücretsiz oluşturun. Formu doldurun, canlı önizleyin ve faturanızı saniyeler içinde PDF olarak indirin. Kayıt gerekmez.",
    },
    ja: {
        title: "無料請求書作成ツール（PDF）| Vibany",
        description:
            "請求書をオンラインで無料作成。フォームに入力してリアルタイムでプレビューし、数秒でPDFの請求書をダウンロードできます。登録不要。",
    },
    "nb-NO": {
        title: "Gratis fakturagenerator (PDF) | Vibany",
        description:
            "Lag profesjonelle fakturaer gratis på nett. Fyll ut skjemaet, se forhåndsvisning direkte og last ned fakturaen som PDF på sekunder – uten registrering.",
    },
    "nn-NO": {
        title: "Gratis fakturagenerator (PDF) | Vibany",
        description:
            "Lag profesjonelle fakturaer gratis på nett. Fyll ut skjemaet, sjå førehandsvising direkte og last ned fakturaen som PDF på sekund – utan registrering.",
    },
};

export const localeUrl = (locale: string) => `${BASE_URL}/${locale}`;

/** hreflang map: every locale plus x-default, all absolute. */
export const languageAlternates = (): Record<string, string> => ({
    ...Object.fromEntries(LOCALES.map(({ code }) => [code, localeUrl(code)])),
    "x-default": localeUrl(DEFAULT_LOCALE),
});

export const getLocaleSeo = (locale: string): LocaleSeo =>
    LOCALE_SEO[locale] ?? LOCALE_SEO[DEFAULT_LOCALE];

export const buildLocaleMetadata = (locale: string): Metadata => {
    const { title, description } = getLocaleSeo(locale);
    const url = localeUrl(locale);

    return {
        metadataBase: new URL(BASE_URL),
        title,
        description,
        alternates: {
            canonical: url,
            languages: languageAlternates(),
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            title,
            description,
            url,
            locale,
        },
    };
};

export const buildJsonLd = (locale: string) => {
    const { title, description } = getLocaleSeo(locale);
    const url = localeUrl(locale);

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: title,
        description,
        url,
        inLanguage: locale,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: "https://vibany.com" },
        author: { "@type": "Person", name: "Ali Abbasov", url: AUTHOR_WEBSITE },
    };
};
