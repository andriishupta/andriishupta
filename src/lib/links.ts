export type LinkBrand =
  | "linkedin"
  | "github"
  | "x"
  | "devto"
  | "medium"
  | "hashnode";

export type LinkIconName = "upwork" | "cv" | "blog" | "email";

export const isExternalHref = (href: string) =>
  href.startsWith("https://") || href.startsWith("http://");
