# Research: Wedding Information Website

**Feature**: 001-wedding-website  
**Date**: November 8, 2025  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a static wedding website using Next.js 15 with static export to GitHub Pages. All unknowns from the technical context have been resolved.

## Key Decisions

### 1. Next.js Static Export for GitHub Pages

**Decision**: Use Next.js 15 with `output: 'export'` in `next.config.js` to generate static HTML/CSS/JS files compatible with GitHub Pages.

**Rationale**:
- Next.js App Router provides modern React 19 features with static generation
- Static export eliminates need for Node.js runtime (GitHub Pages constraint)
- Built-in image optimization, routing, and performance features
- Excellent TypeScript support out of the box
- Nx already configured for Next.js 15 in this workspace

**Alternatives Considered**:
- **Vanilla React with Vite**: Less opinionated but requires manual routing setup, lacks built-in static generation patterns
- **Gatsby**: Heavyweight for a 3-page site, more complex build configuration
- **Astro**: Excellent performance but introduces new framework to learn, less React ecosystem alignment

**Implementation Notes**:
- Set `output: 'export'` in `next.config.js`
- Use `next/image` with `unoptimized: true` or configure static image optimization
- Add `.nojekyll` file to `public/` directory to prevent GitHub Pages Jekyll processing
- Deploy to `gh-pages` branch using GitHub Actions workflow

### 2. Guestlist Data Management

**Decision**: Store guestlist as a static JSON file (`src/data/guestlist.json`) bundled at build time.

**Rationale**:
- No server-side database needed (static site constraint)
- Guestlist is fixed at build time (invitations already sent)
- JSON format is TypeScript-friendly with type definitions
- Easy to version control and update via rebuilds
- Fast client-side search (small dataset: 50-200 guests)

**Schema**:
```json
{
  "guests": [
    {
      "id": "uuid-string",
      "name": "John Smith",
      "email": "john@example.com",
      "postalCode": "B12 3AB"
    }
  ]
}
```

**Alternatives Considered**:
- **Airtable/Supabase**: Adds external dependency, overkill for read-only static data
- **Google Sheets**: Requires build-time API integration, adds complexity
- **Hardcoded array**: Less maintainable, JSON provides better structure

**Implementation Notes**:
- Define TypeScript interface `Guest` with required fields
- Implement case-insensitive exact matching using `toLowerCase()` normalization
- Handle special characters (apostrophes, hyphens, accents) in comparison logic

### 3. Google Forms Integration Strategy

**Decision**: Embed Google Forms using iframe with URL pre-fill parameters based on guestlist search results.

**Rationale**:
- Google Forms provides free, reliable RSVP data collection
- Pre-fill parameters allow seamless UX (guest name auto-populated)
- Embedded iframe keeps users on the wedding site
- Form responses automatically collected in Google Sheets for Amy and Dan
- No server-side code needed for form submission

**Pre-fill URL Pattern**:
```
https://docs.google.com/forms/d/e/{FORM_ID}/viewform?embedded=true&entry.{FIELD_ID}={GUEST_NAME}
```

**Alternatives Considered**:
- **Custom form with Formspree**: Requires paid plan for unlimited submissions, less flexible for data viewing
- **Netlify Forms**: Not compatible with GitHub Pages (Netlify-specific feature)
- **EmailJS**: Requires client-side email credentials, less secure

**Implementation Notes**:
- Create Google Form with fields: Name (pre-filled), Attending (Yes/No), Additional Comments
- Extract field IDs from Google Forms HTML inspector
- Build iframe URL dynamically after guest search
- Add responsive iframe sizing for mobile devices
- Handle iframe loading states and potential errors

### 4. RSVP Deadline Enforcement

**Decision**: Implement client-side deadline check (May 2, 2026) that disables the RSVP form and shows a message after the deadline passes.

**Rationale**:
- Static site cannot enforce server-side validation
- Client-side check is sufficient for wedding context (guests are cooperative, not adversarial)
- JavaScript `Date` object provides reliable date comparison
- Clear messaging improves user experience

**Implementation**:
```typescript
const RSVP_DEADLINE = new Date('2026-05-02T23:59:59');
const isBeforeDeadline = new Date() < RSVP_DEADLINE;
```

**Alternatives Considered**:
- **Build-time deadline**: Would require rebuilding site daily, impractical
- **No deadline enforcement**: Relies on guest goodwill, less clear UX

**Implementation Notes**:
- Display deadline prominently on RSVP page
- Show countdown or days-remaining indicator if helpful
- Graceful message after deadline: "The RSVP deadline has passed. Please contact Amy and Dan directly."

### 5. Name Collision Disambiguation

**Decision**: Two-step flow - initial name search, then prompt for email/postal code if multiple matches found.

**Rationale**:
- Most guests will have unique names (one-step flow)
- Additional input only shown when necessary (progressive disclosure)
- Email/postal code validation ensures correct guest match
- Simple UX that doesn't overwhelm users with fields upfront

**Implementation Flow**:
1. Guest enters name in search field
2. System searches guestlist (case-insensitive exact match)
3. If 0 matches: Show "not on guestlist" message
4. If 1 match: Show Google Forms iframe with name pre-filled
5. If 2+ matches: Prompt for email OR postal code
6. Re-search with name + identifier to find unique match

**Alternatives Considered**:
- **Always ask for email/postal code**: Extra friction for majority of guests
- **Show list of matches with distinguishing info**: Requires more complex guestlist schema (e.g., "John Smith from London")

**Implementation Notes**:
- Design clear, non-accusatory messaging for disambiguation prompt
- Validate email format and postal code format (UK format: `AB12 3CD`)
- Provide helpful error messages if disambiguation fails

### 6. Performance Optimization for GitHub Pages

**Decision**: Use Next.js built-in optimizations with static export configuration to meet Lighthouse ≥ 90 target.

**Rationale**:
- Next.js automatically code-splits and optimizes bundles
- Static export generates pre-rendered HTML (fast initial load)
- CSS Modules provide scoped, optimized CSS
- Image optimization ensures hero image doesn't bloat page size

**Optimizations**:
- **Images**: Use `next/image` with responsive sizing, modern formats (WebP/AVIF), lazy loading
- **Fonts**: Self-host fonts (no external requests), use `font-display: swap`
- **CSS**: Critical CSS inlined, CSS Modules eliminate unused styles
- **JavaScript**: Code splitting by route, tree shaking for smaller bundles
- **Caching**: Set far-future cache headers for static assets (GitHub Pages default)

**Lighthouse Target Breakdown**:
- Performance ≥ 90 (LCP < 2.5s, FCP < 1.5s, CLS < 0.1, TTI < 3.5s)
- Accessibility ≥ 90 (semantic HTML, ARIA labels, color contrast)
- Best Practices ≥ 90 (HTTPS via GitHub Pages, no console errors)
- SEO ≥ 90 (meta tags, structured data for wedding event)

**Implementation Notes**:
- Run `next build` and analyze bundle size
- Test with Chrome DevTools Lighthouse in incognito mode
- Optimize hero image (compress, resize to actual display size)
- Minimize third-party scripts (Google Forms iframe only)

### 7. Testing Strategy

**Decision**: TDD with Jest + React Testing Library (unit tests) and Playwright (E2E tests), following constitution requirements.

**Test Structure**:
- **Unit Tests** (`apps/wedding/specs/`):
  - Homepage: Hero image renders, announcement text displays
  - RSVP: Guestlist search logic, name matching, disambiguation flow
  - About: Content sections render correctly
  - Components: GuestSearch, GoogleFormsEmbed, Navigation
  - Utilities: `guestlist.ts` search logic, `deadline.ts` validation

- **E2E Tests** (`apps/wedding-e2e/src/`):
  - `homepage.spec.ts`: P1 user journey (load homepage, see hero + announcement)
  - `rsvp.spec.ts`: P2 user journey (search guest, RSVP via Google Forms)
  - `about.spec.ts`: P3 user journey (view venue details, schedule, dress code)

**TDD Workflow**:
1. Write failing test for requirement (RED)
2. Implement minimum code to pass test (GREEN)
3. Refactor for quality while keeping tests passing (REFACTOR)

**Implementation Notes**:
- Mock Google Forms iframe in unit tests (test URL generation, not actual form submission)
- Use Playwright's `page.goto()` with real URLs for E2E tests
- Test responsive design with Playwright's device emulation
- Ensure 100% test coverage for critical logic (guestlist search, deadline validation)

## Open Questions (Resolved)

All technical unknowns have been resolved. No clarifications needed.

## Next Steps

Proceed to **Phase 1: Design & Contracts**:
1. Generate `data-model.md` with Guest and Guestlist entities
2. Create `contracts/guestlist-schema.json` with TypeScript interfaces
3. Write `quickstart.md` with development setup instructions
4. Update agent context files with Next.js 15 + GitHub Pages specifics
