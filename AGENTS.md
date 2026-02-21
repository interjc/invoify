# AGENTS.md

This file provides guidance to AI agents (like Claude, Claude Code, and others) when working with code in this repository.

## Project Overview

Invoify is a Next.js 16 invoice generator web application that creates professional invoices with PDF generation capabilities. The app uses TypeScript, React 19, Shadcn UI components, and @react-pdf/renderer for PDF generation.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Build the application
pnpm build

# Production server
pnpm start

# Linting
pnpm lint

# Bundle analysis
ANALYZE=true pnpm build

# Cloudflare Workers
pnpm preview    # Build and preview locally
pnpm deploy     # Build and deploy
pnpm cf-typegen # Generate Cloudflare types
```

## Core Architecture

### Directory Structure
- `app/` - Next.js 16 App Router pages and API routes with [locale] dynamic segments for i18n
- `components/` - Shared UI components organized by feature
  - `components/ui/` - Shadcn UI components (25+ components)
  - `components/templates/` - Invoice PDF templates
- `contexts/` - React Context providers for global state
- `lib/` - Utilities, schemas (Zod), and helper functions
- `services/` - Business logic for invoice operations
- `types.ts` - TypeScript type definitions
- `i18n/` - Internationalization configuration and locale files
  - `i18n/locales/` - Translation files (15+ languages: en, es, fr, de, ja, pt-BR, it, ar, etc.)

### Key Technologies
- **Next.js 16** with App Router and Turbopack
- **React 19** with latest features
- **TypeScript 5.2** with strict mode enabled
- **Shadcn/UI** component library (in `components/ui/`)
- **Radix UI** primitives (dialogs, popovers, selects, etc.)
- **React Hook Form** with Zod validation
- **@react-pdf/renderer** for PDF generation
- **next-intl** for internationalization
- **Tailwind CSS 3.3** for styling
- **@dnd-kit** for drag and drop functionality

### State Management
- **InvoiceContext** - Main invoice form data
- **ChargesContext** - Tax, discount, shipping calculations
- **SignatureContext** - Signature drawing/typing/upload
- **ThemeProvider** - Dark/light theme switching

### PDF Generation
PDF generation uses @react-pdf/renderer:
- Templates in `components/templates/invoice-pdf/`
- Service at `services/invoice/server/generatePdfService.ts`
- API endpoint at `app/api/invoice/generate/route.ts`

### Form Validation
All forms use React Hook Form with Zod schemas defined in `lib/schemas.ts`. The main `InvoiceSchema` validates the complete invoice structure.

### Multi-language Support
- Locale files in `i18n/locales/` (15+ languages supported)
- Translation context in `contexts/TranslationContext.tsx`
- Middleware handles locale routing with `middleware.ts`
- Supported locales: en, es, fr, de, ja, pt-BR, it, ar, ca, id, nb-NO, nn-NO, pl, tr, zh_CN

### Export Formats
- **PDF**: @react-pdf/renderer
- **JSON**: Native JSON.stringify
- **XLSX**: xlsx library
- **CSV**: @json2csv/node
- **XML**: xml2js

## Environment Variables

Required for email functionality:
```env
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PW=your_email_password
```

Optional for Cloudflare deployment:
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## Import Aliases
- `@/*` maps to project root for clean imports

## Testing
No test framework is currently configured in this project.

## Special Configurations

### Next.js Config
- Turbopack enabled for development
- Bundle analyzer available with `ANALYZE=true`
- Custom webpack config ignores `.map` files
- @react-pdf/renderer externalized for server-side rendering

### Tailwind Config
- Custom color palette defined
- Dark mode support via class strategy
- Custom animations and keyframes

### Cloudflare Workers
- Configured with `wrangler.jsonc`
- Uses `@opennextjs/cloudflare` adapter
- KV storage support available

## Code Conventions

### Components
- Use functional components with TypeScript
- Props interfaces named with `Props` suffix
- Export default for page components
- Named exports for reusable components

### Forms
- Always use React Hook Form with Zod resolver
- Define schemas in `lib/schemas.ts`
- Use controlled inputs with proper validation messages

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use Shadcn UI components where possible

### Internationalization
- All user-facing strings must use `useTranslations()` hook
- Add translations to all locale files when adding new text
- Use translation keys with dot notation (e.g., `invoice.title`)

### File Naming
- Components: PascalCase (e.g., `InvoiceForm.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE or camelCase
- Types: PascalCase with descriptive names

## Dependencies

### Package Manager
- **pnpm** is the required package manager
- Overrides configured for esbuild and React types

### Key Dependencies
- @dnd-kit/* - Drag and drop
- @radix-ui/* - UI primitives
- @react-pdf/renderer - PDF generation
- lucide-react - Icons
- next-intl - i18n
- nodemailer - Email
- react-hook-form - Forms
- react-signature-canvas - Signatures
- xlsx, @json2csv/node, xml2js - Export formats
- zod - Validation

## Related Skills

When working on this codebase, the following skills may be relevant:

- **vercel-react-best-practices** - React/Next.js performance optimization
- **vercel-composition-patterns** - Component composition patterns
- **frontend-design** - UI/UX design guidance
- **web-design-guidelines** - Accessibility and design audits
- **native-data-fetching** - Data fetching patterns (if adding API routes)
