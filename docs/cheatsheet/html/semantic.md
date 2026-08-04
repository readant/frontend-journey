---
title: HTML 语义化标签速查
---

# HTML 语义化标签速查

## 何时用

| 场景 | 用什么标签 |
| --- | --- |
| 页面顶部 / 章节头部 | `<header>` |
| 主要导航链接 | `<nav>` |
| 页面核心内容（全页唯一） | `<main>` |
| 可独立分发的内容（博客/评论/新闻） | `<article>` |
| 有独立主题的分区（需带标题） | `<section>` |
| 相关但独立的内容（侧栏/注释） | `<aside>` |
| 页面 / 章节底部 | `<footer>` |
| 图文组合 | `<figure>` + `<figcaption>` |
| 机器可读的日期时间 | `<time datetime="ISO 格式">` |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>语义化骨架</title>
<style>
  body { margin: 0; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; }
  header, nav, main, article, section, aside, footer { padding: 12px; margin: 4px; border-radius: 4px; }
  header { background: #3498db; color: #fff; }
  nav    { background: #ecf0f1; }
  main   { display: flex; }
  article, section { background: #f0f4f8; }
  aside  { background: #fdebd0; width: 200px; }
  footer { background: #2c3e50; color: #fff; }
</style>
</head>
<body>
  <header>
    <h1>博客标题</h1>
    <nav>
      <a href="#">首页</a> | <a href="#">分类</a> | <a href="#">关于</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>文章标题</h2>
      <time datetime="2026-08-04">2026-08-04</time>
      <p>文章正文内容……</p>
      <section><h3>小节一</h3><p>小节内容</p></section>
      <section><h3>小节二</h3><p>小节内容</p></section>
    </article>
    <aside>
      <h3>相关推荐</h3>
      <p>与主内容相关但独立的信息。</p>
    </aside>
  </main>

  <footer>© 2026 版权信息</footer>
</body>
</html>
```

## 踩坑记录

- **`<main>` 每页只能一个**，且不能嵌套在 `header/footer/article/aside/nav` 内
- **`<section>` 必须有标题**（h2~h6），无标题的分组用 `<div>`
- **article vs section 的判断标准**：`article` 拿出来还能单独成立（能否被 RSS/转发/单独索引）；`section` 只是文章内部的分区（引言、正文、结论）。嵌套时 section 可以套在 article 里
- **`<header>/<footer>` 可以有多个**：页面级 + article 内的各算各的；但 `<nav>` 只用于"主要导航"，不是所有链接组
- **`<aside>` 不一定在右侧**，关键看"相关但独立"；`<time>` 的 `datetime` 属性必须写 ISO 格式（如 `2026-08-04`），否则机器读不到
- **语义化不等于样式**：浏览器对语义标签没有内置样式，效果来自 CSS；语义化主要服务 SEO 和辅助技术（屏幕阅读器）
