import { createSitemapResponse, getRootSitemapPages } from "../lib/sitemap";

export async function GET() {
  return createSitemapResponse(await getRootSitemapPages());
}
