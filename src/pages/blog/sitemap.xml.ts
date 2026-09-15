import { getBlogPosts, getPostPath, toIsoDate } from "../../lib/blog";
import { createSitemapResponse } from "../../lib/sitemap";

export const prerender = true;

export async function GET() {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  const pages = [
    { path: "/blog", lastmod: undefined },
    ...posts.map((post) => ({
      path: getPostPath(post),
      lastmod: toIsoDate(post.data.updatedAt ?? post.data.publishedAt),
    })),
  ];
  return createSitemapResponse(pages, { noindex: true });
}
