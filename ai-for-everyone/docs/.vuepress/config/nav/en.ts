export const enNavbarConfig = [
  {
    text: 'Guide',
    prefix: '/guide/',
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
  {
    text: 'Interface',
    prefix: '/zh/interface/',
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
]