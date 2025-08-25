import type { HeadConfig } from 'vitepress'

export const shared = {
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/sniphub-logo.svg',
        media: '(prefers-color-scheme: light)'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/sniphub-logo-dark.svg',
        media: '(prefers-color-scheme: dark)'
      }
    ],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SnipHub' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'sniphub-logo.jpg'
      }
    ],
    ['meta', { property: 'og:url', content: 'https://github.com/dao404/SnipHub/' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'AZBRSFGG',
        'data-spa': 'auto',
        defer: ''
      }
    ]
  ] as HeadConfig[],

  markdown: {
    math: true,
    codeTransformers: [
      {
        postprocess(code: string) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ]
  },

  themeConfig: {
    logo: {
      light: '/sniphub-logo.svg',
      dark: '/sniphub-logo-dark.svg',
      alt: 'SnipHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dao404/SnipHub' }
    ],

    search: {
      provider: 'local'
    }
  }
}
