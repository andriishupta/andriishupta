import { type CollectionEntry, getCollection } from "astro:content";

export {
  blogTopicDefinitions,
  blogTopics,
  getBlogTopicSlug,
} from "./blog-topics";

export type BlogPost = CollectionEntry<"blog">;
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

export function stripMdxModuleLines(body: string | undefined) {
  return (body ?? "")
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "");
}

export function getReadingStats(
  body: string | undefined,
  originalReadingMinutes?: number,
) {
  const text = stripMdxModuleLines(body)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ");
  const wordCount = text.match(wordPattern)?.length ?? 0;
  const readingMinutes =
    wordCount > 0
      ? Math.max(1, Math.ceil(wordCount / 220))
      : (originalReadingMinutes ?? 0);

  return { wordCount, readingMinutes, isStub: wordCount === 0 };
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
  let posts = await getCollection("blog", ({ data }) =>
    includeDrafts ? true : !data.draft,
  );

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
