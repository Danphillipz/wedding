# Feature Specification: Wedding Information Website

**Feature Branch**: `001-wedding-website`  
**Created**: November 8, 2025  
**Status**: Draft  
**Input**: User description: "I want to build a wedding website aimed at giving guest all of the information about our wedding which is taking place on Thursday July 2nd 2026 and Thorpe Gardens in Tamworth. There should be 3 main pages, the homepage which simply has a hero image and beneath a small section of text with 'We're getting married' and our wedding date. The second page should be a 'RSVP' section, where guest can enter their name to search for themselves to see if they're on our initial guestlist, then they can RSVP. The third page should be general 'About the day' and other information. Importantly, this should be a static website which we want to host using GitHub Pages"

My name is Daniel, my fiances name is Amy. We should be referred to as by Amy and Dan.

**Constitution Compliance**: All features MUST adhere to TDD (tests written first), TypeScript strict mode, visual consistency standards, performance targets (Lighthouse ≥ 90), and component modularity principles.

## Clarifications

### Session 2025-11-08

- Q: What RSVP response options should be available to guests? → A: Simple binary: Attending / Not Attending (single person only)
- Q: What matching strategy should be used for guestlist search? → A: Case-insensitive exact match only
- Q: How should multiple name matches be handled? → A: Require additional input field (e.g., email or postal code) for disambiguation
- Q: What is the RSVP deadline? → A: 2 months before (May 2, 2026)
- Q: How should Google Forms be integrated? → A: Embedded iframe with pre-filled guest information from search

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Wedding Information (Priority: P1)

A wedding guest visits the website to learn about the wedding date and location.

**Why this priority**: This is the core purpose of the website - providing basic wedding information. Without this, the site has no value.

**Independent Test**: Can be fully tested by visiting the homepage and verifying the hero image, announcement text "We're getting married", and wedding date (Thursday July 2nd 2026) are displayed.

**Acceptance Scenarios**:

1. **Given** a guest visits the homepage, **When** the page loads, **Then** they see a hero image displayed prominently
2. **Given** a guest is viewing the homepage, **When** they scroll below the hero image, **Then** they see the text "We're getting married" and the date "Thursday July 2nd 2026"
3. **Given** a guest visits the homepage on a mobile device, **When** the page loads, **Then** all content is responsive and readable

---

### User Story 2 - RSVP to Wedding (Priority: P2)

A wedding guest wants to confirm their attendance by submitting an RSVP.

**Why this priority**: Essential for wedding planning as it enables guest count tracking, but the site still provides value (information) without it.

**Independent Test**: Can be fully tested by navigating to the RSVP page, searching for a guest name on the list, and submitting an RSVP response.

**Acceptance Scenarios**:

1. **Given** a guest navigates to the RSVP page, **When** they enter their name in the search field, **Then** the system searches the guestlist using case-insensitive exact matching and displays whether they are on the list
2. **Given** multiple guests share the same name, **When** a guest searches for that name, **Then** the system prompts for an additional identifier (email or postal code) to disambiguate
3. **Given** a guest is on the guestlist, **When** they view their search result, **Then** they see an embedded Google Forms iframe with their name pre-filled
4. **Given** a guest completes the RSVP form, **When** they submit it, **Then** their response is recorded in Google Forms and they see a confirmation message
5. **Given** a guest is not on the guestlist, **When** they search for their name, **Then** they see a polite message indicating they are not on the initial guestlist
6. **Given** a guest has already submitted an RSVP, **When** they search for their name again, **Then** they see their previous RSVP response and can update it if needed
7. **Given** the current date is after May 2, 2026, **When** a guest tries to RSVP, **Then** they see a message that the RSVP deadline has passed

---

### User Story 3 - Access Wedding Day Details (Priority: P3)

A wedding guest wants to learn additional information about the wedding day, such as venue details, schedule, dress code, and other logistics.

**Why this priority**: Enhances the guest experience but is not critical for the core function of announcing the wedding and collecting RSVPs.

**Independent Test**: Can be fully tested by navigating to the "About the day" page and verifying all relevant information sections are displayed.

**Acceptance Scenarios**:

1. **Given** a guest navigates to the "About the day" page, **When** the page loads, **Then** they see information about the venue (Thorpe Gardens in Tamworth)
2. **Given** a guest is viewing the "About the day" page, **When** they scroll through the content, **Then** they find details about the schedule, dress code, accommodations, and any other relevant information
3. **Given** a guest needs venue directions, **When** they view the venue section, **Then** they can access location information and directions

---

### Edge Cases

- What happens if a guest tries to submit an RSVP without completing required fields?
- How does the site perform when accessed from various devices (mobile, tablet, desktop)?
- What happens when the guestlist data file is missing or corrupted?
- How are special characters in guest names handled (apostrophes, hyphens, accented letters)?
- What happens if a guest cannot remember their email or postal code used for disambiguation?
- What happens if a guest tries to RSVP after the deadline (May 2, 2026)?
- What happens if a guest tries to update their RSVP after the deadline?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a homepage with a hero image and wedding announcement text ("We're getting married" and "Thursday July 2nd 2026")
- **FR-002**: System MUST provide navigation between three pages: Homepage, RSVP, and About the day
- **FR-003**: System MUST provide an RSVP page with a name search functionality using case-insensitive exact matching to find guests on the initial guestlist
- **FR-003a**: System MUST prompt for additional identifying information (email or postal code) when multiple guests share the same name
- **FR-004**: System MUST allow guests on the guestlist to submit an RSVP response with binary options: Attending or Not Attending
- **FR-005**: System MUST display a confirmation message after a guest submits an RSVP
- **FR-006**: System MUST show an appropriate message to guests who are not found on the guestlist
- **FR-007**: System MUST display venue information (Thorpe Gardens in Tamworth) on the "About the day" page
- **FR-008**: System MUST persist RSVP responses using an embedded Google Forms iframe with guest information pre-filled from the search results
- **FR-009**: System MUST be deployable as a static site compatible with GitHub Pages
- **FR-010**: System MUST be responsive and functional on mobile, tablet, and desktop devices
- **FR-011**: System MUST allow guests who have already RSVP'd to view and update their response
- **FR-012**: System MUST display wedding day details including schedule, dress code, and accommodations on the "About the day" page
- **FR-013**: System MUST display the RSVP deadline (May 2, 2026) prominently on the RSVP page
- **FR-014**: System MUST prevent RSVP submissions after the deadline (May 2, 2026) and display an appropriate message

### Key Entities *(include if feature involves data)*

- **Guest**: Represents a person on the wedding guestlist, including their name, disambiguating identifier (email or postal code), and RSVP status (attending/not attending)
- **Guestlist**: Collection of all invited guests with their names and identifying information
- **RSVP Response**: A guest's confirmation of attendance, including their name and attendance status
- **Wedding Details**: Information about the wedding including date (Thursday July 2nd 2026), venue (Thorpe Gardens in Tamworth), schedule, dress code, and other logistics

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Guests can view wedding date and location information immediately upon visiting the homepage (within 2 seconds of page load)
- **SC-002**: Guests can search the guestlist and receive results in under 1 second
- **SC-003**: 95% of guests successfully complete the RSVP process on their first attempt without assistance
- **SC-004**: The website loads and displays correctly on mobile devices (iOS and Android), tablets, and desktop browsers
- **SC-005**: The website achieves a Lighthouse performance score of 90 or higher (per constitution requirements)
- **SC-006**: The website successfully deploys to GitHub Pages and is accessible via public URL
- **SC-007**: Page load time for the homepage is under 2.5 seconds on 3G connections (LCP < 2.5s per constitution requirements)
- **SC-008**: All pages are navigable and functional without errors across major browsers (Chrome, Firefox, Safari, Edge)

## Assumptions *(mandatory)*

- The guestlist will be provided as a data file that can be included in the static site build
- Google Forms will be used to collect and manage RSVP responses, with notifications sent to the couple
- The couple will have access to Google Forms to view and export RSVP data
- The couple will provide the hero image and any additional images for the "About the day" page
- The wedding details content (schedule, dress code, etc.) will be provided as text content
- Basic analytics or tracking is not required in the initial version
- No authentication is required - the site is publicly accessible to anyone with the URL
- Guest names on the guestlist are unique enough to avoid significant collision issues
- The site will use modern, clean design consistent with constitution standards

## Dependencies *(mandatory)*

- GitHub Pages hosting service must be available
- Google Forms must be set up to collect RSVP responses
- Wedding details content must be provided by the couple
- Hero image and any additional images must be provided
- Guestlist data must be provided in a structured format
