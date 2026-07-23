import { getBlogPosts, getPostPath, toIsoDate } from "../lib/blog";

const staticPages = [
  { path: "/", lastmod: undefined },
  { path: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf", lastmod: undefined },
  { path: "/llms.txt", lastmod: undefined },
  { path: "/blog", lastmod: undefined },
];
const siteUrl = "https://andriishupta.dev";

export async function GET() {
  const posts = await getBlogPosts({ includeStubs: false });
  const pages = [
    ...staticPages,
    ...posts.map((post) => ({
      path: getPostPath(post),
      lastmod: toIsoDate(post.data.updatedAt ?? post.data.publishedAt),
    })),
  ];
  const urls = pages
    .map(({ path, lastmod }) => {
      const loc = new URL(path, siteUrl).toString();
      const values = ["    <url>", `        <loc>${loc}</loc>`];

      if (lastmod) values.push(`        <lastmod>${lastmod}</lastmod>`);
      values.push("    </url>");

      return values.join("\n");
    })
    .join("\n");

  return new Response(
    `${[
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      "</urlset>",
    ].join("\n")}\n`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
