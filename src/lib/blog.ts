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
}

const wordPattern = /[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu;

export function getReadingStats(
  body: string | undefined,
  originalReadingMinutes?: number,
) {
  const text = (body ?? "")
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "")
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

export function getBlogLanguage(post: BlogPost): BlogLanguage {
  return post.data.lang;
}

export async function getBlogPosts(options: BlogPostOptions = {}) {
  const {
    includeDrafts = false,
    includeStubs = true,
    lang,
    includeTranslations = false,
  } = options;
  let posts = await getCollection("blog", ({ data }) =>
    includeDrafts ? true : !data.draft,
  );

  if (lang) {
    posts = posts.filter((post) => post.data.lang === lang);
  }

  if (!includeTranslations) {
    const defaultPosts = new Map<string, BlogPost>();

    for (const post of posts) {
      const key = getTranslationKey(post);
      const current = defaultPosts.get(key);

      if (!current || (post.data.defaultLang && !current.data.defaultLang)) {
        defaultPosts.set(key, post);
      }
    }

    posts = [...defaultPosts.values()];
  }

  return posts
    .filter((post) => includeStubs || isBlogPostReady(post))
    .sort((a, b) => {
      const dateDifference =
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime();

      return dateDifference || a.data.title.localeCompare(b.data.title);
    });
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
