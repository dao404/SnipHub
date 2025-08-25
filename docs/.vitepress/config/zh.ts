import type { DefaultTheme } from "vitepress";

export const zhConfig: DefaultTheme.Config = {
  nav: [
    {
      text: "指南",
      link: "/zh/guide/what-is-sniphub",
      activeMatch: "/zh/guide/",
    },
    {
      text: "参考",
      link: "/zh/reference/site-config",
      activeMatch: "/zh/reference/",
    },
    {
      text: "v0.0.1",
      items: [
        {
          text: "更新日志",
          link: "https://github.com/dao404/SnipHub/blob/main/CHANGELOG.md",
        },
        {
          text: "参与贡献",
          link: "https://github.com/dao404/SnipHub/blob/main/.github/contributing.md",
        },
        {
          text: "未来计划",
          link: "/zh/guide/future-plans",
        },
      ],
    },
  ],

  sidebar: {
    "/zh/guide/": [
      {
        text: "简介",
        collapsed: false,
        items: [
          { text: "什么是 SnipHub？", link: "/zh/guide/what-is-sniphub" },
          { text: "快速开始", link: "/zh/guide/getting-started" },
        ],
      },
      {
        text: "功能",
        collapsed: false,
        items: [
          { text: "快速保存片段", link: "/zh/guide/create" },
          { text: "便捷应用片段", link: "/zh/guide/apply" },
          { text: "关于片段文件", link: "/zh/guide/snip" },
        ],
      },
      {
        text: "其它",
        collapsed: false,
        items: [
          { text: "常见问题", link: "/zh/guide/faq" },
          { text: "未来计划", link: "/zh/guide/future-plans" },
          { text: "反馈", link: "https://github.com/dao404/SnipHub/issues" },
        ],
      },
    ],
  },

  search: {
    provider: "local",
    options: {
      placeholder: "搜索文档",
      translations: {
        button: {
          buttonText: "搜索文档",
          buttonAriaLabel: "搜索文档",
        },
        modal: {
          searchBox: {
            clearButtonTitle: "清除查询条件",
            clearButtonAriaLabel: "清除查询条件",
            closeButtonText: "关闭",
            closeButtonAriaLabel: "关闭",
            placeholderText: "搜索文档",
            placeholderTextAskAi: "向 AI 提问：",
            placeholderTextAskAiStreaming: "回答中...",
            searchInputLabel: "搜索",
            backToKeywordSearchButtonText: "返回关键字搜索",
            backToKeywordSearchButtonAriaLabel: "返回关键字搜索",
          },
          startScreen: {
            recentSearchesTitle: "搜索历史",
            noRecentSearchesText: "没有搜索历史",
            saveRecentSearchButtonTitle: "保存至搜索历史",
            removeRecentSearchButtonTitle: "从搜索历史中移除",
            favoriteSearchesTitle: "收藏",
            removeFavoriteSearchButtonTitle: "从收藏中移除",
            recentConversationsTitle: "最近的对话",
            removeRecentConversationButtonTitle: "从历史记录中删除对话",
          },
          errorScreen: {
            titleText: "无法获取结果",
            helpText: "你可能需要检查你的网络连接",
          },
          noResultsScreen: {
            noResultsText: "无法找到相关结果",
            suggestedQueryText: "你可以尝试查询",
            reportMissingResultsText: "你认为该查询应该有结果？",
            reportMissingResultsLinkText: "点击反馈",
          },
          resultsScreen: {
            askAiPlaceholder: "向 AI 提问： ",
          },
          askAiScreen: {
            disclaimerText: "答案由 AI 生成，可能不准确，请自行验证。",
            relatedSourcesText: "相关来源",
            thinkingText: "思考中...",
            copyButtonText: "复制",
            copyButtonCopiedText: "已复制！",
            copyButtonTitle: "复制",
            likeButtonTitle: "赞",
            dislikeButtonTitle: "踩",
            thanksForFeedbackText: "感谢你的反馈！",
            preToolCallText: "搜索中...",
            duringToolCallText: "搜索 ",
            afterToolCallText: "已搜索",
            aggregatedToolCallText: "已搜索",
          },
          footer: {
            selectText: "选择",
            submitQuestionText: "提交问题",
            selectKeyAriaLabel: "Enter 键",
            navigateText: "切换",
            navigateUpKeyAriaLabel: "向上箭头",
            navigateDownKeyAriaLabel: "向下箭头",
            closeText: "关闭",
            backToSearchText: "返回搜索",
            closeKeyAriaLabel: "Esc 键",
            poweredByText: "搜索提供者",
          },
        },
      },
    },
  },

  docFooter: {
    prev: "上一页",
    next: "下一页",
  },

  outline: {
    label: "页面导航",
  },

  lastUpdated: {
    text: "最后更新于",
  },

  editLink: {
    pattern: "https://github.com/dao404/SnipHub/edit/main/docs/:path",
    text: "在 GitHub 上编辑此页面",
  },

  footer: {
    message: "基于 MIT 许可发布",
    copyright: `版权所有 © 2023-${new Date().getFullYear()} SnipHub`,
  },
};
