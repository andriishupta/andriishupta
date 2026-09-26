export type ContentLanguage = "en" | "uk";

const filenameDatePattern = /(\d{4}-\d{2}-\d{2})_/;

interface DatedEntry {
  id: string;
}

interface ContentRecordData {
  slug: string;
  lang: string;
  featured: boolean;
  title: string;
  publishedAt: Date;
}

interface ContentRecord {
  data: ContentRecordData;
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPublishedDate(entry: DatedEntry, kind: string) {
  const dateString = entry.id.match(filenameDatePattern)?.[1];

  if (!dateString) {
    throw new Error(
      `${entry.id}: ${kind} filename must start with a valid YYYY-MM-DD date`,
    );
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || toIsoDate(date) !== dateString) {
    throw new Error(`${entry.id}: invalid UTC publication date ${dateString}`);
  }

  return date;
}

export function withPublishedDate<T extends { id: string; data: object }>(
  entry: T,
  kind: string,
): Omit<T, "data"> & { data: T["data"] & { publishedAt: Date } } {
  return {
    ...entry,
    data: { ...entry.data, publishedAt: getPublishedDate(entry, kind) },
  } as Omit<T, "data"> & { data: T["data"] & { publishedAt: Date } };
}

export function selectPrimaryTranslations<
  T extends { data: { slug: string; lang: string } },
>(items: T[]) {
  const selectedItems = new Map<string, T>();

  for (const item of items) {
    const current = selectedItems.get(item.data.slug);

    if (!current || (current.data.lang !== "en" && item.data.lang === "en")) {
      selectedItems.set(item.data.slug, item);
    }
  }

  return [...selectedItems.values()];
}

export function compareByPublishedDate<T extends ContentRecord>(a: T, b: T) {
  const dateDifference =
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime();

  return dateDifference || a.data.title.localeCompare(b.data.title);
}

export function compareFeaturedFirst<T extends ContentRecord>(a: T, b: T) {
  if (a.data.featured !== b.data.featured) {
    return a.data.featured ? -1 : 1;
  }

  return compareByPublishedDate(a, b);
}

export function formatContentDate(date: Date, lang: ContentLanguage = "en") {
  return new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : "en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
