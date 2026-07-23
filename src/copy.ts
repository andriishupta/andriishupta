const email = "hello@andriishupta.dev";

export const urls = {
  linkedin: "https://www.linkedin.com/in/andriishupta/",
  github: "https://github.com/andriishupta/",
  x: "https://x.com/andriishupta",
  upwork: "https://www.upwork.com/freelancers/andriishupta",
  cv: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf",
  about: "/#about",
  experience: "/#experience",
  blogPath: "/blog",
  email: `mailto:${email}`,
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
    title: "Andrii Shupta - Full-Stack Engineer",
    description:
      "Full-stack engineer with 10+ years building secure, maintainable software, modernizing products, and bringing AI-assisted code to production.",
    imageAlt:
      "Andrii Shupta - Full-stack engineer building production-ready software with AI",
    twitterHandle: "@andriishupta",
    keywords: [
      "Andrii Shupta",
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
        {
          id: "github",
          label: "GitHub",
          href: urls.github,
          brand: "github",
        },
        { id: "x", label: "Twitter", href: urls.x, brand: "x" },
        {
          id: "upwork",
          label: "Upwork",
          href: urls.upwork,
          icon: "upwork",
        },
      ],
      innerLinks: [
        { id: "cv", label: "CV", href: urls.cv, icon: "cv" },
        {
          id: "blog",
          label: "Blog",
          href: urls.blogPath,
          icon: "blog",
        },
        {
          id: "email",
          label: "Email me",
          href: urls.email,
          icon: "email",
        },
      ],
    },
    intro: {
      heading: "Full-stack engineer - 10+ years of experience",
      description:
        "I work across architecture, security, performance, integrations, and production delivery",
      scrollLabel: "About",
      scrollAriaLabel: "Scroll to about",
    },
    about: {
      heading: "About",
      scrollLabel: "Experience",
      scrollAriaLabel: "Scroll to experience",
      areasLabel: "Areas of work",
      areas: ["SaaS, MVPs & internal tools", "Architecture, APIs & delivery"],
      coreStack: {
        heading: "Core stack",
        listLabel: "Core technologies",
        technologies: [
          { name: "TypeScript", icon: "code" },
          { name: "React / Next.js", icon: "react" },
          { name: "Node.js / Hono.js", icon: "server" },
          { name: "PostgreSQL / Supabase", icon: "database" },
          { name: "AWS / Cloudflare", icon: "cloud" },
          { name: "Codex / Claude", icon: "rocket" },
        ],
      },
      description:
        "I build production-ready software and modernize complex systems - SaaS, internal tools, APIs, and AI-enabled applications. Across 10+ years, I’ve worked with startups shipping MVPs and enterprise teams evolving large-scale products, from architecture and APIs through performance, code review, and production delivery.",
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
    experience: {
      heading: "Experience",
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
