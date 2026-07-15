import { copy, urls } from "../copy";

const homepage = "https://andriishupta.dev";

const socials = ["LinkedIn", "GitHub", "Twitter", "Upwork"]
  .map((label) =>
    copy.mainPage.header.links.find((item) => item.label === label),
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

const llmsContent = `
# ${copy.identity.fullName}

${copy.seo.description}

## Primary pages

- [Home](${homepage}): ${copy.mainPage.intro.heading}
- [CV](${homepage}${urls.cv}): Concise professional experience and skills.
- [Blog](${urls.blog}/): Technical writing by ${copy.identity.fullName}.

## Technology stack
- Main: ${mainTechnologies}
${additionalFacts}

## Socials
${socials}
`;

export function GET() {
  return new Response(llmsContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
