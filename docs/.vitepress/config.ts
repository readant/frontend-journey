import { defineConfig } from "vitepress";
import { vitepressDemoPlugin } from "vitepress-demo-plugin";
import path from "path";

export default defineConfig({
  title: "Frontend Journey",
  description: "前端学习笔记 - 从零开始的前端学习旅程",

  // GitHub Pages 部署配置
  base: "/frontend-journey/",

  // 忽略死链接检查（静态资源链接无法在构建时验证）
  ignoreDeadLinks: true,

  // 预构建 markmap 相关依赖（d3 等 CJS 模块需要 Vite 处理）
  vite: {
    optimizeDeps: {
      include: ["markmap-lib", "markmap-view", "d3"],
    },
  },

  // Markdown 配置：集成 vitepress-demo-plugin 交互式演示插件
  // 插件支持 vue/react/html 三种 demo 的代码展示 + 实时预览
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin, {
        // demoDir: 指定 demo 文件的根目录，配置后 <demo> 标签可使用相对该目录的路径
        demoDir: path.resolve(__dirname, "../public/demos"),
      });
    },
  },

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "准备阶段", link: "/00-preparation/" },
      { text: "HTML", link: "/01-html/" },
      { text: "CSS", link: "/02-css/" },
      { text: "JavaScript", link: "/03-js/" },
      {
        text: "思维导图",
        items: [
          { text: "HTML 思维导图", link: "/01-html/mindmap/" },
          { text: "CSS 思维导图", link: "/02-css/mindmap/" },
          { text: "JavaScript 思维导图", link: "/03-js/mindmap/" },
        ],
      },
      { text: "速查手册", link: "/cheatsheet/" },
      { text: "知识星盘", link: "/3-reference/" },
    ],

    // 侧边栏：分区结构（学习之路 → 速查补给站 → 参考层 → 实战项目）
    sidebar: {
      "/": [
        {
          // 顶部区域：核心学习路线
          text: "📚 学习之路",
          items: [
            {
              // HTML 按 5 章展开
              text: "HTML 学习",
              collapsed: false,
              items: [
                { text: "HTML 学习总览", link: "/01-html/" },
                { text: "01 文档结构", link: "/01-html/01-document-structure/" },
                { text: "02 语义化标签", link: "/01-html/02-semantic-tags/" },
                { text: "03 表单与验证", link: "/01-html/03-forms-validation/" },
                { text: "04 音视频与图片", link: "/01-html/04-media-assets/" },
                { text: "05 SEO 与可访问性", link: "/01-html/05-seo-a11y/" },
                { text: "🧠 思维导图", link: "/01-html/mindmap/" },
              ],
            },
            {
              // CSS 按 9 章展开，另含思维导图入口
              text: "CSS 学习",
              collapsed: false,
              items: [
                { text: "CSS 学习总览", link: "/02-css/" },
                { text: "01 基础语法与机制", link: "/02-css/01-basics/" },
                { text: "02 选择器", link: "/02-css/02-selectors/" },
                { text: "03 盒子模型", link: "/02-css/03-box-model/" },
                { text: "04 布局与定位", link: "/02-css/04-layout-positioning/" },
                { text: "05 视觉样式与美化", link: "/02-css/05-visual-styling/" },
                { text: "06 变换与动画", link: "/02-css/06-transform-animation/" },
                { text: "07 响应式设计", link: "/02-css/07-responsive/" },
                { text: "08 工程化与现代 CSS", link: "/02-css/08-modern-css/" },
                { text: "09 设计模式与问题解决", link: "/02-css/09-design-patterns/" },
                { text: "🧠 思维导图", link: "/02-css/mindmap/" },
              ],
            },
            {
              // JavaScript 按 8 章展开，每章含细分子页面
              text: "JavaScript 学习",
              collapsed: false,
              items: [
                { text: "JS 学习总览", link: "/03-js/" },
                {
                  text: "01 变量与基础",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/01-foundation/" },
                    { text: "初识 JavaScript", link: "/03-js/01-foundation/01-javascript-intro" },
                    { text: "如何运行 JavaScript", link: "/03-js/01-foundation/02-how-to-run" },
                    { text: "程序的基本结构", link: "/03-js/01-foundation/03-program-structure" },
                    { text: "交互方式", link: "/03-js/01-foundation/04-interaction" },
                    { text: "变量声明", link: "/03-js/01-foundation/05-variables" },
                    { text: "数据类型", link: "/03-js/01-foundation/06-data-types" },
                    { text: "类型转换", link: "/03-js/01-foundation/07-type-conversion" },
                    { text: "表达式与运算符", link: "/03-js/01-foundation/08-operators" },
                  ],
                },
                {
                  text: "02 函数与闭包",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/02-functions/" },
                    { text: "01 函数定义与调用", link: "/03-js/02-functions/01-define-functions" },
                    { text: "02 参数传递", link: "/03-js/02-functions/02-parameters" },
                    { text: "03 返回值", link: "/03-js/02-functions/03-return-value" },
                    { text: "04 箭头函数", link: "/03-js/02-functions/04-arrow-functions" },
                    { text: "05 作用域与词法环境", link: "/03-js/02-functions/05-scope" },
                    { text: "06 闭包", link: "/03-js/02-functions/06-closure" },
                    { text: "07 this 绑定", link: "/03-js/02-functions/07-this-binding" },
                    { text: "08 阶梯练习", link: "/03-js/02-functions/08-exercises" },
                  ],
                },
                {
                  text: "03 对象与原型",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/03-objects/" },
                    { text: "对象创建与属性", link: "/03-js/03-objects/01-create-objects" },
                    { text: "原型链", link: "/03-js/03-objects/02-prototype-chain" },
                    { text: "class 语法", link: "/03-js/03-objects/03-class-syntax" },
                    { text: "深浅拷贝", link: "/03-js/03-objects/04-copy-objects" },
                  ],
                },
                {
                  text: "04 数组与方法",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/04-arrays/" },
                    { text: "增删改查", link: "/03-js/04-arrays/01-basic-operations" },
                    { text: "map/filter/reduce", link: "/03-js/04-arrays/02-higher-order" },
                    { text: "遍历与迭代", link: "/03-js/04-arrays/03-iteration" },
                    { text: "实战模式", link: "/03-js/04-arrays/04-practical-patterns" },
                  ],
                },
                {
                  text: "05 异步编程",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/05-async/" },
                    { text: "事件循环", link: "/03-js/05-async/01-event-loop" },
                    { text: "Promise", link: "/03-js/05-async/02-promise" },
                    { text: "async/await", link: "/03-js/05-async/03-async-await" },
                    { text: "fetch 与并发", link: "/03-js/05-async/04-fetch-concurrency" },
                  ],
                },
                {
                  text: "06 DOM 操作与事件",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/06-dom-api/" },
                    { text: "查询与遍历", link: "/03-js/06-dom-api/01-query-dom" },
                    { text: "修改节点", link: "/03-js/06-dom-api/02-modify-dom" },
                    { text: "事件机制", link: "/03-js/06-dom-api/03-events" },
                    { text: "事件委托", link: "/03-js/06-dom-api/04-event-delegation" },
                  ],
                },
                {
                  text: "07 ES 模块",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/07-es-modules/" },
                    { text: "export/import", link: "/03-js/07-es-modules/01-export-import" },
                    { text: "模块机制", link: "/03-js/07-es-modules/02-module-mechanism" },
                    { text: "ESM vs CommonJS", link: "/03-js/07-es-modules/03-esm-vs-cjs" },
                  ],
                },
                {
                  text: "08 错误处理与调试",
                  collapsed: true,
                  items: [
                    { text: "章节总览", link: "/03-js/08-error-debug/" },
                    { text: "错误基础", link: "/03-js/08-error-debug/01-error-basics" },
                    { text: "错误处理", link: "/03-js/08-error-debug/02-error-handling" },
                    { text: "调试方法论", link: "/03-js/08-error-debug/03-debugging" },
                  ],
                },
                { text: "🧠 思维导图", link: "/03-js/mindmap/" },
              ],
            },
          ],
        },
        {
          // 中部区域：速查补给站（layout / style / data 三大分类）
          text: "⚡ 速查补给站",
          items: [
            { text: "速查总览", link: "/cheatsheet/" },
            {
              text: "布局 layout",
              collapsed: true,
              items: [
                { text: "Flex 布局", link: "/cheatsheet/layout/flex" },
                { text: "Grid 布局", link: "/cheatsheet/layout/grid" },
                { text: "定位与层级", link: "/cheatsheet/layout/position" },
                { text: "浮动与清除", link: "/cheatsheet/layout/float" },
                { text: "水平垂直居中", link: "/cheatsheet/layout/centering" },
              ],
            },
            {
              text: "样式 style",
              collapsed: true,
              items: [
                { text: "选择器与权重", link: "/cheatsheet/style/selector" },
                { text: "盒模型", link: "/cheatsheet/style/box-model" },
                { text: "字体与单位", link: "/cheatsheet/style/typography" },
                { text: "背景与视觉美化", link: "/cheatsheet/style/visual" },
                { text: "响应式设计", link: "/cheatsheet/style/responsive" },
                { text: "CSS 工程化", link: "/cheatsheet/style/engineering" },
              ],
            },
            {
              text: "数据与 JS data",
              collapsed: true,
              items: [
                { text: "变量与类型", link: "/cheatsheet/data/variable-type" },
                { text: "函数与闭包", link: "/cheatsheet/data/function-closure" },
                { text: "对象与原型", link: "/cheatsheet/data/object-prototype" },
                { text: "数组方法", link: "/cheatsheet/data/array-unique" },
                { text: "异步与 Promise", link: "/cheatsheet/data/promise" },
                { text: "ES 模块", link: "/cheatsheet/data/module" },
                { text: "错误与调试", link: "/cheatsheet/data/error-debug" },
              ],
            },
          ],
        },
        {
          // 参考层：手册优先（内容本体）→ 场景索引（快速入口）→ 代码骨架（成品片段）→ 星盘（可视化导航）
          text: "🕊️ 参考层",
          items: [
            { text: "🕊️ 知识星盘", link: "/3-reference/" },
            { text: "参考层总览", link: "/3-reference/intro" },
            {
              text: "📖 知识手册",
              collapsed: true,
              items: [
                {
                  text: "HTML 手册",
                  collapsed: true,
                  items: [
                    { text: "HTML 总览", link: "/3-reference/1-handbook/html/" },
                    { text: "文档结构", link: "/3-reference/1-handbook/html/" },
                    { text: "语义化标签", link: "/3-reference/1-handbook/html/semantic" },
                    { text: "表单与验证", link: "/3-reference/1-handbook/html/forms" },
                    { text: "音视频与图片", link: "/3-reference/1-handbook/html/media" },
                    { text: "SEO 与可访问性", link: "/3-reference/1-handbook/html/seo" },
                  ],
                },
                {
                  text: "CSS 手册",
                  collapsed: true,
                  items: [
                    { text: "CSS 总览", link: "/3-reference/1-handbook/css/" },
                    { text: "基础语法与机制", link: "/3-reference/1-handbook/css/basics" },
                    { text: "选择器", link: "/3-reference/1-handbook/css/selectors" },
                    { text: "盒模型", link: "/3-reference/1-handbook/css/box-model" },
                    {
                      text: "布局",
                      link: "/3-reference/1-handbook/css/layout",
                      collapsed: true,
                      items: [
                        { text: "布局总览", link: "/3-reference/1-handbook/css/layout" },
                        {
                          text: "文档流与定位",
                          link: "/3-reference/1-handbook/css/layout/position",
                        },
                        { text: "浮动 float", link: "/3-reference/1-handbook/css/layout/float" },
                        { text: "弹性布局 Flex", link: "/3-reference/1-handbook/css/layout/flex" },
                        { text: "网格布局 Grid", link: "/3-reference/1-handbook/css/layout/grid" },
                      ],
                    },
                    { text: "文字与字体", link: "/3-reference/1-handbook/css/typography" },
                    { text: "颜色与背景", link: "/3-reference/1-handbook/css/color-bg" },
                    { text: "过渡与动画", link: "/3-reference/1-handbook/css/animation" },
                    { text: "响应式", link: "/3-reference/1-handbook/css/responsive" },
                    { text: "移动 Web 适配", link: "/3-reference/1-handbook/css/mobile" },
                    { text: "现代 CSS 与工程化", link: "/3-reference/1-handbook/css/modern-css" },
                    { text: "设计模式与实战", link: "/3-reference/1-handbook/css/design-patterns" },
                  ],
                },
                {
                  text: "JS 手册",
                  collapsed: true,
                  items: [
                    { text: "JS 总览", link: "/3-reference/1-handbook/js/" },
                    { text: "变量与类型", link: "/3-reference/1-handbook/js/variables" },
                    { text: "运算符", link: "/3-reference/1-handbook/js/operators" },
                    { text: "函数", link: "/3-reference/1-handbook/js/functions" },
                    { text: "数组", link: "/3-reference/1-handbook/js/array" },
                    { text: "对象与原型", link: "/3-reference/1-handbook/js/object" },
                    { text: "闭包", link: "/3-reference/1-handbook/js/closure" },
                    { text: "异步", link: "/3-reference/1-handbook/js/async" },
                    { text: "DOM 操作", link: "/3-reference/1-handbook/js/dom" },
                    { text: "事件系统", link: "/3-reference/1-handbook/js/event" },
                  ],
                },
                {
                  text: "工程化手册",
                  collapsed: true,
                  items: [
                    { text: "工程化总览", link: "/3-reference/1-handbook/engineering/" },
                    { text: "Git 版本控制", link: "/3-reference/1-handbook/engineering/git" },
                    { text: "npm 包管理", link: "/3-reference/1-handbook/engineering/npm" },
                    { text: "构建工具", link: "/3-reference/1-handbook/engineering/build-tools" },
                  ],
                },
              ],
            },
            {
              text: "🔍 场景索引",
              collapsed: true,
              items: [
                { text: "场景索引总览", link: "/3-reference/2-scenarios/" },
                { text: "布局场景", link: "/3-reference/2-scenarios/layout" },
                { text: "对齐场景", link: "/3-reference/2-scenarios/align" },
                { text: "异步场景", link: "/3-reference/2-scenarios/async" },
                { text: "数据处理", link: "/3-reference/2-scenarios/data" },
                { text: "事件场景", link: "/3-reference/2-scenarios/event" },
              ],
            },
            {
              text: "📦 代码骨架",
              collapsed: true,
              items: [{ text: "骨架总览", link: "/3-reference/3-patterns/" }],
            },
          ],
        },
        {
          // 底部区域：实战项目
          text: "🚀 实战项目",
          items: [{ text: "项目总览", link: "/projects/" }],
        },
        {
          // 仓库工程实践：VitePress 个人结构化知识库实践案例（docs/maintenance-guide/）
          // 注意：VitePress 1.x sidebar 无 prefix 字段，等价实现 = items 的 link 统一以 /maintenance-guide/ 开头
          text: "🛠️ 仓库工程实践",
          collapsed: true,
          items: [
            { text: "实践案例入口", link: "/maintenance-guide/" },
            { text: "仓库架构", link: "/maintenance-guide/00-overview/project-arch" },
            { text: "渲染铁律", link: "/maintenance-guide/01-content-rules/render-rules" },
            { text: "页面结构标准", link: "/maintenance-guide/01-content-rules/page-standard" },
            { text: "改动影响面", link: "/maintenance-guide/01-content-rules/change-impact" },
            { text: "站点配置", link: "/maintenance-guide/02-config-spec/site-config" },
            { text: "主题与组件", link: "/maintenance-guide/02-config-spec/theme-component" },
            { text: "格式化与 TS", link: "/maintenance-guide/02-config-spec/format-ts" },
            { text: "gitignore 策略", link: "/maintenance-guide/02-config-spec/gitignore-spec" },
            {
              text: "GitHub 部署架构",
              link: "/maintenance-guide/03-build-deploy-arch/github-deploy-arch",
            },
            { text: "依赖策略", link: "/maintenance-guide/03-build-deploy-arch/dependency-policy" },
            { text: "思维导图模块", link: "/maintenance-guide/04-feature-modules/mindmap-spec" },
            {
              text: "知识星盘模块",
              link: "/maintenance-guide/04-feature-modules/knowledge-star-spec",
            },
            { text: "提交规范", link: "/maintenance-guide/05-git-policy/commit-spec" },
            { text: "决策记录", link: "/maintenance-guide/decision-records" },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [{ icon: "github", link: "https://github.com/readant/frontend-journey" }],

    // 搜索
    search: {
      provider: "local",
    },

    // 页脚
    footer: {
      message: "前端学习笔记",
      copyright: "MIT License",
    },
  },
});
