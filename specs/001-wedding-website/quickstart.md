# Quickstart: Wedding Information Website

**Feature**: 001-wedding-website  
**Last Updated**: November 8, 2025

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- VS Code (recommended) with Nx Console extension
- Playwright browsers installed: `npx playwright install --with-deps`

## Initial Setup

1. **Clone and install dependencies** (if not already done):

   ```powershell
   git clone <repository-url>
   cd dna
   npm install
   ```

2. **Checkout the feature branch**:

   ```powershell
   git checkout 001-wedding-website
   ```

3. **Verify workspace structure**:

   ```powershell
   npx nx graph
   ```

   Confirm `wedding` and `wedding-e2e` projects appear in the graph.

## Development Workflow (TDD)

### Step 1: Write Tests First (RED)

Before implementing any feature, write the failing tests:

**Unit Test Example** (`apps/wedding/specs/guestlist.spec.ts`):

```typescript
import { searchGuest } from '@/lib/guestlist';

describe('searchGuest', () => {
  it('should return "found" status for exact name match', () => {
    const result = searchGuest('John Smith');
    expect(result.status).toBe('found');
    expect(result.guest?.name).toBe('John Smith');
  });

  it('should return "not-found" status for unknown name', () => {
    const result = searchGuest('Unknown Person');
    expect(result.status).toBe('not-found');
  });
});
```

**Run tests** (should fail initially):

```powershell
npx nx test wedding
```

### Step 2: Implement Feature (GREEN)

Write minimum code to make tests pass:

**Implementation Example** (`apps/wedding/src/lib/guestlist.ts`):

```typescript
import guestlistData from '@/data/guestlist.json';
import type { Guest, SearchResult } from '@/types';

export function searchGuest(name: string): SearchResult {
  const normalized = name.toLowerCase().trim();
  const matches = guestlistData.guests.filter(
    guest => guest.name.toLowerCase() === normalized
  );

  if (matches.length === 0) {
    return {
      status: 'not-found',
      message: 'We couldn\'t find your name on our guestlist.'
    };
  }

  if (matches.length === 1) {
    return {
      status: 'found',
      guest: matches[0],
      message: `Welcome, ${matches[0].name}!`
    };
  }

  return {
    status: 'multiple-matches',
    matches,
    message: 'We found multiple guests with that name.'
  };
}
```

**Run tests** (should pass):

```powershell
npx nx test wedding
```

### Step 3: Refactor (REFACTOR)

Improve code quality while keeping tests green:

```typescript
// Extract normalization logic
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

export function searchGuest(name: string): SearchResult {
  const normalized = normalizeName(name);
  // ... rest of implementation
}
```

**Re-run tests** to ensure refactoring didn't break anything:

```powershell
npx nx test wedding
```

## Running the Application

### Development Server

```powershell
npx nx dev wedding
```

Visit `http://localhost:3000` in your browser.

### Build Static Site

```powershell
npx nx build wedding
```

Output: `apps/wedding/out/` directory with static HTML/CSS/JS files.

### Run All Quality Checks

Before committing, run the full CI pipeline locally:

```powershell
npx nx run-many -t lint test build typecheck
```

### E2E Tests

```powershell
npx nx e2e wedding-e2e
```

**Tip**: E2E tests automatically start the dev server on localhost:3000.

## Project Structure

```text
apps/wedding/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── rsvp/page.tsx         # RSVP page
│   │   └── about/page.tsx        # About the day page
│   ├── components/               # Reusable React components
│   ├── lib/                      # Business logic and utilities
│   └── data/
│       └── guestlist.json        # Static guestlist data
├── specs/                        # Unit tests (non-standard location)
└── public/
    └── images/                   # Hero image and other assets

apps/wedding-e2e/
└── src/
    ├── homepage.spec.ts          # Homepage E2E tests
    ├── rsvp.spec.ts              # RSVP E2E tests
    └── about.spec.ts             # About page E2E tests
```

## Common Tasks

### Add a New Component

1. **Write component test first** (`apps/wedding/src/components/MyComponent/MyComponent.test.tsx`):

   ```typescript
   import { render, screen } from '@testing-library/react';
   import MyComponent from './MyComponent';

   describe('MyComponent', () => {
     it('should render correctly', () => {
       render(<MyComponent />);
       expect(screen.getByText('Hello')).toBeInTheDocument();
     });
   });
   ```

2. **Run test** (should fail):

   ```powershell
   npx nx test wedding --testPathPattern=MyComponent
   ```

3. **Create component** (`apps/wedding/src/components/MyComponent/MyComponent.tsx`):

   ```typescript
   import styles from './MyComponent.module.css';

   export default function MyComponent() {
     return <div className={styles.container}>Hello</div>;
   }
   ```

4. **Create styles** (`apps/wedding/src/components/MyComponent/MyComponent.module.css`):

   ```css
   .container {
     padding: 1rem;
   }
   ```

5. **Re-run test** (should pass)

### Update Guestlist Data

1. Edit `apps/wedding/src/data/guestlist.json`:

   ```json
   {
     "guests": [
       {
         "id": "550e8400-e29b-41d4-a716-446655440000",
         "name": "John Smith",
         "email": "john@example.com",
         "postalCode": "B12 3AB"
       }
     ]
   }
   ```

2. Generate UUID for new guests: Use online tool or `crypto.randomUUID()` in Node.js

3. Validate schema:

   ```powershell
   # Run tests that validate guestlist structure
   npx nx test wedding --testPathPattern=guestlist
   ```

### Deploy to GitHub Pages

1. **Build static site**:

   ```powershell
   npx nx build wedding
   ```

2. **Verify output** in `apps/wedding/out/`

3. **Deploy** (manual or via GitHub Actions):

   ```powershell
   # Manual deployment
   npx gh-pages -d apps/wedding/out
   ```

   Or push to `main` branch and let GitHub Actions workflow handle deployment.

## Troubleshooting

### Tests Failing

- Ensure you're running tests with Nx: `npx nx test wedding` (not `npm test`)
- Check test file location: Unit tests must be in `apps/wedding/specs/`
- Verify TypeScript strict mode compliance: `npx nx typecheck wedding`

### Build Errors

- Check `next.config.js` has `output: 'export'` for static export
- Ensure no server-side features (API routes work differently in static export)
- Verify all images use `next/image` with `unoptimized: true` or proper static config

### E2E Tests Not Running

- Install Playwright browsers: `npx playwright install --with-deps`
- Check `playwright.config.ts` webServer is configured for port 3000
- Ensure dev server is not already running on port 3000

### Lighthouse Score Low

- Optimize images (compress, resize, use WebP/AVIF)
- Check CSS bundle size: `npx nx build wedding --analyze`
- Verify no layout shift during load (test CLS metric)
- Remove or defer non-critical JavaScript

## Next Steps

1. **Read the spec**: Review `specs/001-wedding-website/spec.md` for requirements
2. **Review the plan**: Check `specs/001-wedding-website/plan.md` for implementation strategy
3. **Follow TDD workflow**: Red → Green → Refactor for every feature
4. **Run full CI pipeline**: Before every commit, run `npx nx run-many -t lint test build typecheck`

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Nx Documentation](https://nx.dev)
- [Playwright Documentation](https://playwright.dev)
- [Constitution](./.specify/memory/constitution.md) - Project standards
