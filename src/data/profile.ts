/**
 * Single source of content for the site, synthesized from resume_base.pdf.
 * See docs/content.md. Components render from this — no copy hard-coded in JSX.
 */

export const profile = {
  name: "Mattie Phillips",
  title: "Engineering Manager · Staff Engineer",
  recentRole: "Most recently Director of Engineering · BiggerPockets",
  tagline: "Technical Engineering Leader",
  location: "Grand Rapids, MI",
  remote: "Open to remote",
  email: "mphillips1695@gmail.com",
  github: "https://github.com/mattie-mcp",
  linkedin: "https://www.linkedin.com/in/mattiephillips/",
  site: "https://codebrewconsulting.com",
  statusOpen: "Open to technical EM / Staff Engineer roles",

  valueProp:
    "I build engineering teams as deliberately as I build software — and I never leave the code.",

  summary:
    "I'm a staff engineer turned engineering manager with nine years of full-stack delivery across digital and connected products. Most recently I was recruited as BiggerPockets' first head of engineering, where I led a 10-person org through a cultural and technical transformation as a player-coach — taking the team from resistant to roughly 80% active AI-driven development in four months, modernizing the stack, and rebuilding the product–engineering relationship. Before that I set architecture direction across the org as a Staff Engineer at Ellevest. I'm looking for a technical EM role where both dimensions matter: the team and the code.",
} as const;

/**
 * Copy + options for the résumé-request / contact form. Voiced to read as a
 * low-effort, confident trade — a name and an email, résumé in your inbox now.
 * The reason `value`s must match the Lambda's REASON_LABELS keys.
 */
export const resumeForm = {
  // CTA labels used across Hero / Contact / Footer.
  ctaPrimary: "Request my résumé",
  ctaShort: "Request résumé",

  eyebrow: "Résumé & contact",
  title: "Request my résumé — straight to your inbox",
  intro:
    "Drop your name and email and the résumé lands in your inbox right away — PDF attached, no waiting. I just like to know who I'm talking to.",
  reassurance: "Instant delivery · no spam · just so I know who's reaching out.",

  nameLabel: "Your name",
  emailLabel: "Email",
  messageLabel: "Anything you'd like to add?",
  messagePlaceholder: "A role you're hiring for, what caught your eye — optional.",
  reasonsLegend: "Why are you reaching out?",
  reasonsHint: "Optional — pick any that fit.",

  submitLabel: "Send me the résumé",
  submitBusyLabel: "Sending…",

  reasons: [
    { value: "hiring", label: "Hiring for a role" },
    { value: "recruiting", label: "Recruiting / sourcing" },
    { value: "networking", label: "Networking / staying in touch" },
    { value: "consulting", label: "Consulting or contract inquiry" },
    { value: "hello", label: "Just saying hello" },
    { value: "other", label: "Other" },
  ],

  // Success state — warm and human, not a generic "thanks, submitted."
  successTitle: "It's on its way.",
  successBody:
    "Check your inbox — the résumé should land in a moment, with a quick note from me. If it's hiding, peek in spam, or just reply to that email and it comes straight to me.",

  // Returning visitor (remembered for 7 days in this browser).
  returnTitle: "Welcome back",
  returnBody: "Want the résumé sent over again? One click and it's back in your inbox.",
  returnResendLabel: "Resend my résumé",
  returnResendBusyLabel: "Sending…",
  returnSwitchLabel: "Use a different email",

  // Error fallbacks (server messages take precedence when present).
  errorGeneric:
    "Something went sideways sending that. Mind trying again? Or email me directly and I'll reply with the résumé.",
} as const;

export interface CaseStudy {
  title: string;
  tag: string;
  context: string;
  did: string;
  outcome: string;
  stack: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: "Reviving an engineering org as a player-coach",
    tag: "BiggerPockets · Director of Engineering",
    context:
      "Recruited as the first-ever head of engineering for a ~10-person org (2 EMs, ~8 ICs) facing low engagement, a legacy stack, and a strained product relationship.",
    did:
      "Led as a player-coach — standardized the org on Claude Code and redesigned the SDLC to encourage AI-driven development, getting engineers contributing shared AI workflows (in-repo standards, skills, MCPs) rather than just consuming a tool. Designed a career ladder and coached the EMs to manage strategically rather than distribute tickets.",
    outcome:
      "Took the engineering team from resistant to ~80% active adoption of AI-driven development in four months; throughput gains by month three forced CI/test-spend tuning; restored Product's trust in engineering quality and timelines.",
    stack: ["Leadership", "SDLC design", "Career ladders", "Claude Code"],
  },
  {
    title: "Custom plant-floor shipping & receiving platform",
    tag: "Code Brew Consulting · Principal Consultant",
    context:
      "A regional food manufacturer was paying recurring license fees for an off-the-shelf shipping/receiving product. Engaged independently via Software InsITe.",
    did:
      "Replaced it with a custom .NET Core / Razor Pages app on the plant floor, integrated with Microsoft Dynamics 365 Business Central via API extensions. Architected stateless against Business Central (no app-side DB), secured with Azure AD, shipped with Azure DevOps CI/CD and a full test suite. Built a preventative production-halt safety system that freezes production on ERP-side exceptions until a supervisor overrides.",
    outcome:
      "Eliminated recurring license fees and gave the client full control of their workflow; each averted batch protects thousands in inventory.",
    stack: [".NET Core", "Dynamics 365 BC", "Azure AD", "Azure DevOps"],
  },
  {
    title: "High-availability investment platform",
    tag: "Ellevest · Staff Engineer, Financial Systems",
    context:
      "A recoverable system handling vendor integrations, financial transaction processing, and client-facing products.",
    did:
      "Lead engineer; set architecture direction and patterns adopted across the org. Enhanced observability and transaction processing; built high-throughput, fault-tolerant Sidekiq systems.",
    outcome:
      "Drastically reduced error rates in the financial transaction system while lowering compute and monitoring spend and removing complexity that had slowed releases.",
    stack: ["Ruby on Rails", "Sidekiq", "Datadog"],
  },
  {
    title: "Consumer-facing AI search (RAG), in production",
    tag: "BiggerPockets · Architect / IC",
    context:
      "Launch an AI search experience over the company's blog articles and forum content.",
    did:
      "Set scope, steered technical direction with the implementation partner, and gated quality through code review. Pinecone-backed RAG with OpenAI embeddings and GPT-4o synthesis, SSE-streamed to the client.",
    outcome:
      "Shipped to production, serving AI-synthesized answers over the company's blog and forum corpus.",
    stack: ["Pinecone", "OpenAI", "GPT-4o", "RAG", "SSE", "React"],
  },
];

export interface Role {
  role: string;
  company: string;
  dates: string;
  location: string;
  note: string;
}

export const experience: Role[] = [
  {
    role: "Director of Engineering",
    company: "BiggerPockets",
    dates: "Dec 2025 – Jun 2026",
    location: "Remote",
    note: "First head of engineering; 10-person org (2 EMs, ~8 ICs); player-coach through a cultural and technical transformation.",
  },
  {
    role: "Principal Consultant",
    company: "Code Brew Consulting",
    dates: "Apr 2025 – Dec 2025",
    location: "Grand Rapids, MI",
    note: "Independent delivery at staff level — an ERP-integrated plant-floor platform for a regional manufacturer.",
  },
  {
    role: "Staff Engineer, Financial Systems",
    company: "Ellevest",
    dates: "Jan 2022 – Apr 2025",
    location: "Remote (NYC)",
    note: "Promoted from Technical Lead on Advice. Set org-wide architecture direction on the investment platform.",
  },
  {
    role: "Senior Connected Products Consultant",
    company: "Open Systems Technologies (OST)",
    dates: "2016 – Jan 2022",
    location: "Grand Rapids, MI",
    note: "Intern → Senior on IoT and connected-products engagements; serverless AWS, GraphQL, large brownfield device migration.",
  },
  {
    role: "Software Development Intern",
    company: "American Express",
    dates: "Summer 2017",
    location: "Phoenix, AZ",
    note: "Built Java microservices and Kafka tooling for a custom cloud platform team.",
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Ruby (Rails)", "TypeScript / JavaScript", "React / React Native", "Node.js", "Python", ".NET (C#)", "SQL"],
  },
  {
    label: "Cloud & Infra",
    items: ["AWS (Lambda, DynamoDB, ECS, API Gateway, IoT Core, RDS)", "Azure", "Docker", "CloudFormation / CDK", "GitHub Actions", "Azure DevOps"],
  },
  {
    label: "AI Engineering",
    items: ["Claude Code (skills, MCPs, hooks)", "Figma MCP design-to-code", "RAG / embeddings", "Agent-driven workflows", "In-repo AI standards"],
  },
  {
    label: "Architecture & Ops",
    items: ["Event-driven systems", "Microservices", "REST / GraphQL", "Datadog / Sentry / PagerDuty", "Job orchestration"],
  },
  {
    label: "Leadership",
    items: ["Engineering management", "Career-ladder design", "EM coaching", "Technical strategy", "Player-coach delivery", "SAFe 4"],
  },
];

export const consulting = {
  blurb:
    "Code Brew Consulting is my LLC — the vehicle for independent, staff-level delivery. Through it I've shipped production systems end-to-end for real clients, owning scope, architecture, security, and CI/CD without a net. It's how I stay close to the work and prove I can deliver outside any single company's scaffolding.",
};

export const education = {
  degree: "B.S. Computer Science",
  school: "Grand Valley State University",
  dates: "2013 – 2017",
  detail: "Frederick Meijer Honors College. Researched DDoS mitigation strategies of top websites using DNS crawling techniques.",
};
