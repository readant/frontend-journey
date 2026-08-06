---
title: CSS 弹性布局（Flexbox）完整手册
---

# 弹性布局 Flexbox

## 核心概念

沿**一个主轴**（行或列）排列子项的布局体系，自动处理对齐与空间分配，是「一排/一列」布局的首选。

## 完整内容

### 是什么 / 为什么

浮动布局做「水平排列 + 垂直居中 + 等分空间」非常痛苦，flex 用两条轴 + 三个分配规则彻底解决。声明 `display: flex` 后，直接子项变为**弹性项目**，沿主轴排列。

**主轴与交叉轴**：`flex-direction` 决定主轴方向，垂直于主轴的另一条轴为交叉轴。所有对齐属性都围绕这两条轴展开。

```css
.flex-container {
  display: flex;              /* 开启弹性布局 */
  flex-direction: row;        /* 主轴方向：row 行 / column 列 / row-reverse / column-reverse */
  flex-wrap: wrap;            /* 换行：nowrap 不换（默认） / wrap 换行 / wrap-reverse */
  justify-content: center;    /* 主轴对齐：flex-start / center / space-between / space-around / space-evenly */
  align-items: center;        /* 交叉轴对齐（单行）：stretch 拉伸 / flex-start / center / baseline */
  align-content: space-between; /* 多行时的交叉轴对齐（作用在整组行上） */
  gap: 12px;                  /* 子项间距（主轴与交叉轴通用） */
}
```

**项目属性**：每个子项可以单独控制「伸缩」「顺序」「对齐」。

```css
.item {
  flex: 1;            /* 简写：flex-grow 1 flex-shrink 1 flex-basis 0% —— 等分剩余空间 */
  order: -1;          /* 排列顺序：越小越靠前（默认 0） */
  align-self: flex-end; /* 单独覆盖交叉轴对齐 */
}

.item-grow2 {
  flex: 2;            /* 占据剩余空间的比例加倍 */
}

.item-fixed {
  flex: 0 0 200px;    /* 不伸缩，固定 200px */
}
```

**flex 三个子属性（最重要的概念）**：

| 子属性 | 默认值 | 含义 |
| :--- | :--- | :--- |
| `flex-grow` | `0` | 空间有富余时，按比例**放大**的权重 |
| `flex-shrink` | `1` | 空间不足时，按比例**缩小**的权重（0 表示打死不缩） |
| `flex-basis` | `auto` | 主轴方向的**基准尺寸**（放大缩小都从它开始算） |

**记忆口诀**：`flex: 1` 是「吃掉剩余空间」；`flex: 0 0 200px` 是「我就是 200px 谁也别动我」。

### 语法速查

**容器属性**：

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `display` | `flex` / `inline-flex` | 开启弹性布局 |
| `flex-direction` | `row` / `row-reverse` / `column` / `column-reverse` | 主轴方向 |
| `flex-wrap` | `nowrap` / `wrap` / `wrap-reverse` | 是否换行 |
| `flex-flow` | `<direction> <wrap>` 简写 | 方向 + 换行一次设置 |
| `justify-content` | `flex-start` / `flex-end` / `center` / `space-between` / `space-around` / `space-evenly` | 主轴对齐 |
| `align-items` | `stretch` / `flex-start` / `flex-end` / `center` / `baseline` | 交叉轴对齐（单行） |
| `align-content` | 同 align-items + `space-between` / `space-around` / `space-evenly` | 多行整体在交叉轴的对齐 |
| `gap` | 长度 | 子项间距（`row-gap` / `column-gap` 可分开设） |

**项目属性**：

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `flex-grow` | 数字 | 放大权重（0 = 不放大） |
| `flex-shrink` | 数字 | 缩小权重（0 = 不缩小） |
| `flex-basis` | 长度 / `auto` | 主轴基准尺寸 |
| `flex` | `<grow> <shrink> <basis>` 简写 | 最常用：`1` / `0 0 200px` |
| `order` | 整数 | 排列顺序（默认 0） |
| `align-self` | `auto` + align-items 各值 | 单独覆盖交叉轴对齐 |

### 常见用法

**水平垂直居中（一行代码）**：

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**导航栏等分布局**：

```css
.nav {
  display: flex;
  gap: 8px;
}
.nav a {
  flex: 1;           /* 每个链接吃掉等额剩余空间 */
  text-align: center;
}
```

**粘性页脚（flex 经典）**：内容不足一屏时页脚贴底，超出一屏时正常下推。

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex: 1;           /* 内容区吃掉所有剩余空间 */
}
```

### 注意事项

- ⚠️ flex 项目的默认 `min-width: auto`：项目内容过长时**不会被压缩**，容易撑爆容器。加 `min-width: 0` 放行。
- ⚠️ `flex: 1` 是 `1 1 0%`，`flex: auto` 是 `1 1 auto`，二者基准不同，别混用。
- ⚠️ `align-items` 默认 `stretch`：不设高度的项目会被拉满交叉轴 —— 想居左靠上时容易踩坑。
- ⚠️ `space-between` 与 `space-around` 首尾间距不同，注意区分。
- ⚠️ 只有**直接子项**才是弹性项目，孙级不参与。

## 相关

- 📖 同章手册：[网格布局 Grid](/3-reference/1-handbook/css/layout/grid)（二维场景）、[文档流与定位](/3-reference/1-handbook/css/layout/position)、[布局总览](/3-reference/1-handbook/css/layout)
- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
