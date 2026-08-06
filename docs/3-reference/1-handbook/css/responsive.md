---
title: CSS 响应式完整手册
---

# CSS 响应式

## 核心概念

一套代码，手机、平板、桌面都好看 —— 靠视口、媒体查询、弹性单位与弹性布局四件套。

## 完整内容

### 是什么 / 为什么

设备宽度从 320px（老手机）到 2560px+（大屏）不等。响应式设计的目标：**布局随宽度自适应**，而不是给每个设备写一套页面。核心思路是「内容流式、图片弹性、断点换档」。

### 一、视口（viewport）基础

**没有下面这行，移动端会把页面按桌面宽度渲染再缩小**，一切响应式都白搭：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 二、媒体查询（断点换档）

```css
/* 基础样式（先写手机，再逐级放大 = 移动优先） */
.container { padding: 12px; }

/* ≥ 768px 平板 */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

/* ≥ 1024px 桌面 */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

**两种思路**：

| 思路 | 写法 | 场景 |
| :--- | :--- | :--- |
| 移动优先 | `min-width` 逐级加 | 推荐：基础样式天然是手机版 |
| 桌面优先 | `max-width` 逐级减 | 已有桌面站快速适配 |

**常用断点**（不是铁律，以内容为准）：

| 断点 | 设备 |
| :--- | :--- |
| `≥ 480px` | 大屏手机 |
| `≥ 768px` | 平板 |
| `≥ 1024px` | 小桌面 / 横屏平板 |
| `≥ 1280px` | 标准桌面 |

### 三、弹性单位与弹性布局

**弹性单位**：

```css
html { font-size: 16px; }
.container {
  width: 100%;                    /* 百分比随容器变 */
  font-size: 1rem;                /* 相对根元素 */
  padding: clamp(12px, 3vw, 32px); /* 最小-首选-最大 */
}
```

**弹性布局**（响应式的真正主力）：

```css
/* 一维：flex 自动换行，项目伸缩 */
.flex-row { display: flex; flex-wrap: wrap; gap: 12px; }
.flex-row > * { flex: 1 1 200px; }   /* 每项至少 200px，空间多就多放 */

/* 二维：grid 自动填充列数，零媒体查询 */
.card-wall {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
```

**弹性图片/媒体**：

```css
img, video, iframe {
  max-width: 100%;    /* 不超出父容器，可缩不可放 */
  height: auto;       /* 保持比例 */
}
```

### 四、现代响应式：容器查询与 clamp

**容器查询（container queries）**：不再看视口，而是看**父容器**有多宽（组件级响应式）。

```css
.card-list {
  container-type: inline-size;   /* 声明为可查询容器 */
}
@container (min-width: 400px) {
  .card { flex-direction: row; } /* 容器变宽时卡片横排 */
}
```

**clamp() 自适应字号**：

```css
h1 {
  font-size: clamp(24px, 5vw, 56px);  /* 不小于 24px、不超过 56px、随视口线性变化 */
}
```

### 语法速查

| 手段 | 写法 | 说明 |
| :--- | :--- | :--- |
| 视口 | `<meta name="viewport">` | 响应式前提，必加 |
| 媒体查询 | `@media (min-width: 768px) { }` | 按视口断点换档 |
| 弹性单位 | `%` / `rem` / `vw` / `clamp()` | 让尺寸跟随环境 |
| 弹性布局 | `flex-wrap` + `flex: 1 1 基准` | 一维自适应 |
| 自动网格 | `repeat(auto-fit, minmax(最小, 1fr))` | 二维自适应 |
| 弹性媒体 | `img { max-width: 100% }` | 图片视频不溢出 |
| 容器查询 | `container-type` + `@container` | 组件级响应式 |

### 常见用法

**响应式三栏（桌面三列，手机单列）**：

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;                       /* 手机：单列 */
}
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }  /* 桌面：三列 */
}
```

**响应式导航（桌面横排，手机汉堡菜单切换）**：

```css
.nav { display: flex; flex-wrap: wrap; }
.nav .toggle { display: none; }         /* 手机用汉堡按钮 */
@media (max-width: 767px) {
  .nav { flex-direction: column; }
  .nav .menu { display: none; }
  .nav .menu.open { display: block; }
}
```

### 注意事项

- ⚠️ **没有 viewport meta 一切白搭**：先确认 HTML head 里有它。
- ⚠️ 移动端字号别用 `px` 定死小字，正文用 `rem`；`16px` 以下的字号 iOS 会「自动放大」（表单聚焦时）。
- ⚠️ `min-width` 断点要按从小到大写，`max-width` 从大到小写，否则会被覆盖。
- ⚠️ 别为每个小屏幕写断点，通常 2-3 个断点足够；优先用 `flex-wrap`/`auto-fit` 让布局自动适配。
- ⚠️ 桌面优先的 `max-width` 写法，手机上要先「卸载」桌面样式，容易漏；新手优先移动优先。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)（自适应卡片墙）
- 📖 相邻手册：[布局](/3-reference/1-handbook/css/layout)（flex/grid 弹性布局）、[文字与字体](/3-reference/1-handbook/css/typography)（rem 与 clamp）
