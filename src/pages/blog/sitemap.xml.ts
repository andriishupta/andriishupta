import { createSitemapResponse, getBlogSitemapPages } from "../../lib/sitemap";

export const prerender = true;

export async function GET() {
  return createSitemapResponse(await getBlogSitemapPages(), { noindex: true });
}
