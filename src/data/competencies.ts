/**
 * Competency map — content tree for the interactive drill-down node graph.
 * Four core competencies → sub-areas → specific work, where each leaf carries
 * an evidence card. Rendered by CompetencyMap.tsx.
 *
 * Node `code`s are explicit and stable (01 / 01.1 / 01.1.a) so the map can key
 * navigation state on them. A node has EITHER `children` or `evidence` (leaf).
 */

export interface Evidence {
  desc: string;
  /** Where "See the work" links — an in-page anchor (e.g. "#work"). */
  link: string;
  linkLabel: string;
}

export interface CompNode {
  code: string;
  label: string;
  /** One-line descriptor shown under the four root cores. */
  subtitle?: string;
  children?: CompNode[];
  evidence?: Evidence;
}

export const competencyTree: CompNode[] = [
  {
    code: "01",
    label: "Connected Products",
    subtitle: "Devices, firmware & the cloud behind them",
    children: [
      {
        code: "01.1",
        label: "IoT & device platforms",
        children: [
          {
            code: "01.1.a",
            label: "AWS IoT Core fleet",
            evidence: {
              desc: "Built serverless device backends on AWS IoT Core, Lambda and DynamoDB powering a connected-product fleet.",
              link: "#work",
              linkLabel: "See the work (OST)",
            },
          },
          {
            code: "01.1.b",
            label: "Brownfield device migration",
            evidence: {
              desc: "Migrated hundreds of thousands of existing devices from Xively to AWS with zero downtime in the field.",
              link: "#work",
              linkLabel: "See the work (OST)",
            },
          },
        ],
      },
      {
        code: "01.2",
        label: "Connected-product delivery",
        children: [
          {
            code: "01.2.a",
            label: "Edge messaging",
            evidence: {
              desc: "Edge-device messaging and ingestion built on Azure IoT Hub, Event Hubs and Functions.",
              link: "#work",
              linkLabel: "See the work (OST)",
            },
          },
          {
            code: "01.2.b",
            label: "Event-driven architecture",
            evidence: {
              desc: "Designed event-driven, serverless backends and presented on the pattern at a regional developer event.",
              link: "#work",
              linkLabel: "See the work (OST)",
            },
          },
        ],
      },
    ],
  },
  {
    code: "02",
    label: "Digital Products",
    subtitle: "Full-stack web, mobile & fintech",
    children: [
      {
        code: "02.1",
        label: "Full-stack delivery",
        children: [
          {
            code: "02.1.a",
            label: "Client advice product",
            evidence: {
              desc: "Led a client-facing advice product end-to-end across React Native, React and Ruby on Rails.",
              link: "#work",
              linkLabel: "See the work (Ellevest)",
            },
          },
          {
            code: "02.1.b",
            label: "Consumer AI search",
            evidence: {
              desc: "Pinecone RAG with GPT-4o synthesis, SSE-streamed across articles and forums — shipped to production.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
        ],
      },
      {
        code: "02.2",
        label: "Fintech systems",
        children: [
          {
            code: "02.2.a",
            label: "Investment platform",
            evidence: {
              desc: "Lead engineer on a highly-available, recoverable platform processing financial transactions and vendor integrations.",
              link: "#work",
              linkLabel: "See the work (Ellevest)",
            },
          },
          {
            code: "02.2.b",
            label: "Design system & CMS",
            evidence: {
              desc: "Built a reusable React component library integrated with Contentful so editors compose accessible pages.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
        ],
      },
    ],
  },
  {
    code: "03",
    label: "Infrastructure",
    subtitle: "Cloud, reliability & integrations",
    children: [
      {
        code: "03.1",
        label: "Cloud & reliability",
        children: [
          {
            code: "03.1.a",
            label: "Observability & cost",
            evidence: {
              desc: "Improved observability and transaction processing — cutting error rates and both compute and monitoring spend.",
              link: "#work",
              linkLabel: "See the work (Ellevest)",
            },
          },
          {
            code: "03.1.b",
            label: "Fault-tolerant jobs",
            evidence: {
              desc: "Built high-throughput, fault-tolerant Sidekiq systems for concurrent, parallel job processing.",
              link: "#work",
              linkLabel: "See the work (Ellevest)",
            },
          },
        ],
      },
      {
        code: "03.2",
        label: "Systems integration",
        children: [
          {
            code: "03.2.a",
            label: "ERP integration",
            evidence: {
              desc: "Custom .NET Core application integrated with Dynamics 365 Business Central via API extensions.",
              link: "#work",
              linkLabel: "See the work (Code Brew)",
            },
          },
          {
            code: "03.2.b",
            label: "CI/CD & IaC",
            evidence: {
              desc: "Azure DevOps pipelines with full test suites; infrastructure managed as code via CloudFormation and ARM.",
              link: "#work",
              linkLabel: "See the work (Code Brew)",
            },
          },
        ],
      },
    ],
  },
  {
    code: "04",
    label: "Team Building",
    subtitle: "Leading & growing engineering teams",
    children: [
      {
        code: "04.1",
        label: "Leading teams",
        children: [
          {
            code: "04.1.a",
            label: "AI adoption",
            evidence: {
              desc: "Drove engineering AI adoption from resistant to ~80% active use in four months via peer-led workshops and in-repo standards.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
          {
            code: "04.1.b",
            label: "Career ladder",
            evidence: {
              desc: "Designed an engineering career ladder — coherent roles, right-sized bands and explicit expectations.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
        ],
      },
      {
        code: "04.2",
        label: "Player-coach delivery",
        children: [
          {
            code: "04.2.a",
            label: "SDLC redesign",
            evidence: {
              desc: "Shifted from top-down tickets to engineer-owned, end-to-end initiatives with AI-augmented execution.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
          {
            code: "04.2.b",
            label: "Product–eng trust",
            evidence: {
              desc: "Rebuilt the product–engineering relationship: introduced estimates and restored trust in quality and timelines.",
              link: "#work",
              linkLabel: "See the work (BiggerPockets)",
            },
          },
        ],
      },
    ],
  },
];
