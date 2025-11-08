<!--
SYNC IMPACT REPORT
==================
Version Change: Initial → 1.0.0
Modified Principles: N/A (initial version)
Added Sections:
  - I. Test-Driven Development (NON-NEGOTIABLE)
  - II. Type Safety & Code Quality
  - III. Visual Consistency & Modern Design
  - IV. Performance & User Experience
  - V. Component Architecture
  - User Experience Standards
  - Development Workflow
Removed Sections: N/A
Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md - Updated Constitution Check section
  ✅ .specify/templates/spec-template.md - Aligned with testing requirements
  ✅ .specify/templates/tasks-template.md - Updated to reflect TDD workflow
Follow-up TODOs: None
-->

# DNA Wedding Website Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)

**TDD is mandatory for all features.** Tests MUST be written before implementation:

- Tests are written first and reviewed by stakeholders
- Tests MUST fail initially (red phase)
- Implementation proceeds only after failing tests confirm expected behavior
- Red-Green-Refactor cycle strictly enforced
- No feature is complete without passing tests

**Rationale**: TDD ensures requirements are understood before coding begins, prevents regressions, and serves as living documentation. For a wedding website where user experience is paramount, testing guarantees each feature works flawlessly before deployment.

### II. Type Safety & Code Quality

**TypeScript strict mode is non-negotiable.** All code MUST:

- Pass TypeScript strict type checking (no implicit `any`)
- Use explicit return types for functions
- Define interfaces for all data structures
- Pass ESLint with zero warnings (flat config format)
- Follow Prettier formatting (2-space indent, single quotes, LF line endings)
- Achieve 100% type coverage

**Rationale**: Strict typing catches errors at compile time, improves IDE autocomplete, makes refactoring safe, and serves as inline documentation. This is critical for maintaining a clean, professional codebase.

### III. Visual Consistency & Modern Design

**All UI components MUST maintain a clean, modern aesthetic.** Design requirements:

- CSS Modules only (`.module.css` co-located with components)
- Consistent spacing, typography, and color palette across all pages
- Mobile-first responsive design (320px minimum width)
- Accessibility compliance (WCAG 2.1 AA minimum)
- No CSS-in-JS libraries - CSS Modules provide scoped styling
- Design tokens for colors, fonts, spacing documented in project

**Rationale**: A wedding website represents a special occasion and MUST look polished and professional. Visual consistency creates trust and ensures a delightful user experience across all devices.

### IV. Performance & User Experience

**Performance is a feature.** All pages MUST meet these standards:

- Lighthouse Performance score ≥ 90
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5s
- Images optimized (Next.js Image component with WebP/AVIF)
- No layout shifts during page load

**Rationale**: Users expect instant, smooth experiences. A slow or janky website detracts from the wedding celebration theme and causes frustration.

### V. Component Architecture

**Components MUST be modular, reusable, and independently testable.** Requirements:

- Single Responsibility Principle - one component does one thing well
- Props interfaces explicitly typed
- Components tested in isolation (unit tests in `specs/` directory)
- E2E tests validate complete user journeys (Playwright)
- Components documented with usage examples
- Nx project boundaries enforced (no circular dependencies)

**Rationale**: Modular components enable rapid feature development, easier testing, and prevent the codebase from becoming a tangled mess. Clear boundaries maintain long-term maintainability.

## User Experience Standards

**Wedding website visitors expect elegance and ease.** These standards apply universally:

- **Loading States**: All async operations show loading indicators
- **Error Handling**: User-friendly error messages (no stack traces shown)
- **Navigation**: Intuitive menu structure, clear call-to-action buttons
- **Content Hierarchy**: Visual hierarchy guides users to important information
- **Animations**: Subtle, purposeful transitions (no gratuitous effects)
- **Forms**: Clear validation feedback, accessible error messages
- **Mobile Experience**: Touch-friendly targets (minimum 44×44px), thumb-friendly zones

**Enforcement**: Every PR MUST include screenshots/recordings demonstrating the feature on mobile and desktop.

## Development Workflow

**Nx commands are the single source of truth.** Workflow requirements:

- Use ONLY Nx commands (`npx nx dev wedding`, NOT `npm run dev`)
- Run `npx nx affected -t lint test build typecheck` before every commit
- E2E tests run via `npx nx e2e wedding-e2e` (install browsers first)
- CI pipeline (`run-many -t lint test build typecheck e2e`) MUST pass before merge
- All tests located in `apps/wedding/specs/` (non-standard location)
- Use path alias `@/` for imports (maps to `apps/wedding/src/`)

**Code Review Gates**:

- TypeScript strict mode compliance
- All tests passing (unit + E2E)
- ESLint zero warnings
- Lighthouse performance score ≥ 90
- Visual review on mobile and desktop
- No console errors or warnings

**Rationale**: Nx orchestrates the monorepo build system, task caching, and dependencies. Using npm scripts bypasses this orchestration and breaks incremental builds.

## Governance

**This constitution supersedes all other development practices.** All contributors MUST:

- Verify compliance before submitting pull requests
- Justify any deviations in PR description with "Constitution Violation" section
- Update this constitution when new patterns emerge that benefit the project
- Refer to `.github/copilot-instructions.md` for runtime development guidance

**Amendment Process**:

- Amendments require documentation of rationale in PR description
- Version bumping follows semantic versioning:
  - **MAJOR**: Backward-incompatible principle changes or removals
  - **MINOR**: New principles added or material expansions
  - **PATCH**: Clarifications, wording improvements, typo fixes
- All amendments MUST update dependent template files
- Migration plan required for breaking changes

**Compliance Review**: Every PR MUST include a checklist confirming:

- [ ] Tests written first and passed TDD cycle
- [ ] TypeScript strict mode compliance
- [ ] Visual design matches modern, clean aesthetic
- [ ] Performance metrics meet thresholds
- [ ] Component architecture follows SRP
- [ ] Nx commands used (not npm scripts)

**Version**: 1.0.0 | **Ratified**: 2025-11-08 | **Last Amended**: 2025-11-08
