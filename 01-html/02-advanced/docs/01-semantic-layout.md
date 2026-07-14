# 语义化布局详解

> 对应 HTML 文件：`../01-semantic-layout.html`

## 本案例学习目标

- 理解每个语义标签的确切含义和使用场景
- 掌握语义标签的嵌套规则
- 了解 role 属性作为语义化补充
- 能用语义标签构建完整的页面结构

## 知识点详解

### 1. 语义标签速查表

| 标签 | 语义 | 典型用途 | 嵌套规则 |
|------|------|----------|----------|
| `<header>` | 页头区域 | Logo、标题、搜索框、导航 | 可包含 nav、h1-h6、div |
| `<nav>` | 导航区域 | 主要导航链接 | 通常包含 ul > li > a |
| `<main>` | 主要内容 | 页面核心内容 | **每个页面只能有一个** |
| `<article>` | 独立内容 | 博客文章、新闻、论坛帖 | 可独立分发/阅读的内容块 |
| `<section>` | 内容分区 | 有独立主题的区域 | 应包含 h2-h6 标题 |
| `<aside>` | 侧边栏 | 相关链接、广告、作者信息 | 与主要内容相关但独立 |
| `<footer>` | 页脚区域 | 版权、联系方式、链接 | 可包含 nav、p、div |
| `<figure>` | 媒体容器 | 图片、图表、代码示例 | 配合 figcaption 使用 |
| `<figcaption>` | 媒体说明 | 图片/图表的标题文字 | 只能放在 figure 内 |
| `<time>` | 日期时间 | 文章发布日期 | datetime 属性放机器可读值 |
| `<address>` | 联系信息 | 作者邮箱、社交链接 | 通常放在 header/footer 内 |

### 2. 每个标签的详细解析

#### `<header>` 页头

```html
<header>
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/about">关于</a></li>
    </ul>
  </nav>
</header>
```

**注意：**
- 一个页面可以有**多个** header（页面级 + article 内部）
- header 不一定在页面顶部，article 内部也可以有 header
- header 内部通常包含 h1-h6 标题

#### `<nav>` 导航

```html
<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
    <li><a href="/blog">博客</a></li>
  </ul>
</nav>
```

**注意：**
- 不是所有链接组都需要 nav，nav 用于**主要导航**
- 页脚的链接组也可以用 nav
- 用 `aria-label` 区分多个 nav

#### `<main>` 主要内容

```html
<main>
  <!-- 页面的核心内容 -->
</main>
```

**关键规则：**
- 一个页面**只能有一个** main
- main 不能嵌套在 article、aside、header、footer、nav 内
- main 通常没有 role 属性（浏览器默认就是 main）

#### `<article>` 独立内容

```html
<article>
  <header>
    <h2>文章标题</h2>
    <time datetime="2026-07-14">2026-07-14</time>
  </header>
  <p>文章正文...</p>
  <footer>
    <p>作者：L君</p>
  </footer>
</article>
```

**判断标准：** 这个内容能否被独立分发（RSS、转发、单独索引）？如果能，就用 article。

**article 内部可以嵌套：**
- article 内可以有 section
- article 内可以有自己的 header 和 footer
- 多个 article 可以并列

#### `<section>` 内容分区

```html
<section>
  <h2>第一章：入门</h2>
  <p>内容...</p>
</section>
```

**与 article 的区别：**
- section = "有独立主题的分区"，需要标题
- article = "可独立分发的内容"，不一定需要标题
- article 内部可以用 section 来细分

#### `<aside>` 侧边栏

```html
<aside aria-label="相关文章">
  <h3>相关推荐</h3>
  <ul>
    <li><a href="#">文章1</a></li>
  </ul>
</aside>
```

**注意：**
- aside 不一定在页面右侧，可以放在任何位置
- 关键是"与主内容相关但可独立"

#### `<time>` 日期时间

```html
<!-- 人类可读 + 机器可读 -->
<time datetime="2026-07-14">2026年7月14日</time>

<!-- 带时间 -->
<time datetime="2026-07-14T18:00">今晚6点</time>

<!-- 只有年月 -->
<time datetime="2026-07">2026年7月</time>
```

**作用：** 搜索引擎可以提取结构化日期数据。

#### `<address>` 联系信息

```html
<address>
  写于 <a href="https://example.com">我的博客</a>。
  联系 <a href="mailto:me@example.com">我</a>。
</address>
```

**注意：** address 不是"地址"的意思，是"联系信息"。

### 3. role 属性（语义化补充）

当 HTML5 语义标签不够用时，可用 role 增强：

| role 值 | 等效标签 | 使用场景 |
|---------|----------|----------|
| `banner` | header | 页面横幅 |
| `navigation` | nav | 导航区域 |
| `main` | main | 主要内容 |
| `contentinfo` | footer | 页脚信息 |
| `complementary` | aside | 补充内容 |
| `search` | - | 搜索区域 |

**优先级：** 原生 HTML5 标签 > role 属性 > class + div

### 4. 合法嵌套结构

```html
<body>
  <header>
    <nav aria-label="主导航">...</nav>
  </header>
  
  <main>
    <article>
      <header>
        <h1>文章标题</h1>
        <time datetime="2026-07-14">2026-07-14</time>
      </header>
      
      <section>
        <h2>第一节</h2>
        <p>内容...</p>
      </section>
      
      <section>
        <h2>第二节</h2>
        <p>内容...</p>
      </section>
      
      <footer>
        <p>作者：L君</p>
      </footer>
    </article>
    
    <article>...</article>
  </main>
  
  <aside>
    <h3>侧边栏</h3>
    <nav aria-label="相关链接">...</nav>
  </aside>
  
  <footer>
    <nav aria-label="页脚导航">...</nav>
    <address>联系信息</address>
    <p>&copy; 2026 版权信息</p>
  </footer>
</body>
```

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| section 没有标题 | section 应该有 h2-h6 标题 | 给 section 加标题，或改用 div |
| 页面有多个 main | main 只能有一个 | 检查 HTML 结构 |
| header 内没有标题 | header 通常包含标题 | 加 h1-h6 |
| aside 放在 main 内 | aside 应与 main 同级 | 移到 main 外面 |

## 拓展练习

1. **练习 1**：用语义标签重构一个只用 div 的页面
   - 提示：识别每个 div 的含义，替换为合适的语义标签
2. **练习 2**：创建一个博客文章页面，包含 article、section、aside
   - 提示：article 内用 section 细分，aside 放相关推荐
3. **练习 3**：用浏览器开发者工具的 Accessibility 面板检查页面结构
   - 提示：Chrome DevTools → Elements → Accessibility

## 本案例知识速查表

| 标签 | 语义 | 关键规则 |
|------|------|----------|
| `<header>` | 页头 | 可多个（页面级 + article 内） |
| `<nav>` | 导航 | 主要导航区域 |
| `<main>` | 主要内容 | **只能一个**，不能嵌套在其他语义标签内 |
| `<article>` | 独立内容 | 可独立分发的内容块 |
| `<section>` | 内容分区 | 需有标题，表示有独立主题 |
| `<aside>` | 侧边栏 | 与主内容相关但可独立 |
| `<footer>` | 页脚 | 可多个 |
| `<time>` | 日期时间 | datetime 属性放机器可读值 |
| `<address>` | 联系信息 | 不是"地址"，是"联系方式" |
| `role` | 语义补充 | 优先使用原生 HTML5 标签 |
