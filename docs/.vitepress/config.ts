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

  // 预构建 markmap 相关依赖（d3 等 CJS 模块需要 Vite 处理）
  vite: {
    optimizeDeps: {
      include: ['markmap-lib', 'markmap-view', 'd3'],
    },
  },

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
      { text: 'JavaScript', link: '/03-js/' },
      { text: '思维导图', link: '/02-css/mindmap/' },
      { text: '速查手册', link: '/cheatsheet/' },
    ],

    // 侧边栏：全局三分区结构（学习之路 → 速查补给站 → 实战项目）
    sidebar: {
      '/': [
        {
          // 顶部区域：核心学习路线
          text: '📚 学习之路',
          items: [
            { text: 'HTML 学习', link: '/01-html/' },
            { text: 'CSS 学习', link: '/02-css/' },
            { text: 'JavaScript 学习', link: '/03-js/' },
          ]
        },
        {
          // 中部区域：速查补给站（layout / style / data 三大分类）
          text: '⚡ 速查补给站',
          items: [
            { text: '速查总览', link: '/cheatsheet/' },
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
              text: '数据与 JS data',
              collapsed: false,
              items: [
                { text: '变量与类型', link: '/cheatsheet/data/variable-type' },
                { text: '函数与闭包', link: '/cheatsheet/data/function-closure' },
                { text: '对象与原型', link: '/cheatsheet/data/object-prototype' },
                { text: '数组方法', link: '/cheatsheet/data/array-unique' },
                { text: '异步与 Promise', link: '/cheatsheet/data/promise' },
                { text: 'ES 模块', link: '/cheatsheet/data/module' },
                { text: '错误与调试', link: '/cheatsheet/data/error-debug' },
              ]
            },
          ]
        },
        {
          // 底部区域：实战项目
          text: '🚀 实战项目',
          items: [
            { text: '项目总览', link: '/projects/' },
          ]
        },
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
