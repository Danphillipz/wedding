# Implementation Plan: Wedding Information Website

**Branch**: `001-wedding-website` | **Date**: November 8, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-wedding-website/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a static wedding website for Amy and Dan's July 2, 2026 wedding at Thorpe Gardens in Tamworth. The site features three pages: Homepage (hero image + announcement), RSVP (guestlist search with Google Forms integration), and About the Day (venue details, schedule, dress code). The site must be deployable to GitHub Pages, achieve Lighthouse scores ≥ 90, and provide a modern, clean, responsive experience across all devices.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15 (App Router only, React 19)  
**Primary Dependencies**: Next.js 15, React 19, CSS Modules (built-in)  
**Storage**: Static JSON files for guestlist data (bundled at build time), Google Forms for RSVP responses  
**Testing**: Jest (unit tests), Playwright (E2E tests), React Testing Library  
**Target Platform**: Static site deployment via GitHub Pages  
**Project Type**: Web application (Next.js App Router with static export)  
**Performance Goals**: Lighthouse ≥ 90, LCP < 2.5s, FCP < 1.5s, CLS < 0.1, TTI < 3.5s  
**Constraints**: GitHub Pages static hosting (no server-side runtime), case-insensitive exact name matching, RSVP deadline enforcement (May 2, 2026)  
**Scale/Scope**: 3 pages (Home, RSVP, About), estimated 50-200 wedding guests, single language (English)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Test-Driven Development**: Feature includes test specifications written BEFORE implementation (unit tests in `apps/wedding/specs/`, E2E tests in `apps/wedding-e2e/src/`)
- [x] **Type Safety**: All code will use TypeScript strict mode (already enabled in `tsconfig.json`)
- [x] **Visual Consistency**: UI components use CSS Modules (`.module.css`) and follow modern, clean design aesthetic
- [x] **Performance Targets**: Feature meets Lighthouse score ≥ 90, LCP < 2.5s, CLS < 0.1 (static site optimized for performance)
- [x] **Component Architecture**: Components follow Single Responsibility Principle, independently testable (page components, search component, form iframe component, navigation component)
- [x] **Nx Workflow**: All tasks use Nx commands (`npx nx dev wedding`, `npx nx test wedding`, `npx nx e2e wedding-e2e`)
- [x] **UX Standards**: Loading states for search, error handling for not found/deadline passed, mobile-first responsive design

**Violations Requiring Justification**: None

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-website/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── guestlist-schema.json
├── checklists/
│   └── requirements.md  # Created during /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/wedding/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (P1)
│   │   ├── page.module.css       # Homepage styles
│   │   ├── layout.tsx            # Root layout with navigation
│   │   ├── global.css            # Global styles and design tokens
│   │   ├── rsvp/
│   │   │   ├── page.tsx          # RSVP page (P2)
│   │   │   └── page.module.css   # RSVP page styles
│   │   └── about/
│   │       ├── page.tsx          # About the day page (P3)
│   │       └── page.module.css   # About page styles
│   ├── components/
│   │   ├── GuestSearch/
│   │   │   ├── GuestSearch.tsx
│   │   │   ├── GuestSearch.module.css
│   │   │   └── GuestSearch.test.tsx
│   │   ├── GoogleFormsEmbed/
│   │   │   ├── GoogleFormsEmbed.tsx
│   │   │   ├── GoogleFormsEmbed.module.css
│   │   │   └── GoogleFormsEmbed.test.tsx
│   │   └── Navigation/
│   │       ├── Navigation.tsx
│   │       ├── Navigation.module.css
│   │       └── Navigation.test.tsx
│   ├── lib/
│   │   ├── guestlist.ts          # Guestlist search logic
│   │   ├── guestlist.test.ts     # Unit tests for search logic
│   │   └── deadline.ts           # RSVP deadline validation
│   └── data/
│       └── guestlist.json        # Static guestlist data
├── public/
│   ├── images/
│   │   ├── hero.jpg              # Hero image (to be provided)
│   │   └── venue.jpg             # Venue image (optional)
│   └── .nojekyll                 # GitHub Pages: disable Jekyll processing
├── specs/                        # Unit tests (non-standard location)
│   ├── index.spec.tsx            # Homepage tests
│   ├── rsvp.spec.tsx             # RSVP page tests
│   └── about.spec.tsx            # About page tests
└── next.config.js                # Next.js config (static export for GitHub Pages)

apps/wedding-e2e/
└── src/
    ├── homepage.spec.ts          # E2E: Homepage journey (P1)
    ├── rsvp.spec.ts              # E2E: RSVP journey (P2)
    └── about.spec.ts             # E2E: About page journey (P3)
```

**Structure Decision**: Using existing Next.js App Router structure in `apps/wedding` project. Pages are organized using Next.js 15 App Router conventions (`app/page.tsx`, `app/rsvp/page.tsx`, `app/about/page.tsx`). Components are co-located with their tests and styles using CSS Modules. Static guestlist data lives in `src/data/`. Tests follow the non-standard location convention (`apps/wedding/specs/` for unit tests, `apps/wedding-e2e/src/` for E2E tests).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Not applicable - all constitution checks passed without violations.
````
