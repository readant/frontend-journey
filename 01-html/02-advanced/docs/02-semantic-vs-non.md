# 语义化 vs 非语义化对比

> 对应 HTML 文件：`../02-semantic-vs-non.html`

## 本案例目标

- 直观感受语义化与非语义化的代码差异
- 理解语义化对 SEO、无障碍、可维护性的具体影响
- 掌握何时该用什么标签

---

## 代码对比

### 非语义化写法（❌ 不推荐）

```html
<div class="header">
  <div class="nav">
    <div class="nav-item"><a href="/">首页</a></div>
    <div class="nav-item"><a href="/blog">博客</a></div>
  </div>
</div>

<div class="main">
  <div class="article">
    <div class="title">文章标题</div>
    <div class="content">文章内容...</div>
  </div>
</div>

<div class="sidebar">
  <div class="widget">相关推荐</div>
</div>

<div class="footer">
  <div class="copyright">© 2026</div>
</div>
```

**问题：**
- 只有写代码的人知道每个 div 干什么
- 搜索引擎爬虫看到的是一堆无意义的 div
- 屏幕阅读器无法提供任何导航辅助

---

### 语义化写法（✅ 推荐）

```html
<header>
  <nav>
    <a href="/">首页</a>
    <a href="/blog">博客</a>
  </nav>
</header>

<main>
  <article>
    <h2>文章标题</h2>
    <p>文章内容...</p>
  </article>
</main>

<aside>
  <h3>相关推荐</h3>
</aside>

<footer>
  <p>© 2026</p>
</footer>
```

**优点：**
- 标签本身就表达了含义
- 搜索引擎能理解页面结构
- 屏幕阅读器能提供导航辅助

---

## SEO 影响对比

搜索引擎爬虫如何理解你的页面：

| 标签 | SEO 作用 | 非语义化的后果 |
|------|----------|----------------|
| `<main>` | 内容权重最高，搜索引擎重点索引 | 不知道哪里是核心内容 |
| `<article>` | 内容可被单独索引（Google 摘要） | 无法生成搜索结果摘要 |
| `<h1>`~`<h6>` | 构成页面大纲，影响关键词排名 | 无法理解内容层次 |
| `<nav>` | 帮助理解网站导航结构 | 无法识别导航 |

**实际案例：**

```html
<!-- 使用 article → Google 可能显示文章摘要 -->
<article>
  <h1>如何学习 JavaScript</h1>
  <p>JavaScript 是一门强大的编程语言...</p>
</article>

<!-- 没有 article → 只显示页面标题 -->
<div class="article">
  <h1>如何学习 JavaScript</h1>
  <p>JavaScript 是一门强大的编程语言...</p>
</div>
```

---

## 无障碍访问对比

屏幕阅读器如何帮助视障用户浏览你的页面：

| 标签 | 屏幕阅读器行为 | 非语义化的后果 |
|------|----------------|----------------|
| `<nav>` | 提供"跳转到导航"快捷键 | 用户必须听完所有链接 |
| `<main>` | 提供"跳转到主要内容"快捷键 | 用户必须跳过所有内容 |
| `<article>` | 朗读为"文章"，可单独跳过 | 无法识别这是文章 |
| `<aside>` | 朗读为"侧边栏"，可跳过 | 无法跳过补充内容 |

**实际场景：**

```
有语义化标签：
  用户："跳转到主要内容"
  阅读器：跳过导航和侧边栏，直接读文章

没有语义化标签：
  用户：（无法跳转）
  阅读器：从头开始读 "首页 博客 关于 联系 我们..."
  用户：（崩溃）
```

---

## 代码可维护性对比

团队协作时的体验：

| 写法 | 新人理解时间 | 代码审查难度 |
|------|--------------|--------------|
| `<header>` + `<nav>` | 0 秒 | 低 |
| `<div class="header">` + `<div class="nav">` | 需要看 class | 中 |
| `<article>` | 0 秒 | 低 |
| `<div class="article">` | 需要看 CSS | 高 |

---

## 实际项目案例

### 案例 1：电商网站

```html
<header>
  <nav aria-label="主导航">
    <a href="/">首页</a>
    <a href="/category">分类</a>
    <a href="/cart">购物车</a>
  </nav>
</header>

<main>
  <section>
    <h2>热门商品</h2>
    <article class="product-card">
      <img src="product.jpg" alt="商品图片">
      <h3>商品名称</h3>
      <p>价格：¥99</p>
    </article>
    <article class="product-card">...</article>
  </section>
</main>

<aside>
  <h3>购物车</h3>
  <p>共 3 件商品</p>
</aside>
```

### 案例 2：新闻网站

```html
<header>
  <h1>新闻网</h1>
  <nav>...</nav>
</header>

<main>
  <article>
    <header>
      <h1>重大新闻标题</h1>
      <time datetime="2026-07-14">2026-07-14</time>
    </header>
    <section>
      <h2>事件经过</h2>
      <p>...</p>
    </section>
    <section>
      <h2>专家解读</h2>
      <p>...</p>
    </section>
    <footer>
      <address>记者：张三</address>
    </footer>
  </article>
</main>

<aside>
  <h3>热门新闻</h3>
  <ul>
    <li><a href="#">新闻1</a></li>
    <li><a href="#">新闻2</a></li>
  </ul>
</aside>
```

### 案例 3：博客文章

```html
<article>
  <header>
    <h1>如何学习 CSS 布局</h1>
    <time datetime="2026-07-14">2026年7月14日</time>
    <address>作者：李四</address>
  </header>
  
  <section>
    <h2>引言</h2>
    <p>CSS 布局是前端开发的基础...</p>
  </section>
  
  <section>
    <h2>Flexbox 布局</h2>
    <p>Flexbox 是一种一维布局方式...</p>
  </section>
  
  <section>
    <h2>Grid 布局</h2>
    <p>Grid 是一种二维布局方式...</p>
  </section>
  
  <footer>
    <p>标签：CSS、前端</p>
    <p>阅读量：1234</p>
  </footer>
</article>
```

---

## 常见误区

| 误区 | 正确理解 |
|------|----------|
| "语义标签有默认样式" | 语义标签默认和 div 一样是块级元素，需要 CSS 定义视觉效果 |
| "section 当 div 用" | section 需要有独立主题，应包含标题（h2-h6） |
| "article 只能放文章" | 评论、商品卡片、widget 都可以用 article |
| "aside 只能放右侧" | aside 可以放任意位置，关键是"与主内容相关但可独立" |
| "所有内容都用 div" | 优先使用语义标签，实在没有合适标签时再用 div |

---

## 快速决策表

| 你想包裹的内容 | 用这个标签 |
|----------------|------------|
| 博客文章、新闻、评论、商品卡片 | `<article>` |
| 文章的"引言"、"正文"、"结论" | `<section>` |
| 主要导航链接 | `<nav>` |
| 页面或章节的头部 | `<header>` |
| 页面或章节的底部 | `<footer>` |
| 相关推荐、广告、标签云 | `<aside>` |
| 页面核心内容 | `<main>` |
| 都不是 | `<div>` |

---

## 拓展练习

1. **练习 1**：打开热门网站（MDN、知乎、掘金），用 DevTools 查看它们的 HTML 结构
   - 观察它们如何使用 header、nav、main、article、section、aside、footer

2. **练习 2**：将一个 div 导向的页面重构为语义化版本
   - 先识别每个 div 的含义
   - 替换为合适的语义标签

3. **练习 3**：用 WAVE 无障碍评估工具检查页面
   - 访问 https://wave.webaim.org/
   - 输入网址，查看无障碍评估结果

---

## 速查卡片

```
非语义化 → div div div div → 人类看 class，机器看不懂
语义化   → header nav main article aside footer → 人和机器都能理解
```
