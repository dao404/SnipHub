import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader
} from 'vitepress-plugin-group-icons'
import { enConfig } from './config/en'
import { zhConfig } from './config/zh'
import { shared } from './config/shared'

export default defineConfig({
  title: 'SnipHub',
  description: 'VS Code Snippet Manager',

  rewrites: {
    'en/:rest*': ':rest*'
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'VS Code Snippet Manager',
      themeConfig: enConfig
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: 'VS Code 代码片段管理器',
      themeConfig: zhConfig
    }
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    ...shared.markdown,
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const { localeIndex = 'root' } = env
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case 'zh':
              return '复制代码'
            default:
              return 'Copy code'
          }
        })()
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`
        )
      }
      md.use(groupIconMdPlugin)
    }
  },

  sitemap: {
    hostname: 'https://frank6.com',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  head: shared.head,
  themeConfig: {
    ...shared.themeConfig,
    sidebar: {
      '/guide/': enConfig.sidebar['/guide/'],
      '/zh/': zhConfig.sidebar['/zh/guide/']
    }
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          sniphub: localIconLoader(
            import.meta.url,
            '../public/sniphub-logo.svg'
          )
        }
      })
    ]
  }
})