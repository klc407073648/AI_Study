import { blogPlugin } from "@vuepress/plugin-blog";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

//plugin
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { seoPlugin } from "@vuepress/plugin-seo";
import { baiduAnalyticsPlugin } from "@vuepress/plugin-baidu-analytics";
import { backToTopPlugin } from "@vuepress/plugin-back-to-top";
import { copyrightPlugin } from "@vuepress/plugin-copyright";
import { noticePlugin } from "@vuepress/plugin-notice";
import { photoSwipePlugin } from "@vuepress/plugin-photo-swipe";
import { defineWatermarkConfig } from "@vuepress/plugin-watermark/client"; ///TODO
import { pwaPlugin } from "@vuepress/plugin-pwa";
import { redirectPlugin } from "@vuepress/plugin-redirect";
//plugin

export default defineUserConfig({
  locales: {
    "/": {
      lang: "en-US",
      title: "VuePress",
      description: "My first VuePress Site",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "博客演示",
      description: "vuepress-theme-hope 的博客演示",
    },
  },
  theme: defaultTheme({
    logo: "https://vuejs.press/images/hero.png",
    locales: {
      "/": {
        selectLanguageText: "English",
        selectLanguageName: "English",
        navbar: [
          "/",
          {
            text: "Article",
            link: "/article/",
          },
          {
            text: "Category",
            link: "/category/",
          },
          {
            text: "Tag",
            link: "/tag/",
          },
          {
            text: "Timeline",
            link: "/timeline/",
          },
        ],
      },
      "/zh/": {
        selectLanguageText: "简体中文",
        selectLanguageName: "简体中文",
        navbar: [
          "/zh",
          {
            text: "Article",
            link: "/article/",
          },
          {
            text: "Category",
            link: "/category/",
          },
          {
            text: "Tag",
            link: "/tag/",
          },
          {
            text: "Timeline",
            link: "/timeline/",
          },
        ],
      },
    },
  }),

  plugins: [
    docsearchPlugin({
      appId: "<APP_ID>", ///TODO https://ecosystem.vuejs.press/zh/plugins/search/docsearch.html#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95
      apiKey: "<API_KEY>",
      indexName: "<INDEX_NAME>",
      locales: {
        "/": {
          placeholder: "Search Documentation",
          translations: {
            button: {
              buttonText: "Search Documentation",
            },
          },
        },
        "/zh/": {
          placeholder: "搜索文档",
          translations: {
            button: {
              buttonText: "搜索文档",
            },
          },
        },
      },
    }),
    seoPlugin({ hostname: "111" }),
    baiduAnalyticsPlugin({ id: "111" }),
    backToTopPlugin(),
    copyrightPlugin({
      // options
    }),
    noticePlugin({
      config: [
        {
          path: "/",
          title: "Notice Title",
          content: "Notice Content",
          actions: [
            {
              text: "Primary Action",
              link: "https://theme-hope.vuejs.press/",
              type: "primary",
            },
            { text: "Default Action" },
          ],
        },
        {
          path: "/zh/",
          title: "Notice Title",
          content: "Notice Content",
          actions: [
            {
              text: "Primary Action",
              link: "https://theme-hope.vuejs.press/",
              type: "primary",
            },
            { text: "Default Action" },
          ],
        },
      ],
    }),
    photoSwipePlugin({}),
    pwaPlugin({
      // 选项
    }),
    redirectPlugin({
      localeConfig: {
        "/": ["en-US", "en-UK", "en"],
        "/zh/": ["zh-CN", "zh-TW", "zh"],
      },
    }),
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith("posts/") : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || "",
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === "string"
            ? frontmatter.excerpt
            : data?.excerpt || "",
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== "string",

      category: [
        {
          key: "category",
          getter: (page) => page.frontmatter.category || [],
          layout: "Category",
          itemLayout: "Category",
          frontmatter: () => ({
            title: "Categories",
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
        {
          key: "tag",
          getter: (page) => page.frontmatter.tag || [],
          layout: "Tag",
          itemLayout: "Tag",
          frontmatter: () => ({
            title: "Tags",
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: "article",
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: "Article",
          frontmatter: () => ({
            title: "Articles",
            sidebar: false,
          }),
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky;

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
              return -1;

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1;

            if (!pageB.frontmatter.date) return 1;
            if (!pageA.frontmatter.date) return -1;

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            );
          },
        },
        {
          key: "timeline",
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: "Timeline",
          frontmatter: () => ({
            title: "Timeline",
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
  ],

  bundler: viteBundler(),
});
