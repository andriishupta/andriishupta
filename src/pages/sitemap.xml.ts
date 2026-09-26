import { getBlogPosts, getPostPath } from "../lib/blog";
import { getPortfolioItems, getPortfolioPath } from "../lib/portfolio";
import { createSitemapResponse } from "../lib/sitemap";

const staticPages = [
  { path: "/", lastmod: undefined },
  { path: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf", lastmod: undefined },
  { path: "/llms.txt", lastmod: undefined },
  { path: "/blog", lastmod: undefined },
  { path: "/portfolio", lastmod: undefined },
];
export async function GET() {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  const portfolioItems = await getPortfolioItems({
    includeTranslations: true,
  });
  const pages = [
    ...staticPages,
    ...posts.map((post) => ({
      path: getPostPath(post),
    })),
    ...portfolioItems.map((item) => ({ path: getPortfolioPath(item) })),
    ...portfolioItems
      .filter((item) => item.data.pdf)
      .map((item) => ({ path: item.data.pdf })),
  ];
  return createSitemapResponse(pages);
}
