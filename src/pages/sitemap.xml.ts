const pages = [
  {
    path: "/",
    lastmod: "2026-07-13",
    priority: "1.0",
    changefreq: "monthly",
  },
  {
    path: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf",
    lastmod: "2026-06-02",
    priority: "0.4",
    changefreq: "yearly",
  },
];
const siteUrl = "https://andriishupta.dev";

export function GET() {
  const urls = pages
    .map(({ path, lastmod, priority, changefreq }) => {
      const loc = new URL(path, siteUrl).toString();

      return [
        "    <url>",
        `        <loc>${loc}</loc>`,
        `        <lastmod>${lastmod}</lastmod>`,
        `        <changefreq>${changefreq}</changefreq>`,
        `        <priority>${priority}</priority>`,
        "    </url>",
      ].join("\n");
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
