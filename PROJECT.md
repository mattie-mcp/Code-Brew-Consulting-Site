# Code Brew Consulting — Personal Site & Job-Search Hub

> **Source of truth.** This file ties together every planning doc. Start here.
> When a decision changes, update it here first, then propagate to the relevant `docs/*.md`.

## Purpose

A personal website that serves two goals, in priority order:

1. **Primary — land a full-time role.** Position the owner as a senior
   **Engineering Manager / Staff Engineer** (EM-leaning, deeply IC-credible) and
   convert recruiters and hiring managers into conversations.
2. **Secondary — legitimize Code Brew Consulting.** A real LLC that the owner can
   list on applications and reference as proof of independent, end-to-end delivery.

The site is **about the person**; Code Brew is **supporting evidence**, never the headline.
It must not read like an agency landing page that confuses an FTE hiring manager.

## Locked decisions

| Area | Decision | Notes |
|---|---|---|
| App type | Single-page application | Static build, no server runtime |
| Frontend | React + Vite + TypeScript | Broad hiring-manager familiarity, fast DX |
| Hosting | AWS S3 (private) + CloudFront | Owner's existing AWS account |
| TLS / DNS | ACM + Route 53 | Owner's existing registered domain |
| Infra style | Infrastructure as Code | Reproducible; doubles as an engineering work sample |
| Role emphasis | Both — EM-leaning | Lead with leadership, back it with technical depth |
| Consulting weight | Supporting evidence | Credibility signal, not a sales pitch |

## Known facts

- **Owner:** Mattie Phillips — Grand Rapids, MI · mphillips1695@gmail.com
- **Domain:** `codebrewconsulting.com`
- **AWS account:** Identity Center SSO, `default` profile (account ID kept out of this repo)
- **GitHub:** github.com/mattie-mcp · **LinkedIn:** linkedin.com/in/mattiephillips
- **Resume:** `resume_base.pdf` (synthesized into `docs/content.md`)

## Open items (need owner input)

- [x] ~~Domain name~~ → `codebrewconsulting.com`
- [x] ~~AWS account~~ → configured (SSO `default` profile; ID not stored in repo)
- [x] ~~Background content~~ → resume provided, drafted into `docs/content.md`
- [ ] **Route 53** — is a hosted zone already set up for the domain, or is DNS elsewhere?
- [ ] **AWS region + CLI profile/role** for the account (suggest `us-east-1`).
- [ ] **IaC tool** — Terraform vs AWS CDK (see `docs/infrastructure.md`; default: CDK).
- [ ] **Analytics choice** — privacy-friendly (Plausible/Umami) vs none vs GA4.
- [ ] **Scheduling link** — Calendly or similar, if you want one beyond email.

## Agent team

Each role owns a slice of the work and a doc. Dispatch them per iteration.

| Agent | Owns | Primary doc |
|---|---|---|
| Brand & Positioning Strategist | Narrative, voice, role messaging | `docs/positioning.md` |
| Content & Copy Writer | Bio, experience, case studies, CTAs | `docs/content.md` |
| Information Architect / UX | Sections, nav, hierarchy, recruiter 10-sec scan | `docs/ux-architecture.md` |
| Visual / Brand Designer | Color, type, layout system, logo | `docs/design-system.md` |
| Frontend Engineer | SPA implementation | the app (`src/`) |
| Cloud / DevOps Engineer | AWS infra + CI/CD | `docs/infrastructure.md` |
| SEO & Analytics | Meta, OpenGraph, structured data, analytics | folded into infra + content |
| Recruiter (evaluator) | Audience-side reality check — 10-sec scan, resume screen, callback verdict | no doc; critiques the others' output |

## Document index

- [`docs/positioning.md`](docs/positioning.md) — who we're talking to and how we sound.
- [`docs/content.md`](docs/content.md) — the actual words, section by section.
- [`docs/ux-architecture.md`](docs/ux-architecture.md) — page structure and IA.
- [`docs/design-system.md`](docs/design-system.md) — visual language.
- [`docs/infrastructure.md`](docs/infrastructure.md) — AWS, IaC, CI/CD.

## Roadmap

1. ✅ **Ideation & docs** — decisions captured, docs scaffolded.
2. ✅ **Content intake** — resume synthesized into `docs/content.md` + `src/data/profile.ts`.
3. ✅ **Design system** — tokens in `src/index.css` (warm dark + amber, light + reduced-motion).
4. ✅ **Build** — SPA built by the agent team; `npm run build` passes; preview serves. ← here
5. ⏳ **Infra** — CDK stack written (`infra/`); needs `npm install`, bootstrap, `cdk deploy`.
   Pending: SSO login on the `default` profile, region confirm, optional CI/CD (GH Actions OIDC).
6. ⏳ **Launch** — deploy, verify TLS + apex/www, SEO, add `og-image.png`.
7. ⏳ **Iterate** — refine copy and case studies as the search progresses.

## Build status (current)

- App: React + Vite + TS SPA, 9 sections, builds clean. Preview: `npm run dev` (or `preview`).
- Content: `src/data/profile.ts` is the single copy source.
- Infra: `infra/` CDK app (run `cd infra && npm install` before `cdk` commands).
- Process record: `docs/build-log.md` — the "how this was built with AI" narrative.
- Résumé delivery: gated behind a **résumé-request & contact form** (API Gateway +
  Lambda + SES + private S3 + DynamoDB rate-limit, all in `infra/`). The PDF is no
  longer public. Behind a one-switch feature flag. See `docs/infrastructure.md`.
  Deploy prerequisite: verify SES + leave the sandbox (`docs/todo.md`).
- Known TODO: generate `og-image.png` (referenced in `index.html`).
