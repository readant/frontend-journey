---
title: CSS 布局完整手册
---

# CSS 布局（float / position / flex / grid）

## 核心概念

布局 = 用一套定位规则，把盒子摆到页面该去的位置。

## 布局演进：从文档流到网格

CSS 的布局方式不是凭空出现的，而是围绕「怎么把盒子摆好」一步步演进的：

| 阶段 | 布局方式 | 解决什么问题 | 如今定位 |
| :--- | :--- | :--- | :--- |
| 起点 | 文档流 + display | 块级元素垂直堆叠、行内元素水平排列 | 一切布局的默认底座 |
| 第一代 | float 浮动 | 图文混排、文字环绕图片 | 仅保留图文混排场景 |
| 第二代 | position 定位 | 元素精确定位、悬浮层、吸顶 | 弹窗、悬浮、吸顶仍依赖它 |
| 第三代 | flex 弹性布局 | 一维方向的排列、对齐、空间分配 | 一维布局首选 |
| 第四代 | grid 网格布局 | 二维方向同时控制行列 | 二维布局首选 |

**一句话选型**：先问自己 —— 要排的是「一排/一列」（flex），还是「一张表/一面墙」（grid），还是要「钉在某个位置」（position），还是「文字绕着图走」（float）。绝大多数现代页面用 flex + grid 就能完成。

---

## 一、文档流与 display

### 是什么

默认情况下，元素按照 HTML 顺序依次排布，称为**文档流（normal flow）**。display 决定一个盒子以什么方式参与排列。

### 完整内容

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

**为什么要理解它**：80% 的「元素怎么不听话」都源于盒子类型没搞清 —— 比如给 `span` 设 `width` 无效，因为它默认是行内盒。

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `display` | `block` / `inline` / `inline-block` / `none` / `flex` / `grid` / `flow-root` | 决定盒子的排布方式 |
| `visibility` | `visible` / `hidden` | 隐藏但保留占位 |

---

## 二、浮动布局 float

### 是什么

让元素脱离文档流，向容器左侧或右侧贴靠，后面的行内内容（文字）环绕它流动。

### 完整内容

**怎么用**：

```css
.float-left {
  float: left;   /* 向左浮动 */
  float: right;  /* 向右浮动 */
  float: none;   /* 不浮动（默认） */
}
```

**核心行为**：

- 浮动元素脱离文档流，但**没有脱离文字** —— 后续文字会环绕它。
- 多个浮动元素会沿同一方向依次排列（这是早期多栏布局的原理）。
- 浮动元素会收缩宽度（类似 inline-block），可以显式设宽高。

**经典问题：父容器塌陷**。浮动元素脱离文档流后，父容器的高度不再包含它：

```html
<div class="wrap">
  <div class="box">左栏</div>
  <div class="box">右栏</div>
</div>
```

```css
.box { float: left; width: 50%; }
/* .wrap 的高度塌陷为 0，背景和边框消失 */
```

**清除浮动（三选一）**：

```css
/* 方案一：伪元素 clearfix（最通用） */
.wrap::after {
  content: "";
  display: table;
  clear: both;
}

/* 方案二：让父元素建立 BFC（触发块级格式化上下文） */
.wrap {
  display: flow-root;      /* 现代写法，无副作用 */
  /* 或 overflow: hidden;   /* 旧写法，副作用是裁剪溢出内容 */
}

/* 方案三：在末尾追加一个清除元素 */
.clear { clear: both; }
```

**BFC（块级格式化上下文）**：一个独立的渲染区域，内部元素的浮动/外边距不会影响到外部。触发 BFC 的常见方式：`overflow` 非 `visible`、`display: flow-root`、`display: flex/grid` 容器、`float` 自身、`position: absolute/fixed`。

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `float` | `left` / `right` / `none` | 浮动方向 |
| `clear` | `left` / `right` / `both` | 禁止某侧出现浮动元素（用于清除浮动） |

### 注意事项

- ⚠️ 浮动已不是主流布局手段，**只留给图文混排**。
- ⚠️ 浮动元素会脱离文档流，可能导致元素重叠，务必清除浮动或使用 BFC 包裹。
- ⚠️ 浮动元素默认会收缩宽度，需要显式设置宽度。

---

## 三、定位 position

### 是什么

让元素「钉」在页面（或某个祖先）的指定位置上，是最精确的放置手段。

### 完整内容

**五种定位方式**：

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
| `position` | `static` / `relative` / `absolute` / `fixed` / `sticky` | 定位方式 |
| `top` `right` `bottom` `left` | 长度 / 百分比 / `auto` | 偏移量（sticky 只用 top/bottom） |
| `z-index` | 整数 / `auto` | 层叠顺序（需配合定位使用） |
| `inset` | 同 `top/right/bottom/left` 简写 | 一次设置四边（现代写法） |

### 注意事项

- ⚠️ `absolute` 会脱离文档流，父容器若不设定位（`position: relative`），会飘到视口或更上层祖先，务必给父级加锚点。
- ⚠️ `fixed` 在祖先存在 `transform / filter / perspective` 时，参照物会从视口变为该祖先（经典 Bug）。
- ⚠️ `sticky` 的祖先不能有 `overflow: hidden`（会被裁断失效），且只能横向/纵向二选一吸附。
- ⚠️ `z-index` 只在同层叠上下文有效，别指望跨 transform 容器比较层级。

---

## 四、弹性布局 Flexbox

### 是什么

沿**一个主轴**（行或列）排列子项的布局体系，自动处理对齐与空间分配，是「一排/一列」布局的首选。

### 完整内容

**为什么需要它**：浮动布局做「水平排列 + 垂直居中 + 等分空间」非常痛苦，flex 用两条轴 + 三个分配规则彻底解决。声明 `display: flex` 后，直接子项变为**弹性项目**，沿主轴排列。

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

---

## 五、网格布局 Grid

### 是什么

同时控制**行和列**两条轴的二维布局体系，适合「卡片墙」「表格」「整体页面骨架」。

### 完整内容

**为什么需要它**：flex 解决「一条线上怎么排」，但页面常是「一张网」—— 既要分列又要分行。grid 用「画线 + 放格子」的方式彻底解放二维布局。

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

---

## 六、布局选型总览

| 需求 | 首选方案 | 一句话理由 |
| :--- | :--- | :--- |
| 一排/一列排列、等分、居中 | Flex | 一维问题最顺手的工具 |
| 卡片墙、页面骨架、二维对齐 | Grid | 行列同时控制，天然二维 |
| 弹窗、悬浮角标、吸顶/吸底 | position（absolute/fixed/sticky） | 需要「钉住」就交给定位 |
| 文字环绕图片 | float | 唯一不可替代的浮动员场景 |
| 水平垂直居中 | Flex（`justify-content: center` + `align-items: center`） | 一行代码，最不易错 |

---

## 注意事项（全局）

- ⚠️ **百分比参照物不同**：width 百分比参照父容器宽度，而 height 百分比需要父容器有确定高度，否则不生效（常见「高度百分比失效」）。
- ⚠️ **margin 垂直合并**：相邻块级元素的垂直 margin 取较大值，不是相加。flex/grid 容器内不会合并。
- ⚠️ **统一盒模型**：写布局前先加 `* { box-sizing: border-box }`，让 width 包含 padding 和 border，避免「宽度算不对」。
- ⚠️ **gap 只对 flex/grid 容器有效**：普通块级布局用 margin 控制间距。
- ⚠️ **真·居中别用 margin: 0 auto 实现垂直居中**：`margin: 0 auto` 只能水平居中块级元素（需已知宽度），垂直居中交给 flex/grid。

---

## 相关

- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout) —— 遇到「我要 X 布局」时先查这里
- 📖 相邻手册：[盒模型](/3-reference/1-handbook/css/box-model)（border-box、margin 合并）、[响应式](/3-reference/1-handbook/css/responsive)（媒体查询与容器查询）
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
