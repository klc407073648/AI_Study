export const zhNavbarConfig = [
  {
    text: "Group1",
    link: "/zh/guide/interface/icon.md",
  },
  {
    text: "Group2",
    link: "/zh/guide/interface/others.md",
  },
  {
    text: 'Group',
    prefix: '/zh/guide/',
    children: [
      {
        text: 'SubGroup1',
        prefix: 'intro/',
        children: [
          'install.md', // 解析为 `/zh/guide/group/sub1/bar.md`
          'intro.md', // 解析为 `/zh/guide/group/sub1/bar.md`
        ],
      }
    ],
  },
]