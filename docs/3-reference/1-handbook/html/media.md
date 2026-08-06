---
title: HTML 音视频与图片完整手册
---

# 音视频与图片

## 核心概念

图片的**响应式三件套**（`srcset` + `sizes` + `picture`）、原生音视频播放、以及 Canvas / SVG 两种「动态图形」方案。

## 完整内容

### 是什么 / 为什么

媒体资源是页面体量的主要来源：选错方案轻则模糊、重则浪费流量。本页把「图片怎么放、视频怎么播、图形怎么画」一次性说清。

### 一、图片基础与响应式

```html
<!-- 基础：alt 是必须的（加载失败/读屏/SEO 都靠它） -->
<img src="photo.jpg" alt="一张风景照" />

<!-- 密度适配：2x 高分屏用高清图 -->
<img src="photo.jpg" srcset="photo@2x.jpg 2x" alt="风景照" />

<!-- 宽度适配：按视口宽度选图（sizes 告诉浏览器真实显示宽度） -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="响应式风景照"
/>
```

| 属性 | 作用 |
| :--- | :--- |
| `alt` | 图片的文字替代（**必须**） |
| `srcset` | 候选图列表（`2x` 密度写法 / `400w` 宽度写法） |
| `sizes` | 各视口下图片的实际展示宽度，配合 `w` 描述符让浏览器择优 |
| `loading="lazy"` | 懒加载（进入视口才加载） |
| `fetchpriority="high"` | 首屏大图提高加载优先级 |

**`picture` 元素**：按条件换图（格式 + 视口），适合 WebP 降级与美术裁剪：

```html
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="浏览器不支持新格式时的兜底" />
</picture>
```

**图片格式选型**：

| 格式 | 特点 | 适用 |
| :--- | :--- | :--- |
| JPEG | 体积小、有损、无透明 | 照片、大图 |
| PNG | 无损、支持透明 | 截图、带透明 logo |
| **WebP** | 体积更小、有损/无损/透明都行 | **现代 Web 首选** |
| **AVIF** | 压缩率再上一档 | 支持环境（新版 Chrome/FF/Safari） |
| SVG | 矢量、任意缩放不失真、可 CSS 控制 | 图标、插画、logo |
| GIF | 动画但体积大、色域低 | 小动画（新项目用 WebP 动画/视频替代） |

**经验**：内容图片尽量输出 WebP/AVIF（用 `picture` 做旧浏览器降级）；图标与简单图形一律 SVG；照片用 JPEG/WebP。

**懒加载细节**：

```html
<img src="thumb.jpg" loading="lazy" decoding="async" fetchpriority="low" alt="..." />
```

| 属性 | 作用 |
| :--- | :--- |
| `loading="lazy"` | 滚动到视口附近才加载 |
| `decoding="async"` | 异步解码，不阻塞渲染 |
| `fetchpriority` | `high` 给 LCP 首屏大图 / `low` 给懒加载图 |

**注意**：`loading="lazy"` 对首屏（LCP）图片反而有害——会推迟加载，首屏图不设 lazy、加 `fetchpriority="high"`。

### 二、视频与音频

```html
<video controls width="640" poster="cover.jpg" preload="metadata">
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.webm" type="video/webm" />
  你的浏览器不支持视频播放。
</video>

<audio controls preload="metadata">
  <source src="music.mp3" type="audio/mpeg" />
  你的浏览器不支持音频播放。
</audio>
```

| 属性 | 作用 |
| :--- | :--- |
| `controls` | 显示原生控制条 |
| `autoplay` | 自动播放（多数浏览器要求静音才放行） |
| `muted` | 静音（配合 autoplay） |
| `loop` | 循环 |
| `poster` | 视频封面 |
| `preload` | `auto`/`metadata`/`none` 预载策略 |

### 三、Canvas：像素画布

Canvas 是**逐像素**绘制的 2D 位图画布，适合图表、粒子、游戏画面。

```html
<canvas id="chart" width="400" height="300"></canvas>
<script>
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d"); // 取 2D 上下文

  ctx.fillStyle = "#34d399";           // 填充色
  ctx.fillRect(20, 20, 150, 100);     // 画一个矩形
  ctx.beginPath();                    // 开始路径
  ctx.arc(280, 120, 50, 0, Math.PI * 2); // 画圆
  ctx.fill();
</script>
```

### 四、SVG：矢量图形

SVG 是**基于 XML 的矢量图形**，放大不失真、可被 CSS/JS 操作，适合图标、logo、插画。

```html
<svg viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#6ea8ff" stroke="#1b2a6b" stroke-width="4" />
</svg>
```

### 五、iframe：嵌入外部页面

```html
<iframe
  src="https://example.com/widget"
  title="外部小部件"
  loading="lazy"
  allowfullscreen
></iframe>
```

| 注意点 | 说明 |
| :--- | :--- |
| 必须 `title` | 读屏需要知道嵌入的是什么 |
| 慎用 | 嵌入第三方页面有性能与安全成本 |
| 沙箱 | 内容不可信时加 `sandbox` 限制权限 |

### 语法速查

| 需求 | 方案 |
| :--- | :--- |
| 高分屏清晰 | `srcset` + `2x` |
| 窄屏省流量 | `srcset` + `w` 描述符 + `sizes` |
| 多格式兜底 | `picture` + `source` 列表 |
| 图片懒加载 | `loading="lazy"` |
| 播放视频 | `video` + `source` 多格式 |
| 位图动态绘制 | Canvas 2D |
| 矢量图形 | 内联 SVG |
| 嵌入第三方 | `iframe` + `title` |

### 常见用法

**首屏 LCP 大图优化**：

```html
<img
  src="hero-1200.jpg"
  srcset="hero-800.jpg 800w, hero-1200.jpg 1200w, hero-1920.jpg 1920w"
  sizes="100vw"
  alt="活动主视觉"
  fetchpriority="high"
/>
```

### 注意事项

- ⚠️ 图片**必须写 `alt`**（装饰性图片可写 `alt=""` 而非省略）。
- ⚠️ `sizes` 不写或写错，`srcset` 的宽度适配基本失效。
- ⚠️ `autoplay` 不带 `muted` 会被浏览器拦截。
- ⚠️ Canvas 内容读屏不可见，重要信息需用文本或 ARIA 补充；SVG 默认可被读屏读取。
- ⚠️ `iframe` 缺 `title` 会过无障碍审计。

## 相关

- 📖 相邻手册：[HTML 文档结构](/3-reference/1-handbook/html/)、[SEO 与可访问性](/3-reference/1-handbook/html/seo)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
