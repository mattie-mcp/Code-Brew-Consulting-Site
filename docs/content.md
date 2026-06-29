# Content & Copy

> Owner: Content & Copy Writer. See [`../PROJECT.md`](../PROJECT.md).
> Drafted from `resume_base.pdf` (2026-06). Voice: EM-leaning, deeply technical, low-ego,
> quantified. First person, active. Refine wording during design/build.

## Identity & facts

- **Name:** Mattie Phillips
- **Headline title:** Technical Engineering Leader — Engineering Manager / Staff Engineer
- **Location:** Grand Rapids, MI (open to remote)
- **Email:** mphillips1695@gmail.com
- **GitHub:** https://github.com/mattie-mcp
- **LinkedIn:** https://www.linkedin.com/in/mattiephillips/
- **Site:** https://codebrewconsulting.com

## Hero

- **Name:** Mattie Phillips
- **Title line:** Engineering Manager · Staff Engineer
- **Value prop:** "I build engineering teams as deliberately as I build software —
  and I never leave the code." *(alt: "Staff engineer turned engineering manager. I
  lead teams through technical and cultural transformation, and I still ship.")*
- **Status chip:** Open to technical EM / Staff Engineer roles
- **CTAs:** Get in touch (email) · Resume (PDF) · LinkedIn · GitHub

## Summary / What I do

> I'm a staff engineer turned engineering manager with nine years of full-stack
> delivery across digital and connected products. Most recently I was recruited as
> BiggerPockets' first head of engineering, where I led a 10-person org through a
> cultural and technical transformation as a player-coach — driving AI adoption from
> resistant to ~80% in four months, modernizing the stack, and rebuilding the
> product–engineering relationship. Before that I set architecture direction across
> the org as a Staff Engineer at Ellevest. I'm looking for a technical EM role where
> both dimensions matter: the team and the code.

## Selected work (case studies)

### 1. Reviving an engineering org as a player-coach
- **Tag:** BiggerPockets · Director of Engineering
- **Context:** First-ever head of engineering for a ~10-person org (2 EMs, ~8 ICs)
  with low engagement, a legacy stack, and a strained product relationship.
- **What I did:** Led as a player-coach — codified in-repo AI standards, redesigned
  the SDLC toward engineer-owned end-to-end initiatives, designed a career ladder,
  and coached the EMs to manage strategically rather than distribute tickets.
- **Outcome:** AI adoption resistant → ~80% active in four months; throughput gains
  large enough by month three that we had to tune CI/test spend; restored Product's
  trust in engineering quality and timelines.

### 2. Consumer-facing AI search (RAG) in production
- **Tag:** BiggerPockets · Director of Engineering (IC/architect)
- **Context:** Launch an AI search experience over blog + forum content.
- **What I did:** Set scope, steered technical direction with the implementation
  partner, and gated quality via code review. Pinecone-backed RAG with OpenAI
  embeddings and GPT-4o synthesis, SSE-streamed to the client.
- **Outcome:** Fully in production.
- **Stack:** Pinecone, OpenAI embeddings, GPT-4o, SSE, React.

### 3. Custom plant-floor shipping & receiving platform
- **Tag:** Code Brew Consulting · Principal Consultant (independent delivery)
- **Context:** A regional food manufacturer paying recurring license fees for a
  shipping/receiving product, engaged via Software InsITe.
- **What I did:** Replaced it with a custom .NET Core / Razor Pages app on the plant
  floor, integrated with Microsoft Dynamics 365 Business Central via API extensions.
  Stateless against Business Central (no app-side DB), secured with Azure AD, shipped
  with Azure DevOps CI/CD and a full test suite. Built a preventative production-halt
  safety system that freezes production on ERP-side exceptions until a supervisor
  overrides.
- **Outcome:** Eliminated recurring license fees, gave the client full control of
  their workflow; each averted batch protects thousands in inventory.
- **Stack:** .NET Core, Razor Pages, Dynamics 365 Business Central, Azure AD, Azure DevOps.

### 4. High-availability investment platform
- **Tag:** Ellevest · Staff Engineer, Financial Systems
- **Context:** A recoverable system handling vendor integrations, financial
  transaction processing, and client-facing products.
- **What I did:** Lead engineer; set architecture direction and patterns adopted
  across the org. Enhanced observability and transaction processing; built
  high-throughput, fault-tolerant Sidekiq systems.
- **Outcome:** Reduced error rates while lowering compute and monitoring spend and
  removing complexity that had slowed releases.
- **Stack:** Ruby on Rails, Sidekiq, Datadog.

*(Optional 5th — OST: contributed to migrating hundreds of thousands of brownfield
IoT devices from Xively to AWS with no downtime; serverless on Lambda/IoT Core/DynamoDB.)*

## Experience timeline

- **Director of Engineering**, BiggerPockets — Dec 2025–Present · Remote
  · First head of eng; 10-person org (2 EMs, ~8 ICs); player-coach.
- **Principal Consultant**, Code Brew Consulting — Apr 2025–Dec 2025 · Grand Rapids
  · Independent delivery at staff level; ERP-integrated plant-floor platform.
- **Staff Engineer, Financial Systems**, Ellevest — Jan 2022–Apr 2025 · Remote (NYC)
  · Promoted from Tech Lead, Advice. Org-wide architecture direction.
- **Senior Connected Products Consultant**, OST — 2016–Jan 2022 · Grand Rapids
  · Intern → Senior on IoT / connected-products engagements.
- **Software Development Intern**, American Express — Summer 2017 · Phoenix

## Skills

- **Languages:** Ruby (Rails), JavaScript/TypeScript (React, React Native, Node.js),
  Python, .NET (C#, Entity Framework), SQL
- **Cloud & Infra:** AWS (Lambda, DynamoDB, IoT Core, API Gateway, RDS, ECS), Azure
  (Functions, IoT Hub, API Management, Service Bus), Docker, CloudFormation/ARM,
  CircleCI / GitHub Actions / Azure DevOps
- **AI Engineering:** Claude Code (skills, MCPs, hooks, CLAUDE.md), Figma MCP
  design-to-code, agent-driven workflows, in-repo AI standards
- **Observability:** Datadog, Sentry, BugSnag, PagerDuty
- **Architecture:** Event-driven systems, microservices, REST/GraphQL, job management, ORMs
- **Leadership:** Engineering management, career-ladder design, EM coaching, technical
  strategy, player-coach delivery, SAFe 4 Practitioner

## Codebrew Consulting (supporting evidence)

> Code Brew Consulting is my LLC — the vehicle for independent, staff-level delivery.
> Through it I've shipped production systems end-to-end for real clients, owning scope,
> architecture, security, and CI/CD without a net. It's how I stay close to the work
> and prove I can deliver outside any single company's scaffolding.

## Education

- **B.S. Computer Science**, Grand Valley State University — 2013–2017.
  Frederick Meijer Honors College. Researched DDoS mitigation via DNS crawling.

## SEO

- `<title>`: "Mattie Phillips — Engineering Manager / Staff Engineer"
- Meta description (~155 chars): "Staff engineer turned engineering manager. I lead
  teams through technical and cultural transformation — and still ship. Open to
  technical EM / Staff roles."
- OpenGraph image: branded card, name + title + amber accent.
- JSON-LD `Person`: name, jobTitle, sameAs [LinkedIn, GitHub], worksFor Code Brew Consulting.
