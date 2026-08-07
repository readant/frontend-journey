---
title: 站点配置
---

# 站点配置：config.ts 设计思路

> `docs/.vitepress/config.ts` 是全站唯一的"组织层"配置：它不生产内容，只决定内容如何被导航与渲染。整个文件是一个
> `defineConfig({...})` 对象。

## 1. 站点级字段

```ts
export default defineConfig({
  title: "Frontend Journey", // 浏览器标签页标题
  description: "...", // SEO 描述
  base: "/frontend-journey/", // 路由前缀，与 GitHub 仓库名强绑定
  ignoreDeadLinks: true, // 静态资源链接无法在构建期验证，放宽死链检查
  vite: { optimizeDeps: { include: ["markmap-lib", "markmap-view", "d3"] } }, // CJS 依赖预构建
  markdown: {
    config(md) {
      /* 注册 demo 插件 */
    },
  }, // <demo> 标签能力
  themeConfig: {
    /* nav / sidebar / search / footer */
  },
});
```

**设计要点**：

- `base` 是部署层面的硬约束：GitHub Pages 按仓库名路由，`base`
  与仓库名不一致会全站 404。它同时影响所有硬编码链接（见[渲染铁律](../01-content-rules/render-rules.md)第 4 条）
- `optimizeDeps.include`：markmap 依赖链是 CJS 模块，需要 Vite 预构建才能在浏览器端 ESM 化
- `markdown.config` 注入 `vitepress-demo-plugin`，让笔记页可以直接 `<demo>` 引用 `docs/public/demos/`
  下的演示文件——**内容与演示分离**

## 2. nav —— 顶部导航栏

```ts
nav: [
  { text: "首页", link: "/" },
  { text: "JavaScript", link: "/03-js/" },
  {
    text: "思维导图",                      // 下拉菜单
    items: [
      { text: "HTML 思维导图", link: "/01-html/mindmap/" },
      { text: "CSS 思维导图", link: "/02-css/mindmap/" },
    ],
  },
],
```

**设计思路**：nav 只放**顶级入口**（语言域 + 特殊功能），不承担细粒度导航；细粒度导航全部下沉到 sidebar。

## 3. sidebar —— 侧边栏三区域结构

```ts
sidebar: {
  "/": [                                   // 全局统一侧边栏
    { text: "📚 学习之路", items: [ /* 按语言域分组的章节树 */ ] },
    { text: "⚡ 速查补给站", items: [ /* layout / style / data 三大分类 */ ] },
    { text: "🕊️ 参考层", items: [ /* 手册 / 场景索引 / 代码骨架 */ ] },
    { text: "🚀 实战项目", items: [ /* 项目 */ ] },
  ],
},
```

**设计思路**：

- **key 是路径前缀，value 是该路径下的菜单数组**；本仓库用 `"/"` 全局统一，保证任何页面下侧边栏结构一致
- 分区递进：学习之路 → 速查补给站 → 参考层 → 实战项目 → 仓库工程实践，让使用者随时知道"我在学习层 / 速查区 / 参考层 / 工程实践"
- 目录项三种写法：直接链接 `{text, link}`、可折叠分组 `{text, collapsed, items}`、嵌套分组（link 指向分组的首页）
- `link` 是相对 `docs/` 的路径，**不带 `.md` 后缀**

## 4. search / footer / socialLinks

```ts
socialLinks: [{ icon: "github", link: "https://github.com/..." }],
search: { provider: "local" },       // 本地全文搜索，新页面自动被索引
footer: { message: "...", copyright: "MIT License" },
```

**设计思路**：`search: { provider: "local" }`
是零配置方案——新建页面自动进入索引，不需要手动登记，符合"Markdown 唯一数据源"原则。

## 侧边栏维护约定

新增页面后必须同步在 `sidebar`
对应分组登记，否则页面"找不到"。这是知识库最常见的"改了内容但导航没更新"问题来源，完整影响面见[改动影响面](../01-content-rules/change-impact.md)。
