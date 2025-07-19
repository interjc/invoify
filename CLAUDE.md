# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Invoify is a Next.js 13 invoice generator web application that creates professional invoices with PDF generation capabilities. The app uses TypeScript, React, Shadcn UI components, and Puppeteer for PDF generation.

## Development Commands

```bash
# Development server
npm run dev

# Build the application  
npm run build

# Production server
npm start

# Linting
npm run lint

# Bundle analysis
npm run analyze
```

## Core Architecture

### Directory Structure
- `app/` - Next.js 13 App Router pages and API routes
- `components/` - Shared UI components organized by feature
- `contexts/` - React Context providers for global state
- `lib/` - Utilities, schemas (Zod), and helper functions
- `services/` - Business logic for invoice operations
- `types.ts` - TypeScript type definitions

### Key Technologies
- **Next.js 13** with App Router
- **TypeScript** with strict mode enabled
- **Shadcn UI** component library (in `components/ui/`)
- **React Hook Form** with Zod validation
- **Puppeteer** for PDF generation
- **next-intl** for internationalization
- **Tailwind CSS** for styling

### State Management
- **InvoiceContext** - Main invoice form data
- **ChargesContext** - Tax, discount, shipping calculations
- **SignatureContext** - Signature drawing/typing/upload
- **ThemeProvider** - Dark/light theme switching

### PDF Generation
PDF generation uses Puppeteer with server-side rendering:
- Templates in `components/templates/invoice-pdf/`
- Service at `services/invoice/server/generatePdfService.ts`
- API endpoint at `app/api/invoice/generate/route.ts`

### Form Validation
All forms use React Hook Form with Zod schemas defined in `lib/schemas.ts`. The main `InvoiceSchema` validates the complete invoice structure.

### Multi-language Support
- Locale files in `i18n/locales/`
- Translation context in `contexts/TranslationContext.tsx`
- Middleware handles locale routing

## Environment Variables
Required for email functionality:
```env
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PW=your_email_password
```

## Import Aliases
- `@/*` maps to project root for clean imports

## Testing
No test framework is currently configured in this project.

## Special Configurations
- Puppeteer configured as external package in Next.js config
- Bundle analyzer available with `ANALYZE=true` environment variable
- Custom webpack config ignores `.map` files