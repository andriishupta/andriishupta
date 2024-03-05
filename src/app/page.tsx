import {marketingConfig} from "@/config/marketing";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {MainNav} from "@/components/main-nav";
import {SiteFooter} from "@/components/site-footer";
import {siteConfig} from "@/config/site";
import {ModeToggle} from "@/components/mode-toggle";
import {Github, Twitter} from "lucide-react";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav}/>
          <nav>
            <ModeToggle/>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 justify-center items-center">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Hello 👋, I am <span className="text-accent-foreground">{siteConfig.authorName}</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {siteConfig.shortDescription}
            </p>
            <div className="space-x-4">
              <Link
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({variant: "outline", size: "lg"}))}>
                <Twitter/>
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({variant: "outline", size: "lg"}))}
              >
                <Github/>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter/>
    </div>
  );
}
