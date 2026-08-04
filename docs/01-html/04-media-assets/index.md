---
title: 04. 音视频与图片
---

# 音视频与图片

## 它是什么

HTML 中所有"媒体资产"——**图片、视频、音频、绘图画布、第三方嵌入**——由这一组标签承载：

```
<img> / <picture>    位图图片（最基础、最常用）
<video> / <audio>    音视频播放
<track>              字幕与音轨
<canvas>             位图绘图画布（配合 JS）
<svg>                矢量图形（也是一种 HTML 内联元素）
<iframe>             嵌入第三方页面
```

核心认知：**媒体标签不只是"放个文件"，它们各自有一套资源选择、加载与降级机制**，理解这些机制才能写出不卡顿、不破版的页面。

## 核心机制

### 1. 图片资源选择机制（srcset / sizes）

`<img>` 根据**设备像素密度与视口宽度**从多个候选图中自动选一张：

```html
<img
  src="default.jpg"   <!-- 兜底：不支持 srcset 的老浏览器 -->
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="响应式图片">
```

| 属性 | 作用 | 关键点 |
| --- | --- | --- |
| `srcset` | 候选图列表 | `图片地址 + 宽w或密度x`（如 `480w`、`2x`） |
| `sizes` | 告知浏览器图片的**显示宽度** | 媒体条件 + 长度（如 `(max-width:600px) 100vw`） |
| `src` | 兜底图 | 必须写，兼容老浏览器 |

浏览器**不会下载所有候选图**，而是按视口宽度 + 像素密度选一张下载——这正是节省带宽的核心。

### 2. 视频多格式回退（source 选择）

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持 video 标签。
</video>
```

浏览器**从上到下读取 `<source>`，加载第一个 `type` 支持的格式**。标签内最后一行文字是"完全不支持"时的兜底。

### 3. 浏览器自动播放策略

现代浏览器**禁止"有声自动播放"**（用户体验策略），规则是：

- 带声音 + `autoplay` → 被拦截
- `autoplay` + `muted` → 允许
- 用户已与该域有交互（点击过页面）后 → 允许有声自动播放

```html
<!-- 正确：静音自动播放（背景视频标配） -->
<video autoplay muted loop playsinline></video>
```

## 标准语法

### 图片

```html
<!-- 基础：alt 必写 -->
<img src="photo.jpg" alt="夕阳下的海滩" width="800" height="600">

<!-- 艺术指导：不同屏幕放不同构图 -->
<picture>
  <source media="(max-width: 600px)" srcset="portrait.jpg">
  <source media="(max-width: 1200px)" srcset="landscape.jpg">
  <img src="default.jpg" alt="风景">
</picture>
```

| 属性 | 作用 | 注意 |
| --- | --- | --- |
| `alt` | 替代文本 | 装饰图写 `alt=""`（空），信息图必须描述 |
| `width` / `height` | 尺寸 | **建议写死**，防止 CLS（见深入理解） |
| `loading` | 懒加载 | `lazy`（视口附近才加载）/ `eager`（默认） |
| `decoding` | 解码策略 | `async` 异步解码，减轻主线程 |
| `fetchpriority` | 加载优先级 | `high`（首屏 LCP 图） |

### 视频与音频

```html
<video controls width="640" poster="cover.jpg" preload="metadata" playsinline>
  <source src="movie.mp4" type="video/mp4">
  <track kind="subtitles" src="subs.zh.vtt" srclang="zh" label="中文字幕" default>
</video>

<audio controls preload="metadata">
  <source src="song.mp3" type="audio/mpeg">
</audio>
```

| 属性 | 作用 | 注意事项 |
| --- | --- | --- |
| `controls` | 显示播放控件 | 不加则没有播放界面 |
| `autoplay` | 自动播放 | 必须同时 `muted` 才被允许 |
| `muted` | 静音 | autoplay 的必备搭档 |
| `loop` | 循环播放 | 背景视频 |
| `poster` | 封面图 | 仅 video 有 |
| `preload` | 预加载策略 | `none` / `metadata`（推荐）/ `auto` |
| `playsinline` | iOS 内联播放 | 移动端必须加，否则全屏播放 |

**常见格式**：video 用 mp4（H.264 兼容最好）+ webm（开源体积小）；audio 用 mp3 + ogg。

### Canvas 绘图（配合 JS）

```javascript
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');     // 2D 绘图上下文

ctx.fillStyle = '#3498db';
ctx.fillRect(10, 10, 100, 50);           // 填充矩形
ctx.beginPath();                          // 新路径
ctx.arc(200, 60, 30, 0, Math.PI * 2);    // 圆
ctx.fill();
ctx.strokeStyle = '#2ecc71';
ctx.strokeRect(10, 80, 280, 30);         // 描边矩形
```

**坐标系**：左上角为 `(0,0)`，x 向右增大，y **向下**增大。

### SVG（内联矢量）

```html
<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="blue"/>
  <rect x="10" y="10" width="30" height="30" fill="red"/>
</svg>
```

SVG 是矢量图形（放大不失真），**可用 CSS 控制样式**（fill/stroke），适合图标、图表、Logo。

### iframe 嵌入

```html
<iframe src="https://example.com" width="600" height="400" loading="lazy"
        sandbox="allow-scripts allow-same-origin"></iframe>
```

::: danger iframe 安全
嵌入第三方内容时用 `sandbox` 限制权限（无属性 = 全禁；按需放行 `allow-scripts`、`allow-same-origin` 等）。**不要同时放开 `allow-scripts` 和 `allow-same-origin`**，否则嵌入页面可操作你的顶层文档（"沙箱逃逸"）。
:::

## 深入理解

### 1. 图片加载性能（CLS 与 LCP）

**CLS（累积布局偏移）**：图片加载完成前若不占位，加载后会把下方内容"顶下去"，用户点错按钮——这是 Core Web Vitals 指标之一。

```html
<!-- 正确：宽高写死，浏览器提前预留空间 -->
<img src="photo.jpg" alt="风景" width="800" height="600">

<!-- 配合 CSS 自适应 -->
<style>img { max-width: 100%; height: auto; }</style>
```

**LCP（最大内容绘制）**：首屏最大元素往往是图片。提升方式：

```html
<!-- 首屏图：优先加载 -->
<img src="hero.jpg" fetchpriority="high" decoding="async">
```

**懒加载**：首屏以下的图用 `loading="lazy"`，延迟到接近视口才加载，节省带宽。

```html
<img src="article-1.jpg" loading="lazy" alt="正文配图">
```

### 2. Canvas vs SVG（位图 vs 矢量）

| 对比 | Canvas | SVG |
| --- | --- | --- |
| 本质 | 像素位图 | 矢量图形 |
| 放大 | 模糊 | 不失真 |
| CSS 控制 | 无法控制内部元素 | 可控制（fill/stroke） |
| 性能 | 大量元素时更快（游戏/图表） | 元素少时更优 |
| 交互 | 需自己做命中检测 | 原生 DOM 事件 |
| 适用 | 游戏、动态图表、像素级处理 | 图标、Logo、静态图形 |

::: warning Canvas 画完即像素
Canvas 绘制后无法再通过 CSS 调整内部图形；要做点击交互需自己计算坐标命中。SVG 则直接是 DOM，天然可交互。
:::

### 3. video 的预加载权衡

- `preload="none"`：不预加载，点播放才下载（省流量，但首帧慢）
- `preload="metadata"`：只加载时长/尺寸等元数据（**推荐默认**）
- `preload="auto"`：尽量加载全部（页面卡顿风险）

移动端蜂窝网络下，浏览器常忽略 `auto` 直接按 `metadata` 处理。

### 4. template 与 dialog（"半隐藏"的媒体容器）

```html
<template id="card">
  <article class="card"><h3>标题</h3></article>
</template>
<script>
  const tpl = document.getElementById('card');
  document.body.append(tpl.content.cloneNode(true));  // 克隆后插入才生效
</script>
```

- `<template>` 内容**不渲染、不加载资源**，直到被 JS 克隆插入 DOM
- `<dialog>` 默认隐藏，`show()` 显示（无遮罩）/ `showModal()` 模态显示（有遮罩、可 ESC 关闭）

### 5. 经典误区

- ❌ 视频 `<video>` 只写一个 mp4 源 → 旧浏览器（如老 Safari）不支持就直接空白，应提供 webm 回退 + 提示文字
- ❌ 图片不写宽高 → CLS 飙升
- ❌ `autoplay` 不带 `muted` → 被浏览器拦截，效果不生效
- ❌ iframe 裸嵌入第三方 → 安全风险，用 sandbox
- ❌ Canvas 的 width/height 用 CSS 设置 → CSS 只影响显示尺寸，绘图分辨率不变，会模糊；要在属性或 JS 里设置

## 关联速查

::: tip 速查卡片
媒体标签的完整速查（含可运行示例），见 [HTML 多媒体与 Canvas 速查](/cheatsheet/html/media)。
:::

::: info 互动演示
视频音频 / Canvas / 新交互标签案例：[媒体演示](/examples/01-html/04-media-assets/01-video-audio.html)
:::
