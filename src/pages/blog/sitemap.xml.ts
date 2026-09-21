import { getBlogPosts, getPostPath } from "../../lib/blog";
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
    })),
  ];
  return createSitemapResponse(pages, { noindex: true });
}
