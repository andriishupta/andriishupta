import rss from "@astrojs/rss";
import { marked } from "marked";
import { getBlogPosts, getPostPath } from "../../lib/blog";

export const prerender = true;

function prepareRssMarkdown(body: string | undefined) {
  return (body ?? "")
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "")
    .trim();
}

export async function GET(context: { site?: URL }) {
  const posts = await getBlogPosts({ includeStubs: false });

  return rss({
    title: "Andrii Shupta — Writing",
    description:
      "Technical notes on software architecture, web development, integrations, security, and production engineering.",
    site: context.site ?? "https://andriishupta.dev",
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: getPostPath(post),
      pubDate: post.data.publishedAt,
      categories: post.data.tags,
      content: marked.parse(prepareRssMarkdown(post.body)) as string,
      customData: `<updated>${(post.data.updatedAt ?? post.data.publishedAt).toISOString()}</updated>`,
    })),
    customData: "<language>en-us</language>",
  });
}
