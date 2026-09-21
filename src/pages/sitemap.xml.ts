import { getBlogPosts, getPostPath } from "../lib/blog";
import { createSitemapResponse } from "../lib/sitemap";

const staticPages = [
  { path: "/", lastmod: undefined },
  { path: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf", lastmod: undefined },
  { path: "/llms.txt", lastmod: undefined },
  { path: "/blog", lastmod: undefined },
];
export async function GET() {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  const pages = [
    ...staticPages,
    ...posts.map((post) => ({
      path: getPostPath(post),
    })),
  ];
  return createSitemapResponse(pages);
}
