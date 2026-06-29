# Redesign Proposal — "Warm & Human" — 2026-06-24

> Owner: Visual / Brand Designer. Proposal stage — **nothing in `src/` was changed.**
> Three standalone HTML/CSS mockups live in the scratchpad `concepts/` dir; screenshots
> in `out/`. Each renders the **hero + "What I do" + two case-study cards** using Mattie's
> real copy from `src/data/profile.ts` (copy unchanged — Content's lane).
>
> The brief: move off the cold "Insert coin" blueprint look to something **warm, human,
> approachable** that still reads **senior EM / Staff Engineer** in a 10-second recruiter
> scan. All three below are siblings of one direction — warm paper, rounded forms,
> generous breathing room — varied in palette temperature, type pairing, portrait
> treatment, and layout rhythm.
>
> **What the old look got wrong (and what these fix).** The previous design read as a
> generic engineer-portfolio: the blueprint/mono motif repeated without escalating, the
> hero opened on a timid mono eyebrow rather than a moment, the type and palette weren't
> distinctive, and the strongest idea (the competency map) was buried mid-page while the
> hero played it safe. Every concept here answers that directly:
> 1. **A bolder, singular hero moment** — a masthead-scale name in a characterful warm
>    typeface; warmth and personality up top, no timid eyebrow leading.
> 2. **Genuinely distinctive type** — a real humanist serif or characterful grotesk, not
>    a system default.
> 3. **A crescendo hierarchy** — the hero is unmistakably the peak; type scale steps DOWN
>    into "What I do" and "Case studies" so the page reads as a descending arc, not a row
>    of equal-weight peers. (Translated to the full site, the competency map becomes a
>    deliberate second peak rather than another flat section.)

---

## Concept A — "Studio"  ·  *literate, editorial, photo-free*

A warm-cream editorial layout with a humanist serif. Reads like the personal site of a
thoughtful engineering leader who writes well — confident and senior without trying hard.

- **Palette:** bone cream `#f7f0e6` paper / `#fdf8f0` cards · warm ink `#2c2420` ·
  muted brown `#6b5d52` · **terracotta accent** `#c45a3b` (links/buttons deepen to
  `#a8452b` for AA) · olive secondary `#7d7a4f`.
- **Type:** **Newsreader** (warm humanist serif, opsz) for the name/headlines and an
  *italic* role line; **Inter** for body. Serif-led = literate, human, established.
- **Portrait:** **none** — a terracotta gradient **"MP" monogram block** with concentric
  rings carries the warmth. Zero photo dependency.
- **Signals:** a senior leader with taste and judgment; calm, well-liked, communicates
  clearly. Skews "Staff/Principal who leads."
- **Pros:** most distinctive and the most "premium"; works with no asset at all; serif
  warmth is hard to make look junior. **Cons:** serif-forward is a slightly bolder bet;
  if Mattie wants an unmistakably "friendly" read, B is warmer-faced.
- **Screens:** `out/concept-a-desktop.png`, `out/concept-a-mobile.png`.

## Concept B — "Atelier"  ·  *people-first, organic, portrait-led*

The warmest, most human-faced of the three. A sage-and-clay palette with an organic
blob-shaped portrait and a friendly geometric sans. Reads "approachable manager who
grows people."

- **Palette:** soft greige-sage `#eef0e9` paper / `#f7f8f3` lifted · forest ink
  `#26302a` · sage accent `#6f8a6e` (text `#4f6b4f` for AA) · **warm clay** secondary
  `#cf9a7d` (darkens to `#9c5a38` for text) · clay-soft pills `#ecd9c9`.
- **Type:** **Fraunces** (soft display serif) for headlines + **Hanken Grotesk**
  (friendly geometric sans) for body/labels. Rounded, warm, contemporary.
- **Portrait:** **placeholder silhouette** inside an organic blob shape — clearly
  labeled *"placeholder — real headshot optional."* Designed to host a real headshot if
  Mattie wants one, and to still look intentional if he doesn't (the silhouette + blob
  read as a considered abstract, not a missing image).
- **Signals:** people-first engineering leader; coaching, culture, team-building — which
  maps directly to the BiggerPockets transformation story. Skews "EM/Director who builds
  teams."
- **Pros:** warmest, most human; the layout has an obvious home for a photo later.
  **Cons:** **depends on the portrait slot** to feel complete — without a real photo the
  silhouette is fine but not as strong as A's monogram; sage is the most "lifestyle" of
  the palettes, so the copy has to keep it senior (it does).
- **Screens:** `out/concept-b-desktop.png`, `out/concept-b-mobile.png`.

## Concept C — "Daybreak"  ·  *confident, calm, photo-free, centered*

A centered, airy hero with a soft golden "daybreak" glow behind the name. Warmth comes
from light and color, not a face. The most modern/tech-forward of the three while still
warm.

- **Palette:** warm greige `#f3ede2` paper / `#fbf6ec` cards · warm ink `#2a2520` ·
  muted `#6a6056` · **honey/amber accent** `#d9963f` (text `#8a5810` for AA) · rust
  secondary `#b9542f` · soft sun fill `#f0c27a`.
- **Type:** **Space Grotesk** (confident geometric grotesque) for the big name + section
  heads, **Fraunces italic** for the role line and pull-quote (the warm serif counterpoint),
  **Inter** body. Grotesk-led = current and technical; serif accents keep it human.
- **Portrait:** **none** — the radial honey glow behind the centered name is the hero
  moment. No asset needed.
- **Layout rhythm:** **centered** hero (vs. the two-column heroes of A and B) — its own
  distinct cadence.
- **Signals:** modern, calm, in-command technical leader; the grotesk + AI-era cleanliness
  pairs well with the AI-engineering story. Balanced EM-and-Staff read.
- **Pros:** no photo needed and still has a strong singular hero moment; the centered
  layout escalates better toward a centerpiece section later. **Cons:** centered heroes
  are a touch more common; honey/amber needs care to stay sophisticated rather than
  "sunny" (handled by keeping the glow soft and the ink warm-neutral).
- **Screens:** `out/concept-c-desktop.png`, `out/concept-c-mobile.png`.

---

## At a glance

| | A — Studio | B — Atelier | C — Daybreak |
|---|---|---|---|
| Temp / palette | cream + terracotta | sage + clay | greige + honey |
| Type lead | humanist **serif** | soft serif + friendly **sans** | **grotesk** + serif accent |
| Photo | **no** (monogram) | **yes-ready** (silhouette placeholder) | **no** (sun glow) |
| Hero layout | two-column | two-column, organic | centered |
| Leans | Staff/Principal who leads | EM/Director who builds teams | modern technical leader |
| Photo-independent? | ✅ fully | ⚠️ works, stronger with photo | ✅ fully |

## Accessibility (checked at proposal stage)

All body text, muted text, and link/eyebrow colors clear **WCAG AA** on their paper in
every concept. Adjustments already baked into the mockups so they don't ship a fail:
- **A:** primary button deepened to terracotta `#a8452b` (white label 5.91:1).
- **B:** clay was failing as text (2.13:1) → split into a fill clay and a **text clay
  `#9c5a38`** (4.65:1); pills use `#7a4f37` on clay-soft (5.11:1).
- **C:** honey-deep darkened to `#8a5810` for links/eyebrows/pill text (5.17:1 on paper).
Light accent tints (`--terra`, `--honey`, sage) remain reserved for large display text,
fills, and decoration only — never small body text.

## Recommendation

**Lead with Concept A (Studio), with Concept C (Daybreak) as the close runner-up.**

A is the strongest *because* it's photo-free: it looks the most premium and distinctive
with zero dependency on an asset Mattie may never provide, and the humanist serif is the
hardest of the three to ever read as junior — exactly the "thoughtful, well-liked
engineering leader" target. C is the pick if Mattie wants a more modern/technical-forward
read or a centered layout. **Reserve B for if Mattie definitely wants his face on the
site** — it's the warmest and has a real home for a headshot, but it leans on that slot to
feel finished.

A pragmatic path: **build A as the primary direction**, and if Mattie later supplies a
headshot, B's portrait treatment can be folded into A as an optional variant (monogram ↔
photo) rather than a separate design.

## Open questions for Mattie

1. **Photo: yes or no?** This is the biggest fork. A and C need no photo and look complete
   today; B is built to host one. If "no photo," I'd drop B and decide between A and C.
2. **Type personality:** serif-led & literate (A), soft-serif + friendly-sans (B), or
   grotesk + serif-accent (C)? This is the most defining choice once palette is picked.
3. **Font licensing:** all three use **Google Fonts** (Newsreader, Fraunces, Hanken
   Grotesk, Space Grotesk, Inter) — open-licensed (OFL), free to self-host, no cost. Fine
   to proceed unless you'd prefer a specific paid typeface.
4. **Accent temperature:** terracotta (A), sage+clay (B), or honey/amber (C) — which warm
   accent feels most "you"?

## Notes

- These are static HTML mockups for look-and-feel only — not wired to data, nav, or the
  competency map. Once a direction is picked I'll translate the chosen tokens/type into
  `src/index.css` + components and re-fit the existing sections (including the map) to it.
- Scratchpad sources: `concepts/concept-a.html`, `concept-b.html`, `concept-c.html`;
  capture helper `shot-concept.mjs`.
