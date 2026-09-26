import { type CollectionEntry, getCollection } from "astro:content";
import {
  compareByPublishedDate,
  compareFeaturedFirst,
  formatContentDate,
  selectPrimaryTranslations,
  toIsoDate,
  withPublishedDate,
} from "./content";

export {
  blogTopicDefinitions,
  blogTopicSlugs,
} from "./blog-topics";
export { toIsoDate };

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

export function getReadingStats(body: string | undefined) {
  const source = stripMdxModuleLines(body).trim();
  const text = getReadingText(body);
  const wordCount = text.match(wordPattern)?.length ?? 0;
  const readingMinutes =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 220)) : 0;

  return { wordCount, readingMinutes, isStub: source.length === 0 };
}

function isBlogPostReady(post: BlogPost) {
  return !getReadingStats(post.body).isStub;
}

function getTranslationKey(post: BlogPost) {
  return post.data.slug;
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
  ).map((post) => withPublishedDate(post, "blog"));

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
  return formatContentDate(date, lang);
}

export function getPostPath(post: BlogPost) {
  return post.data.lang === "uk"
    ? `/blog/ua/${post.data.slug}`
    : `/blog/${post.data.slug}`;
}
