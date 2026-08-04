---
title: 07. 响应式设计
---

## 7.1 视口设置

### viewport meta 标签
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### viewport 参数说明
| 参数 | 说明 | 取值 |
|-----|------|------|
| `width` | 视口宽度 | `device-width` 或具体值 |
| `height` | 视口高度 | `device-height` 或具体值 |
| `initial-scale` | 初始缩放比 | `1.0` |
| `minimum-scale` | 最小缩放比 | `0.5` |
| `maximum-scale` | 最大缩放比 | `3.0` |
| `user-scalable` | 是否允许用户缩放 | `yes`, `no` |

::: warning 注意
- `width=device-width` 必须设置，否则移动端不会自适应
- 不推荐 `user-scalable=no`，影响可访问性
- 微信/QQ 等内置浏览器需要额外适配
:::
---

## 7.2 媒体查询

### 基础语法
```css
@media media-type and (media-feature) {
    /* 样式 */
}
```

### 媒体类型
| 类型 | 说明 |
|-----|------|
| `all` | 所有媒体（默认） |
| `screen` | 屏幕 |
| `print` | 打印 |
| `speech` | 屏幕阅读器 |

### 媒体特性
| 特性 | 说明 | 示例 |
|-----|------|------|
| `width` | 视口宽度 | `(width: 768px)` |
| `min-width` | 最小宽度 | `(min-width: 768px)` |
| `max-width` | 最大宽度 | `(max-width: 768px)` |
| `height` | 视口高度 | `(height: 600px)` |
| `orientation` | 屏幕方向 | `(orientation: portrait)` |
| `resolution` | 分辨率 | `(resolution: 2dppx)` |
| `aspect-ratio` | 宽高比 | `(aspect-ratio: 16/9)` |

### 逻辑操作符
| 操作符 | 说明 | 示例 |
|-------|------|------|
| `and` | 与 | `screen and (min-width: 768px)` |
| `or` (或 `,`) | 或 | `screen, print` |
| `not` | 非 | `not print` |
| `only` | 仅 | `only screen and (max-width: 600px)` |

::: tip `only` 的作用
防止老旧浏览器（不支持媒体查询的）错误应用样式
实际开发中通常省略
:::
### 示例
```css
/* 移动端 */
@media screen and (max-width: 767px) {
    .container { padding: 10px; }
    .sidebar { display: none; }
}

/* 平板 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
    .container { padding: 20px; }
}

/* 桌面 */
@media screen and (min-width: 1024px) {
    .container { max-width: 1200px; margin: 0 auto; }
}

/* 打印样式 */
@media print {
    .no-print { display: none; }
    body { color: black; background: white; }
}
```

---

## 7.3 断点策略

### 移动优先
```css
/* 默认：移动端样式 */
.container { padding: 10px; }

/* 平板 */
@media (min-width: 768px) {
    .container { padding: 20px; }
}

/* 桌面 */
@media (min-width: 1024px) {
    .container { padding: 30px; }
}
```

### 桌面优先
```css
/* 默认：桌面端样式 */
.container { padding: 30px; }

/* 平板 */
@media (max-width: 1023px) {
    .container { padding: 20px; }
}

/* 移动端 */
@media (max-width: 767px) {
    .container { padding: 10px; }
}
```

### 常用断点
| 设备类型 | 断点范围 | 说明 |
|---------|---------|------|
| 手机 | < 768px | iPhone / Android |
| 平板 | 768px - 1023px | iPad 等 |
| 桌面 | ≥ 1024px | 笔记本 / PC |
| 大屏 | ≥ 1440px | 高清屏 |

::: tip 建议
- 使用 **Mobile First** 策略
- 不要为了特定设备设置断点
- 让内容决定断点（从宽到窄测试，找到断点）
- 结合 Flexbox / Grid 实现流式布局
:::
---

## 7.4 容器查询

### 基础概念
容器查询是根据**容器尺寸**而非视口尺寸来调整样式。

```css
.card-container {
    container-type: inline-size;
    container-name: card;
}

@container card (min-width: 400px) {
    .card {
        display: flex;
        flex-direction: row;
    }
}

@container card (max-width: 399px) {
    .card {
        display: flex;
        flex-direction: column;
    }
}
```

### 偏好媒体查询

```css
/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #e0e0e0;
  }
}

/* 减少动画（无障碍） */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 触摸设备 */
@media (hover: none) and (pointer: coarse) {
  /* 触摸设备专用样式 */
}
```

| 媒体特性 | 用途 |
|---------|------|
| `prefers-color-scheme` | 暗色/亮色模式适配 |
| `prefers-reduced-motion` | 减少动画（前庭障碍用户） |
| `hover` | 是否支持悬停（触摸设备为 none） |
| `pointer` | 指针精度（coarse 触摸 / fine 鼠标） |

### 动态视口单位

移动端 `100vh` 会包含地址栏，导致内容被遮挡。使用动态视口单位解决：

| 单位 | 含义 |
|------|------|
| `dvh` | 动态视口高度（地址栏显隐时自动调整） |
| `svh` | 小视口高度（地址栏显示时） |
| `lvh` | 大视口高度（地址栏隐藏时） |

```css
.fullscreen {
  height: 100dvh; /* 推荐：动态适配 */
}
```

---

::: tip 速查手册
本章核心语法已收录到独立的 [速查手册](/cheatsheet/) 中，方便开发时快速查阅。
:::


---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 响应式设计 演示](/demos/02-css/07-responsive.html)
:::
