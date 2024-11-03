export const zhNavbarConfig = [
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
  {
    text: '组',
    prefix: '/zh/guide/',
    children: [
      {
        text: '组1',
        prefix: 'interface/',
        children: [
          'icon.md', // 解析为 `/guide/group/sub1/bar.md`
          'others.md', // 解析为 `/guide/group/sub1/bar.md`
        ],
      }
    ],
  },
]