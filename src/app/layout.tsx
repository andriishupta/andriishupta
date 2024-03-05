import {PropsWithChildren} from "react";
import {Inter as FontSans} from "next/font/google"
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {cn} from "@/lib/utils";
import {siteConfig} from "@/config/site";
import {Metadata, Viewport} from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const viewport: Viewport = {
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "white"},
    {media: "(prefers-color-scheme: dark)", color: "black"},
  ],
}


export const metadata: Metadata = {
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.domain}`,
  },
  description: siteConfig.description,
  keywords: [
    "Andrii Shupta",
    "andriishupta",
    "javascript expert",
    "typescript expert",
    "full stack web",
    "full stack developer",
    "full stack expert",
    "full stack engineer",
    "front-end web",
    "front-end developer",
    "front-end expert",
    "front-end engineer",
    "back-end web",
    "back-end developer",
    "back-end expert",
    "back-end engineer",
    "MVP",
    "MVP development",
    "build MVP",
    "build MVP fast",
    "create MVP",
    "create MVP fast",
    "start-up",
    "start-up development",
    "build start-up",
    "build start-up fast",
    "create start-up",
    "create start-up fast",
    "app",
    "app development",
    "build app",
    "build app fast",
    "create app",
    "create app fast",
    "website",
    "website development",
    "build website",
    "build website fast",
    "create website",
    "create website fast",
    "hide developer hourly",
    "hide developer for a month",
    "hire developer Ukraine",
    "hire developer Ukraine Upwork",
    "Next.js",
    "Next.js expert",
    "Next.js App Router",
    "Next.js 14",
    "React.js",
    "React.js expert",
    "Node.js",
    "Node.js expert",
    "NestJS",
    "NestJS expert",
    "Supabase",
    "Supabase expert",
    "Tailwind CSS",
    "Tailwind expert",
  ],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.siteName,
    description: siteConfig.description,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.author}`,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
    <body className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    </body>
    </html>
  );
}
