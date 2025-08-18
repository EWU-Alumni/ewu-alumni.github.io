export default {
  title: "EWU Alumni List",
  description: "Official directory of East West University alumni",
  base: "/",
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#10b981" }],
    ["meta", { name: "og:type", content: "website" }],
    ["meta", { name: "og:locale", content: "en" }],
    ["meta", { name: "og:site_name", content: "EWU Alumni Directory" }],
    ["meta", { name: "og:image", content: "/og-image.png" }],
  ],

  themeConfig: {
    logo: "/logo.png",

    nav: [
      { text: "Home", link: "/" },
      { text: "Add Alumni", link: "https://forms.gle/eR5jCbYG5ZKZL32W7" },
      { text: "Contact", link: "/contact" },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/ewu-alumni/ewu-alumni.github.io",
      },
    ],

    editLink: {
      pattern:
        "https://github.com/ewu-alumni/ewu-alumni.github.io/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
  },

  markdown: {
    theme: "github-dark",
    lineNumbers: true,
  },

  sitemap: {
    hostname: "https://ewu-alumni.github.io/",
  },
};
