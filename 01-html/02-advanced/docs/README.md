# 模块 2：文档结构与语义化

> 理解语义化标签的意义，能使用 header、nav、main、article、section、aside、footer 构建清晰的页面结构。

## 学习路线

1. **语义化布局**（预计 15 分钟）→ `01-semantic-layout.html` + [详细文档](01-semantic-layout.md)
   - 掌握每个语义标签的使用场景和嵌套规则
2. **语义 vs 非语义对比**（预计 10 分钟）→ `02-semantic-vs-non.html` + [详细文档](02-semantic-vs-non.md)
   - 理解为什么语义化对 SEO 和无障碍至关重要

## 知识点大纲

### 什么是语义化

语义化 = **用正确的标签表达正确的含义**。不是用 `<div class="header">`，而是直接用 `<header>`。

**三大好处：**
1. **代码可读性**：开发者一眼看出结构
2. **SEO 友好**：搜索引擎爬虫能理解页面各区域的含义
3. **无障碍访问**：屏幕阅读器能正确解读页面结构，为视障用户提供导航

### 语义标签速查表

| 标签 | 语义 | 典型用途 | 嵌套规则 |
|------|------|----------|----------|
| `<header>` | 页头区域 | Logo、标题、导航 | 可包含 nav、h1-h6、div |
| `<nav>` | 导航区域 | 主要导航链接 | 通常包含 ul > li > a |
| `<main>` | 主要内容 | 页面核心内容 | 每个页面只能有一个 |
| `<article>` | 独立内容 | 博客文章、新闻、论坛帖 | 可独立分发/阅读的内容块 |
| `<section>` | 内容分区 | 有独立主题的区域 | 应包含 h2-h6 标题 |
| `<aside>` | 侧边栏 | 相关链接、广告、作者信息 | 与主要内容相关但独立 |
| `<footer>` | 页脚区域 | 版权、联系方式、链接 | 可包含 nav、p、div |
| `<figure>` | 媒体容器 | 图片、图表、代码示例 | 配合 figcaption 使用 |
| `<figcaption>` | 媒体说明 | 图片/图表的标题文字 | 只能放在 figure 内 |
| `<time>` | 日期时间 | 文章发布日期 | datetime 属性放机器可读值 |
| `<address>` | 联系信息 | 作者邮箱、社交链接 | 放在 header/footer 内 |

### 嵌套关系（合法结构）

```html
<body>
  <header>
    <nav>...</nav>
  </header>
  <main>
    <article>
      <header>文章标题区</header>
      <section>文章正文</section>
      <footer>文章底部信息</footer>
    </article>
    <article>...</article>
  </main>
  <aside>侧边栏</aside>
  <footer>页脚</footer>
</body>
```

**注意：** header、footer、article、section 内部都可以再嵌套 header/footer，语义是相对的。

### 常见误区

| 误区 | 正确做法 |
|------|----------|
| 所有内容都用 div 包裹 | 优先使用语义标签，实在没有合适标签时再用 div |
| main 放多个 | 一个页面只放一个 `<main>` |
| section 当 div 用 | section 需要有独立主题，应包含标题（h2-h6） |
| article 只能放文章 | article 可以是任何可独立分发的内容：评论、卡片、widget |
| aside 只能放右侧 | aside 可以放任意位置，关键是"与主内容相关但可独立" |

## 重难点总结

| 难点 | 说明 | 对应案例 |
|------|------|----------|
| section vs article | section 是"有主题的分区"，article 是"可独立分发的内容"，article 内部可用 section 细分 | `01-semantic-layout.html` |
| header/footer 的相对性 | header/footer 不一定只在页面级别，article 内部也可以有自己的 header 和 footer | `01-semantic-layout.html` |
| 语义标签无默认样式 | 语义标签默认和 div 一样是块级元素，需要 CSS 来定义视觉效果 | `02-semantic-vs-non.html` |
| SEO 爬虫如何理解语义 | 搜索引擎给 `<main>` 内容更高权重，`<article>` 内容可被单独索引 | `02-semantic-vs-non.html` |

## 案例索引

| 案例文件 | 配套文档 | 说明 |
|----------|----------|------|
| `01-semantic-layout.html` | [01-semantic-layout.md](01-semantic-layout.md) | 完整语义布局示例 |
| `02-semantic-vs-non.html` | [02-semantic-vs-non.md](02-semantic-vs-non.md) | 语义 vs 非语义对比分析 |

## 参考资源

- [MDN - 语义化介绍](https://developer.mozilla.org/zh-CN/docs/Glossary/Semantics#Semantics_in_HTML)
- [MDN - HTML 语义元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element#Text_content_tags)
- [W3C - HTML5 语义化](https://www.w3.org/TR/2011/WD-html5-20110525/sections.html)
