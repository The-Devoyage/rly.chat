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
    {
      label: "Chat",
      href: "/chat",
    },
  ],
  navMenuItems: [
    {
      label: "Sims",
      href: "/sims",
    },
    {
      label: "Chat",
      href: "/chat",
    },
  ],
  links: {
    github: "https://github.com/the-devoyage/rly.chat",
  },
};
