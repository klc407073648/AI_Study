// region config
export const zhSidebarConfig = {
  '/zh/guide/': [
    {
      text: '指南',
      // 相对路径会自动追加子路径前缀
      collapsible: true,
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
  ],
  '/zh/interface/': [
    {
      text: '接口',
      // 相对路径会自动追加子路径前缀
      collapsible: true,
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
  ],
  // '/zh/interface/icon.md': 'interface-icon',
  // '/zh/interface/others.md': 'interface-others',
}
