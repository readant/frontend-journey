import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Frontend Journey',
  description: '前端学习笔记 - 从零开始的前端学习旅程',
  titleTemplate: (pageTitle, siteTitle) => pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle,

  // GitHub Pages 部署配置
  base: '/frontend-journey/',

  // 忽略死链接检查（静态资源链接无法在构建时验证）
  ignoreDeadLinks: true,

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '准备阶段', link: '/00-preparation/' },
      { text: 'HTML', link: '/01-html/' },
      { text: 'CSS', link: '/02-css/' },
    ],

    // 侧边栏
    sidebar: {
      '/00-preparation/': [
        {
          text: '基础准备',
          items: [
            { text: '概览', link: '/00-preparation/' },
            { text: '环境搭建', link: '/00-preparation/01-environment-setup/' },
            { text: '逻辑思维', link: '/00-preparation/02-logic-thinking/' },
            { text: '通用工具', link: '/00-preparation/03-common-tools/' },
          ]
        }
      ],
      '/01-html/': [
        {
          text: 'HTML 学习',
          items: [
            { text: '概览', link: '/01-html/' },
            { text: '基础入门', link: '/01-html/01-basics/' },
            { text: '语义化标签', link: '/01-html/02-advanced/' },
            { text: '表单元素', link: '/01-html/03-forms/' },
            { text: '多媒体标签', link: '/01-html/04-media/' },
            { text: '实战项目', link: '/01-html/05-projects/' },
          ]
        }
      ],
      '/02-css/': [
        {
          text: 'CSS 核心知识体系',
          items: [
            { text: '概览', link: '/02-css/' },
            { text: '基础语法与机制', link: '/02-css/01-basics/' },
            { text: '选择器', link: '/02-css/02-selectors/' },
            { text: '盒子模型', link: '/02-css/03-box-model/' },
            { text: '布局与定位', link: '/02-css/04-layout-positioning/' },
            { text: '视觉样式与美化', link: '/02-css/05-visual-styling/' },
            { text: '变换与动画', link: '/02-css/06-transform-animation/' },
            { text: '响应式设计', link: '/02-css/07-responsive/' },
            { text: '工程化与现代 CSS', link: '/02-css/08-modern-css/' },
            { text: '设计模式与实战', link: '/02-css/09-design-patterns/' },
          ]
        }
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/readant/frontend-journey' }
    ],

    // 搜索
    search: {
      provider: 'local'
    },

    // 页脚
    footer: {
      message: '前端学习笔记',
      copyright: 'MIT License'
    }
  }
})
