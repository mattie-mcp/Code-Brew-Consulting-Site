/**
 * Interactive competency map — content tree.
 * Core competency → branch → leaf, where each leaf is a specific claim
 * backed by a real case study or role. Rendered by CompetencyMap.tsx.
 * This is a DRAFT tree for iterating on the interaction — edit freely.
 */

export interface Leaf {
  label: string;
  /** One-line, evidence-backed claim shown in the leaf's evidence panel. */
  claim: string;
  /** Short source label, e.g. "Ellevest" or "OST". */
  evidence: string;
  /** Anchor the "see the work" link scrolls to (#work-… or #experience). */
  href: string;
  stack?: string[];
}

export interface Branch {
  label: string;
  leaves: Leaf[];
}

export interface Core {
  label: string;
  descriptor: string;
  branches: Branch[];
}

/** Slug used as the DOM id on a case-study card so leaf links can scroll to it.
 *  Must stay in sync with the id applied in Work.tsx. */
export function caseStudyAnchor(tag: string): string {
  return (
    "work-" +
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

const href = {
  bpDirector: "#" + caseStudyAnchor("BiggerPockets · Director of Engineering"),
  bpRag: "#" + caseStudyAnchor("BiggerPockets · Architect / IC"),
  codeBrew: "#" + caseStudyAnchor("Code Brew Consulting · Principal Consultant"),
  ellevest: "#" + caseStudyAnchor("Ellevest · Staff Engineer, Financial Systems"),
  experience: "#experience",
};

export const competencyMap: Core[] = [
  {
    label: "Connected Products",
    descriptor: "Devices, telemetry, and the cloud behind them.",
    branches: [
      {
        label: "IoT & device platforms",
        leaves: [
          {
            label: "AWS IoT Core fleet",
            claim:
              "Built serverless AWS backends for connected-device fleets — IoT Core ingest feeding Lambda and managed data stores.",
            evidence: "OST",
            href: href.experience,
            stack: ["AWS IoT Core", "Lambda", "DynamoDB"],
          },
          {
            label: "Brownfield device migration",
            claim:
              "Migrated a large existing device fleet onto the new platform without disrupting the field.",
            evidence: "OST",
            href: href.experience,
          },
        ],
      },
      {
        label: "Connected-product delivery",
        leaves: [
          {
            label: "GraphQL + serverless at scale",
            claim:
              "Delivered connected-product features on serverless AWS with a GraphQL API layer, intern through senior over five years.",
            evidence: "OST",
            href: href.experience,
            stack: ["GraphQL", "AWS", "Serverless"],
          },
        ],
      },
    ],
  },
  {
    label: "Digital Products",
    descriptor: "Shipping software people actually use.",
    branches: [
      {
        label: "Full-stack delivery",
        leaves: [
          {
            label: ".NET plant-floor platform",
            claim:
              "Shipped a custom .NET Core / Razor Pages plant-floor app end-to-end for a regional manufacturer.",
            evidence: "Code Brew",
            href: href.codeBrew,
            stack: [".NET Core", "Razor Pages"],
          },
          {
            label: "React / Rails client products",
            claim:
              "Built and maintained client-facing investment products on React and Ruby on Rails.",
            evidence: "Ellevest",
            href: href.ellevest,
            stack: ["React", "Ruby on Rails"],
          },
        ],
      },
      {
        label: "AI engineering",
        leaves: [
          {
            label: "Production RAG search",
            claim:
              "Shipped a production RAG search over blog and forum content — Pinecone, OpenAI embeddings, GPT-4o synthesis, SSE-streamed.",
            evidence: "BiggerPockets",
            href: href.bpRag,
            stack: ["Pinecone", "GPT-4o", "RAG", "SSE"],
          },
          {
            label: "AI-driven SDLC",
            claim:
              "Standardized the org on Claude Code with in-repo AI standards, custom skills, and MCPs — engineers building workflows, not just consuming a tool.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
            stack: ["Claude Code", "MCPs", "AI standards"],
          },
        ],
      },
    ],
  },
  {
    label: "Infrastructure",
    descriptor: "High-availability systems and the rails they run on.",
    branches: [
      {
        label: "High-availability financial systems",
        leaves: [
          {
            label: "Fault-tolerant ACH & transfers",
            claim:
              "Processed ACH and investment-transfer transactions on a fault-tolerant, job-based financial platform built to recover cleanly.",
            evidence: "Ellevest",
            href: href.ellevest,
            stack: ["Ruby on Rails", "Sidekiq"],
          },
          {
            label: "High-throughput job orchestration",
            claim:
              "Built high-throughput, fault-tolerant Sidekiq job systems for transaction processing at scale.",
            evidence: "Ellevest",
            href: href.ellevest,
            stack: ["Sidekiq", "Job orchestration"],
          },
        ],
      },
      {
        label: "Observability & cost",
        leaves: [
          {
            label: "Instrumentation + spend tuning",
            claim:
              "Enhanced observability with Datadog while lowering compute and monitoring spend and removing complexity that slowed releases.",
            evidence: "Ellevest",
            href: href.ellevest,
            stack: ["Datadog"],
          },
        ],
      },
      {
        label: "Secure cloud delivery",
        leaves: [
          {
            label: "Azure AD + CI/CD",
            claim:
              "Secured delivery with Azure AD and shipped through Azure DevOps CI/CD with a full automated test suite.",
            evidence: "Code Brew",
            href: href.codeBrew,
            stack: ["Azure AD", "Azure DevOps"],
          },
          {
            label: "Dynamics 365 BC integration",
            claim:
              "Integrated with Microsoft Dynamics 365 Business Central via API extensions — architected stateless against the ERP, no app-side database.",
            evidence: "Code Brew",
            href: href.codeBrew,
            stack: ["Dynamics 365 BC", "API extensions"],
          },
        ],
      },
      {
        label: "Operational safety",
        leaves: [
          {
            label: "Production-halt safety system",
            claim:
              "Built a preventative system that freezes production on ERP-side exceptions until a supervisor overrides — each averted batch protects thousands in inventory.",
            evidence: "Code Brew",
            href: href.codeBrew,
          },
        ],
      },
    ],
  },
  {
    label: "Team Building",
    descriptor: "Building the team as deliberately as the software.",
    branches: [
      {
        label: "Org leadership",
        leaves: [
          {
            label: "10-person org turnaround",
            claim:
              "Recruited as the first-ever head of engineering; led a 10-person org (2 EMs, ~8 ICs) through a cultural and technical turnaround as a player-coach.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
          },
          {
            label: "Rebuilt product–eng trust",
            claim:
              "Restored Product's trust in engineering quality and delivery timelines.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
          },
        ],
      },
      {
        label: "Growing engineers",
        leaves: [
          {
            label: "Career-ladder design",
            claim: "Designed a career ladder that made growth and expectations legible.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
          },
          {
            label: "Coaching EMs",
            claim:
              "Coached the EMs to manage strategically rather than distribute tickets.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
          },
        ],
      },
      {
        label: "Player-coach delivery",
        leaves: [
          {
            label: "~80% AI-dev adoption",
            claim:
              "Took the engineering team from resistant to roughly 80% active AI-driven development in four months — while still shipping code myself.",
            evidence: "BiggerPockets",
            href: href.bpDirector,
          },
        ],
      },
    ],
  },
];
