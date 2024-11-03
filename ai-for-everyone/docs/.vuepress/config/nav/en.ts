export const enNavbarConfig = [
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
  {
    text: 'Group',
    prefix: 'guide/',
    children: [
      {
        text: 'SubGroup1',
        prefix: 'interface/',
        children: [
          'icon.md', // 解析为 `/guide/group/sub1/bar.md`
          'others.md', // 解析为 `/guide/group/sub1/bar.md`
        ],
      }
    ],
  },
]