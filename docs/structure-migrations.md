# Structure migration roadmap

An ordered list of small, low-risk refactors to move toward the target SaaS architecture.

1. **Routes into groups**  
   - Keep the root entry in `app/page.tsx` but delegate to `app/(marketing)/page.tsx`.  
   - Add new marketing routes like `app/(marketing)/pricing/page.tsx`.  
   - Add `app/(app)/layout.tsx` and `app/(app)/dashboard/page.tsx` for the future authenticated area.  
   - Add `app/(auth)/sign-in/page.tsx` as the starting point for auth flows.

2. **Move layout primitives**  
   - Keep all global layout components in `components/layout` (`header`, `footer`, `logo`, theme provider/toggle).  
   - Use these from both marketing and future app layouts.

3. **Consolidate marketing sections**  
   - Treat hero, features, FAQs, integrations, content, and call-to-action sections as marketing-only and keep them under `components`.  
   - When they grow more complex, you can optionally move them into `components/marketing` without changing behavior.

4. **Adopt the features layer for new logic**  
   - Add new business logic under `features/*` instead of under `app/*` (for example, `features/auth/server`, `features/billing/server`, `features/projects/server`).  
   - Gradually migrate any existing API handlers or server actions to call into these feature modules.

5. **Centralize external integrations in services**  
   - Use `services/aiservice.tsx` as the single place to talk to your AI provider.  
   - Follow the same pattern for other integrations later (`services/billing`, `services/notifications`, etc.).

6. **Tighten imports and aliases**  
   - Prefer `@/components`, `@/features`, `@/lib`, and `@/services` over deep relative paths.  
   - Update imports as you touch files to slowly converge on the alias-based style.

7. **Introduce tests where it pays off**  
   - Start with isolated feature logic in `features/*/server` and service functions in `services/*`.  
   - Add tests only for the most critical paths first (auth, billing, core product flows).

