# 简易博客项目详解

> 对应 HTML 文件：`../02-simple-blog.html`

## 本案例学习目标

- 综合运用语义标签构建博客首页
- 掌握双栏布局（main + aside）
- 理解导航栏的语义化写法
- 掌握文章列表的结构设计

## 项目结构分析

### 整体布局

```
body
├── header（页面头部：标题 + 副标题）
├── nav（导航栏：首页、技术文章、学习笔记、关于我）
├── container（flex 双栏容器）
│   ├── main（文章列表）
│   │   ├── article（文章1）
│   │   ├── article（文章2）
│   │   └── article（文章3）
│   └── aside（侧边栏）
│       ├── widget（文章分类）
│       ├── widget（最新评论）
│       └── widget（友情链接）
└── footer（页脚：版权信息）
```

### 设计思路

1. **顶部 header + nav**：渐变背景 + 深色导航栏
2. **主体 flex 双栏**：main（flex: 3）+ aside（flex: 1）
3. **文章卡片**：白色背景 + 圆角 + 阴影
4. **侧边栏 widget**：统一的卡片样式

## 知识点详解

### 1. 页面头部

```html
<header>
  <h1>我的技术博客</h1>
  <p>记录学习过程，分享技术心得</p>
</header>
```

**设计要点：**
- 渐变背景（linear-gradient）
- 居中文本
- h1 是页面主标题

### 2. 导航栏

```html
<nav>
  <ul>
    <li><a href="#">首页</a></li>
    <li><a href="#">技术文章</a></li>
    <li><a href="#">学习笔记</a></li>
    <li><a href="#">关于我</a></li>
  </ul>
</nav>
```

**CSS 技巧：**
```css
nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
}
nav a {
  display: block;
  padding: 15px 25px;
  text-decoration: none;
  color: white;
}
nav a:hover {
  background: #555;
}
```

**语义化：** 用 `<nav>` 包裹，屏幕阅读器知道这是导航区域。

### 3. 双栏布局

```html
<div class="container">
  <main>文章列表</main>
  <aside>侧边栏</aside>
</div>
```

```css
.container {
  display: flex;
  gap: 20px;
}
main {
  flex: 3;  /* 占 3/4 宽度 */
}
aside {
  flex: 1;  /* 占 1/4 宽度 */
}
```

**响应式：**
```css
@media (max-width: 768px) {
  .container {
    flex-direction: column;  /* 手机端改为单列 */
  }
}
```

### 4. 文章卡片

```html
<article>
  <h2>HTML5 新特性详解</h2>
  <div class="article-meta">
    <span>📅 <time datetime="2026-05-20">2026-05-20</time></span> |
    <span>👤 作者</span> |
    <span>📁 分类：HTML</span>
  </div>
  <div class="article-content">
    <p>HTML5带来了很多新特性...</p>
  </div>
  <a href="#" class="read-more">阅读全文 →</a>
</article>
```

**语义化：**
- `<article>` 表示独立文章
- `<time datetime>` 机器可读的日期
- `<h2>` 是文章标题（页面子标题）

### 5. 侧边栏 widget

```html
<aside>
  <div class="widget">
    <h3>文章分类</h3>
    <ul>
      <li><a href="#">HTML (5)</a></li>
      <li><a href="#">CSS (8)</a></li>
    </ul>
  </div>
</aside>
```

**设计要点：**
- widget 统一的卡片样式
- h3 是 widget 标题
- ul + li 列表

### 6. 页脚

```html
<footer>
  <p>&copy; 2026 我的技术博客 | 用 ❤️ 构建</p>
</footer>
```

**语义化：** `<footer>` 表示页脚区域。

## CSS 技巧

### 渐变背景

```css
header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 卡片阴影

```css
article, .widget {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
```

### Flex 布局

```css
.container {
  display: flex;
  gap: 20px;
}
```

## 扩展建议

### 1. 添加分页

```html
<nav class="pagination">
  <a href="#">上一页</a>
  <span>1 / 5</span>
  <a href="#">下一页</a>
</nav>
```

### 2. 添加文章标签

```html
<div class="tags">
  <span class="tag">HTML5</span>
  <span class="tag">语义化</span>
</div>
```

### 3. 添加搜索框

```html
<form class="search-form">
  <input type="search" placeholder="搜索文章...">
  <button type="submit">搜索</button>
</form>
```

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 导航链接不显示 | list-style: none 没生效 | 确认 ul 的 display: flex |
| 双栏在手机上不换行 | 没有媒体查询 | 加 @media (max-width: 768px) |
| 侧边栏内容溢出 | 没有 overflow 处理 | 加 overflow: auto 或 ellipsis |
| 文章卡片高度不一致 | flex 默认拉伸 | 用 align-items: flex-start |

## 拓展练习

1. **练习 1**：为博客添加文章标签功能
   - 提示：每个文章下方添加标签列表
2. **练习 2**：实现响应式布局，手机端单列显示
   - 提示：用媒体查询调整 flex-direction
3. **练习 3**：添加一个文章搜索框
   - 提示：用 type="search" 的 input

## 本案例知识速查表

| 知识点 | 作用 | 示例 |
|--------|------|------|
| `<header>` | 页面头部 | 渐变背景 + 居中文本 |
| `<nav>` | 导航栏 | flex 水平排列 |
| `<main>` | 主要内容 | flex: 3 占主区域 |
| `<article>` | 文章卡片 | 独立内容块 |
| `<aside>` | 侧边栏 | flex: 1 占侧区域 |
| `<footer>` | 页脚 | 版权信息 |
| `<time datetime>` | 日期 | 机器可读格式 |
| `flex` 布局 | 双栏布局 | main + aside |
| `linear-gradient` | 渐变背景 | header 样式 |
| `box-shadow` | 卡片阴影 | 提升层次感 |
