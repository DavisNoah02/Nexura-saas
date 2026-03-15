# Improvements checklist

This is a pragmatic, ordered list of changes to move from "nice UI shell" to a production SaaS.

## Quick wins (low risk)

- [ ] Keep secrets out of git: use `.env.local` and commit only `.env.example`.
- [ ] Add `npm run typecheck` (`tsc --noEmit`) and run it in CI.
- [ ] Add formatting (Prettier) and a `format` script to keep style consistent across files.
- [ ] Remove dead links or add stubs for any routes referenced in navigation.

## Foundations (auth, data, boundaries)

- [ ] Pick an auth provider and enforce protected routes (`/dashboard`, `/settings`).
- [ ] Add an application data layer (Prisma or Drizzle) and define the first domain tables.
- [ ] Implement `features/auth/server` (`getCurrentUser`, `requireUser`) and use it from server components/route handlers.
- [ ] Move "real logic" out of `app/` and into `features/*` and `services/*`.

## Billing

- [ ] Choose billing provider (Stripe is common) and implement:
- [ ] Checkout session creation endpoint.
- [ ] Webhook handler with signature verification.
- [ ] Subscription state stored in DB and surfaced in `features/billing/server`.

## AI service

- [ ] Keep provider keys server-side: call AI from a route handler (for example `app/api/ai/route.ts`).
- [ ] Implement `services/aiservice` behind a single function and type it end-to-end.
- [ ] Add basic abuse controls: rate limit, request size limits, and audit logging.

## Testing and CI

- [ ] Add unit tests for `features/*/server` and `services/*` (Vitest works well).
- [ ] Add E2E smoke tests for auth pages and dashboard navigation (Playwright).
- [ ] Add CI: lint, typecheck, and tests on pull requests.

