# Tasks: Wedding Information Website

**Input**: Design documents from `/specs/001-wedding-website/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/guestlist-schema.json

**Constitution Compliance**:
- Tests are MANDATORY (TDD is NON-NEGOTIABLE) - tests MUST be written first and fail before implementation
- All code MUST pass TypeScript strict mode
- All UI components MUST use CSS Modules and follow modern, clean design
- All features MUST meet performance targets (Lighthouse ≥ 90, LCP < 2.5s, FCP < 1.5s, CLS < 0.1)
- Use ONLY Nx commands for all tasks (`npx nx dev wedding`, `npx nx test wedding`, `npx nx e2e wedding-e2e`)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Project root: `apps/wedding/`
- Source code: `apps/wedding/src/`
- Unit tests: `apps/wedding/specs/` (non-standard location)
- E2E tests: `apps/wedding-e2e/src/`
- Path alias: `@/` → `apps/wedding/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Next.js 15 static export configuration

- [ ] T001 Configure Next.js for static export in apps/wedding/next.config.js (set output: 'export')
- [ ] T002 Create .nojekyll file in apps/wedding/public/.nojekyll to disable GitHub Pages Jekyll processing
- [ ] T003 [P] Create TypeScript interfaces in apps/wedding/src/types/index.ts from contracts/guestlist-schema.json
- [ ] T004 [P] Create global design tokens and base styles in apps/wedding/src/app/global.css
- [ ] T005 [P] Create sample guestlist data file in apps/wedding/src/data/guestlist.json with 3-5 sample guests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Write unit tests for guestlist search logic in apps/wedding/specs/lib/guestlist.spec.ts (MUST FAIL - test normalization, exact match, multiple matches)
- [ ] T007 Implement guestlist search utilities in apps/wedding/src/lib/guestlist.ts (normalizeString, searchByName, searchByEmail, searchByPostalCode functions)
- [ ] T008 Write unit tests for deadline validation in apps/wedding/specs/lib/deadline.spec.ts (MUST FAIL - test before/after deadline scenarios)
- [ ] T009 Implement deadline validation utility in apps/wedding/src/lib/deadline.ts (isBeforeDeadline function with May 2, 2026 deadline)
- [ ] T010 [P] Write unit tests for Navigation component in apps/wedding/src/components/Navigation/Navigation.test.tsx (MUST FAIL - test links render, active state)
- [ ] T011 [P] Implement Navigation component in apps/wedding/src/components/Navigation/Navigation.tsx (links to /, /rsvp, /about)
- [ ] T012 [P] Create Navigation component styles in apps/wedding/src/components/Navigation/Navigation.module.css (responsive mobile-first design)
- [ ] T013 Update root layout in apps/wedding/src/app/layout.tsx to include Navigation component and global metadata

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Wedding Information (Priority: P1) 🎯 MVP

**Goal**: Display wedding announcement with hero image, couple names, and wedding date on homepage

**Independent Test**: Navigate to homepage and verify hero image loads, "We're getting married" text displays, and date shows "Thursday July 2nd 2026"

### Tests for User Story 1 (MANDATORY - TDD NON-NEGOTIABLE) ⚠️

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation (Red-Green-Refactor)**

- [ ] T014 [P] [US1] Unit test for homepage in apps/wedding/specs/index.spec.tsx (MUST FAIL - test hero image alt text, announcement text, date display)
- [ ] T015 [P] [US1] E2E test for homepage journey in apps/wedding-e2e/src/homepage.spec.ts (MUST FAIL - test page loads, hero visible, responsive on mobile)

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create placeholder hero image in apps/wedding/public/images/hero.jpg (use 1920x1080 placeholder from Lorem Picsum or similar)
- [ ] T017 [US1] Implement homepage in apps/wedding/src/app/page.tsx (hero image using next/image, announcement section with "We're getting married" and date)
- [ ] T018 [US1] Create homepage styles in apps/wedding/src/app/page.module.css (hero full-width, announcement centered, mobile-first responsive)
- [ ] T019 [US1] Run unit tests with npx nx test wedding --testPathPattern=index.spec.tsx to verify tests pass
- [ ] T020 [US1] Run E2E test with npx nx e2e wedding-e2e --grep=homepage to verify journey passes
- [ ] T021 [US1] Run Lighthouse audit on homepage to verify score ≥ 90, LCP < 2.5s, FCP < 1.5s, CLS < 0.1

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - MVP deliverable!

---

## Phase 4: User Story 2 - RSVP to Wedding (Priority: P2)

**Goal**: Enable guests to search guestlist by name and submit RSVP via embedded Google Forms

**Independent Test**: Navigate to /rsvp, search for guest name, verify correct match/no match/disambiguation flow, submit RSVP via iframe

### Tests for User Story 2 (MANDATORY - TDD NON-NEGOTIABLE) ⚠️

- [ ] T022 [P] [US2] Unit test for GuestSearch component in apps/wedding/src/components/GuestSearch/GuestSearch.test.tsx (MUST FAIL - test search input, submit, result states)
- [ ] T023 [P] [US2] Unit test for GoogleFormsEmbed component in apps/wedding/src/components/GoogleFormsEmbed/GoogleFormsEmbed.test.tsx (MUST FAIL - test iframe URL generation with pre-fill)
- [ ] T024 [P] [US2] Unit test for RSVP page in apps/wedding/specs/rsvp.spec.tsx (MUST FAIL - test page renders search, handles results, shows deadline)
- [ ] T025 [P] [US2] E2E test for RSVP journey in apps/wedding-e2e/src/rsvp.spec.ts (MUST FAIL - test search found, search not found, multiple matches, deadline passed, iframe embed)

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement GuestSearch component in apps/wedding/src/components/GuestSearch/GuestSearch.tsx (search input, submit handler, loading state, result display)
- [ ] T027 [P] [US2] Create GuestSearch component styles in apps/wedding/src/components/GuestSearch/GuestSearch.module.css (form styling, error/success states, mobile-first)
- [ ] T028 [P] [US2] Implement GoogleFormsEmbed component in apps/wedding/src/components/GoogleFormsEmbed/GoogleFormsEmbed.tsx (iframe with dynamic pre-fill URL, responsive sizing)
- [ ] T029 [P] [US2] Create GoogleFormsEmbed component styles in apps/wedding/src/components/GoogleFormsEmbed/GoogleFormsEmbed.module.css (responsive iframe container)
- [ ] T030 [US2] Implement RSVP page in apps/wedding/src/app/rsvp/page.tsx (GuestSearch component, deadline check, GoogleFormsEmbed on found result)
- [ ] T031 [US2] Create RSVP page styles in apps/wedding/src/app/rsvp/page.module.css (page layout, deadline banner, mobile-first responsive)
- [ ] T032 [US2] Create Google Form with fields: Name (short text), Attending (multiple choice: Yes/No), Additional Comments (paragraph text)
- [ ] T033 [US2] Extract Google Form field IDs and update GoogleFormsEmbed component with correct form ID and entry field IDs
- [ ] T034 [US2] Test disambiguation flow: Add duplicate guest names to guestlist.json, verify email/postal code prompt works
- [ ] T035 [US2] Run unit tests with npx nx test wedding --testPathPattern=rsvp to verify all tests pass
- [ ] T036 [US2] Run E2E test with npx nx e2e wedding-e2e --grep=rsvp to verify full journey passes
- [ ] T037 [US2] Run Lighthouse audit on /rsvp page to verify score ≥ 90, performance targets met

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Access Wedding Day Details (Priority: P3)

**Goal**: Display venue information, schedule, dress code, and accommodations on About the Day page

**Independent Test**: Navigate to /about and verify all sections display correctly (venue details, schedule, dress code, accommodations)

### Tests for User Story 3 (MANDATORY - TDD NON-NEGOTIABLE) ⚠️

- [ ] T038 [P] [US3] Unit test for About page in apps/wedding/specs/about.spec.tsx (MUST FAIL - test venue info renders, schedule sections present, dress code displayed)
- [ ] T039 [P] [US3] E2E test for About page journey in apps/wedding-e2e/src/about.spec.ts (MUST FAIL - test page loads, all sections visible, responsive on mobile)

### Implementation for User Story 3

- [ ] T040 [P] [US3] Create wedding details constants in apps/wedding/src/lib/constants.ts (venue info, schedule array, dress code, accommodations as TypeScript objects)
- [ ] T041 [US3] Implement About the Day page in apps/wedding/src/app/about/page.tsx (venue section, schedule timeline, dress code section, accommodations section)
- [ ] T042 [US3] Create About page styles in apps/wedding/src/app/about/page.module.css (section layouts, timeline styling, mobile-first responsive)
- [ ] T043 [US3] Add optional venue image to apps/wedding/public/images/venue.jpg (if provided by couple)
- [ ] T044 [US3] Run unit tests with npx nx test wedding --testPathPattern=about.spec.tsx to verify tests pass
- [ ] T045 [US3] Run E2E test with npx nx e2e wedding-e2e --grep=about to verify journey passes
- [ ] T046 [US3] Run Lighthouse audit on /about page to verify score ≥ 90, performance targets met

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations and quality checks across all user stories

- [ ] T047 [P] Add metadata and SEO tags in apps/wedding/src/app/layout.tsx (title, description, Open Graph tags for social sharing)
- [ ] T048 [P] Optimize hero image compression and format (WebP/AVIF with fallback, appropriate sizing)
- [ ] T049 [P] Add structured data JSON-LD for wedding event in apps/wedding/src/app/layout.tsx (schema.org/Event markup)
- [ ] T050 Run full test suite with npx nx run-many -t lint test typecheck to verify all quality checks pass
- [ ] T051 Run full E2E suite with npx nx e2e wedding-e2e to verify all user journeys pass
- [ ] T052 Build static site with npx nx build wedding and verify output in apps/wedding/out/ directory
- [ ] T053 Test static site locally by serving apps/wedding/out/ directory and verifying all pages work
- [ ] T054 Run Lighthouse audit on all pages (/, /rsvp, /about) and verify all scores ≥ 90
- [ ] T055 Test responsive design on mobile devices (iOS Safari, Android Chrome) and verify all pages render correctly
- [ ] T056 Verify special character handling in guestlist search (test names with apostrophes, hyphens, accents)
- [ ] T057 Verify deadline enforcement: Change system clock to after May 2, 2026 and confirm RSVP form is disabled
- [ ] T058 [P] Update README.md with deployment instructions for GitHub Pages
- [ ] T059 [P] Create GitHub Actions workflow in .github/workflows/deploy.yml for automatic deployment on push to main

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T005) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T006-T013)
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Homepage**: Can start after Foundational (T006-T013) - No dependencies on other stories
- **User Story 2 (P2) - RSVP**: Can start after Foundational (T006-T013) - Uses guestlist.ts and deadline.ts utilities from Phase 2
- **User Story 3 (P3) - About**: Can start after Foundational (T006-T013) - No dependencies on other stories

### Within Each User Story

1. **Tests FIRST** (TDD Red phase) - MUST be written and FAIL before implementation
2. **Implementation** (TDD Green phase) - Minimum code to make tests pass
3. **Component dependencies**: Styles and tests can be parallel, but component implementation waits for its tests
4. **Test verification** (TDD Refactor phase) - Run tests to confirm they pass
5. **Quality checks** - Lighthouse, E2E tests, responsive testing

### Parallel Opportunities

**Setup Phase (T001-T005)**:
- T003 (TypeScript interfaces) || T004 (global styles) || T005 (sample data) can run in parallel

**Foundational Phase (T006-T013)**:
- T006-T007 (guestlist search) can run in parallel with T008-T009 (deadline validation)
- T010-T012 (Navigation component) can run in parallel with T006-T009

**User Story 1 (T014-T021)**:
- T014 (unit test) || T015 (E2E test) || T016 (hero image) can run in parallel

**User Story 2 (T022-T037)**:
- T022, T023, T024, T025 (all test files) can run in parallel
- T026-T027 (GuestSearch) || T028-T029 (GoogleFormsEmbed) can run in parallel

**User Story 3 (T038-T046)**:
- T038 (unit test) || T039 (E2E test) || T040 (constants) || T043 (venue image) can run in parallel

**Polish Phase (T047-T059)**:
- T047, T048, T049, T058, T059 (all independent file changes) can run in parallel

**Cross-Story Parallelization**:
- Once Foundational phase (T006-T013) completes, User Stories 1, 2, and 3 can be implemented in parallel by different developers

---

## Parallel Example: User Story 2 (RSVP)

```bash
# Launch all tests for User Story 2 together (TDD Red phase):
T022: "Unit test for GuestSearch component"
T023: "Unit test for GoogleFormsEmbed component"
T024: "Unit test for RSVP page"
T025: "E2E test for RSVP journey"

# Launch independent component implementations together (TDD Green phase):
T026-T027: "GuestSearch component + styles"
T028-T029: "GoogleFormsEmbed component + styles"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (T001-T005) - ~2 hours
2. Complete **Phase 2: Foundational** (T006-T013) - ~4 hours - **CRITICAL BLOCKER**
3. Complete **Phase 3: User Story 1** (T014-T021) - ~3 hours
4. **STOP and VALIDATE**: Test homepage independently (`npx nx test wedding`, `npx nx e2e wedding-e2e --grep=homepage`)
5. Deploy MVP to GitHub Pages for stakeholder review
6. **Total MVP time**: ~9 hours

### Incremental Delivery

1. **Foundation** (Setup + Foundational) → ~6 hours → Foundation ready
2. **+ User Story 1** (Homepage) → ~3 hours → Test independently → Deploy/Demo (MVP!)
3. **+ User Story 2** (RSVP) → ~8 hours → Test independently → Deploy/Demo (Core feature complete)
4. **+ User Story 3** (About) → ~4 hours → Test independently → Deploy/Demo (Full feature set)
5. **+ Polish** (Phase 6) → ~4 hours → Final deployment
6. **Total time**: ~25 hours

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:
- **Developer A**: User Story 1 (Homepage) - ~3 hours
- **Developer B**: User Story 2 (RSVP) - ~8 hours
- **Developer C**: User Story 3 (About) - ~4 hours

Stories complete and integrate independently. Developer A can assist with User Story 2 or Polish after completing Homepage.

---

## TDD Workflow Reminder

**EVERY task follows Red-Green-Refactor**:

1. **RED**: Write test first in `apps/wedding/specs/` or `apps/wedding-e2e/src/`
   - Run test: `npx nx test wedding` or `npx nx e2e wedding-e2e`
   - **MUST FAIL** - confirms test is actually testing something
2. **GREEN**: Write minimum code to make test pass
   - Implement in `apps/wedding/src/`
   - Run test again - **MUST PASS**
3. **REFACTOR**: Improve code quality while keeping tests green
   - Extract functions, improve naming, optimize performance
   - Run test again - **MUST STAY PASSING**

**Constitution requires TDD** - no exceptions. Tests written after implementation do NOT count.

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story (US1, US2, US3) for traceability
- **Each user story is independently completable and testable** - can be delivered as MVP increments
- **Verify tests FAIL before implementing** - critical for TDD compliance
- **Commit after each task or logical group** - enables easy rollback
- **Stop at any checkpoint to validate story independently** - prevents compounding errors
- **Google Forms setup (T032-T033)**: Requires manual creation in Google Forms UI, extract field IDs from form HTML
- **Hero image (T016)**: Placeholder until Amy and Dan provide actual photo
- **Venue image (T043)**: Optional - only add if provided
- **Total task count**: 59 tasks
  - Setup: 5 tasks
  - Foundational: 8 tasks
  - User Story 1 (Homepage): 8 tasks
  - User Story 2 (RSVP): 16 tasks
  - User Story 3 (About): 9 tasks
  - Polish: 13 tasks
