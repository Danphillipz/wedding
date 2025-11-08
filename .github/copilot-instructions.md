# DNA Wedding - Nx Monorepo with Next.js 15 + React 19

## Architecture

Nx workspace (`@dna/` namespace) with two projects:
- `apps/wedding` - Next.js 15 app with App Router (no Pages Router)
- `apps/wedding-e2e` - Playwright E2E tests

**Critical**: Use **only** Nx commands (`npx nx dev wedding`) not npm scripts. Nx orchestrates builds, caching, and task dependencies across the monorepo.

## Essential Commands

```bash
npx nx dev wedding              # Dev server (port 3000)
npx nx test wedding             # Jest unit tests
npx nx e2e wedding-e2e          # Playwright (install browsers first: npx playwright install --with-deps)
npx nx run-many -t lint test build typecheck e2e  # CI pipeline locally
npx nx graph                    # Visualize project dependencies
npx nx g @nx/next:component Button --project=wedding  # Generate component
```

## Project-Specific Patterns

### Next.js App Router Structure
- Routes: `apps/wedding/src/app/` (e.g., `app/page.tsx`, `app/layout.tsx`)
- API routes: `apps/wedding/src/app/api/hello/route.ts` - export `GET`, `POST`, etc. as async functions returning `Response`
- Path alias: Import using `@/` → `apps/wedding/src/` (e.g., `import styles from '@/app/page.module.css'`)

### Testing Locations (Non-Standard)
- **Unit tests**: `apps/wedding/specs/` directory (NOT co-located with source)
  - Example: `apps/wedding/specs/index.spec.tsx` tests `apps/wedding/src/app/page.tsx`
  - Uses `@testing-library/react` with jsdom
- **E2E tests**: `apps/wedding-e2e/src/*.spec.ts`
  - Playwright auto-starts dev server on localhost:3000
  - Tests run against chromium, firefox, webkit

### Code Conventions
- **TypeScript**: Strict mode enabled - no implicit any, all code paths must return/throw
- **Formatting**: 2-space indent, single quotes (Prettier), LF line endings
- **CSS**: CSS Modules only (`.module.css` co-located with components)
- **ESLint**: Flat config format (`eslint.config.mjs`) - do NOT create `.eslintrc` files

## Common Gotchas

1. **React 19 breaking changes**: Check compatibility before adding React ecosystem libraries
2. **Module boundaries**: `@nx/enforce-module-boundaries` rule prevents circular dependencies - respect Nx project structure
3. **Tests depend on build**: Run `npx nx test wedding` triggers upstream builds automatically (configured in `nx.json` targetDefaults)
4. **Windows PowerShell**: Default shell - use PowerShell syntax for terminal commands
5. **Nx Cloud connected**: CI failures trigger `npx nx fix-ci` with auto-suggested fixes (see `.github/workflows/ci.yml`)
