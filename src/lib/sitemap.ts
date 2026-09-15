interface SitemapPage {
  path: string;
  lastmod?: string;
}

const siteUrl = "https://andriishupta.dev";

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
