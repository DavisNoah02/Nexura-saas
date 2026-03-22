# Nexura SaaS — Agent Notes

This repo contains a Next.js App Router frontend (`saas-app/`) intended to grow from a marketing site into a full SaaS app.

## Where code goes

- `app/`: Routes, layouts, and route handlers (thin). Use route groups:
  - `app/(marketing)`: public pages (`/`, `/pricing`, `/about`)
  - `app/(auth)`: auth pages (`/sign-in`, `/sign-up`, `/forgot-password`)
  - `app/(app)`: authenticated app pages (`/dashboard`, `/settings`)
- `components/`: UI components
  - `components/ui/`: reusable primitives (buttons, cards, inputs, etc.)
  - `components/layout/`: shared layout pieces (header, footer, logo, theme provider/toggle)
- `features/`: domain modules (preferred home for new business logic)
  - `features/*/server`: server-side domain helpers (DB, providers, validations)
  - `features/*/hooks`: client-side hooks (thin adapters around APIs)
- `services/`: external integrations (AI, billing, notifications, etc.). Keep provider calls centralized here.
- `lib/`: shared utilities (pure functions where possible).

## Workflow commands

Run these from `saas-app/`:

- `npm run dev` — local dev server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript (no emit)
- `npm test` — unit tests (Jest)

## PowerShell note (route groups)

PowerShell treats parentheses specially in some contexts. When navigating route-group folders, quote the path:

- `cd "saas-app\app\(marketing)"`
- `cd "saas-app\app\(app)"`
- `cd "saas-app\app\(auth)"`

## Testing expectations

- Prefer unit tests for **pure logic** in `lib/`, `features/*/server`, and `services/*`.
- Avoid unit testing Next.js internals or layout/markup-heavy pages unless there’s real logic.
- Keep tests fast; prefer mocking boundaries (network/DB/provider SDKs) instead of hitting real services.

