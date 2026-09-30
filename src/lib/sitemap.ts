import { urls } from "../copy";
import { getBlogPosts, getPostPath } from "./blog";
import { getPortfolioItems, getPortfolioPath } from "./portfolio";

interface SitemapPage {
  path: string;
  lastmod?: string;
}

const siteUrl = "https://andriishupta.dev";
const rootPages: SitemapPage[] = [
  { path: "/", lastmod: undefined },
  { path: urls.cv, lastmod: undefined },
  { path: "/llms.txt", lastmod: undefined },
];

export async function getBlogSitemapPages(): Promise<SitemapPage[]> {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  return [
    { path: urls.blogPath, lastmod: undefined },
    ...posts.map((post) => ({ path: getPostPath(post) })),
  ];
}

export async function getPortfolioSitemapPages(
  options: { includePdfs?: boolean } = {},
): Promise<SitemapPage[]> {
  const items = await getPortfolioItems({ includeTranslations: true });
  return [
    { path: urls.portfolioPath, lastmod: undefined },
    ...items.map((item) => ({ path: getPortfolioPath(item) })),
    ...(options.includePdfs
      ? items.flatMap((item) =>
          item.data.pdf ? [{ path: item.data.pdf }] : [],
        )
      : []),
  ];
}

export async function getRootSitemapPages(): Promise<SitemapPage[]> {
  const [blogPages, portfolioPages] = await Promise.all([
    getBlogSitemapPages(),
    getPortfolioSitemapPages({ includePdfs: true }),
  ]);
  return [...rootPages, ...blogPages, ...portfolioPages];
}

function renderUrl({ path, lastmod }: SitemapPage) {
  const values = ["    <url>", `        <loc>${new URL(path, siteUrl)}</loc>`];

  if (lastmod) values.push(`        <lastmod>${lastmod}</lastmod>`);
  values.push("    </url>");

  return values.join("\n");
}

export function createSitemapResponse(
  pages: SitemapPage[],
  options: { noindex?: boolean } = {},
) {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    pages.map(renderUrl).join("\n"),
    "</urlset>",
  ].join("\n");
  const headers: Record<string, string> = {
    "Content-Type": "application/xml; charset=utf-8",
  };

  if (options.noindex) headers["X-Robots-Tag"] = "noindex";

  return new Response(`${body}\n`, { headers });
}
