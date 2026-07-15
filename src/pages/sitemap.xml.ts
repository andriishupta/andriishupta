const pages = ["/", "/Andrii_Shupta_Lead_Full_Stack_CV.pdf", "/llms.txt"];
const siteUrl = "https://andriishupta.dev";

export function GET() {
  const urls = pages
    .map((path) => {
      const loc = new URL(path, siteUrl).toString();

      return ["    <url>", `        <loc>${loc}</loc>`, "    </url>"].join(
        "\n",
      );
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
