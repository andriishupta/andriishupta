const pages = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  {
    path: "/Andrii_Shupta_Lead_Full_Stack_CV.pdf",
    priority: "0.4",
    changefreq: "yearly",
  },
];
const siteUrl = "https://andriishupta.dev";
const lastmod = "2026-06-02";

export function GET() {
  const urls = pages
    .map(({ path, priority, changefreq }) => {
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
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      "</urlset>",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
