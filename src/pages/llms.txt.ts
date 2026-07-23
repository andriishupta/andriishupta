import { copy, urls } from "../copy";
import { getBlogPosts, getPostPath } from "../lib/blog";

const homepage = "https://andriishupta.dev";
const blog = new URL(urls.blogPath, homepage).toString();

const socials = ["LinkedIn", "GitHub", "Twitter", "Upwork"]
  .map((label) =>
    copy.mainPage.header.outerLinks.find((item) => item.label === label),
  )
  .filter((item) => item !== undefined)
  .map((item) => `- [${item.label}](${item.href})`)
  .join("\n");

const mainTechnologies = copy.mainPage.about.coreStack.technologies
  .map((tech) => tech.name)
  .join(", ");

const additionalFacts = copy.mainPage.about.additional
  .map((item) =>
    item.label ? `- ${item.label} ${item.text}` : `- ${item.text}`,
  )
  .join("\n");

export async function GET() {
  const posts = await getBlogPosts({ includeStubs: false });
  const blogArticles = posts
    .map(
      (post) =>
        `- [${post.data.title}](${new URL(getPostPath(post), homepage)}): ${post.data.description}`,
    )
    .join("\n");
  const llmsContent = `
# ${copy.identity.fullName}

${copy.seo.description}

## Primary pages

- [Home](${homepage}): ${copy.mainPage.intro.heading}
- [CV](${homepage}${urls.cv}): Concise professional experience and skills.
- [Blog](${blog}): Technical writing by ${copy.identity.fullName}.

## Blog articles
${blogArticles}

## Technology stack
- Main: ${mainTechnologies}
${additionalFacts}

## Socials
${socials}

## Contact
- [Email](${urls.email}): ${copy.identity.email}
`;

  return new Response(llmsContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
