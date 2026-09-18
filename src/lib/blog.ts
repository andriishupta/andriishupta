import { type CollectionEntry, getCollection } from "astro:content";

export {
  blogTopicDefinitions,
  blogTopics,
  getBlogTopicSlug,
} from "./blog-topics";

type BlogContentEntry = CollectionEntry<"blog">;
export type BlogPost = Omit<BlogContentEntry, "data"> & {
  data: BlogContentEntry["data"] & { publishedAt: Date };
};
export type BlogLanguage = "en" | "uk";

interface BlogPostOptions {
  includeDrafts?: boolean;
  includeStubs?: boolean;
  lang?: BlogLanguage;
  includeTranslations?: boolean;
  featuredFirst?: boolean;
}

export interface BlogPostPageProps {
  post: BlogPost;
  newerPost?: BlogPost;
  olderPost?: BlogPost;
  alternatePost?: BlogPost;
}

const wordPattern = /[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu;
const filenameDatePattern = /(\d{4}-\d{2}-\d{2})_/;

function getPublishedDate(post: BlogContentEntry) {
  const dateString = post.id.match(filenameDatePattern)?.[1];

  if (!dateString) {
    throw new Error(
      `${post.id}: blog filename must start with a valid YYYY-MM-DD date`,
    );
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || toIsoDate(date) !== dateString) {
    throw new Error(`${post.id}: invalid UTC publication date ${dateString}`);
  }

  return date;
}

function withPublishedDate(post: BlogContentEntry): BlogPost {
  return {
    ...post,
    data: { ...post.data, publishedAt: getPublishedDate(post) },
  };
}

export function stripMdxModuleLines(body: string | undefined) {
  return (body ?? "")
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "");
}

function getReadingText(body: string | undefined) {
  return stripMdxModuleLines(body)
    .replace(/^(?:`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?:`{3,}|~{3,})[ \t]*$/gm, " ")
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, " ")
    .replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, " ")
    .replace(/(`+)[^`\n]*\1/g, " ")
    .replace(/^(?: {4}|\t).+$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/<[^>]+>/g, " ");
}

export function getReadingStats(
  body: string | undefined,
  originalReadingMinutes?: number,
) {
  const source = stripMdxModuleLines(body).trim();
  const text = getReadingText(body);
  const wordCount = text.match(wordPattern)?.length ?? 0;
  const readingMinutes =
    wordCount > 0
      ? Math.max(1, Math.ceil(wordCount / 220))
      : (originalReadingMinutes ?? 0);

  return { wordCount, readingMinutes, isStub: source.length === 0 };
}

export function isBlogPostReady(post: BlogPost) {
  return !getReadingStats(post.body).isStub;
}

export function getTranslationKey(post: BlogPost) {
  return post.data.translationKey ?? post.data.slug;
}

function selectPrimaryTranslations(posts: BlogPost[]) {
  const selectedPosts = new Map<string, BlogPost>();

  for (const post of posts) {
    const key = getTranslationKey(post);
    const current = selectedPosts.get(key);

    if (!current || (current.data.lang !== "en" && post.data.lang === "en")) {
      selectedPosts.set(key, post);
    }
  }

  return [...selectedPosts.values()];
}

function compareByPublishedDate(a: BlogPost, b: BlogPost) {
  const dateDifference =
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime();

  return dateDifference || a.data.title.localeCompare(b.data.title);
}

function compareFeaturedFirst(a: BlogPost, b: BlogPost) {
  if (a.data.featured !== b.data.featured) {
    return a.data.featured ? -1 : 1;
  }

  return compareByPublishedDate(a, b);
}

export async function getBlogPosts(options: BlogPostOptions = {}) {
  const {
    includeDrafts = import.meta.env.DEV,
    includeStubs = true,
    lang,
    includeTranslations = false,
    featuredFirst = false,
  } = options;
  let posts = (
    await getCollection("blog", ({ data }) =>
      includeDrafts ? true : !data.draft,
    )
  ).map(withPublishedDate);

  if (lang) {
    posts = posts.filter((post) => post.data.lang === lang);
  }

  if (!includeTranslations) {
    posts = selectPrimaryTranslations(posts);
  }

  return posts
    .filter((post) => includeStubs || isBlogPostReady(post))
    .sort(featuredFirst ? compareFeaturedFirst : compareByPublishedDate);
}

export async function getBlogStaticPaths(lang: BlogLanguage) {
  const allPosts = await getBlogPosts({ includeTranslations: true });
  const posts = allPosts.filter((post) => post.data.lang === lang);

  return posts.map((post, index) => ({
    params: { slug: post.data.slug },
    props: {
      post,
      newerPost: posts[index - 1],
      olderPost: posts[index + 1],
      alternatePost: allPosts.find(
        (candidate) =>
          candidate.data.lang !== post.data.lang &&
          getTranslationKey(candidate) === getTranslationKey(post),
      ),
    } satisfies BlogPostPageProps,
  }));
}

export function formatBlogDate(date: Date, lang: BlogLanguage = "en") {
  return new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : "en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPostPath(post: BlogPost) {
  return post.data.lang === "uk"
    ? `/blog/ua/${post.data.slug}`
    : `/blog/${post.data.slug}`;
}

export function hasMeaningfulUpdate(post: BlogPost) {
  return Boolean(
    post.data.updatedAt &&
      toIsoDate(post.data.updatedAt) !== toIsoDate(post.data.publishedAt),
  );
}
