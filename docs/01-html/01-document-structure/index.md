---
title: 01. 文档结构
---

# HTML 文档结构

## 它是什么

HTML 文档是一个 **有固定骨架的文本文件**。任何 HTML 页面都由三部分组成：

1. **`<!DOCTYPE html>`** —— 文档类型声明，告诉浏览器"这是 HTML5"
2. **`<html>`** —— 根元素，包裹整个文档
3. **`<head>` + `<body>`** —— 元数据区 + 内容区

```
<!DOCTYPE html>        ← 声明
<html lang="zh-CN">    ← 根元素（lang 声明语言）
  <head>               ← 元数据（用户不可见）
  <body>               ← 内容（用户可见）
</html>
```

> 一句话：**head 描述文档，body 呈现文档**。这就像一本书——封面的书名/作者信息（head）与正文（body）分离。

## 核心机制

### 浏览器如何解析 HTML

浏览器拿到的是**字节流**，需要经过四步变成可交互的页面：

```
字节(bytes) → 字符(UTF-8) → Token(标签流) → 节点 → DOM 树
```

1. **解码**：按字符编码（`charset`）把字节转为字符
2. **分词**：把字符流切成一个个 Token（开始标签、结束标签、文本）
3. **建树**：按 Token 的嵌套关系构建 DOM 节点
4. **DOM 树**：最终形成内存中的树状结构，供 JS 操作

**关键特性：HTML 解析是增量式的**——浏览器边下载边解析，先到的内容先渲染，这就是为什么页面内容会"从上到下"逐步出现。

### 解析容错机制

HTML 解析器对错误**极其宽容**（与 XML 不同）。标签不闭合、嵌套错乱都不会直接报错，而是按 HTML 规范里定义的"错误处理规则"自动修复。例如：

```html
<p>第一段
<p>第二段
<!-- 浏览器会自动补全 </p>，生成两个独立段落 -->
```

::: warning 宽容不等于可以乱写
容错是给浏览器的兜底机制，不是给开发者的许可。书写时仍必须保证标签闭合、嵌套正确，否则不同浏览器的修复结果可能不一致，导致页面表现漂移。
:::

### 渲染管线

DOM 树构建完成后，页面还要经过：

```
DOM 树 + CSSOM 树 → 渲染树(Render Tree) → 布局(Layout) → 绘制(Paint) → 合成(Composite)
```

其中 **CSS 与 JS 都会影响这条管线**（详见"深入理解"的加载阻塞部分）。

## 标准语法

### 完整骨架模板（标准写法）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- 可见内容 -->
</body>
</html>
```

### head 元数据家族

| 标签/属性 | 作用 | 关键说明 |
| --- | --- | --- |
| `<meta charset="UTF-8">` | 字符编码 | **必须放在 head 最前面**，否则中文可能乱码 |
| `<meta name="viewport">` | 移动端视口 | `width=device-width, initial-scale=1.0` 固定写法 |
| `<meta name="description">` | 页面描述 | 显示在搜索结果摘要中 |
| `<meta name="keywords">` | 关键词 | 对主流搜索引擎几乎无效，可省略 |
| `<title>` | 浏览器标签页标题 | 也是 SEO 最重要的标题信号 |
| `<link rel="stylesheet">` | 引入外部 CSS | 放 head，避免 FOUC |
| `<link rel="icon">` | 网站小图标 | 支持 .ico/.png/.svg |
| `<style>` | 内部样式 | 单页样式用 |
| `<script src defer>` | 引入 JS | 建议加 `defer`，见深入理解 |

### lang 属性

```html
<html lang="zh-CN">   <!-- 中文页面 -->
<html lang="en">       <!-- 英文页面 -->
```

`lang` 影响**屏幕阅读器的发音**、**浏览器翻译建议**和 **SEO 语言识别**，必须写对。

## 深入理解

### 1. DOCTYPE 到底做了什么

```html
<!DOCTYPE html>   <!-- 标准模式（HTML5） -->
```

DOCTYPE 触发浏览器进入**标准模式（standards mode）**。如果不写，浏览器进入**怪异模式（quirks mode）**，按 IE5 时代的盒模型渲染，`width` 计算规则完全不同——这是老页面最大的兼容性坑。

### 2. 加载阻塞：CSS 与 JS 如何拖慢页面

浏览器**边解析边渲染**，但两类资源会打断这个过程：

**① CSS 阻塞渲染（render-blocking）**

```html
<!-- 错误：CSS 放 body 里，页面会先显示无样式内容（FOUC） -->
<body>
  <p>内容</p>
  <link rel="stylesheet" href="style.css">
</body>
```

浏览器解析到 `<link>` 之前不会渲染任何内容。**CSS 必须放 head**，让样式和内容一起就绪。

**② 无属性 `<script>` 阻塞 HTML 解析**

```html
<head>
  <script src="app.js"></script>  <!-- 阻塞！解析到这里会暂停，等 JS 下载+执行完才继续 -->
</head>
```

普通 `<script>` 会**暂停 HTML 解析**去下载执行 JS。解决办法：

| 方式 | 行为 | 适用场景 |
| --- | --- | --- |
| 无属性 | 阻塞解析，立即执行 | 几乎不用 |
| `defer`（推荐） | 并行下载，HTML 解析完才按顺序执行 | 大多数业务脚本 |
| `async` | 并行下载，下载完立即执行（不保证顺序） | 独立无依赖的统计脚本 |

```html
<script src="app.js" defer></script>   <!-- 推荐：不阻塞解析 -->
<script src="analytics.js" async></script> <!-- 分析脚本 -->
```

::: tip 最佳实践
- CSS：放 head，控制文件数量
- JS：加 `defer` 放 head，或用模块脚本 `type="module"`（默认延迟执行）
- 结论：**"CSS 尽量少，JS 尽量晚"**
:::

### 3. charset 为什么必须最靠前

浏览器按 `charset` 解码字节流。规范要求 `<meta charset>` 必须在文档**前 1024 字节内**，否则解码可能是错的，中文直接乱码。放 head 第一行是安全写法。

### 4. viewport 为什么是"固定咒语"

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `width=device-width`：让布局宽度等于设备宽度（否则移动端默认按 980px 缩放显示）
- `initial-scale=1.0`：初始缩放比例为 1
- 两个值**逗号分隔**，属性名小写，写错会导致移动端缩放异常

### 5. 经典误区

- ❌ `keywords` 能提升排名 → 主流搜索引擎已忽略
- ❌ 把 `<title>` 当 `<h1>` 用 → title 是浏览器/搜索用，页面内标题是 h1
- ❌ `<html>` 不写 `lang` → 屏幕阅读器发音与 SEO 语言识别都会受影响
- ❌ head 里塞大量 `<script>` 不加 defer → 首屏白屏

## 关联速查

::: tip 速查卡片
文档骨架与元数据的完整速查，见 [HTML 文档结构速查](/cheatsheet/html/document)。
:::

::: info 互动演示
文档结构与 meta 标签的完整案例：[案例演示](/examples/01-html/01-document-structure/02-document-structure.html)
:::
