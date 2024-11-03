export const enNavbarConfig = [
  {
    text: "Group1",
    link: "guide/interface/icon.md",
  },
  {
    text: "Group2",
    link: "guide/interface/others.md",
  },
  {
    text: 'Group',
    prefix: 'guide/',
    children: [
      {
        text: 'SubGroup1',
        prefix: 'intro/',
        children: [
          'install.md', // 解析为 `/guide/group/sub1/bar.md`
          'intro.md', // 解析为 `/guide/group/sub1/bar.md`
        ],
      }
    ],
  },
]