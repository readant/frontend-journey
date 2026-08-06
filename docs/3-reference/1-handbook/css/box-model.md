---
title: CSS 盒模型完整手册
---

# CSS 盒模型

## 核心概念

每个元素都是一个盒子：内容 + 内边距 + 边框 + 外边距。

## 完整内容

### 是什么

浏览器把每个元素渲染成一个矩形盒子，盒子由外到内四层组成：

```
┌──────────── margin（外边距，透明）────────────┐
│ ┌────────── border（边框）──────────┐ │
│ │ ┌──────── padding（内边距）────────┐ │ │
│ │ │        content（内容区）         │ │ │
│ │ └────────────────────────┘ │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

| 层 | 属性 | 作用 |
| :--- | :--- | :--- |
| 内容 | `width` / `height` | 实际装内容的空间 |
| 内边距 | `padding` | 内容与边框的间距（可设四边） |
| 边框 | `border` | 边缘线（宽/样式/颜色） |
| 外边距 | `margin` | 盒子与外部元素的间距 |

### 为什么有 content-box 和 border-box

`box-sizing` 决定 `width` 算到哪一层：

```css
/* 默认：width 只算内容区，实际占位 = width + padding + border */
* { box-sizing: content-box; }

/* 推荐：width 包含 padding 和 border，算出的总宽就是声明的宽 */
* { box-sizing: border-box; }
```

```css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid #000;
  /* content-box → 实际总宽 200 + 40 + 4 = 244px */
  /* border-box  → 实际总宽就是 200px，内容区被压缩 */
}
```

**为什么统一用 border-box**：百分比栅格、flex/grid 布局里，宽度按百分比分配时不会被 padding 撑破，「50% + 50% > 100% 换行」的经典 Bug 从此消失。

### margin 的三大坑

**1. 垂直 margin 合并（塌陷）**：相邻块级元素的垂直 margin 取较大值，不是相加。

```css
/* .a 的 margin-bottom: 30px，.b 的 margin-top: 20px → 间距 30px 而非 50px */
```

**2. 父子 margin 合并**：子元素的 margin-top 会穿透到父元素（父元素没有 padding/border/overflow 等阻隔时）。

```css
.parent { /* 没有 padding/border 时 */ }
.child { margin-top: 20px; }  /* 结果：parent 整体被顶下来 20px */
```

**防穿透**：给父元素加 `padding-top`、`border-top`、`overflow: hidden`，或父元素建立 BFC（`display: flow-root`）。

**3. margin: auto 只能水平居中**：块级元素设 `width` 后 `margin: 0 auto` 水平居中；垂直居中必须交给 flex/grid。

### BFC（块级格式化上下文）

BFC 是一个独立渲染区域：内部元素的浮动、外边距**不泄漏**到外部。触发方式（任选其一）：

- `display: flow-root`（推荐，无副作用）
- `overflow: hidden / auto / scroll`
- `display: flex / grid / inline-block`
- `position: absolute / fixed`
- `float: left / right`

**典型用途**：清除浮动塌陷、阻止 margin 穿透、防止兄弟元素被浮动元素覆盖。

### 溢出与装饰

```css
.box {
  overflow: hidden;         /* 裁剪溢出内容（滚动用 auto） */
  border-radius: 12px;      /* 圆角（50% 即圆形） */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);  /* 阴影：x y 模糊 扩散 颜色 */
}
```

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `box-sizing` | `content-box` / `border-box` | 宽度计算基准（统一用 border-box） |
| `padding` | 1-4 个值（上 右 下 左） | 内边距，`padding: 10px 20px` = 上下 10 左右 20 |
| `border` | `<宽> <样式> <颜色>` | `border: 1px solid #ccc`；可拆 `border-top` 等 |
| `margin` | 1-4 个值 | 外边距；`auto` 可水平居中（需定宽） |
| `width` / `height` | 长度 / 百分比 / `auto` | 内容区尺寸（border-box 下含 padding） |
| `min-width` / `max-width` | 长度 | 弹性布局防溢出常用 |
| `overflow` | `visible` / `hidden` / `scroll` / `auto` | 溢出处理 |
| `border-radius` | 长度 / 百分比 | 圆角 |
| `box-shadow` | `x y 模糊 扩散 颜色` | 阴影（`inset` 内阴影） |

### 常见用法

**重置（全局统一盒模型）**：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**卡片组件**：

```css
.card {
  width: 100%;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

**两列等宽 + 间距（border-box 下百分比安全）**：

```css
.col {
  width: calc(50% - 8px);   /* 或 flex: 1 + gap */
  box-sizing: border-box;
  padding: 16px;
}
```

### 注意事项

- ⚠️ **不统一 border-box，百分比宽度 + padding 必爆宽**。
- ⚠️ 垂直 margin 合并取较大值，横向不合并；flex/grid 容器内不合并。
- ⚠️ 子元素 margin-top 会穿透父元素，用 padding-top 或建立 BFC 隔离。
- ⚠️ `margin: 0 auto` 只水平居中，且元素必须有确定宽度。
- ⚠️ `box-shadow` 不占布局空间，别指望用它撑出间距。

## 相关

- 🔍 场景索引：[对齐场景](/3-reference/2-scenarios/align)、[布局场景](/3-reference/2-scenarios/layout)
- 📖 相邻手册：[布局](/3-reference/1-handbook/css/layout)（BFC 与浮动清除）、[文字与字体](/3-reference/1-handbook/css/typography)
