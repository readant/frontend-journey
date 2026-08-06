---
title: CSS 文档流与定位（display / position）完整手册
---

# 文档流与定位（display / position）

## 核心概念

**文档流**是元素默认的排列秩序，**display** 决定盒子以什么方式参与排列，**position** 让元素「钉」在指定位置。80% 的「元素怎么不听话」都源于这两块没搞清。

## 完整内容

### 是什么 / 为什么

默认情况下，元素按照 HTML 顺序依次排布，称为**文档流（normal flow）**。display 决定一个盒子以什么方式参与排列；position 则是越过文档流的精确放置手段。

**三类基本盒子**：

| 盒子 | 行为 | 典型元素 |
| :--- | :--- | :--- |
| 块级 block | 独占一行，宽度默认撑满父容器，可设宽高 | `div` `p` `h1` `section` |
| 行内 inline | 挨着排，宽高与上下 margin 无效 | `span` `a` `strong` |
| 行内块 inline-block | 既能设宽高，又不在行内强制换行 | `img` `button` |

**display 可切换盒子的排布方式**：

```css
display: block;         /* 块级 */
display: inline;        /* 行内 */
display: inline-block;  /* 行内块：可设宽高 + 不换行 */
display: none;          /* 彻底移除，不占空间（区别于 visibility: hidden 保留占位） */
display: flex;          /* 弹性容器 */
display: grid;          /* 网格容器 */
display: flow-root;     /* 块级 + 建立 BFC（现代清除浮动方案） */
```

**为什么要理解它**：比如给 `span` 设 `width` 无效，因为它默认是行内盒。

### 一、五种定位方式

| 值 | 参照物 | 是否脱离文档流 | 典型场景 |
| :--- | :--- | :--- | :--- |
| `static` | 无（默认，按文档流排） | 否 | 一切默认状态 |
| `relative` | 元素**自身**原来的位置 | 否（保留占位） | 微调位置；作为 absolute 的定位锚点 |
| `absolute` | 最近的**非 static 祖先**（找不到则是视口/根元素） | 是 | 弹窗、角标、悬浮元素 |
| `fixed` | **视口** | 是 | 返回顶部、吸底导航、弹层 |
| `sticky` | 滚动容器（relative + fixed 混合） | 部分（未触发时占位） | 吸顶表头、分区吸顶标题 |

**怎么用**：设置 `position` 后，再用 `top / right / bottom / left` 四个偏移属性描述位置；`z-index` 控制同一层级的堆叠顺序。

```css
/* 相对定位：相对自己原来的位置偏移，占位保留 */
.badge-offset {
  position: relative;
  top: 6px;
  left: 6px;
}

/* 绝对定位：相对最近的定位祖先（父级需 position: relative） */
.panel-float {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 自身再偏移一半，实现水平垂直居中 */
}

/* 固定定位：钉在视口右下角 */
.gotop {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

/* 粘性定位：滚动到距离顶部 0 后吸住 */
.sticky-head {
  position: sticky;
  top: 0;
}
```

**包含块（containing block）**：absolute 元素定位时参照的祖先盒子。这个祖先必须是定位元素（`position` 非 `static`）。所以「父级 `position: relative` + 子级 `position: absolute`」是最常见的锚定组合。

**z-index 与层叠上下文**：`z-index` 只在**同一层叠上下文**内比较。`position` 非 `static` + `z-index` 非 `auto`、`opacity < 1`、`transform`、`filter` 等都会创建新的层叠上下文。简单说：**给元素加了 transform/filter/opacity，它内部的 z-index 就只能跟内部比**。

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `display` | `block` / `inline` / `inline-block` / `none` / `flex` / `grid` / `flow-root` | 决定盒子的排布方式 |
| `visibility` | `visible` / `hidden` | 隐藏但保留占位 |
| `position` | `static` / `relative` / `absolute` / `fixed` / `sticky` | 定位方式 |
| `top` `right` `bottom` `left` | 长度 / 百分比 / `auto` | 偏移量（sticky 只用 top/bottom） |
| `z-index` | 整数 / `auto` | 层叠顺序（需配合定位使用） |
| `inset` | 同 `top/right/bottom/left` 简写 | 一次设置四边（现代写法） |

### 注意事项

- ⚠️ `absolute` 会脱离文档流，父容器若不设定位（`position: relative`），会飘到视口或更上层祖先，务必给父级加锚点。
- ⚠️ `fixed` 在祖先存在 `transform / filter / perspective` 时，参照物会从视口变为该祖先（经典 Bug）。
- ⚠️ `sticky` 的祖先不能有 `overflow: hidden`（会被裁断失效），且只能横向/纵向二选一吸附。
- ⚠️ `z-index` 只在同层叠上下文有效，别指望跨 transform 容器比较层级。
- ⚠️ `display: none` 与 `visibility: hidden` 不同：前者彻底移除不占位，后者保留占位只隐藏。

## 相关

- 📖 同章手册：[弹性布局 Flexbox](/3-reference/1-handbook/css/layout/flex)、[网格布局 Grid](/3-reference/1-handbook/css/layout/grid)、[布局总览](/3-reference/1-handbook/css/layout)
- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
