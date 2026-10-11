// region config
export const enSidebarConfig = {
  '/guide/': [
    {
      text: 'Guide',
      // 相对路径会自动追加子路径前缀
      collapsible: true,
      children: [
        {
          text: 'Guide Content',
          prefix: 'intro/',
          children: [
            {
              text: "Install",
              link: "install",
            },
            {
              text: "Intro",
              link: "intro",
            },
          ],
        }
      ],
    },
  ],
  '/interface/': [
    {
      text: 'Interface',
      // 相对路径会自动追加子路径前缀
      collapsible: true,
      children: [
        {
          text: 'Interface Content',
          prefix: 'intro/',
          children: [
            {
              text: "Icon",
              link: "icon.md",
            },
            {
              text: "Others",
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