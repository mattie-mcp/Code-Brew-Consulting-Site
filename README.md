# Code Brew Consulting — Personal Site

The source for [**codebrewconsulting.com**](https://codebrewconsulting.com) — a
single-page personal site for Mattie Phillips (Engineering Manager / Staff
Engineer) and the home of Code Brew Consulting.

It doubles as a work sample: a small, dependency-light React app fronted by a
fully infrastructure-as-code AWS stack (static hosting + a serverless
contact/résumé-request API), built end to end with an AI agent team.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript, built with Vite 5 |
| Styling | Hand-authored CSS with design tokens (`src/index.css`); no UI framework |
| Hosting | Private S3 + CloudFront (OAC), TLS via ACM, DNS via Route 53 |
| API | API Gateway + Lambda + SES + DynamoDB (résumé-request / contact form) |
| IaC | AWS CDK (TypeScript), `infra/` |
| Analytics | Plausible (cookieless) |

The app has only two runtime dependencies (`react`, `react-dom`). Everything
else is build-time tooling.

## Project layout

```
.
├── index.html              # App shell: meta, OpenGraph, JSON-LD Person/Org schema
├── src/
│   ├── main.tsx            # React entry
│   ├── App.tsx             # Composes the page sections
│   ├── components/         # Section components, each with a colocated .css
│   ├── data/
│   │   ├── profile.ts      # Single source for all site copy
│   │   └── competencies.ts # Data for the interactive competency map
│   ├── hooks/useReveal.ts  # Scroll-reveal animation hook
│   ├── lib/resumeForm.ts   # Client for the résumé-request API
│   └── index.css           # Design tokens + base styles
├── infra/                  # AWS CDK app (see infra/README.md)
├── docs/                   # Planning docs: positioning, content, UX, design, infra
└── PROJECT.md              # Source of truth for decisions and roadmap
```

Content and code are deliberately separated: copy lives in `src/data/profile.ts`,
so editing the site's words never means touching component logic.

## Local development

Requirements: **Node.js 18+** and npm.

```sh
npm install
npm run dev        # Vite dev server with HMR
```

| Script | Action |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only, no emit |

## Résumé-request form

The résumé is gated behind a contact form rather than served as a public PDF
(it carries PII). The form posts to a serverless API (API Gateway → Lambda →
SES), with a DynamoDB-backed rate limit. It's controlled by a single feature
flag that must match on both ends:

- Frontend: `VITE_RESUME_FORM_ENABLED` (see `.env.example`). When off, CTAs fall
  back to a plain `mailto:` and the form is hidden.
- Backend: CDK `-c formEnabled=false` / Lambda `FEATURE_ENABLED`.

`VITE_API_BASE` overrides the API origin (defaults to
`https://api.codebrewconsulting.com`). Both variables have safe defaults baked
in, so a normal production build needs no `.env` file.

## Infrastructure & deployment

All AWS resources are defined as code in `infra/` (AWS CDK, TypeScript). The
stack provisions a private S3 bucket fronted by CloudFront with Origin Access
Control, an ACM certificate, Route 53 alias records (apex + `www`), SPA error
routing, security response headers (HSTS/CSP), and the serverless form API.

One CDK app deploys two environments via a context flag — `production` (custom
domain) and `staging` (served on the default CloudFront URL). Deploy flow:

```sh
npm run build                 # build the SPA → dist/ (uploaded by the stack)
cd infra && npm install
npm run deploy                # production
npm run deploy:staging        # staging
```

See [`infra/README.md`](infra/README.md) for full prerequisites (SSO auth, Route
53 zone, the gitignored résumé PDF), bootstrap, environments, and the complete
script list.

## Documentation

- [`PROJECT.md`](PROJECT.md) — decisions, roadmap, and the agent-team approach.
- [`docs/`](docs/) — positioning, content, UX architecture, design system,
  infrastructure, and the build log (how this was built with AI).

## License

Personal project — all rights reserved. Code may be referenced as a work sample;
content and brand assets are not licensed for reuse.
