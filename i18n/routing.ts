import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/variables';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES.map(locale => locale.code),

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE
});