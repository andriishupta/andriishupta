import {MarketingConfig} from "@/types/app";
import {siteConfig} from "@/config/site";

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Blog",
      href: `https://blog.${siteConfig.domain}`,
      target: '_blank'
    },
  ],
}