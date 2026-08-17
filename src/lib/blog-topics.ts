export const blogTopics = [
  "AI",
  "Web3",
  "Software Design",
  "Consulting",
  "UI Development",
  "API Development",
  "Mobile Development",
] as const;

export const blogTopicDefinitions = [
  { label: "AI", slug: "ai" },
  { label: "Web3", slug: "web3" },
  { label: "Software Design", slug: "software-design" },
  { label: "Consulting", slug: "consulting" },
  { label: "UI Development", slug: "ui-development" },
  { label: "API Development", slug: "api-development" },
  { label: "Mobile Development", slug: "mobile-development" },
] as const;

export type BlogTopicSlug = (typeof blogTopicDefinitions)[number]["slug"];

export function getBlogTopicSlug(topic: string) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
