---
title: CSS 文字与字体完整手册
---

# CSS 文字与字体

## 核心概念

字怎么排、大小怎么定、间距怎么调 —— 全部由 font 家族与文本属性控制。

## 完整内容

### 是什么 / 为什么

网页 90% 的内容是文字。文字相关的属性分两族：**font（字体本身）**与**text（文本排版）**。理解「哪些属性可继承」是少写重复样式的关键。

### 一、字体族 font-family

```css
body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
}
```

- 浏览器按顺序**逐个尝试**，找不到就换下一个；最后给一个通用族（`sans-serif` / `serif` / `monospace`）兜底。
- 中文字体名用引号包裹；`monospace` 用于代码（等宽）。
- 引入外部字体用 `@font-face`，配合 `font-display: swap` 避免文字不可见。

### 二、字号与单位

```css
p {
  font-size: 16px;        /* 绝对单位：不随环境缩放 */
  font-size: 1rem;        /* 相对根元素（html）字号，最推荐 */
  font-size: 1.5em;       /* 相对父元素字号 */
  font-size: 2vw;         /* 相对视口宽度，可做响应式字 */
}
```

**单位选型**：

| 单位 | 参照 | 适用 |
| :--- | :--- | :--- |
| `px` | 固定像素 | 边框、小字号、不用缩放的地方 |
| `rem` | 根元素 `html` 字号 | **正文与间距首选**（改 html 字号即可全局缩放） |
| `em` | 父元素字号 | 需要相对父级缩放的局部（按钮内边距） |
| `vw` / `vh` | 视口宽 / 高 | 全屏大标题、视觉冲击字 |
| `clamp()` | min(首选, 区间) | `clamp(14px, 2vw, 20px)` 自适应区间字号 |

### 三、字重、行高与间距

```css
p {
  font-weight: 700;         /* 100-900，或 normal/bold；可变字体可任意值 */
  line-height: 1.6;         /* 无单位 = 字号倍数，最推荐（继承时按自身字号算） */
  letter-spacing: 0.05em;   /* 字间距（标题加宽更精致） */
  word-spacing: 0.2em;      /* 词间距（英文） */
}
```

**line-height 的三种写法**：

```css
line-height: 24px;   /* 固定像素：继承时可能不适配大字号 */
line-height: 160%;   /* 百分比：继承的是计算后的像素值，也容易错 */
line-height: 1.6;    /* 无单位：继承后按自身字号重新计算 ✓ 推荐 */
```

### 四、文本排版

```css
p {
  text-align: center;        /* left / right / center / justify（两端对齐） */
  text-decoration: none;     /* underline / line-through / overline */
  text-transform: uppercase; /* uppercase / lowercase / capitalize */
  text-indent: 2em;          /* 首行缩进 */
  text-overflow: ellipsis;   /* 单行省略号（需配合 overflow + white-space） */
  white-space: nowrap;       /* 不换行 */
  word-break: break-all;     /* 断行规则 */
  text-shadow: 0 2px 4px rgba(0,0,0,.5); /* 文字阴影 */
}
```

**单行省略号三件套（高频）**：

```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

**多行省略号（-webkit 方案）**：

```css
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;      /* 显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 五、可继承属性速记

| 可继承（写父级，子级自动生效） | 不可继承（每个元素要自己设） |
| :--- | :--- |
| `color`、`font-*`、`line-height`、`letter-spacing`、`text-align`、`text-indent`、`white-space`、`visibility` | `margin`、`padding`、`border`、`background`、`width/height`、`display`、`position`、`overflow` |

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `font-family` | 字体列表 + 通用族 | 字体族 |
| `font-size` | `px` / `rem` / `em` / `vw` / `clamp()` | 字号（正文用 rem） |
| `font-weight` | `100-900` / `normal` / `bold` | 字重 |
| `font-style` | `normal` / `italic` | 斜体 |
| `font` | 简写：`style weight size/line-height family` | 一次设置，注意顺序 |
| `line-height` | 无单位倍率最推荐 | 行高 |
| `letter-spacing` | 长度 / `normal` | 字间距 |
| `text-align` | `left` / `right` / `center` / `justify` | 水平对齐 |
| `text-decoration` | `underline` / `line-through` / `none` | 装饰线 |
| `text-transform` | `uppercase` / `lowercase` / `capitalize` | 大小写 |
| `text-overflow` | `ellipsis` / `clip` | 溢出省略（配 nowrap + hidden） |
| `white-space` | `nowrap` / `pre` / `pre-wrap` / `normal` | 空白与换行处理 |
| `word-break` | `normal` / `break-all` / `keep-all` | 断行规则 |
| `text-shadow` | `x y 模糊 颜色` | 文字阴影 |

### 常见用法

**站点字号与行高基线**：

```css
:root { font-size: 16px; }
body {
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
}
```

**响应式标题（clamp 自适应）**：

```css
h1 {
  font-size: clamp(24px, 4vw, 48px);
  letter-spacing: 0.03em;
}
```

**代码块等宽字体**：

```css
code, pre {
  font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
  font-size: 0.9em;
}
```

### 注意事项

- ⚠️ 中文正文别用 `justify` 两端对齐，会出现「字间拉出大空隙」的河。
- ⚠️ `em` 会随父级嵌套**逐级放大**（如多层标题），深嵌套时优先用 `rem`。
- ⚠️ 移动端防「点击字体放大」：`font-size: 16px` 以上或设 `<meta name="viewport">`。
- ⚠️ 继承陷阱：`line-height: 160%` 继承的是**算好的像素值**，子级大字会挤压；用无单位倍率。
- ⚠️ 省略号三件套缺一不可，`text-overflow` 单独设无效。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)（文字居中/对齐）
- 📖 相邻手册：[颜色与背景](/3-reference/1-handbook/css/color-bg)、[响应式](/3-reference/1-handbook/css/responsive)
