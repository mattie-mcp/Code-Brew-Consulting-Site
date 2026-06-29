# Design System

> Owner: Visual / Brand Designer. See [`../PROJECT.md`](../PROJECT.md).
> **Status: live direction — "Studio."** This replaces the earlier "Insert coin"
> blueprint look as the source of truth. Tokens live in `src/index.css`.

## Design intent

Senior, credible, warm. The aesthetic is itself a signal: a hiring manager should infer
"this person has taste and judgment." The site reads like **the personal site of a
thoughtful, well-liked engineering leader** — editorial, literate, generous with space —
never a startup landing page, never template-y, never cutesy or junior.

**Direction (current): "Studio."** Warm ink on cream paper, a single **terracotta**
accent, and a **humanist serif masthead**. Warmth comes from color and type, not from
decoration. The hero is a deliberate, singular moment (an oversized serif name); the page
then steps DOWN in scale through the sections so it reads as a descending arc rather than
a row of equal-weight peers. The competency map is the second peak.

## Color (live tokens — see `src/index.css`)

```
--bg:        #f7f0e6   /* bone cream paper (light, single mode) */
--bg-elev:   #fbf6ec   /* lifted paper */
--surface:   #fdf8f0   /* card stock */
--surface-2: #efe6d6   /* recessed / pressed */
--text:      #2c2420   /* warm near-black ink */
--text-muted:#6b5d52   /* muted warm brown — AA on paper (5.6:1) */
--text-faint:#948578   /* faint metadata — AA-large only */
--accent:    #c45a3b   /* terracotta — display fills, hover, decoration */
--accent-text:#a8452b  /* deepened terracotta — links + button fills, AA on paper (5.2:1) */
--accent-soft:#d2725a  /* display-size / hover only */
--accent-cyan:#7d7a4f  /* secondary signal — warm olive (reserved) */
--accent-dim: rgba(196,90,59,0.10)
--border:    #ddd0bd   /* warm hairline */
--border-soft:#e7dccb
--grid-line: rgba(44,36,32,0.035)  /* very faint warm paper grid */
--ok:        #5e7a3f   /* "open to work" dot — warm olive-green, AA on paper */
```

- **Light, single mode.** `color-scheme: light`.
- One warm accent, used with restraint: CTAs, links, eyebrows, the masthead role line,
  the monogram block, key numbers, the competency-map active path.
- **`--accent-text` (#a8452b) is the AA-safe value for text and button fills.** The
  lighter `--accent` (#c45a3b) is for large display text, fills behind white, hover, and
  decoration only. White on `--accent-text` = 5.9:1; white on `--accent` = 4.3:1 (use for
  large/bold only).
- Verify all pairings at WCAG AA before locking. Current text pairings all pass AA except
  `--text-faint` (AA-large, reserved for small supplementary metadata).

## Typography

- **Display / headings + masthead:** **Newsreader** — a warm humanist serif (optical
  sizing). Used for the hero name, section titles, case-study/experience headings, the
  italic role line, and the hero lede. `--font-display`.
- **Body:** **Inter** — highly legible sans. `--font-sans`. Body 17px, line-height 1.65.
- **Mono (technical labels):** **JetBrains Mono** — for coordinate codes, the email
  address, and competency-map labels (the one surviving "technical" signal). `--font-mono`.
- Headings are serif weight 500, tight tracking (-0.02em). The hero name is masthead scale
  (`clamp(3.2rem, 8vw, 6rem)`). Type scale steps down hero → section title → body so the
  page crescendos.

## Layout & geometry

- Max content width ~1080px, centered, generous gutters (8px spacing scale, canonical).
- **Rounded, editorial geometry:** `--radius: 14px`, `--radius-sm: 8px`,
  `--radius-pill: 999px`. Buttons and chips are pills; cards are soft-cornered. (This
  replaces the old rectilinear 4px/2px.)
- **Section rhythm:** `--sp-12` (6rem) top/bottom on desktop; reduced to `--sp-8` (4rem)
  below 760px so generous spacing doesn't bury content on phones.

## Warmth / motif system

- **Monogram block:** the hero carries an **"MP" monogram** on a terracotta gradient
  block (concentric rings) — warmth and personality with **no photo dependency**. If a
  real headshot is ever added, it can swap into this slot.
- **Faint warm grid:** an extremely faint paper grid (`--grid-line`) is available behind
  the competency-map panel; the body background is plain cream (the old fixed blueprint
  grid was dropped).
- **Quiet corner ticks:** the `.crop` registration ticks survive as a subtle warm framing
  accent (terracotta at 50% opacity) — used sparingly, e.g. the map panel.
- **Warm radial glow:** the contact block closes the page with a soft terracotta radial
  glow (mirrors the hero warmth) instead of the old blueprint panel.
- **Eyebrows:** uppercase, wide-tracked, terracotta — a confident label, no crosshair.

## Components inventory

Sticky nav (serif wordmark + ◑ mark, sans links), hero (masthead + monogram block),
status line, CTA buttons (primary terracotta pill / strong outline / quiet), case-study
card, experience timeline, skill pills, competency map (warm schematic — terracotta
active path, cream plates, mono coordinates; full interaction + mobile rack fallback
intact), consulting card, contact block, **résumé-request form**, footer.

### Résumé-request form (`ContactForm`)

Lives in the contact block; replaces the old "Resume ↓" download. Styled in-system:
card-stock inputs (`--surface`) with warm hairline borders and `--radius-sm`, a
`3px --accent-dim` focus ring on `--accent-text`, and the reason multi-select as
**pill toggles** (selected = terracotta outline + `--accent-dim` fill, matching `.tag`).
Submit uses the existing `.btn--primary`. The honeypot field is off-screen (not
`display:none`). The success and returning-visitor states render as a warm bordered
**note card** with a serif title and a terracotta check-disc — deliberately human, not a
generic "submitted" receipt. All inputs have real `<label>`s, the reasons use a
`<fieldset>/<legend>`, errors are `role="alert"` + `aria-describedby`, and focus moves to
the confirmation on success. Clears WCAG AA on the cream palette; single-column at 540px.

## Accessibility

- All body, muted, link, eyebrow, and button-label colors clear **WCAG AA** on their
  surface. `--text-faint` is AA-large only (reserved for small supplementary metadata).
- Visible `:focus-visible` outline in the accent. Motion (scroll reveals, map camera) is
  gated by `prefers-reduced-motion`. No horizontal scroll at 390px (long tags wrap).
