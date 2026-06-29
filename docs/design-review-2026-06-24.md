# Design & Usability Review — 2026-06-24

> Visual / Brand Designer pass. Captured the live site at **1440×900 (desktop)** and
> **390×844 (mobile)** with Playwright (deviceScaleFactor 2), drove the competency map
> through all interaction states, and probed for layout breaks. Screenshots referenced
> below live in the review scratchpad `out/` dir.
>
> Verdict in one line: the site already reads as **senior, considered, and on-brand**.
> The "Insert coin" system is applied tastefully and the competency map is a genuine
> differentiator. One real responsive break (now fixed) and a rhythm tune (now fixed);
> the rest is polish and a couple of subjective calls left for the owner.

## What's genuinely good (keep)

- **Hero lands the positioning in the 10-second scan.** Name → `ENGINEERING MANAGER ·
  STAFF ENGINEER` → "Most recently Director of Engineering · BiggerPockets" → the
  "I build teams as deliberately as I build software — and I never leave the code"
  tagline. EM-leaning, IC-credible, exactly the brief. The status chip + crop ticks
  frame it without clutter. (`mob-hero.png`, `desk-hero.png`)
- **Competency map is the centerpiece it was meant to be.** The four-quadrant initial
  state with the ◑ mark at center and the `＋ click a node to explore` hint is clear;
  clicking blooms children with a smooth camera move; the selected node highlights in
  accent; breadcrumb + `◀ back` keep you oriented; the floating evidence card
  (`EVIDENCE · 01.1.A`, claim, stack tags, "See the work →") is clean and ties claims
  to real work. (`mapsvg-initial.png`, `mapsvg-expanded.png`, `mapsvg-branch.png`,
  `mapsvg-evidence2.png`)
- **Mobile map fallback is the right call** — numbered rack cards (`01 Connected
  Products`, descriptor, `2 areas ↘`, accent left-border) instead of a cramped SVG.
  (`mob-competencies.png`)
- **Contact CTA hierarchy is correct:** "Email me" primary, then quiet secondary chips
  (LinkedIn / GitHub / phone / Resume). (`mob-contact.png`)
- **The blueprint system is restrained, not noisy** — faint fixed grid, masked accent
  panels behind hero/contact, crop ticks, mono coordinate eyebrows. It reads as
  technical taste, never decoration-for-decoration's-sake.

---

## P0 — broken / embarrassing

### P0-1 — Horizontal scroll on mobile (FIXED)
**Saw:** at 390px the page `scrollWidth` was **436px** — a 46px horizontal overflow, so
the whole page could be dragged sideways. Root cause: `.tag` had `white-space: nowrap`,
and the long single tag **"AWS (Lambda, DynamoDB, ECS, API Gateway, IoT Core, RDS)"**
(plus long case-study tags) couldn't wrap and blew past the viewport, clipping at the
right edge. (`mob-skills.png` — tags clipped mid-word.)
**Why it matters:** horizontal jiggle on a phone is the single most obvious "this wasn't
tested" tell to a recruiter scanning on mobile. It undercuts the engineering-taste signal.
**Fix applied:** `src/index.css` `.tag` — added `max-width: 100%; overflow-wrap: anywhere;`
and a `@media (max-width: 480px) { .tag { white-space: normal } }` so short tags still sit
on one line but over-long ones wrap inside their column. Verified: `scrollWidth` is now
exactly 390px, zero overflow offenders. (`mob2-skills.png` — AWS tag wraps cleanly.)

---

## P1 — clear improvement

### P1-1 — Cavernous inter-section gaps on mobile (FIXED)
**Saw:** every `.section` uses `padding: var(--sp-12) 0` (6rem top + 6rem bottom). Stacked,
that's a ~12rem (~192px) dead zone between every section. On a 390px phone the eyebrow of
each section sat roughly halfway down the viewport with nothing above it, burying content
below the fold and making the page feel sparse rather than generous.
(`mob-summary.png`, `mob-consulting.png` — large empty top band above each eyebrow.)
**Why it matters:** on mobile this pushes "Case studies", "Experience", and the competency
map further from the scan; generous whitespace becomes wasted whitespace.
**Fix applied:** `src/index.css` — `@media (max-width: 760px) { .section { padding: var(--sp-8) 0 } }`
(6rem → 4rem on phones). Desktop rhythm is untouched. Verified: prior section content now
sits just above each eyebrow, the page reads as a continuous flow. (`mob3-consulting.png`)

### P1-2 — `text-faint` is AA-large only (RECOMMEND — owner call)
**Measured:** `--text-faint #8a8792` on `--bg #f4f1ea` = **3.12:1** → passes AA only for
large text. It's used for mono coordinate labels (`01.1.a`), breadcrumb separators, and
some metadata. The genuinely-readable dates in Experience/Work use `--text-muted`
(6.88:1, AA-pass), so this is confined to supplementary labels.
**Recommendation:** acceptable as-is for decorative coordinates, but if you want the small
mono labels to clear AA, nudge the token to ~`#6f6c77` (≈4.5:1). I left this for you
because darkening it slightly compresses the three-tier text hierarchy (faint vs. muted
vs. ink) and that's a taste trade-off, not a clear win. No code change made.

---

## P2 — polish / nice-to-have

### P2-1 — Map camera leaves the focused node low in frame (RECOMMEND)
**Saw:** in the branch view the selected node (`01.1 IoT & device platforms`) and its
accent edge sit near the bottom-right and the edge runs off-canvas; a faint parent
remnant (`01`) lingers bottom-left. (`mapsvg-branch.png`) It still reads fine, but the
framing isn't as centered as the initial and core states.
**Why it matters:** minor — the centerpiece is the thing people will play with, so the
framing being slightly off on the deepest levels is the kind of thing a sharp eye notices.
**Fix (owner/Frontend call):** `targetView()` in `CompetencyMap.tsx` could weight the
focused node toward center (or grow the vertical padding for L≥2). This touches the camera
logic (Frontend's lane), so flagging rather than editing.

### P2-2 — "＋ click a node to explore" hint shows in the mobile fallback (RECOMMEND — Content)
**Saw:** the intro hint `＋ click a node to explore` renders on mobile too, where the UI is
a tap-through rack of cards, not clickable graph nodes. (`mob-competencies.png`) Slightly
inaccurate instruction on touch.
**Fix:** copy/conditional — hide the hint or swap to "tap to explore" in fallback mode.
This is a copy + render-condition change → **Content / Frontend** lane.

### P2-3 — Consulting ◑ watermark reads as a faint partial circle (NO CHANGE — intentional)
**Saw:** the large ◑ mark at 8% opacity bleeding off the consulting card's top-right corner
can read as an incomplete arc rather than the brand mark. (`desk-consulting.png`,
`mob-consulting.png`) On inspection it's deliberate (`.consulting__mark`, the ◑ logo motif)
and genuinely subtle. Leaving as-is; noting only so it isn't mistaken for a rendering bug.

---

## Changes applied this pass (file-by-file)

- `src/index.css`
  - `.tag` — `max-width: 100%; overflow-wrap: anywhere;` + `@media (max-width:480px)` wrap.
    Kills the mobile horizontal overflow. (P0-1)
  - `.section` — `@media (max-width:760px) { padding: var(--sp-8) 0 }`. Tightens mobile
    inter-section rhythm. (P1-1)

No tokens were added or changed in value, so `docs/design-system.md` needs no edit (the
two changes are responsive overrides of existing tokens, faithful to the locked system).

## Left for the owner to decide

- **P1-2** `text-faint` AA-large vs. darkening to AA (taste trade-off on text hierarchy).
- **P2-1** map camera framing on deep levels (Frontend lane).
- **P2-2** mobile map hint copy (Content lane).

## Verification

- `npm run build` — **passes** (tsc + vite, 54 modules, clean).
- Mobile horizontal overflow — **resolved** (`scrollWidth` 390 = viewport, 0 offenders).
- Contrast — body/muted/link/CTA pairings clear **WCAG AA**; only `text-faint` is AA-large
  (flagged, not forced); `accent-cyan` is declared-but-unused so no violation.
- Screenshots (scratchpad `out/`): `desk-hero.png`, `desk-summary.png`, `desk-work.png`,
  `desk-experience.png`, `desk-competencies.png`, `desk-skills.png`, `desk-consulting.png`,
  `desk-contact.png`; `mapsvg-initial/expanded/branch/evidence2.png`;
  `mob-hero/summary/work/experience/competencies/skills/consulting/contact.png`;
  `mob-nav-open.png`; post-fix `mob2-skills.png`, `mob3-consulting.png`.
