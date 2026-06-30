/**
 * Single source of content for the site. Components render from this -
 * no copy hard-coded in JSX. See docs/content.md and docs/design-system.md.
 */

export const profile = {
  name: "Mattie Phillips",
  location: "Grand Rapids, MI",
  email: "mphillips1695@gmail.com",
  github: "https://github.com/mattie-mcp",
  repo: "https://github.com/mattie-mcp/Code-Brew-Consulting-Site",
  linkedin: "https://www.linkedin.com/in/mattiephillips/",
} as const;

/** Hero - the espresso "Today's Brew" masthead. */
export const hero = {
  eyebrow: "Today's Brew -",
  nameLine: "Mattie Phillips,",
  titleLine: "player-coach engineer.",
  // `firm` is bolded inline; `blurb` follows it.
  firm: "Code Brew Consulting",
  blurb:
    " is my independent software practice - senior, hands-on help with custom software, connected products, and engineering leadership. Nine years in, I still lead teams without ever leaving the code.",
  primaryCta: { label: "See the menu", href: "#menu" },
  secondaryCta: { label: "Request my resume", href: "#contact" },
} as const;

/** About - "Pull up a chair". */
export const about = {
  eyebrow: "- Pull up a chair -",
  title: "A people-first engineer who likes the hard problems.",
  bio:
    "I'm Mattie Phillips - a software engineering leader with nine years of full-stack delivery across fintech, connected products, and digital platforms. I lead teams as a player-coach, set architecture direction, and care just as much about the engineers writing the software as the software itself. Code Brew Consulting is the practice I run when I'm building for clients directly.",
  pills: [
    "Versatile tech skill-set",
    "Digital products",
    "Fintech",
    "Connected products & IoT",
    "AI engineering",
  ],
} as const;

/** The Menu - consulting services. */
export interface Service {
  name: string;
  tag: "Project" | "Advisory";
  desc: string;
}

export const services: Service[] = [
  {
    name: "Custom Applications",
    tag: "Project",
    desc: "Full-stack web, mobile and backend builds - like a custom .NET Core platform that replaced costly licensed software end to end.",
  },
  {
    name: "Team Practices",
    tag: "Advisory",
    desc: "Player-coach engineering leadership - architecture direction, code review, career ladders, and the delivery habits that turn a group of engineers into a high-performing team.",
  },
  {
    name: "Mobile Builds",
    tag: "Project",
    desc: "Native and cross-platform mobile builds - from fintech apps to connected-product companion apps. Build, ship, and maintain.",
  },
  {
    name: "AI Adoption",
    tag: "Advisory",
    desc: "Help getting your team using AI for real - from rolling out coding assistants and AI workflows to shipping production LLM and RAG features.",
  },

  {
    name: "Connected Products & IoT",
    tag: "Project",
    desc: "End-to-end IoT build-outs - edge devices, messaging, and the cloud backends that tie hardware and software together.",
  },
];

/** Selected Work - "House Specials" project cards. */
export interface Project {
  name: string;
  category: string;
  desc: string;
  stack: string[];
}

export const projects: Project[] = [
  {
    name: "Consumer AI Search",
    category: "AI · DIGITAL PRODUCT",
    desc: "Pinecone-backed RAG with OpenAI embeddings and GPT-4o synthesis, SSE-streamed across articles and forum content. Shipped to production at BiggerPockets.",
    stack: ["Pinecone", "OpenAI", "GPT-4o"],
  },
  {
    name: "Engineering Team Transformation",
    category: "ENGINEERING LEADERSHIP",
    desc: "Led a 10-person org through a cultural and technical reset at BiggerPockets - drove AI adoption from resistant to ~80%, modernized the stack, designed a career ladder, and rebuilt the product–engineering relationship.",
    stack: ["Leadership", "AI adoption", "Career ladder"],
  },
  {
    name: "Shipping & Receiving Platform",
    category: "CUSTOM SOFTWARE",
    desc: "A custom .NET Core app integrated with Dynamics 365 Business Central that replaced licensed software and added a real-time production-halt safety system.",
    stack: [".NET Core", "Dynamics 365", "Azure AD"],
  },
  {
    name: "End-to-End IoT Build-Outs",
    category: "CONNECTED PRODUCTS",
    desc: "Designed and shipped connected-product systems from edge devices to cloud - serverless backends, device messaging, and a zero-downtime migration of hundreds of thousands of IoT devices to AWS.",
    stack: ["AWS IoT", "Azure IoT Hub", "Serverless"],
  },
  {
    name: "Investment Platform",
    category: "FINTECH",
    desc: "Lead engineer on a highly-available, recoverable system processing financial transactions and vendor integrations, with fault-tolerant Sidekiq jobs.",
    stack: ["Ruby on Rails", "Sidekiq", "AWS"],
  },
];

/**
 * Copy + options for the resume-request / contact form. Voiced to read as a
 * low-effort, confident trade - a name and an email, resume in your inbox now.
 * The reason `value`s must match the Lambda's REASON_LABELS keys.
 */
export const resumeForm = {
  // CTA labels used across Hero / Contact / Footer.
  ctaPrimary: "Request my resume",
  ctaShort: "Request resume",

  eyebrow: "Resume & contact",
  title: "Request my resume - straight to your inbox",
  intro:
    "Drop your name and email and the resume lands in your inbox right away - PDF attached, no waiting. I just like to know who I'm talking to.",
  reassurance: "Instant delivery · no spam · just so I know who's reaching out.",

  nameLabel: "Your name",
  emailLabel: "Email",
  messageLabel: "Anything you'd like to add?",
  messagePlaceholder: "A role you're hiring for, what caught your eye - optional.",
  reasonsLegend: "Why are you reaching out?",
  reasonsHint: "Optional - pick any that fit.",

  submitLabel: "Send it over →",
  submitBusyLabel: "Sending…",

  reasons: [
    { value: "hiring", label: "Hiring for a role" },
    { value: "recruiting", label: "Recruiting / sourcing" },
    { value: "networking", label: "Networking / staying in touch" },
    { value: "consulting", label: "Consulting or contract inquiry" },
    { value: "hello", label: "Just saying hello" },
    { value: "other", label: "Other" },
  ],

  // Success state - warm and human, on-theme with the coffee house.
  successTitle: "Order received! ☕",
  successBody:
    "Check your inbox - the resume should land in a moment, with a quick note from me. If it's hiding, peek in spam, or just reply to that email and it comes straight to me.",

  // Returning visitor (remembered for 7 days in this browser).
  returnTitle: "Welcome back",
  returnBody: "Want the resume sent over again? One click and it's back in your inbox.",
  returnResendLabel: "Resend my resume",
  returnResendBusyLabel: "Sending…",
  returnSwitchLabel: "Use a different email",

  // Error fallbacks (server messages take precedence when present).
  errorGeneric:
    "Something went sideways sending that. Mind trying again? Or email me directly and I'll reply with the resume.",
} as const;
