export const urls = {
  linkedin: "https://www.linkedin.com/in/andriishupta/",
  github: "https://github.com/andriishupta/",
  x: "https://x.com/andriishupta",
  upwork: "https://www.upwork.com/freelancers/andriishupta",
  cv: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf",
  blog: "https://blog.andriishupta.dev",
} as const;

export const copy = {
  identity: {
    firstName: "Andrii",
    lastName: "Shupta",
    fullName: "Andrii Shupta",
    username: "andriishupta",
  },
  seo: {
    title: "Andrii Shupta - Full-Stack Engineer",
    description:
      "Full-stack engineer with 10+ years of experience building secure, maintainable software, modernizing products, and turning AI-generated code into production-ready systems.",
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
      links: [
        { label: "LinkedIn", href: urls.linkedin, brand: "linkedin" },
        { label: "GitHub", href: urls.github, brand: "github" },
        { label: "Twitter", href: urls.x, brand: "x" },
        { label: "Upwork", href: urls.upwork, icon: "upwork" },
        { label: "CV", href: urls.cv, icon: "cv" },
        { label: "Blog", href: urls.blog, icon: "blog" },
      ],
    },
    intro: {
      heading: "Full-stack engineer - 10+ years of experience",
      description:
        "I build and modernize full-stack products - SaaS, internal tools, APIs, and AI-powered applications. I work across architecture, security, performance, integrations, and production delivery, using AI when it helps without treating generated code as finished work.",
      scrollLabel: "About",
      scrollAriaLabel: "Scroll to about",
    },
    about: {
      heading: "About",
      scrollLabel: "Experience",
      scrollAriaLabel: "Scroll to experience",
      areasLabel: "Areas of work",
      areas: [
        "AI-powered applications",
        "AI code review & cleanup",
        "SaaS, MVPs & internal tools",
        "Architecture, APIs & delivery",
      ],
      coreStack: {
        heading: "Core stack",
        listLabel: "Core technologies",
        technologies: [
          { name: "TypeScript", icon: "code" },
          { name: "React / Next.js", icon: "react" },
          { name: "Node.js / Hono.js", icon: "server" },
          { name: "Supabase / PostgreSQL", icon: "database" },
        ],
      },
      degree: "Degree in Computer Science.",
      description:
        "I’ve built MVPs with early-stage teams and helped enterprise teams modernize large applications. My work covers product development, architecture, APIs, performance, security, code reviews, and AI integrations. I’m comfortable moving between technologies and getting unfamiliar codebases into a shape that teams can ship and maintain.",
      additional: [
        {
          label: "Also work with:",
          text: "NestJS, Tailwind CSS, Cloudflare, AWS, Vercel, Docker, Redis, Kafka, React Native, and Flutter.",
        },
        {
          label: "For fun:",
          text: "Gleam, Python, and emerging technologies.",
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
        { before: "longer notes on", label: "the blog", href: urls.blog },
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
                "Node.js(Nest.js)",
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
                "Node.js(Nest.js) with AWS Lambda and StepFunctions",
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
