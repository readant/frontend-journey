---
title: 02. 语义化标签
---

# HTML 语义化标签

## 它是什么

**语义化 = 用"有含义的标签"而不是"无含义的容器"来表达内容结构。**

同样的页面，两种写法：

```html
<!-- 非语义化：一堆 div，含义全靠 class 猜 -->
<div class="header">
  <div class="nav"><a href="#">首页</a></div>
</div>

<!-- 语义化：标签自己说明身份 -->
<header>
  <nav><a href="#">首页</a></nav>
</header>
```

语义化服务三类"读者"：

1. **开发者** —— 看标签就知道结构，不需要读 class 和注释
2. **搜索引擎** —— 爬虫据此判断"哪是主要内容、哪是导航"
3. **辅助技术** —— 屏幕阅读器据此提供页面导航与朗读

## 核心机制

### 1. 文档大纲（heading 结构）

语义化的底层是**标题层级**。浏览器与辅助技术把 `h1 → h2 → h3` 的嵌套组织成"目录大纲"：

```
h1 页面主标题
├── h2 章节一
│   └── h3 小节
└── h2 章节二
```

屏幕阅读器用户可以通过大纲**跳转到任意章节**——前提是标题层级正确。

### 2. 爬虫如何理解页面

搜索引擎爬虫解析 DOM 后，会按语义标签**加权**：`<main>` 里的内容权重高于 `<nav>`/`<aside>`，`<article>` 被视为可独立索引的内容。这直接影响页面能否进入搜索结果。

### 3. 屏幕阅读器如何导航

屏幕阅读器（如 NVDA / VoiceOver）把 `<header>/<nav>/<main>/<aside>/<footer>` 识别为 **landmark（地标）**，用户可通过地标列表快速跳转——相当于给视障用户一张页面地图。

## 标准语法

### 布局语义标签

```html
<body>
  <header>            <!-- 页面头部：Logo、标题、导航 -->
    <nav>             <!-- 主要导航链接组 -->
      <a href="#">首页</a>
      <a href="#">关于</a>
    </nav>
  </header>

  <main>              <!-- 核心内容，全页唯一 -->
    <article>         <!-- 可独立分发的内容（博客、新闻、评论） -->
      <h2>文章标题</h2>
      <time datetime="2026-08-04">2026-08-04</time>
      <p>正文……</p>
      <section>       <!-- 有独立主题的分区 -->
        <h3>小节标题</h3>
      </section>
    </article>

    <aside>           <!-- 相关但独立：侧栏、相关推荐 -->
      <h3>相关推荐</h3>
    </aside>
  </main>

  <footer>            <!-- 页脚：版权、联系方式 -->
    <p>© 2026</p>
  </footer>
</body>
```

**图文组合**：`<figure>` + `<figcaption>` 将图片/代码与说明绑定为一个单元：

```html
<figure>
  <img src="chart.png" alt="月度销量图">
  <figcaption>图 1：2026 年 8 月销量趋势</figcaption>
</figure>
```

### 文本语义标签

| 标签 | 语义 | 别用错 |
| --- | --- | --- |
| `<h1>`~`<h6>` | 标题层级 | h1 一页一个 |
| `<p>` | 段落 | 别用 `<br>` 拼段落 |
| `<strong>` | 重要性强调 | vs `<b>`（纯视觉加粗） |
| `<em>` | 语气强调 | vs `<i>`（纯视觉斜体） |
| `<mark>` | 高亮/参考标记 | 搜索结果关键词 |
| `<blockquote>` | 长引用 | 配合 cite |
| `<q>` | 行内短引用 | 自动加引号 |
| `<abbr title="...">` | 缩写 | 悬停显示全称 |
| `<time datetime>` | 机器可读时间 | 必须 ISO 格式 |
| `<code>` / `<pre>` | 代码 / 预格式文本 | pre 保留空格换行 |
| `<del>` / `<ins>` | 删除 / 插入 | 修订记录 |
| `<sub>` / `<sup>` | 下标 / 上标 | 化学式、数学式 |

### 列表

| 列表 | 标签 | 适用 |
| --- | --- | --- |
| 无序列表 | `<ul>` + `<li>` | 无顺序关系（导航、功能点） |
| 有序列表 | `<ol>` + `<li>` | 有步骤顺序（操作流程） |
| 定义列表 | `<dl>` + `<dt>` + `<dd>` | 术语表、FAQ |

```html
<ol>
  <li>第一步：注册账号</li>
  <li>第二步：验证邮箱</li>
</ol>

<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言</dd>
</dl>
```

::: warning `<li>` 的父级限制
`<li>` 只能放在 `<ul>`、`<ol>`、`<menu>` 内部，不能单独使用或放进 `<div>`。
:::

### 表格

```html
<table>
  <caption>2026 年销售数据</caption>
  <thead>
    <tr><th scope="col">月份</th><th scope="col">销售额</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">8 月</th><td>12000</td></tr>
  </tbody>
</table>
```

- 结构：`<caption>` → `<thead>` / `<tbody>` / `<tfoot>` → `<tr>` → `<th>` / `<td>`
- `<th scope="col|row">`：让屏幕阅读器知道表头方向，**无障碍关键**

## 深入理解

### article vs section 决策树

最常搞混的两个标签，判断标准只有一个：

> **这个内容"单独拿出来"还能成立吗？**（能否被 RSS 订阅、被转发、被单独索引）

| 判断 | 结论 |
| --- | --- |
| 拿出来能独立成立（文章/评论/新闻/产品） | `<article>` |
| 只是页面内部的"分区"（引言/正文/结论） | `<section>` |
| 分区但**没有标题** | 用 `<div>`（section 必须有标题） |

```html
<article>                    <!-- 整篇文章：可独立分发 -->
  <h2>文章</h2>
  <section><h3>引言</h3></section>   <!-- 内部小节 -->
  <section><h3>正文</h3></section>
</article>
```

### main 的唯一性

```html
<main>...</main>   <!-- 全页只能一个 -->
```

`<main>` 不能嵌套在 `<header>/<footer>/<article>/<aside>/<nav>` 内部。它标识"页面核心内容"，是屏幕阅读器的"跳过导航直入正文"的落点。

### header / footer 可以有多个

```html
<article>
  <header>文章头部</header>   <!-- article 自己的头部 -->
  <p>正文</p>
  <footer>文章尾部</footer>   <!-- article 自己的脚部 -->
</article>
```

页面级 `header/footer` 与 article 内部的**各算各的，互不影响**。但 `<nav>` 只用于"主要导航"，不是所有链接组都要用 nav。

### 大纲算法的现状（重要认知）

旧规范中的"大纲算法"（任意标题嵌套都能生成大纲）**已被废弃**。现代浏览器与辅助技术的标准是：

- 大纲完全由 `h1~h6` 的**层级关系**决定
- **不要跳级**：`h1` 后直接 `h3` 是错误写法（破坏大纲）
- section/article 不会自动重置标题级别

```html
<!-- 错误：跳级 -->
<h1>标题</h1>
<h3>小标题</h3>

<!-- 正确：逐级递进 -->
<h1>标题</h1>
<h2>小标题</h2>
```

### 语义化 vs 样式

- 语义标签**没有内置样式**，视觉全靠 CSS
- 反过来：`<div class="header">` 样式完全相同，但语义信息全丢
- 原则：**先选对语义标签，再写样式**，不要"写 div 然后补语义"

## 关联速查

::: tip 速查卡片
语义标签的「何时用」对照表与完整骨架，见 [HTML 语义化标签速查](/cheatsheet/html/semantic)。
:::

::: info 互动演示
语义布局与对比案例：[语义布局演示](/examples/01-html/02-semantic-tags/01-semantic-layout.html) · [语义 vs 非语义对比](/examples/01-html/02-semantic-tags/02-semantic-vs-non.html)
:::
