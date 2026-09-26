import { type CollectionEntry, getCollection } from "astro:content";
import {
  compareByPublishedDate,
  compareFeaturedFirst,
  formatContentDate,
  selectPrimaryTranslations,
  toIsoDate,
  withPublishedDate,
} from "./content";

export { toIsoDate };

type PortfolioContentEntry = CollectionEntry<"portfolio">;
export type PortfolioItem = Omit<PortfolioContentEntry, "data"> & {
  data: PortfolioContentEntry["data"] & { publishedAt: Date };
};
export type PortfolioLanguage = "en" | "uk";

interface PortfolioItemOptions {
  includeDrafts?: boolean;
  lang?: PortfolioLanguage;
  includeTranslations?: boolean;
  featuredFirst?: boolean;
}

export interface PortfolioItemPageProps {
  item: PortfolioItem;
  alternateItem?: PortfolioItem;
}

export async function getPortfolioItems(options: PortfolioItemOptions = {}) {
  const {
    includeDrafts = import.meta.env.DEV,
    lang,
    includeTranslations = false,
    featuredFirst = false,
  } = options;
  let items = (
    await getCollection("portfolio", ({ data }) =>
      includeDrafts ? true : !data.draft,
    )
  ).map((item) => withPublishedDate(item, "portfolio"));

  if (lang) {
    items = items.filter((item) => item.data.lang === lang);
  }

  if (!includeTranslations) {
    items = selectPrimaryTranslations(items);
  }

  return items.sort(
    featuredFirst ? compareFeaturedFirst : compareByPublishedDate,
  );
}

export async function getPortfolioItemBySlug(
  slug: string,
  options: PortfolioItemOptions = {},
) {
  const items = await getPortfolioItems({
    ...options,
    includeTranslations: true,
  });
  return items.find((item) => item.data.slug === slug);
}

export async function getPortfolioStaticPaths(lang: PortfolioLanguage) {
  const allItems = await getPortfolioItems({ includeTranslations: true });
  const items = allItems.filter((item) => item.data.lang === lang);

  return items.map((item) => ({
    params: { slug: item.data.slug },
    props: {
      item,
      alternateItem: allItems.find(
        (candidate) =>
          candidate.data.lang !== item.data.lang &&
          candidate.data.slug === item.data.slug,
      ),
    } satisfies PortfolioItemPageProps,
  }));
}

export function formatPortfolioDate(
  date: Date,
  lang: PortfolioLanguage = "en",
) {
  return formatContentDate(date, lang);
}

export function getPortfolioPath(item: PortfolioItem) {
  return item.data.lang === "uk"
    ? `/portfolio/ua/${item.data.slug}`
    : `/portfolio/${item.data.slug}`;
}
