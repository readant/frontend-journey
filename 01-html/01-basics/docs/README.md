# 模块 1：HTML 基础入门

> 掌握 HTML 文档结构、常用文本标签、列表、链接、图片和表格，能独立编写基础网页。

## 学习路线

1. **Hello World**（预计 5 分钟）→ `01-hello-world.html`
   - 第一个网页，理解 HTML 基本结构
2. **文档结构详解**（预计 15 分钟）→ `02-document-structure.html` + [详细文档](02-document-structure.md)
   - DOCTYPE、head、body 的作用，meta 标签家族
3. **文本标签**（预计 15 分钟）→ `03-text-tags.html`
   - 标题、段落、格式化、容器标签
4. **列表**（预计 10 分钟）→ `04-lists.html`
   - 无序列表、有序列表、定义列表
5. **链接与图片**（预计 20 分钟）→ `05-links-and-images.html` + [详细文档](05-links-and-images.md)
   - 超链接属性、图片嵌入、响应式图片
6. **表格**（预计 15 分钟）→ `06-tables.html` + [详细文档](06-tables.md)
   - 表格结构、单元格合并、无障碍访问

## 知识点大纲

### HTML 文档结构

- `<!DOCTYPE html>` 声明：告诉浏览器使用 HTML5 标准
- `<html lang="zh-CN">`：根元素，lang 属性影响 SEO 和无障碍
- `<head>` 区域：存放元数据（用户不可见）
  - `<meta charset="UTF-8">`：字符编码，必须放在 head 最前面
  - `<meta name="viewport">`：移动端适配，固定写法
  - `<meta name="description">`：搜索引擎结果页显示的描述
  - `<title>`：浏览器标签页标题
  - `<link>`：引入外部资源（CSS、favicon）
- `<body>` 区域：所有可见内容

### 文本标签

| 标签 | 作用 | 语义 |
|------|------|------|
| `<h1>`~`<h6>` | 标题，h1 最大 | 文档大纲层级 |
| `<p>` | 段落 | 独立文本块 |
| `<br>` | 换行（单标签） | 打断当前行 |
| `<hr>` | 水平线（单标签） | 内容主题分隔 |
| `<strong>` | 加粗 | 重要性强调 |
| `<em>` | 斜体 | 语气强调 |
| `<mark>` | 高亮 | 参考/搜索关键词 |
| `<small>` | 小号文本 | 法律声明、注释 |
| `<del>` | 删除线 | 被删除的内容 |
| `<ins>` | 下划线 | 新插入的内容 |
| `<sub>` / `<sup>` | 下标 / 上标 | 化学式、数学公式 |
| `<code>` | 行内代码 | 代码片段 |
| `<pre>` | 预格式文本 | 保留空格和换行 |
| `<blockquote>` | 引用块 | 长引用 |
| `<q>` | 行内引用 | 短引用 |
| `<abbr>` | 缩写 | 鼠标悬停显示全称 |
| `<time>` | 日期/时间 | 机器可读的时间 |
| `<div>` | 块级容器 | 无语义分组 |
| `<span>` | 行内容器 | 无语义行内包裹 |

### 列表

| 类型 | 标签 | 用途 | 示例场景 |
|------|------|------|----------|
| 无序列表 | `<ul>` + `<li>` | 无先后关系的项目 | 购物清单、功能列表 |
| 有序列表 | `<ol>` + `<li>` | 有顺序的步骤 | 操作步骤、排行榜 |
| 定义列表 | `<dl>` + `<dt>` + `<dd>` | 术语和定义 | 术语表、FAQ |

**注意：** `<li>` 只能放在 `<ul>`、`<ol>`、`<menu>` 内部，不能单独使用。

### 链接与图片

- `<a>` 超链接：href（地址）、target（打开方式）、rel（关系）、title（提示）
- `<img>` 图片：src（来源）、alt（替代文本）、width/height（尺寸）、loading="lazy"（懒加载）
- `<picture>` 响应式图片：根据屏幕尺寸加载不同图片

### 表格

- 基础结构：`<table>` → `<thead>` / `<tbody>` / `<tfoot>` → `<tr>` → `<th>` / `<td>`
- 合并单元格：colspan（跨列）、rowspan（跨行）
- 无障碍：`<th scope="col|row">` 帮助屏幕阅读器理解表头

## 重难点总结

| 难点 | 说明 | 对应案例 |
|------|------|----------|
| meta viewport 写法 | 必须精确写 `width=device-width, initial-scale=1.0`，多一个空格都会失效 | `02-document-structure.html` |
| `<strong>` vs `<b>` | strong 有语义（重要性），b 只是视觉加粗，应优先用 strong | `03-text-tags.html` |
| `<a>` 的 target="_blank" 安全问题 | 新窗口打开的页面可通过 `window.opener` 访问原页面，需加 `rel="noopener noreferrer"` | `05-links-and-images.html` |
| colspan/rowspan 行数计算 | 合并后总列数必须等于该行应有的列数，否则表格错位 | `06-tables.html` |
| `<img>` 的 alt 文本 | 装饰性图片用 `alt=""`（空），信息性图片必须写描述 | `05-links-and-images.html` |

## 案例索引

| 案例文件 | 配套文档 | 说明 |
|----------|----------|------|
| `01-hello-world.html` | - | 极简入门，第一个网页 |
| `02-document-structure.html` | [02-document-structure.md](02-document-structure.md) | 文档结构 + meta 标签详解 |
| `03-text-tags.html` | - | 文本标签全景演示 |
| `04-lists.html` | - | 三种列表对比 |
| `05-links-and-images.html` | [05-links-and-images.md](05-links-and-images.md) | 链接与图片详解 |
| `06-tables.html` | [06-tables.md](06-tables.md) | 表格结构与合并详解 |

## 参考资源

- [MDN - HTML 基础](https://developer.mozilla.org/zh-CN/docs/Learn/HTML)
- [MDN - 文本标签](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)
- [W3School - HTML 教程](https://www.w3school.com.cn/html/index.asp)
- [caniuse - 浏览器兼容性查询](https://caniuse.com/)
