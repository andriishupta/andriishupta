import rss from "@astrojs/rss";
import { marked } from "marked";
import { getBlogPosts, getPostPath, stripMdxModuleLines } from "../../lib/blog";

export const prerender = true;

export async function GET(context: { site?: URL }) {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  const site = context.site ?? new URL("https://andriishupta.dev");
  const siteOrigin = site.origin;

  const response = await rss({
    title: "Andrii Shupta — Blog",
    description:
      "Technical notes on software architecture, web development, integrations, security, and production engineering.",
    site,
    trailingSlash: false,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: getPostPath(post),
      pubDate: post.data.publishedAt,
      categories: post.data.tags,
      content: (
        marked.parse(stripMdxModuleLines(post.body).trim()) as string
      ).replace(/\b(href|src)="\/(?!\/)/g, `$1="${siteOrigin}/`),
    })),
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${siteOrigin}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    ].join(""),
  });
  response.headers.set("X-Robots-Tag", "noindex");

  return response;
}
