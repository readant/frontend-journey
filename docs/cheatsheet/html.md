---
title: HTML 速查
---

# HTML 速查

## 基础入门

### 文档骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
</head>
<body>
  <!-- 可见内容 -->
</body>
</html>
```

### 常用文本标签

| 标签 | 语义 | 标签 | 语义 |
|------|------|------|------|
| `<h1>`~`<h6>` | 标题层级 | `<strong>` | 重要（加粗） |
| `<p>` | 段落 | `<em>` | 强调（斜体） |
| `<br>` | 换行 | `<hr>` | 主题分隔 |
| `<del>`/`<ins>` | 删除/插入 | `<mark>` | 高亮 |
| `<code>`+`<pre>` | 代码块 | `<blockquote>` | 引用 |

### 列表

```html
<ul><li>无序</li></ul>
<ol><li>有序</li></ol>
<dl><dt>术语</dt><dd>定义</dd></dl>
```

### 链接与图片

```html
<a href="https://example.com" target="_blank" rel="noopener">外链</a>
<a href="#section">页内锚点</a>
<img src="a.jpg" alt="描述" loading="lazy">
```

### 表格

```html
<table>
  <thead><tr><th scope="col">姓名</th></tr></thead>
  <tbody><tr><td colspan="2">合并 2 列</td></tr></tbody>
</table>
```

### HTML 实体

| 实体 | 字符 | 实体 | 字符 |
|------|------|------|------|
| `&lt;` | < | `&gt;` | > |
| `&amp;` | & | `&nbsp;` | 空格 |
| `&copy;` | © | `&quot;` | " |

## 语义化标签

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

## 表单与交互

### 表单骨架

```html
<form action="/api/login" method="post">
  <fieldset>
    <legend>分组标题</legend>
    <label for="user">用户名：</label>
    <input type="text" id="user" name="user" required>
  </fieldset>
  <button type="submit">提交</button>
</form>
```

### input 类型速查

| type | 用途 | type | 用途 |
|------|------|------|------|
| `text` | 文本 | `password` | 密码 |
| `email` | 邮箱（自动验证） | `url` | 网址 |
| `number` | 数字 | `tel` | 电话 |
| `date`/`time` | 日期/时间 | `checkbox` | 复选 |
| `radio` | 单选 | `file` | 文件 |
| `hidden` | 隐藏 | `range` | 滑块 |
| `color` | 颜色 | `submit`/`reset`/`button` | 按钮 |

### 验证属性

| 属性 | 作用 |
|------|------|
| `required` | 必填 |
| `minlength`/`maxlength` | 字符长度 |
| `min`/`max`/`step` | 数值范围与步长 |
| `pattern` | 正则（无需 `/.../`） |
| `novalidate` | form 级禁用验证 |

### 其他控件

```html
<select name="city"><option value="bj">北京</option></select>
<textarea rows="4" maxlength="200"></textarea>
<button type="submit|reset|button">按钮</button>
```

### 易错点

- radio 同组必须 `name` 相同才互斥
- label 的 `for` 必须等于 input 的 `id`
- `disabled` 不提交值，`readonly` 提交值
- 文件上传 form 必须 `enctype="multipart/form-data"`

## 多媒体

### 视频与音频

```html
<video controls autoplay muted loop poster="cover.jpg" width="600" playsinline>
  <source src="v.mp4" type="video/mp4">
  浏览器不支持 video
</video>
<audio controls preload="metadata">
  <source src="a.mp3" type="audio/mpeg">
</audio>
```

### 媒体属性

| 属性 | 作用 |
|------|------|
| `controls` | 显示控件 |
| `autoplay` + `muted` | 自动播放（须静音） |
| `loop` | 循环 |
| `poster` | 封面（仅 video） |
| `preload` | `none`/`metadata`/`auto` |
| `playsinline` | iOS 内联播放 |

### Canvas 基础

```html
<canvas id="c" width="600" height="400"></canvas>
<script>
const ctx = document.getElementById('c').getContext('2d');
ctx.fillRect(10, 10, 100, 50);
ctx.beginPath();
ctx.arc(50, 50, 30, 0, Math.PI * 2);
ctx.fill();
</script>
```

### HTML5 新交互标签

| 标签 | 作用 |
|------|------|
| `<details>` + `<summary>` | 折叠面板 |
| `<dialog>` | 原生对话框 |
| `<progress>` | 进度条 |
| `<meter>` | 度量条 |
| `<template>` | 模板（不渲染） |

## 实战项目

### 简历结构模板

```html
<main class="resume">
  <header><h1>姓名</h1><p>联系方式</p></header>
  <section><h2>教育背景</h2><table>...</table></section>
  <section><h2>工作经历</h2><article>...</article></section>
  <section><h2>技能</h2><div class="tags"><span>HTML</span></div></section>
</main>
```

### 博客结构模板

```html
<body>
  <header><nav>...</nav></header>
  <main>
    <article><h2>标题</h2><time>日期</time><p>摘要</p></article>
    <aside><section><h3>分类</h3></section></aside>
  </main>
  <footer>...</footer>
</body>
```

### 项目自检清单

- [ ] 使用了至少 5 种语义标签
- [ ] 表格有 `<thead>`/`<tbody>`
- [ ] 所有图片有 `alt`
- [ ] 链接新窗口有 `rel="noopener"`
- [ ] 移动端 viewport 已设置
- [ ] 页面在 375px 宽度下不溢出
