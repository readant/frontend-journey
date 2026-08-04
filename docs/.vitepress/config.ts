import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
import path from 'path'

export default defineConfig({
  title: 'Frontend Journey',
  description: '前端学习笔记 - 从零开始的前端学习旅程',

  // GitHub Pages 部署配置
  base: '/frontend-journey/',

  // 忽略死链接检查（静态资源链接无法在构建时验证）
  ignoreDeadLinks: true,

  // Markdown 配置：集成 vitepress-demo-plugin 交互式演示插件
  // 插件支持 vue/react/html 三种 demo 的代码展示 + 实时预览
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin, {
        // demoDir: 指定 demo 文件的根目录，配置后 <demo> 标签可使用相对该目录的路径
        demoDir: path.resolve(__dirname, '../public/demos'),
      })
    },
  },

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '准备阶段', link: '/00-preparation/' },
      { text: 'HTML', link: '/01-html/' },
      { text: 'CSS', link: '/02-css/' },
      { text: '速查手册', link: '/cheatsheet/' },
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
            { text: '交互式演示示例', link: '/02-css/demo-showcase' },
          ]
        }
      ],
      '/cheatsheet/': [
        {
          text: '速查手册',
          items: [
            { text: '总览', link: '/cheatsheet/' },
            {
              text: '布局 layout',
              collapsed: false,
              items: [
                { text: 'Flex 布局', link: '/cheatsheet/layout/flex' },
                { text: 'Grid 布局', link: '/cheatsheet/layout/grid' },
                { text: '定位与层级', link: '/cheatsheet/layout/position' },
                { text: '浮动与清除', link: '/cheatsheet/layout/float' },
                { text: '水平垂直居中', link: '/cheatsheet/layout/centering' },
              ]
            },
            {
              text: '样式 style',
              collapsed: false,
              items: [
                { text: '选择器与权重', link: '/cheatsheet/style/selector' },
                { text: '盒模型', link: '/cheatsheet/style/box-model' },
                { text: '字体与单位', link: '/cheatsheet/style/typography' },
                { text: '背景与视觉美化', link: '/cheatsheet/style/visual' },
                { text: '响应式设计', link: '/cheatsheet/style/responsive' },
                { text: 'CSS 工程化', link: '/cheatsheet/style/engineering' },
              ]
            },
            {
              text: '动效 effect',
              collapsed: false,
              items: [
                { text: '过渡 transition', link: '/cheatsheet/effect/transition' },
                { text: '关键帧动画', link: '/cheatsheet/effect/animation' },
                { text: '变换 transform', link: '/cheatsheet/effect/transform' },
              ]
            },
            {
              text: 'HTML',
              collapsed: false,
              items: [
                { text: '语义化标签', link: '/cheatsheet/html/semantic' },
                { text: '表单与交互', link: '/cheatsheet/html/forms' },
                { text: '多媒体与 Canvas', link: '/cheatsheet/html/media' },
              ]
            },
            {
              text: '工具 tools',
              collapsed: false,
              items: [
                { text: 'Git', link: '/cheatsheet/tools/git' },
                { text: 'npm', link: '/cheatsheet/tools/npm' },
                { text: '命令行与调试', link: '/cheatsheet/tools/cli' },
              ]
            },
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
