import { copy, urls } from "../copy";
import { getBlogPosts, getPostPath } from "../lib/blog";
import { getPortfolioItems, getPortfolioPath } from "../lib/portfolio";

const homepage = "https://andriishupta.dev";
const blog = new URL(urls.blogPath, homepage).toString();

const socials = ["LinkedIn", "GitHub", "X", "Upwork"]
  .map((label) =>
    copy.mainPage.header.outerLinks.find((item) => item.label === label),
  )
  .filter((item) => item !== undefined)
  .map((item) => `- [${item.label}](${item.href})`)
  .join("\n");

const writingProfiles = copy.mainPage.blog.platformLinks
  .map((item) => `- [${item.label}](${item.href})`)
  .join("\n");

const mainTechnologies = copy.mainPage.technologies.items
  .map((technology) => technology.name)
  .join(", ");

const additionalFacts = copy.mainPage.about.additional
  .map((item) =>
    item.label ? `- ${item.label} ${item.text}` : `- ${item.text}`,
  )
  .join("\n");

export async function GET() {
  const posts = await getBlogPosts({
    includeStubs: false,
    includeTranslations: true,
  });
  const portfolioItems = await getPortfolioItems();
  const blogArticles = posts
    .map(
      (post) =>
        `- [${post.data.title}](${new URL(getPostPath(post), homepage)}): ${post.data.subtitle}`,
    )
    .join("\n");
  const llmsContent = `
# ${copy.identity.fullName}

${copy.seo.description}

## Primary pages

- [Home](${homepage}): ${copy.mainPage.intro.heading}
- [CV](${homepage}${urls.cv}): Concise professional experience and skills.
- [Blog](${blog}): Technical writing by ${copy.identity.fullName}.
- [Portfolio](${homepage}/portfolio): Selected product and architecture case studies.

## Portfolio case studies
${portfolioItems
  .map((item) => {
    const portfolioLine = `- [${item.data.title}](${new URL(getPortfolioPath(item), homepage)}): ${item.data.subtitle}`;
    return item.data.pdf
      ? `${portfolioLine}\n  PDF: ${new URL(item.data.pdf, homepage)}`
      : portfolioLine;
  })
  .join("\n")}

## Blog articles
${blogArticles}

## Technology stack
- Main: ${mainTechnologies}
${additionalFacts}

## Socials
${socials}

## Writing profiles
${writingProfiles}

## Contact
- [Email](${urls.email}): ${copy.identity.email}
`;

  return new Response(llmsContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
