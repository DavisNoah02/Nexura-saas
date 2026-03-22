## Nexura-SaaS App - Next.js App Router Frontend

This repository is a **Next.js App Router** frontend for a SaaS product.  
Today it ships a **highly-styled marketing site**, but the structure is designed to grow into a full SaaS app with **auth, dashboard, and billing** using the existing tech stack.

---

## Tech stack

- **Framework**: Next.js `16.1` (App Router) with React `19`
- **Language**: TypeScript `5`
- **Styling**:
  - Tailwind CSS `4` (via `@tailwindcss/postcss`)
  - Utility helpers: `clsx`, `tailwind-merge`, `class-variance-authority`
- **UI components**:
  - Custom components using Radix primitives:
    - `@radix-ui/react-accordion`
    - `@radix-ui/react-dropdown-menu`
    - `@radix-ui/react-label`
    - `@radix-ui/react-slot`
  - Icons: `lucide-react`, `react-icons`
- **Theming**:
  - `next-themes` for light/dark/system theme
  - Custom `ThemeProvider` and toggle button in `components/layout`
- **Animation**:
  - `motion` for animations (React 19-compatible)
  - Tailwind `tw-animate-css` utilities
- **Tooling**:
  - ESLint `9` + `eslint-config-next`
  - TypeScript strict types

---

## Project structure (high level)

```text
saas-app/
  app/
    (marketing)/           # Public marketing routes
      page.tsx             # Landing page (/)
      pricing/page.tsx     # Pricing (/pricing)
      about/page.tsx       # About (/about)
    (app)/                 # Authenticated SaaS app (dashboard, etc.)
      layout.tsx           # App shell layout
      dashboard/page.tsx   # Dashboard (/dashboard)
      settings/page.tsx    # Settings (/settings)
    (auth)/                # Auth routes
      sign-in/page.tsx     # Sign in (/sign-in)
      sign-up/page.tsx     # Sign up (/sign-up)
      forgot-password/page.tsx # Forgot password (/forgot-password)
    favicon.ico
    globals.css
    layout.tsx             # Root layout, fonts, ThemeProvider

  components/
    layout/                # Layout-level components
      header.tsx           # Top navigation (HeroHeader)
      footer.tsx           # Site footer
      logo.tsx             # Logo + logo icon variants
      theme-provider.tsx   # next-themes wrapper
      theme-toggle-btn.tsx # Theme toggle dropdown
    ui/                    # Reusable primitives (buttons, cards, etc.)
    icons/                 # Integrations/partner logo components
    *.tsx                  # Marketing sections (hero, features, FAQs, CTA, etc.)

  features/                # Future domain logic (server + hooks)
    auth/
      server/              # e.g. getCurrentUser, requireUser (stubs)
      hooks/               # e.g. useCurrentUser (stub)
    billing/
      server/              # e.g. subscription/billing helpers (stub)
    projects/
      server/              # e.g. core product domain (stub)

  services/
    aiservice.tsx          # Provider-agnostic AI service API (stub)

  docs/
    structure-migrations.md   # Roadmap for evolving structure
```

---

## Running the project

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# start production build
npm start
```

Then open `http://localhost:3000` in your browser.  
The root path `/` is served by `app/(marketing)/page.tsx` (route groups do not change the URL).

---

## Docs

- `docs/WORKFLOW.md` — local workflow + architecture boundaries
- `docs/TESTING.md` — unit test strategy + Jest usage
- `docs/structure-migrations.md` — refactor roadmap
- `docs/IMPROVEMENTS.md` — production hardening checklist

---

## How the client-side is organized

- **Routing**
  - **Marketing** pages live under `app/(marketing)/*` (e.g. `/`, `/pricing`, `/about`).
  - **App** pages live under `app/(app)/*` (e.g. `/dashboard`, `/settings`).
  - **Auth** pages live under `app/(auth)/*` (e.g. `/sign-in`).
  - `app/layout.tsx` sets up global fonts, theme provider, and global styles.

- **Layout components**
  - `components/layout/header.tsx` is a sticky top nav with logo, menu links, CTA buttons, and theme toggle.
  - `components/layout/footer.tsx` is the global footer with link columns, social icons, and newsletter form.
  - These are safe to reuse in both marketing and app layouts.

- **UI primitives**
  - `components/ui/*` holds reusable, mostly stateless building blocks (buttons, card, inputs, accordion, dropdown menu, etc.).
  - They are built on top of **Radix UI** primitives and Tailwind CSS with `class-variance-authority` for variants.

- **Marketing sections**
  - Sections like `hero-section.tsx`, `features-*.tsx`, `content-2.tsx`, `faqs-3.tsx`, `call-to-action.tsx`, `integrations-5.tsx` are composed together in `app/(marketing)/page.tsx`.
  - They use:
    - `motion` + `AnimatedGroup` for entrance animations.
    - Background effects and images via `next/image`.
    - Icons from `lucide-react`.

- **Theming**
  - `components/layout/theme-provider.tsx` wraps `NextThemesProvider`.
  - `components/layout/theme-toggle-btn.tsx` exposes a dropdown that switches between **light**, **dark**, and **system**.
  - `app/layout.tsx` wires this provider around the entire React tree.

---

## Growing into a full SaaS product

The structure is already set up to support:

- **Auth**
  - Use `app/(auth)/sign-in/page.tsx` as the entry point for your auth provider.
  - Implement server utilities in `features/auth/server` (e.g. `getCurrentUser`, `requireUser`).
  - Client-side hooks (`useCurrentUser`) live under `features/auth/hooks`.

- **Dashboard / app area**
  - Use `app/(app)/layout.tsx` as the **app shell** (sidebar, top nav, etc.).
  - Add routes under `app/(app)/*` (e.g. `app/(app)/settings/page.tsx`) for core SaaS functionality.
  - Keep domain logic in `features/*/server` and only call it from server components or route handlers.

- **Billing**
  - Put Stripe/Paddle/other billing logic behind `features/billing/server`.
  - UI for plans/pricing can live in marketing (`/pricing`) and mirror state from billing features.

- **AI features**
  - `services/aiservice.tsx` exposes a single `generateCompletion` function and related types.
  - Wire this up to your AI provider (OpenAI, Anthropic, local models, etc.) so the rest of the app stays provider-agnostic.

---
