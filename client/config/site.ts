export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "RLY",
  description: "Message freely. End to end encrypted chat. No accounts.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Sims",
      href: "/sims",
    },
  ],
  navMenuItems: [
    {
      label: "Sims",
      href: "/sims",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
