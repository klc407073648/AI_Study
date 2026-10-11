export const zhNavbarConfig = [
  {
    text: '指南',
    prefix: '/zh/guide/',
    children: [
      {
        text: '指南内容',
        prefix: 'intro/',
        children: [
          {
            text: "安装",
            link: "install",
          },
          {
            text: "介绍",
            link: "intro",
          },
        ],
      }
    ],
  },
  {
    text: '接口',
    prefix: '/zh/interface/',
    children: [
      {
        text: '接口内容',
        prefix: 'intro/',
        children: [
          {
            text: "图标",
            link: "icon.md",
          },
          {
            text: "其他",
            link: "others.md",
          },
        ],
      }
    ],
  },
]