---
title: HTML 语义化标签完整手册
---

# HTML 语义化标签

## 核心概念

用**有意义的名字**描述内容，而不是用一堆 `<div>` 堆砌。语义化 = 结构可读、机器可懂、样式可维护。

## 完整内容

### 是什么 / 为什么

语义化标签给内容赋予了「身份」：浏览器知道哪是导航、哪是正文；搜索引擎能提取重点；屏幕阅读器能按结构朗读。代价几乎为零，收益贯穿整个生命周期。

### 一、布局语义标签（页面骨架）

```html
<body>
  <header>  站点页眉：logo、导航入口</header>
  <nav>     主导航：一组页面链接</nav>
  <main>    唯一主内容区（页面里只能有一个）</main>
  <aside>   侧边栏：次要信息、广告、相关阅读</aside>
  <footer>  页脚：版权、联系方式</footer>
  <section> 一组相关内容的区块（自带标题）</section>
  <article> 一篇可独立分发的内容（帖子/新闻/评论）</article>
</body>
```

| 标签 | 职责 | 使用提示 |
| :--- | :--- | :--- |
| `<header>` | 页眉/区块头部 | 每个 article、section 都可以有自己的 header |
| `<nav>` | 导航 | 只放主要导航，页脚链接组不必都包 nav |
| `<main>` | 主内容 | 一个页面**只能有一个** |
| `<aside>` | 侧栏/附注 | 与主体内容关系松散时使用 |
| `<footer>` | 页脚/区块尾部 | 可出现在 article、section 内部 |
| `<section>` | 相关内容的区块 | 常配一个标题（h2~h6） |
| `<article>` | 独立成篇的内容 | 拿掉上下文依然完整才用它 |

### 二、article vs section 决策树

```
这段内容单独拿出来还完整吗？
├─ 是 → <article>（新闻、博客、评论、产品卡片）
└─ 否 → 需要标题分组吗？
     ├─ 是 → <section>
     └─ 否 → 用 <div>
```

### 三、文本语义标签

| 标签 | 语义 | 典型场景 |
| :--- | :--- | :--- |
| `<h1>`~`<h6>` | 标题层级 | 一篇页面只应有一个 h1 |
| `<p>` | 段落 | 正文 |
| `<strong>` | 重要（加粗） | 强调关键信息 |
| `<em>` | 强调（斜体） | 语气重音 |
| `<mark>` | 高亮标记 | 搜索结果命中词 |
| `<small>` | 附属细则 | 版权、注释 |
| `<blockquote>` | 长引用 | 独立成块的引用 |
| `<code>` | 行内代码 | 函数名、命令 |
| `<pre>` | 保留空白 | 代码块、ASCII 图 |
| `<time>` | 时间 | `datetime` 属性写机器可读值 |
| `<address>` | 联系信息 | 作者/组织联系方式 |
| `<abbr>` | 缩写 | 配 `title` 展开全称 |

### 四、列表

```html
<ul> 无序列表：顺序无关的选项
<ol> 有序列表：步骤、排名（start/reversed 控制序号）
<dl> 描述列表：术语与解释成对（dt = 术语，dd = 描述）
```

导航、菜单、标签组这些「一串同类项」都该用列表语义，而不是一串 `<span>`。

### 五、表格

```html
<table>
  <caption>表格标题（无障碍必读）</caption>
  <thead> 表头行 </thead>
  <tbody> 数据行 </tbody>
  <tfoot> 表尾汇总 </tfoot>
</table>
```

| 标签 | 作用 |
| :--- | :--- |
| `<caption>` | 表格标题，屏幕阅读器先读它 |
| `<th scope="col/row">` | 表头单元格，声明管辖方向 |
| `<thead>/<tbody>/<tfoot>` | 三区分离，样式与滚动友好 |

### 语法速查

| 意图 | 首选标签 | 说明 |
| :--- | :--- | :--- |
| 页面骨架 | `header/nav/main/aside/footer` | 结构一目了然 |
| 独立内容 | `article` | 可单独分发 |
| 分组 | `section` | 配标题使用 |
| 强调 | `strong/em` | 别用 `b/i` 单纯加粗斜体 |
| 引述 | `blockquote/q/cite` | 长/短/出处 |
| 时间 | `time` | 加 `datetime` 属性 |
| 代码 | `code/pre/kbd` | 行内/块/按键 |
| 无障碍表格 | `caption + th scope` | 列方向明确 |

### 常见用法

**博客文章骨架**：

```html
<article>
  <header>
    <h1>标题</h1>
    <p>作者 · <time datetime="2026-08-06">2026-08-06</time></p>
  </header>
  <p>正文段落…</p>
  <section>
    <h2>小节标题</h2>
    <p>小节内容…</p>
  </section>
  <footer>标签：前端、HTML</footer>
</article>
```

### 注意事项

- ⚠️ 页面**只能有一个** `<main>` 与一个 `<h1>`（现代 SEO 实践）。
- ⚠️ `<section>` 通常需要标题，没有标题就用 `<div>`。
- ⚠️ 语义化不等于去掉样式：标签负责「含义」，CSS 负责「长相」，两者互补。
- ⚠️ 旧版大纲算法早已被浏览器弃用，靠 `h1~h6` 层级表达文档结构，而不是靠嵌套 section 的暗示。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)
- 📖 相邻手册：[HTML 文档结构](/3-reference/1-handbook/html/)、[SEO 与可访问性](/3-reference/1-handbook/html/seo)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
