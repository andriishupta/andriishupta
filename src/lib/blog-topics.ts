export const blogTopicDefinitions = [
  { label: "Software Design", slug: "software-design" },
  { label: "AI", slug: "ai" },
  { label: "API", slug: "api" },
  { label: "UI", slug: "ui" },
  { label: "Mobile", slug: "mobile" },
  { label: "Web3", slug: "web3" },
] as const;

type BlogTopicSlug = (typeof blogTopicDefinitions)[number]["slug"];

export const blogTopicSlugs = blogTopicDefinitions.map(({ slug }) => slug) as [
  BlogTopicSlug,
  ...BlogTopicSlug[],
];
