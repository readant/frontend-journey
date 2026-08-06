---
title: HTML 文档结构完整手册
---

# HTML 文档结构

## 核心概念

一个 HTML 页面的骨架：`doctype` + `html` + `head`（元信息）+ `body`（内容）。

## 完整内容

### 是什么 / 为什么

无论页面多复杂，最外层结构是固定的。写对骨架，浏览器才能正确解析、移动端才能正常缩放、搜索引擎才能抓取。

### 一、标准骨架模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面标题</title>
    <meta name="description" content="页面描述，控制在 120 字内" />
  </head>
  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

| 部分 | 职责 |
| :--- | :--- |
| `<!DOCTYPE html>` | 告诉浏览器按标准模式解析（缺失会进入怪异模式，布局错乱） |
| `<html lang="zh-CN">` | 声明语言（影响朗读、翻译、字体渲染） |
| `<head>` | 元信息：编码、视口、标题、描述 |
| `<body>` | 用户可见的内容 |

### 二、meta 家族

| meta | 作用 |
| :--- | :--- |
| `charset="UTF-8"` | 字符编码（必须第一行，否则中文乱码） |
| `name="viewport"` | 移动端缩放控制（**响应式前提**） |
| `name="description"` | 搜索结果的描述文字 |
| `name="keywords"` | 关键词（现代搜索引擎已弱化，可写可不写） |
| `name="author"` | 作者信息 |
| `name="theme-color"` | 移动端浏览器地址栏颜色 |
| `http-equiv="X-UA-Compatible"` | 旧 IE 兼容（现代可省略） |

### 三、加载顺序与性能

**解析阻塞**：`<script>` 默认遇到就停下解析去执行 JS（阻塞）。现代姿势：

```html
<!-- 常规：放在 body 末尾，保证 DOM 已就绪 -->
<script src="app.js"></script>

<!-- defer：等文档解析完再执行，且按顺序（推荐放 head） -->
<script defer src="app.js"></script>

<!-- async：下载完立即执行，不保证顺序（独立脚本用） -->
<script async src="app.js"></script>
```

**CSS 放 head，JS 放 body 末尾 / 用 defer**。`<link rel="stylesheet">` 放 head 可避免「样式闪烁」。

### 语法速查

| 标签 | 说明 |
| :--- | :--- |
| `<!DOCTYPE html>` | 标准模式声明 |
| `<html lang="zh-CN">` | 根元素 + 语言 |
| `<head>` | 元信息容器 |
| `<body>` | 内容容器 |
| `<meta charset>` | 编码（第一优先级） |
| `<meta name="viewport">` | 移动端视口 |
| `<title>` | 标签页标题 |
| `<script defer>` | 延迟执行脚本 |
| `<link rel="stylesheet">` | 引入样式表 |

### 常见用法

**移动端基础 head**：

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>前端学习笔记</title>
  <meta name="description" content="从零开始的前端学习旅程" />
</head>
```

### 注意事项

- ⚠️ `charset` 必须放在 head **最前面**，否则中文可能乱码。
- ⚠️ 缺 `<!DOCTYPE html>` 进入怪异模式，盒模型和百分比计算会变。
- ⚠️ `<script>` 放 head 且不加 `defer` 会阻塞首屏，页面白屏到脚本执行完。
- ⚠️ `<title>` 不能省略（可访问性 + SEO 都需要）。

## 章节导航

| 章节 | 内容 | 适合解决什么问题 |
| :--- | :--- | :--- |
| [文档结构](/3-reference/1-handbook/html/) | 骨架、meta、加载顺序 | 页面最外层怎么写 |
| [语义化标签](/3-reference/1-handbook/html/semantic) | 布局/文本/列表/表格语义 | 标签怎么选、结构怎么组织 |
| [表单与验证](/3-reference/1-handbook/html/forms) | 控件、label、原生验证 | 收集用户输入 |
| [音视频与图片](/3-reference/1-handbook/html/media) | 响应式图片、video/audio、Canvas/SVG | 页面媒体资源怎么放 |
| [SEO 与可访问性](/3-reference/1-handbook/html/seo) | 元信息、结构化数据、ARIA、键盘导航 | 让页面被搜到、人人可用 |

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
