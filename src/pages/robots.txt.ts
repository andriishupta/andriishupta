const siteUrl = "https://andriishupta.dev";

export function GET() {
  return new Response(
    `${[
      "User-agent: *",
      "Allow: /",
      `Sitemap: ${new URL("/sitemap.xml", siteUrl).toString()}`,
    ].join("\n")}\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
