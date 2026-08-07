---
title: 主题与组件
---

# 主题与组件：theme/ 目录结构与组件注册

> 自定义主题层位于 `docs/.vitepress/theme/`，负责两块能力：**全局自定义组件**（思维导图、知识星盘）与**页面级钩子**（渲染后处理）。

## 目录结构

```
docs/.vitepress/theme/
├── index.ts             # 主题入口：extends 默认主题 + 注册组件 + 钩子
├── custom.css           # 全局自定义样式
└── components/
    ├── Mindmap.vue      # 思维导图组件（<Mindmap />）
    ├── StarMap.vue      # 知识星盘组件（<StarMap />）
    └── star-map-data.ts # 星盘 52 节点展示数据（数据与组件分离）
```

**设计原则：数据与渲染解耦**。星盘数据在 `star-map-data.ts`，导图数据在 `mindmap-data.yml`——改数据不动组件，改组件不动数据。

## 主题入口（index.ts）

```ts
export default {
  extends: DefaultTheme,                // 继承 VitePress 默认主题
  enhanceApp({ app, router }) {
    app.component('Mindmap', Mindmap)   // 全局注册 <Mindmap />
    app.component('StarMap', StarMap)   // 全局注册 <StarMap />
    // 钩子：页面加载后给代码块补语言标签（本项目定制逻辑）
  },
}
```

**设计思路**：
- `extends: DefaultTheme`：不重造轮子，只在默认主题之上叠加能力
- `enhanceApp` 做**全局注册**：Markdown 页面里直接写 `<Mindmap />` / `<StarMap />` 即可用，无需每页 import
- **`router.onAfterPageLoad` 钩子**解决代码块语言标签显示问题：VitePress 生成的代码块 class 含完整类名，钩子在页面渲染后提取纯语言类型（`html`/`css`）作为标签——这是渲染层的一个定制点
- 单页组件不进 `enhanceApp`，在页面内局部引入即可（避免全局注册膨胀）

## 自定义样式（custom.css）

- 全站覆盖样式集中在此（字体、配色、组件微调）
- 学习页的 CSS demo 用 VitePress 默认样式，custom.css 只做整体层调整

## 模块类型声明（shims.d.ts）

```ts
declare module '*.vue' { ... }   // TS 认识 .vue 文件
declare module '*.md' { ... }    // TS 认识 .md 文件
declare module '*?raw' { ... }   // TS 认识 ?raw 导入
```

`.vitepress/` 下的 TS 代码依赖这些声明才能通过类型检查，属于基础设施，不随业务变更。

## 维护约定

- 组件内硬编码链接**必须**用 `import.meta.env.BASE_URL` 拼 base（见[渲染铁律](../01-content-rules/render-rules.md)第 4 条）
- 星盘：改数据不动 `StarMap.vue`；改组件不动 `star-map-data.ts`（契约见[知识星盘模块](../04-feature-modules/knowledge-star-spec.md)）
