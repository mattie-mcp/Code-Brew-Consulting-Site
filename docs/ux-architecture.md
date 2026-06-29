# UX & Information Architecture

> Owner: Information Architect / UX. See [`../PROJECT.md`](../PROJECT.md).
> **Updated 2026-06-29** for the "Coffee house" redesign (build-log Entry 7). The
> original "Studio" section map is superseded by the current structure below.

## Format

Single-page application, **long-scroll with anchored nav**. One page, several
sections, smooth in-page navigation. A recruiter can scan top-to-bottom or jump.

## Section order (top → bottom)

Matches `src/App.tsx`. The coffee-house theme gives several sections a café framing
(Menu, House Specials, Receipt) while keeping the underlying content model.

1. **Hero** (`Hero`) — Above the fold
   - Name, target title ("Engineering Manager · Staff Engineer"), one-line value prop.
   - "Open to roles" status chip.
   - Primary CTA: contact. Secondary: request resume (via form), LinkedIn, GitHub.
2. **About** (`About`) — formerly "Summary / What I do"
   - Short narrative. The both/and (lead teams + go deep) stated plainly.
3. **Menu** (`Menu`) — services / "how I operate"
   - Café-framed services list; folds in the old standalone Consulting section.
4. **Competency map** (`CompetencyMap`) — technical depth
   - Interactive drill-down evidence tree. Replaces the flat Skills list.
5. **Work / House Specials** (`Work`) — case studies
   - Cards: context → what I did → measurable outcome. Employed + Code Brew engagements (tagged).
6. **Receipt** (`Receipt`) — experience timeline
   - Roles, companies, dates, scope. Also hosts the resume-request flow (accordion).
7. **Contact** (`Contact` + `ContactForm`) — low-friction; repeats the "open to roles" signal.
   - The standalone footer was folded into this section.

## Navigation

- Sticky top nav with anchor links to sections; collapses to a menu on mobile.
- Persistent contact CTA in the nav.

## Responsive & accessibility (non-negotiable)

- Mobile-first; recruiters open links on phones.
- WCAG AA contrast, semantic HTML, keyboard navigable, focus states, alt text.
- Respect `prefers-reduced-motion`. Lighthouse 95+ across the board as a target.

## Performance

- Static, code-split, lazy-load below-the-fold imagery.
- No heavy frameworks beyond React; avoid large dependencies.
- Self-host fonts or use `font-display: swap`.

## Conversion details

- Resume is **delivered via the contact/resume-request form** (emailed as a PDF
  attachment), not a public download link — see `infrastructure.md`. The form
  doubles as the primary lead-capture path.
- Every section should have a low-friction path back to "contact me."
- Print stylesheet so the page itself prints cleanly as a leave-behind.
