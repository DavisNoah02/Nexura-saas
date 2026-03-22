# Testing (Unit)

This project uses **Jest via `next/jest`** for fast unit and component-smoke tests.

## What to unit test

Best targets:

- Pure utilities in `lib/`
- Domain logic in `features/*/server`
- Integration wrappers in `services/*` (mock the provider SDK calls)

Avoid (until there’s real logic):

- Snapshotting large UI sections
- Testing Next.js routing/layout behavior

## Where tests live

Co-locate tests next to code using:

- `*.test.ts`
- `*.test.tsx`

Examples in this repo:

- `lib/utils.test.ts`
- `components/layout/logo.test.tsx`

## Running tests

From `saas-app/`:

- `npm test`
- `npm run test:watch`
 - `npm run test:ci` (recommended for CI / restricted environments)

## Mocking Next.js modules (examples)

Mock navigation:

```ts
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
```

Mock `next/link` when a component depends on it in tests:

```ts
jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});
```
