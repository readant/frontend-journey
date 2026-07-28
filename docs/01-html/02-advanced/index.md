# 模块 2：HTML5 语义化标签

用正确的标签表达正确的含义 —— 让代码会说话

## 为什么要学语义化？

```
非语义化：  <div class="header"><div class="nav">...</div></div>
语义化：    <header><nav>...</nav></header>
```

**三大好处：**
1. **代码可读性** —— 一眼看出页面结构，不需要看 class
2. **SEO 友好** —— 搜索引擎爬虫能理解什么是主要内容、什么是导航
3. **无障碍访问** —— 屏幕阅读器能为视障用户提供页面导航

## 速查语法

| 标签 | 一句话解释 | 关键规则 |
|------|------------|----------|
| `<header>` | 页面或章节的头部区域 | 可多个（页面级 + article 内） |
| `<nav>` | 主要导航链接区域 | 用于"主要导航"，不是所有链接组 |
| `<main>` | 页面核心内容 | **只能一个**，不能嵌套在其他标签内 |
| `<article>` | 可独立分发的内容 | 判断标准：能否被 RSS/转发/单独索引 |
| `<section>` | 有独立主题的分区 | 需要有标题（h2-h6） |
| `<aside>` | 与主内容相关但独立 | 不一定在右侧，关键看"相关但独立" |
| `<footer>` | 页面或章节的底部区域 | 可多个（页面级 + article 内） |
| `<time>` | 机器可读的日期时间 | datetime 属性放 ISO 格式值 |

### 页面骨架模板

```html
<body>
  <header><nav><!-- 主导航 --></nav></header>
  <main>
    <article><h1>文章标题</h1><section><h2>小节</h2></section></article>
    <aside><!-- 侧边栏 --></aside>
  </main>
  <footer><!-- 页脚 --></footer>
</body>
```

### 语义标签决策

| 场景 | 用什么 |
|------|--------|
| 页面顶部/章节头部 | `<header>` |
| 主要导航链接 | `<nav>` |
| 页面核心内容（唯一） | `<main>` |
| 可独立分发的内容 | `<article>` |
| 主题分区 | `<section>` |
| 相关但独立的内容 | `<aside>` |
| 页面/章节底部 | `<footer>` |
| 图文组合 | `<figure>` + `<figcaption>` |

### section vs article

- `article` = 拿出来还能单独成立（博客、评论、新闻）
- `section` = 文章内部的分区（引言、正文、结论）

## 最容易搞混的：section vs article

```
article = 可以被独立分发的内容（博客文章、新闻、评论）
section = 有独立主题的内容分区（文章的"引言"、"正文"、"结论"）

关键：article 内部可以用 section 来细分！
```

## 学习路线

| 顺序 | 主题 | 文件 |
|------|------|------|
| 1 | 语义标签详解 | `01-semantic-layout.html` |
| 2 | 语义 vs 非语义对比 | `02-semantic-vs-non.html` |

## 参考资源

- [MDN - 语义化介绍](https://developer.mozilla.org/zh-CN/docs/Glossary/Semantics#Semantics_in_HTML)
- [MDN - HTML 语义元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element#Text_content_tags)

## 在线演示

查看本模块的 HTML 案例文件：[案例演示](/examples/01-html/02-advanced/01-semantic-layout.html)
