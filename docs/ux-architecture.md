# UX & Information Architecture

> Owner: Information Architect / UX. See [`../PROJECT.md`](../PROJECT.md).

## Format

Single-page application, **long-scroll with anchored nav**. One page, several
sections, smooth in-page navigation. A recruiter can scan top-to-bottom or jump.

## Section order (top → bottom)

1. **Hero / Above the fold**
   - Name, target title ("Engineering Manager / Staff Engineer"), one-line value prop.
   - "Open to opportunities" status chip.
   - Primary CTA: contact / schedule. Secondary: download resume, LinkedIn, GitHub.
2. **Summary / "What I do"**
   - 3–4 sentence narrative. The both/and (lead teams + go deep) stated plainly.
3. **Selected work / Case studies**
   - 3–4 cards. Each: context → what I did → measurable outcome.
   - Mix of employed roles and Codebrew engagements (tagged).
4. **Experience timeline**
   - Roles, companies, dates, scope (team size, level). Scannable.
5. **Skills / Technical depth**
   - Grouped (languages, infra/cloud, leadership competencies). Honest, not a keyword dump.
6. **Codebrew Consulting**
   - One compact section. "How I operate independently." Subordinate, evidence-framed.
7. **Contact**
   - Email, scheduling link, social. Low friction. Repeat the "open to roles" signal.
8. **Footer**
   - Copyright, resume link, built-with note (subtle engineering flex).

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

- Resume available as a real downloadable PDF (also good for SEO/applications).
- Every section should have a low-friction path back to "contact me."
- Print stylesheet so the page itself prints cleanly as a leave-behind.
