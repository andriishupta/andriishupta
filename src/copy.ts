import { isExternalHref } from "./lib/links";

const email = "hello@andriishupta.dev";

export const urls = {
  linkedin: "https://www.linkedin.com/in/andriishupta/",
  github: "https://github.com/andriishupta/",
  x: "https://x.com/andriishupta",
  upwork: "https://www.upwork.com/freelancers/andriishupta",
  cv: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf",
  about: "/#services",
  experience: "/#experience",
  blogPath: "/blog",
  devto: "https://dev.to/andriishupta",
  medium: "https://medium.com/@andriishupta",
  hashnode: "https://andriishupta.hashnode.dev/",
  email: `mailto:${email}`,
  useLens: "https://github.com/use-lens/use-lens",
  nestjsSupabase: "https://github.com/andriishupta/nestjs-supabase-setup",
  strapiSeed: "https://github.com/andriishupta/strapi-generate-seed-data",
} as const;

export const copy = {
  identity: {
    firstName: "Andrii",
    lastName: "Shupta",
    fullName: "Andrii Shupta",
    username: "andriishupta",
    email,
  },
  seo: {
    title: "Andrii Shupta — Software Consultant and Developer",
    description:
      "Andrii Shupta helps product teams make better technical decisions and ship reliable software through architecture and delivery consulting.",
    imageAlt:
      "Andrii Shupta - Software consultant helping teams build reliable products",
    twitterHandle: "@andriishupta",
    keywords: [
      "Andrii Shupta",
      "software consultant",
      "software consulting",
      "full-stack engineer",
      "AI software engineer",
      "AI code review",
      "AI code cleanup",
      "production-ready software",
      "React developer",
      "Next.js developer",
      "Node.js developer",
      "TypeScript developer",
      "Supabase developer",
      "PostgreSQL developer",
      "software architecture",
      "security audit",
      "API integration",
    ],
    knowsAbout: [
      "Software consulting",
      "Full-stack software development",
      "AI-assisted development",
      "AI code review",
      "Software architecture",
      "Application security",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Supabase",
      "PostgreSQL",
    ],
  },
  mainPage: {
    header: {
      nameLines: ["Andrii", "Shupta"],
      linksLabel: "Andrii Shupta elsewhere",
      outerLinks: [
        {
          id: "linkedin",
          label: "LinkedIn",
          href: urls.linkedin,
          brand: "linkedin",
        },
        { id: "x", label: "X", href: urls.x, brand: "x" },
        {
          id: "github",
          label: "GitHub",
          href: urls.github,
          brand: "github",
        },
        {
          id: "upwork",
          label: "Upwork",
          href: urls.upwork,
          icon: "upwork",
        },
      ],
      innerLinks: [
        {
          id: "blog",
          label: "Blog",
          href: urls.blogPath,
          icon: "blog",
        },
        { id: "cv", label: "CV", href: urls.cv, icon: "cv" },
        {
          id: "email",
          label: "Email me",
          href: urls.email,
          icon: "email",
        },
      ],
    },
    blog: {
      platformLinks: [
        {
          id: "devto",
          label: "DEV.to",
          href: urls.devto,
          brand: "devto",
        },
        { id: "medium", label: "Medium", href: urls.medium, brand: "medium" },
        {
          id: "hashnode",
          label: "Hashnode",
          href: urls.hashnode,
          brand: "hashnode",
        },
      ],
    },
    intro: {
      heading: "Build the product. Clarify the system.",
      description:
        "I help teams turn ambiguous product and technical problems into systems that are easier to ship, change, and trust.",
      aside:
        "Good software work is not only about writing code. It is about making the right decisions early enough for the business to benefit.",
      focus: [
        "Consulting on architecture & system design",
        "Helping with software development",
        "Leading technical direction",
      ],
      scrollLabel: "Explore",
      scrollAriaLabel: "Explore consulting services",
    },
    about: {
      heading: "What I can help with",
      areasLabel: "Areas of work",
      areas: ["SaaS, MVPs & internal tools", "Architecture, APIs & delivery"],
      description:
        "Bring me in when a product is moving quickly, the system is getting harder to change, or the team needs a clear technical path from idea to production.",
      services: [
        {
          title: "Architecture & system design",
          description:
            "Clarify boundaries, choose the right level of complexity, and design systems that can grow without becoming expensive to operate.",
        },
        {
          title: "Software development",
          description:
            "Build the critical parts of a product with a focus on maintainability, security, performance, and a clean path to the next release.",
        },
        {
          title: "Technical direction",
          description:
            "Turn competing opinions into decisions, unblock teams, review code and architecture, and leave behind a stronger engineering practice.",
        },
      ],
      additional: [
        {
          label: "Worked with:",
          text: "NestJS, Tailwind CSS, Docker, Redis, Kafka, Vercel, React Native, and different AI APIs / MCPs.",
        },
        {
          label: "Other tech:",
          text: "Astro, Svelte, Angular, Flutter, MongoDB, headless CMSs, Chrome extensions, PHP, Python, and Gleam.",
        },
        {
          label: "For fun:",
          text: "Codex, Claude Code, OpenCode, and emerging tools.",
        },
        {
          label: "",
          text: "Degree in Computer Science.",
        },
      ],
      linksIntro: "Find",
      links: [
        {
          before: "detailed experience on",
          label: "LinkedIn",
          href: urls.linkedin,
        },
        { before: "code on", label: "GitHub", href: urls.github },
        {
          before: "longer notes on",
          label: "the blog",
          href: urls.blogPath,
        },
        { before: "short updates on", label: "X", href: urls.x },
        { before: "a concise overview in", label: "my CV", href: urls.cv },
      ],
    },
    technologies: {
      heading: "Main technologies I work with",
      description:
        "A practical toolkit for products, data, cloud, interfaces, integrations, and payments. The stack follows the problem, not the other way around. Hover or focus to pause.",
      regionLabel: "Technology toolkit",
      items: [
        {
          name: "TypeScript / JavaScript",
          detail: "Product and platform code",
          icon: "code",
        },
        { name: "React / Next.js", detail: "Product interfaces", icon: "ui" },
        {
          name: "Node.js / Bun",
          detail: "APIs, services, and tooling",
          icon: "runtime",
        },
        {
          name: "Data / AI / LLM",
          detail: "Applied AI workflows and integrations",
          icon: "ai",
        },
        {
          name: "PostgreSQL / Supabase",
          detail: "Data, auth, and realtime",
          icon: "data",
        },
        {
          name: "Redis",
          detail: "Cache, queues, and fast state",
          icon: "data",
        },
        {
          name: "AWS / Cloudflare / Vercel",
          detail: "Infrastructure, edge, and deployment",
          icon: "cloud",
        },
        {
          name: "Tailwind CSS / shadcn/ui / Material UI",
          detail: "Interface systems",
          icon: "ui",
        },
        {
          name: "Third-party APIs",
          detail: "System integrations",
          icon: "integration",
        },
        {
          name: "Stripe / payment systems",
          detail: "Payments and billing",
          icon: "payment",
        },
        {
          name: "Best fit first",
          detail: "The technology serves the product",
          icon: "principle",
        },
      ],
    },
    approach: {
      heading: "A practical way of working",
      description:
        "The engagement changes with the problem, but the principle stays the same: make the next decision visible, useful, and easy to act on.",
      steps: [
        {
          index: "01",
          title: "Understand the real problem",
          description:
            "Map the product context, constraints, system boundaries, and the decisions that are currently slowing the team down.",
        },
        {
          index: "02",
          title: "Design a path forward",
          description:
            "Compare options, define a pragmatic architecture, and make trade-offs explicit before they become expensive.",
        },
        {
          index: "03",
          title: "Ship and strengthen",
          description:
            "Work with the team through implementation, reviews, and production delivery so the result survives beyond the engagement.",
        },
      ],
    },
    proof: {
      clientsHeading: "What clients say",
      clientsDescription:
        "Feedback from real engagements, kept short enough to read and clear enough to trust.",
      teammatesHeading: "What teammates say",
      teammatesDescription:
        "Recommendations from people who worked with me directly.",
      upworkHref: urls.upwork,
      linkedinHref: urls.linkedin,
      upwork: [
        {
          initial: "SR",
          author: "SR",
          quote:
            "Andrii is very experienced and thoughtful in Next.js. He recommends best practices and will push back if something you require goes against that, as well as suggest a better way...",
          context: "Next.js CMS dashboard · solution-oriented",
          rating: "5.0 / 5",
          featured: true,
          tags: ["Solution Oriented"],
        },
        {
          initial: "SR",
          author: "SR",
          quote: "Excellent skill level, versed in Next.js.",
          context: "CMS development using Next.js · long-term engagement",
          rating: "5.0 / 5",
          featured: false,
          tags: ["Committed to Quality", "Next.js"],
        },
        {
          initial: "B",
          author: "Client",
          quote:
            "Quick and prompt help on an add-hoc need. Next step: preparing to continue with specific tasks.",
          context: "Advisory help on Supabase setup",
          rating: "5.0 / 5",
          featured: false,
          tags: ["Reliable"],
        },
        {
          initial: "C",
          author: "Client",
          quote:
            "Andrii is a really good React.js developer, I hope to work with him again.",
          context: "React.js / Redux front-end development",
          rating: "5.0 / 5",
          featured: false,
          tags: ["Committed to Quality"],
        },
        {
          initial: "D",
          author: "Client",
          quote:
            "Great consultant, very knowledgeable and proactive, highly recommended!",
          context: "Frontend developer · quick problem solution",
          rating: "5.0 / 5",
          tags: ["Clear Communicator"],
        },
      ],
      linkedin: [
        {
          initial: "R",
          author: "Roksolana",
          quote:
            "Working with Andrii was a great experience. He is highly professional, reliable, and an excellent collaborator. Throughout our projects, he provided clear communication, valuable feedback, and maintained an efficient workflow...",
          context: "On cooperation",
        },
        {
          initial: "D",
          author: "Darren",
          quote:
            "During his time supporting the England football teams, Andrii delivered across a number of projects that delivered real, measurable benefit to our stakeholders. He was consistent in his delivery throughout the engagement...",
          context: "Engineering manager",
        },
        {
          initial: "B",
          author: "Bohdan",
          quote:
            "Andrii is a skilled software engineer and open-minded person. He is not afraid of challenges and new technologies. He always took a proactive approach, offering better technical solutions...",
          context: "Teammate recommendation",
        },
      ],
    },
    useCases: {
      heading: "Work that shows the range",
      description:
        "Selected situations from my engineering experience, reframed around the problem, the decision, and the outcome. Detailed case studies can live in the notes.",
      items: [
        {
          client: "The FA",
          context: "Data platform / GCP",
          title: "Making a complex data platform easier to evolve",
          description:
            "Worked in a cross-functional product team on a modern cloud data platform, combining product development with technology discovery and migration work.",
        },
        {
          client: "LeapEvent Tech",
          context: "Tickets platform / modernization",
          title: "Moving a legacy platform toward event-driven systems",
          description:
            "Supported a PHP legacy system while helping shape its rewrite into a Node.js platform with event-driven development and Kafka.",
        },
        {
          client: "Snappy",
          context: "Payments / data migration",
          title: "Scaling billing workflows without losing trust",
          description:
            "Worked on billing and payment-account flows, including a migration of millions of database entities for thousands of customers.",
        },
      ],
    },
    openSource: {
      heading: "Public code people used",
      description:
        "Three open-source projects that developers found useful, paired with the practical notes behind them. These are archived references, not active products.",
      items: [
        {
          repo: "use-lens/use-lens",
          href: urls.useLens,
          description:
            "Type-safe GraphQL tooling and generated React hooks for the Lens API.",
          stars: 50,
          forks: 3,
          article: {
            title: "Simplify Lens API usage with GraphQL Code Generator",
            href: "/blog/simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen",
            image:
              "/blog/simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen/og.png",
          },
        },
        {
          repo: "andriishupta/nestjs-supabase-setup",
          href: urls.nestjsSupabase,
          description:
            "A request-scoped Supabase Auth and client setup for NestJS.",
          stars: 42,
          forks: 10,
          article: {
            title: "Setup Supabase with Nest.js",
            href: "/blog/setup-supabase-with-nestjs",
            image: "/blog/setup-supabase-with-nestjs/og.png",
          },
        },
        {
          repo: "andriishupta/strapi-generate-seed-data",
          href: urls.strapiSeed,
          description:
            "A practical Strapi data seeder covering relations, media, and realistic fixtures.",
          stars: 18,
          forks: 2,
          article: {
            title: "Generate Dummy Data in Strapi",
            href: "/blog/generate-dummy-data-in-strapi",
            image: "/blog/generate-dummy-data-in-strapi/og.png",
          },
        },
      ],
    },
    experience: {
      heading: "Background behind the work",
      companiesLabel: "Selected professional experience",
      moreLabel: "More on LinkedIn",
      moreAriaLabel: "View more experience on LinkedIn",
      moreHref: urls.linkedin,
      companies: [
        {
          name: "GlobalLogic",
          roles: [
            {
              title: "Principal Full Stack Developer",
              dates: "March 2023 - February 2026 (3 years)",
            },
          ],
          projects: [
            {
              name: "The FA",
              description: "English Football Association",
              href: "https://www.thefa.com",
              responsibilities: [
                "Cross-functional product team developing a modern GCP-based data platform",
                "Lead and participate in feature and product development",
                "Data and technology migration/technology discovery",
              ],
              achievements: [],
              tech: [
                "Google Cloud Platform",
                "Terraform",
                "BigQuery",
                "React",
                "Storybook",
                "Fastify",
                "PostgreSQL",
              ],
            },
            {
              name: "LeapEvent Tech(Patron Technology)",
              description: "Tickets Platform",
              href: "https://leapevent.tech",
              responsibilities: [
                "Support PHP legacy system",
                "Rewrite to a new Node.js system with event-driven development with Kafka",
                "Lead and participate in feature and product development",
              ],
              achievements: [],
              tech: [
                "Node.js",
                "Express",
                "Kafka",
                "MySQL(MariaDB)",
                "Redis",
                "PHP",
              ],
            },
          ],
          note: null,
          additionalAchievementsLabel: null,
          additionalAchievements: [],
        },
        {
          name: "Intellias",
          roles: [
            {
              title: "Senior Full Stack Developer",
              dates: "February 2021 - January 2023 (2 years)",
            },
          ],
          projects: [
            {
              name: "Sygnum",
              description: "Web3 bank / Blockchain digital assets",
              href: "https://www.sygnum.com",
              responsibilities: [
                "Lead and play a key role in full-stack development",
                "Develop a microservices architecture for a core proxy level for general product infrastructure",
              ],
              achievements: [],
              tech: [
                "React",
                "Node.js(NestJS)",
                "AWS EC2",
                "SNS/SQS",
                "DynamoDB",
                "Azure Active Directory",
                "and others.",
              ],
            },
            {
              name: "Snappy",
              description: "Gifting Experience Software",
              href: "https://www.snappy.com",
              responsibilities: [
                "Feature and product development",
                "Billing / Invoices and everything related to payment accounts",
              ],
              achievements: [
                "Migrated millions of database entities for thousands of customers",
                "Helped with transitioning to the Agile/Scrum process",
              ],
              tech: [
                "React",
                "Node.js with AWS Lambda and StepFunctions",
                "MongoDB Atlas",
                "extensive StripeAPI usage",
              ],
            },
          ],
          note: "Additionally, participated in hiring activities - 20+ interviews conducted",
          additionalAchievementsLabel: null,
          additionalAchievements: [],
        },
        {
          name: "EPAM Systems",
          roles: [
            {
              title: "Senior Full Stack Developer",
              dates: "February 2020 - February 2021 (1 year 1 month)",
            },
            {
              title: "Middle JavaScript Developer",
              dates: "June 2019 - February 2020 (9 months)",
            },
          ],
          projects: [
            {
              name: "NDA",
              description: "One of the biggest USA Credit Score companies",
              href: null,
              responsibilities: [
                "Lead front-end teams / sub-teams and play a key role in both FE and FS projects",
                "Play part in the architecture of Angular / React / Node + AWS applications",
              ],
              achievements: [
                "Applied different Agile methodologies from previous experience",
              ],
              tech: ["React", "Node.js with AWS", "Angular", "PostgreSQL"],
            },
          ],
          note: null,
          additionalAchievementsLabel: "Additionally for EPAM:",
          additionalAchievements: [
            "Lectured on EPAM's events and R&D Lab",
            "Played a part in the core team in the Mentorship program",
            "Conducted over 15 interviews for FE and FE roles",
          ],
        },
        {
          name: "Ciklum",
          roles: [
            {
              title: "Middle JavaScript Developer",
              dates: "July 2018 - June 2019 (1 year)",
            },
          ],
          projects: [
            {
              name: "Mercedes pay GmbH",
              description: "",
              href: null,
              responsibilities: [
                "Front-end development",
                "Write e2e Kotlin tests",
                "L3 Support",
              ],
              achievements: [],
              tech: ["Angular", "Riot.js", "Protractor/Selenium(Kotlin)"],
            },
          ],
          note: null,
          additionalAchievementsLabel: null,
          additionalAchievements: [],
        },
      ],
    },
  },
} as const;

export const identityProfileLinks = [
  ...copy.mainPage.header.outerLinks,
  ...copy.mainPage.blog.platformLinks,
].filter(({ href }) => isExternalHref(href));
