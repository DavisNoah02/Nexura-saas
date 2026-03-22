# Workflow (Local + Architecture)

## Local development

From `saas-app/`:

1. Install deps: `npm install`
2. Dev server: `npm run dev`
3. Before pushing:
   - `npm run lint`
   - `npm run typecheck`
   - `npm test`
4. Production build sanity: `npm run build`

## Architecture boundaries

Keep `app/` thin and push real logic down:

- `app/`:
  - Page/layout composition
  - Server Components that call into `features/*/server`
  - Route handlers that validate input and delegate to `features/*/server` or `services/*`
- `features/*/server`:
  - Domain logic (auth, billing, projects)
  - Validations, authorization checks, DB access
- `services/*`:
  - External integrations behind small typed APIs (AI provider, billing provider, email, etc.)
- `components/`:
  - UI primitives and layouts; avoid embedding business rules here

## How to add new work

- New route: add a page under the correct group:
  - Marketing: `app/(marketing)/...`
  - Auth: `app/(auth)/...`
  - App: `app/(app)/...`
- New feature/domain logic: create a module under `features/<domain>/server` and call it from routes/pages.
- New integration: add a typed wrapper under `services/<integration>` and call it from `features/*/server`.

## Roadmaps already in the repo

- `docs/structure-migrations.md` describes the target structure and low-risk refactors to get there.
- `docs/IMPROVEMENTS.md` is the production-hardening checklist (auth/data/billing/testing/CI).

