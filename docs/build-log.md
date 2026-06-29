# Build Log — How This Site Was Made

> A chronological, decision-oriented record of building `codebrewconsulting.com` with
> Claude Code and an agent team. Purpose: demonstrate architecture and process — how
> Mattie scopes, decides, and delivers using AI-assisted workflows. Each entry captures
> *what we decided, why, and how the AI was directed.* Newest entries at the bottom.

## Working method

- **Docs-first.** Every decision is persisted in `PROJECT.md` + `docs/*` before code,
  so the work is resumable and reviewable. The human sets direction and gates quality;
  the AI drafts, scaffolds, and implements.
- **Agent team.** Distinct roles (positioning, content, UX, design, frontend, devops)
  each own a doc and a slice of the build — mirroring how Mattie runs a real org.
- **Human-in-the-loop gating.** Decisions that are genuinely the owner's (stack, hosting,
  positioning, analytics) are surfaced as explicit choices, not assumed.

---

## Log

### Entry 1 — Ideation & decision capture
- **Goal set:** a personal site to land a technical EM / Staff role, with Code Brew
  Consulting as supporting evidence (not an agency pitch).
- **Decisions made (owner choices):** React + Vite + TypeScript SPA · AWS S3 + CloudFront
  via IaC · EM-leaning-but-IC-credible voice · consulting as supporting evidence.
- **AI direction:** drafted the full planning doc set (`PROJECT.md` + 5 `docs/`),
  defined the agent-team roles so coverage is explicit.
- **Why it matters for the demo:** shows decision framing and architecture *before* code.

### Entry 2 — Content intake from resume
- **Input:** `resume_base.pdf`, GitHub, LinkedIn, domain, AWS account ID.
- **AI direction:** synthesized the resume into real site copy — hero, four case studies
  (org turnaround, production RAG search, the Codebrew ERP plant-floor platform, the
  Ellevest investment platform), timeline, skills, SEO metadata.
- **Positioning sharpened:** the both/and proven on one job (BiggerPockets: first eng
  leader *and* hands-on architect); AI-engineering depth flagged as the timely hook.

### Entry 3 — Infra & analytics decisions
- **DNS:** Route 53 hosted zone already exists → CDK will look up the zone and add aliases.
- **Analytics:** chose the most basic, most AWS-native option — CloudFront standard
  access logs → S3, queried via Athena, plus free CloudWatch metrics. No third-party
  trackers, no client JS. CloudWatch RUM noted as an optional later upgrade.
- **Why:** matches "basic + native AWS," keeps the site privacy-friendly and cheap.

### Entry 4 — Foundation scaffold (human-led, deterministic)
- **AI direction:** scaffolded the Vite + React + TS app by hand for determinism —
  config, `index.html` (with OG + JSON-LD `Person` schema), the **design system**
  (`src/index.css` tokens: warm dark, roasted-amber accent, light-mode + reduced-motion),
  a typed content layer (`src/data/profile.ts`, all copy sourced from the resume), a
  `useReveal` scroll hook, and two **reference components** (Nav, Hero) to fix the pattern.
- **Why this order:** establishing shared conventions + one worked example *before*
  fanning out keeps a parallel agent team coherent instead of divergent.

### Entry 5 — Agent-team build (parallel)
- **Method:** ran a deterministic **workflow** orchestrating 9 subagents. Each section
  agent owned exactly one component (disjoint files → no merge conflicts), was handed
  the same design-token + data + reference-pattern contract, and read those files before
  writing. Two more agents ran in parallel for the **AWS CDK infra** and **static assets**.
- **Roles dispatched:** Summary · Work (case studies) · Experience · Skills · Consulting ·
  Contact · Footer · Cloud/DevOps (CDK) · Assets.
- **Result:** 7 section components + a synth-ready CDK stack
  (`infra/`: S3 private origin, CloudFront w/ OAC, us-east-1 ACM, Route 53 apex+www
  aliases, security headers, SPA 403/404→index routing, access-logging for Athena) +
  favicon/robots/sitemap/resume.
- **Stats:** ~112s wall-clock, ~159K subagent tokens, 63 tool uses.

### Entry 6 — Integration & verification (human gate)
- `npm run build` (strict `tsc -b` + Vite) passes clean: 51 modules, 158 KB JS
  (51 KB gzip), 13 KB CSS. All assets land in `dist/`. Preview serves HTTP 200.
- Reviewed the two highest-risk outputs (Work section, CDK stack); bumped the CDK
  floor to `^2.160.0` to guarantee the `S3BucketOrigin.withOriginAccessControl` API.
- **Takeaway for the demo:** the human set architecture, conventions, and the quality
  gate; the agent team executed the parallelizable build. Same shape as running a real org.

### Entry 7 — "Coffee house" design overhaul (design-handoff → rebuild)
- **What changed:** a full visual-direction change from "Studio" (terracotta-on-cream,
  Newsreader/Inter/JetBrains) to **"Coffee house"** (caramel + espresso, Spectral / DM
  Sans / Caveat, mug logo + real headshot), driven by a high-fidelity HTML design handoff
  (iteration 2). The handoff was treated as a visual/behavioral reference only — recreated
  in the existing React/Vite component architecture, not copied (its `support.js` runtime
  is not shipped).
- **Structure:** Hero → About → Menu (services) → Competency map → Work (House Specials) →
  Receipt (resume accordion) → Contact. `Summary→About`, `Experience→Receipt`, new `Menu`;
  dropped the standalone `Skills` list, the `Consulting` card, and the separate `Footer`
  (folded into Contact).
- **Owner gates:** keep the backend-wired **resume-request form** (restyled, not replaced
  by the prototype's simulated form); the competency map is the single skills view.
- **Competency map:** re-laid-out to the prototype's coordinate-space model (cross root +
  fanned children, 0–100 SVG connectors, transform-only zoom guarded by visibility +
  reduced-motion) — keeps the evidence-tree content model.
- **Verification:** `tsc -b` + Vite build clean; walked all 8 sections in-browser against
  the prototype — drill-down/zoom/evidence, single-open receipt accordion, and the restyled
  espresso contact form all confirmed.
- **Follow-ups (noted):** swap the favicon for the mug; spot-check small-screen map node
  collisions.

### Entry 8 — Share-preview (og-image) refresh
- Regenerated `public/og-image.png` (2400×1260) to the coffee-house look: espresso roast +
  dot grid, mug lockup, Spectral name with the italic-gold "player-coach engineer." line,
  the headshot ringed in caramel, and the `codebrewconsulting.com` URL — a condensed hero.
- **How:** rendered a self-contained HTML template (Google Fonts + base64-embedded assets)
  with headless Chrome at `--force-device-scale-factor=2`, `--window-size=1200,630` → an
  exact 2400×1260 PNG, matching the existing `og:image:width/height` meta.

<!-- Next entries: favicon (mug), AWS deploy, launch verification -->

