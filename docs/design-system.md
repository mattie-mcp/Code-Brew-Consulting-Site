# Design System

> Owner: Visual / Brand Designer. See [`../PROJECT.md`](../PROJECT.md).
> **Status: live direction — "Coffee house."** This replaces the earlier "Studio"
> (terracotta-on-cream editorial) look as the source of truth. Tokens live in `src/index.css`.

## Design intent

Senior, credible, warm — but personable. The aesthetic is a signal: a hiring manager
should infer "this person has taste, judgment, and is good to work with." The site reads
like **the personal site + consulting front door of a thoughtful engineering leader**,
wrapped in a light, friendly **coffee-house metaphor** (the menu, the receipt, cupping
notes) over clean, recruiter-skimmable content — never a startup landing page, never
template-y, never junior.

**Direction (current): "Coffee house."** Warm cream paper with a single **caramel**
accent and **espresso** darks bookending the page (hero + contact). A literate **Spectral**
serif masthead, **DM Sans** body, and **Caveat** handwritten "chalkboard" accents for the
section eyebrows. The hero is a deliberate moment (an espresso roast with an oversized
serif name + headshot); sections then alternate cream / warm-tint / espresso for rhythm.
The interactive **competency map** ("Cupping Notes") is the second peak.

## Color (live tokens — see `src/index.css`)

```
--bg:        #f7f1e7   /* cream base — page background (light, single mode) */
--bg-elev:   #fbf6ec   /* lifted paper */
--surface:   #fbf6ec   /* paper card stock (menu, work cards, map nodes) */
--surface-2: #efe4d2   /* warm tint — alternating sections + about/stack chips */
--surface-receipt:#fffdf8 /* receipt paper */
--text:      #3a302a   /* ink — primary text on light */
--text-muted:#6b5d4f   /* muted warm brown — AA on paper */
--text-soft: #574b3f   /* body brown for long copy */
--text-faint:#9a8c7a   /* faint metadata / captions */
--espresso:  #262019   /* hero + contact section backgrounds */
--espresso-2:#33291f   /* work-card category band */
--espresso-3:#2b231d   /* focus node + evidence panel */
--cream:     #f1e7d8   /* primary text on dark */
--cream-muted:#cdbfae  /* secondary text on dark */
--cream-dim: #bdae9c   /* tertiary text on dark */
--accent:    #c98a4e   /* caramel — buttons, ring, active states, links-on-dark */
--accent-soft:#d89a5d  /* button hover */
--accent-text:#b07d3e  /* deepened caramel — eyebrows + mono labels, AA on paper */
--accent-ink:#2b231d   /* text on the caramel accent */
--gold:      #e0a560   /* hero eyebrow / accents on dark */
--gold-soft: #e6c79a   /* italic hero line / link-on-dark */
--border:    #e9dcc6   /* warm card hairline */
--border-2:  #e2d3bc
--dotted:    #d8c4a4   /* menu leaders, receipt dividers, map node borders */
--grid-line: rgba(120,90,50,0.07)  /* faint warm grid behind the map */
--ok:        #5e7a3f   /* "open to work" dot — warm olive-green, AA on paper */
```

- **Light, single mode.** `color-scheme: light`.
- One warm accent (caramel), used with restraint: CTAs, links, eyebrow mono, active map
  node + its connector, the receipt "+/–" and bullet markers.
- **`--accent-text` (#b07d3e) is the AA-safe value for caramel text on paper.** The brighter
  `--accent` (#c98a4e) is for fills behind dark/`--accent-ink` text, hover, and decoration.
- The espresso sections invert: `--cream` / `--cream-muted` text, `--gold` / `--gold-soft`
  accents. Verify all pairings at WCAG AA before locking.

## Typography

- **Display / headings + masthead:** **Spectral** — a literate serif. Hero H1 (600, with an
  italic gold second line), all section H2s, project/role/node titles. `--font-display`.
- **Body / UI:** **DM Sans** — legible humanist sans. `--font-sans`. Body 17px / 1.65.
- **Script accents:** **Caveat** — handwritten "chalkboard." Section eyebrows only
  ("— The Menu —", "— Cupping Notes —", "Pull up a chair ☕"), the menu Project/Advisory
  tags, and the form success title. `--font-script`. Used sparingly; never for body.
- **Mono (technical labels):** system mono stack — the receipt block, work-card category
  bands, and competency-map codes/breadcrumb. `--font-mono`.

## Layout & geometry

- Max content width 1160px (hero), with per-section widths (About 920 · Menu/Contact 760 ·
  Map/Work 1040 · Receipt 680). Section padding `clamp(60px,8vw,100px)`.
- **Soft geometry:** `--radius:14px` (cards), `--radius-sm:10px` (inputs, map nodes),
  receipt `6px`, pills `999px`.
- **Section rhythm:** cream → warm-tint (Menu) → cream (Map) → warm-tint (Work) → cream
  (Receipt) → espresso (Contact), with the espresso hero on top. Use `.section--tint` /
  `.section--dark` helpers.

## Warmth / motif system

- **Mug logo + lockup:** the nav carries the custom blue-mug mark + "CODE BREW CO. /
  SOFTWARE CONSULTING" lockup on espresso.
- **Headshot:** the hero pairs the name with a circular photo ringed in caramel (soft
  radial glow + 2px ring). Replaces the old "MP" monogram block.
- **Dotted radial grid:** a faint dotted overlay on the espresso hero; a faint 30px line
  grid behind the competency-map box (`--grid-line`).
- **Caveat eyebrows:** handwritten section labels in `--accent-text` (`--gold` on dark) —
  the warm, personable signal in place of the old uppercase tracked label.
- **Receipt + menu motifs:** dotted leaders (menu), a zig-zag torn edge + dashed/dotted
  rules + "★ THANK YOU ★" (receipt) — metaphor carried in pure CSS.

## Components inventory

Sticky espresso nav (mug + lockup, sans links, caramel "Get in touch" pill, mobile
toggle), hero (espresso masthead + headshot), about (centered bio + warm-tint pills), menu
(paper card, dotted-leader service rows), **competency map** (coordinate-space drill-down:
cross root → focus node + fanned children, SVG connectors, mono breadcrumb + back, espresso
evidence card, transform-only zoom guarded by visibility + reduced-motion), work (House
Specials card grid with espresso category bands), receipt (resume accordion), contact block
(espresso form + outlined pill links + footer line), **resume-request form**.

### Competency map (`CompetencyMap`)

Replaces the old radial-camera graph with the prototype's **coordinate-space** model: nodes
are absolutely positioned at %-coords inside a fixed box; an overlaid `0–100` SVG
(`preserveAspectRatio="none"`, `vector-effect:non-scaling-stroke`) draws connectors so nodes
and lines scale together. Root = cross (hub + 4 cores); deeper = espresso focus node
top-center with children fanned along y=72. Selected leaf + its connector turn caramel; an
espresso evidence card renders below. Zoom (descend / ascend / evidence) uses the Web
Animations API, **transform-only** and skipped when hidden or `prefers-reduced-motion`, so
content can never be left invisible. Content tree in `src/data/competencies.ts`.

### Resume-request form (`ContactForm`)

Backend-wired flow (Lambda PDF delivery + Plausible funnel + 7-day returning-visitor
memory + honeypot) — logic unchanged from the Studio build, restyled for the espresso
contact section: dark translucent inputs (`rgba(255,255,255,0.04)`, gold hairlines, cream
text), reason multi-select as pill toggles, the existing `.btn--primary` caramel submit
("Send it over →"). Success + returning-visitor states render as the caramel "Order
received! ☕" panel (Caveat title). All inputs keep real `<label>`s, the reasons use a
`<fieldset>/<legend>`, errors are `role="alert"` + `aria-describedby`, and focus moves to
the confirmation on success. Single-column at 540px.

## Accessibility

- Body, muted, link, eyebrow, and button-label colors clear **WCAG AA** on their surface
  (light paper and espresso). `--text-faint` / `--cream-dim` are reserved for small
  supplementary metadata.
- Visible `:focus-visible` outline in the accent. Map nodes, breadcrumb, and accordion
  rows are real `<button>`s; Escape backs out of the map.
- Motion (scroll reveals, map zoom) is gated by `prefers-reduced-motion`. No horizontal
  scroll (long tags wrap; `overflow-x:hidden` on body).
