export type SiteConfig = {
  siteName: string
  author: string
  authorName: string
  description: string
  shortDescription: string
  domain: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type NavItem = {
  title: string
  href: string
  target?: '_blank'
  disabled?: boolean
}

export type MainNavItem = NavItem