import type { DefaultTheme } from 'vitepress'

export const enConfig: DefaultTheme.Config = {
  nav: [
    { text: 'Guide', link: '/guide/what-is-sniphub' },
    { text: 'Reference', link: '/reference/api' },
    {
      text: 'v0.0.1',
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/dao404/SnipHub/blob/main/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/dao404/SnipHub/blob/main/.github/contributing.md'
        }
      ]
    }
  ],

  sidebar: {
    '/guide/': [
      {
        text: 'Introduction',
        items: [
          { text: 'What is SnipHub?', link: '/guide/what-is-sniphub' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      }
    ]
  },

  footer: {
    message: 'Released under the MIT License.',
    copyright: `Copyright © 2025-${new Date().getFullYear()} SnipHub`
  },

  editLink: {
    pattern: 'https://github.com/dao404/SnipHub/edit/main/docs/:path',
    text: 'Edit this page on GitHub'
  }
}
