import {
  createSitemapResponse,
  getPortfolioSitemapPages,
} from "../../lib/sitemap";

export const prerender = true;

export async function GET() {
  return createSitemapResponse(await getPortfolioSitemapPages(), {
    noindex: true,
  });
}
