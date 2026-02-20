import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Edge runtime is required for OpenNext Cloudflare
export const runtime = 'edge';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
};
