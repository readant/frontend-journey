---
title: CSS 网格布局（Grid）完整手册
---

# 网格布局 Grid

## 核心概念

同时控制**行和列**两条轴的二维布局体系，适合「卡片墙」「表格」「整体页面骨架」。

## 完整内容

### 是什么 / 为什么

flex 解决「一条线上怎么排」，但页面常是「一张网」—— 既要分列又要分行。grid 用「画线 + 放格子」的方式彻底解放二维布局。

**第一步：把容器画成网格**。

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;        /* 三列：固定 200px + 剩余均分两列 */
  grid-template-rows: auto auto;                /* 两行：高度自适应内容 */
  gap: 12px;                                    /* 行列间距统一 */
}
```

**fr 单位**：网格的弹性单位，代表「剩余空间的一份」，类比 flex-grow。

**第二步：控制项目的占位**。

```css
.card-featured {
  grid-column: span 2;    /* 横跨两列 */
  grid-row: span 2;       /* 横跨两行 */
}

.card-a {
  grid-column: 1 / 3;     /* 从第 1 条列线到第 3 条列线（占 1、2 两列） */
  grid-row: 2 / 4;
}
```

**区域命名（grid-template-areas）**：给每个格子起名字，页面骨架一眼可见。

```css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 4px;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

**响应式栅格（auto-fit + minmax 黄金组合）**：卡片自动换行、自适应列数，不需要写媒体查询。

```css
.card-wall {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

**隐式网格**：项目数超过声明的行列时，多余项目进入隐式网格，尺寸由 `grid-auto-rows` / `grid-auto-columns` 控制（常用 `grid-auto-rows: auto` 或固定高度，避免无限拉伸）。

### 语法速查

**容器属性**：

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `display` | `grid` / `inline-grid` | 开启网格布局 |
| `grid-template-columns` | 长度 / `fr` / `%` / `repeat(n, 尺寸)` / `minmax(最小, 最大)` / `auto` | 列定义 |
| `grid-template-rows` | 同上 | 行定义 |
| `grid-template-areas` | 字符串矩阵 | 区域命名 |
| `gap` | 长度 | 行列间距（`row-gap` / `column-gap`） |
| `justify-items` | `stretch` / `start` / `end` / `center` | 项目在单元格内的水平对齐 |
| `align-items` | 同上 | 项目在单元格内的垂直对齐 |
| `justify-content` | `start` / `end` / `center` / `space-between` / `space-around` / `space-evenly` | 网格整体在容器内的水平对齐 |
| `align-content` | 同上 | 网格整体垂直对齐 |
| `grid-auto-rows` / `grid-auto-columns` | 尺寸 | 隐式网格的默认尺寸 |
| `grid-auto-flow` | `row` / `column` / `dense` | 自动放置的顺序（dense 可回填空隙） |

**项目属性**：

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `grid-column` | `<起点> / <终点>` 或 `span n` | 横跨范围 |
| `grid-row` | 同上 | 纵向跨范围 |
| `grid-area` | 区域名 或 四值简写 | 放入命名区域 / 精确占位 |
| `justify-self` / `align-self` | `stretch` / `start` / `end` / `center` | 单项目覆盖单元格内对齐 |

### 常见用法

**页面骨架（grid 版粘性页脚 + 侧边栏）**：

```css
.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "aside  main"
    "footer footer";
  min-height: 100vh;
}
```

**自适应卡片墙**：`repeat(auto-fill, minmax(240px, 1fr))` —— 宽度充足就多放几列，不足自动换行。

### 注意事项

- ⚠️ `fr` 只在**剩余空间**内分配：`grid-template-columns: 200px 1fr` 是「先给 200px，剩下的全给 1fr」。
- ⚠️ `auto-fill` 与 `auto-fit` 的区别：空间富余时，`auto-fill` 保留空轨道，`auto-fit` 折叠空轨道让项目撑满。想「少列放大」用 `auto-fit`。
- ⚠️ `grid-area` 缩写顺序是 `行起 / 列起 / 行止 / 列止`，容易记反，不确定就写全 `grid-row` + `grid-column`。
- ⚠️ 内容过长会撑破固定轨道，配合 `minmax(0, 1fr)` 防止溢出。

## 相关

- 📖 同章手册：[弹性布局 Flexbox](/3-reference/1-handbook/css/layout/flex)（一维场景）、[文档流与定位](/3-reference/1-handbook/css/layout/position)、[布局总览](/3-reference/1-handbook/css/layout)
- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
