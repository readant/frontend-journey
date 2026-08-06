---
title: CSS 选择器完整手册
---

# CSS 选择器

## 核心概念

选择器 = 告诉浏览器「这条样式给谁」。

## 完整内容

### 是什么 / 为什么

CSS 规则由「选择器 + 声明块」组成。选择器决定样式作用到哪些元素，写错选择器是样式不生效的第一大原因。理解选择器，就是理解「怎么精准地指认目标」。

### 一、基础选择器

| 选择器 | 写法 | 匹配 | 优先级 |
| :--- | :--- | :--- | :--- |
| 通配 | `*` | 所有元素 | 最低 |
| 元素 | `p` `div` | 指定标签 | 低 |
| 类 | `.card` | 有该 class 的元素 | 中 |
| ID | `#header` | 有该 id 的元素（**页面唯一**） | 高 |

```css
* { margin: 0; }          /* 重置所有元素 */
p { color: #333; }        /* 所有段落 */
.card { border-radius: 8px; }
#submit-btn { width: 100%; }
```

### 二、组合器（关系选择）

| 组合器 | 写法 | 关系 |
| :--- | :--- | :--- |
| 后代 | `div p` | div **里面任意层级**的 p |
| 子元素 | `ul > li` | ul **直接子级**的 li |
| 相邻兄弟 | `h2 + p` | 紧跟在 h2 **后面**的 p |
| 通用兄弟 | `h2 ~ p` | h2 后面**所有**同级的 p |

```css
.nav a { color: inherit; }        /* 导航里所有链接 */
.menu > li { list-style: none; }  /* 仅直接子级 */
.title + .desc { margin-top: 8px; }
```

### 三、属性选择器

| 写法 | 匹配 |
| :--- | :--- |
| `[type]` | 有 type 属性 |
| `[type="text"]` | type 恰好等于 text |
| `[class^="btn"]` | class 以 btn **开头** |
| `[class$="btn"]` | class 以 btn **结尾** |
| `[class*="btn"]` | class **包含** btn |

```css
input[type="text"] { border: 1px solid #ccc; }
a[href^="https"] { color: #2d8cf0; }  /* 外链变色 */
```

### 四、伪类（:状态）

**动态伪类**：描述交互状态。

```css
a:hover { color: red; }      /* 悬停 */
a:active { color: blue; }    /* 按下瞬间 */
input:focus { outline: 2px solid #2d8cf0; } /* 聚焦 */
```

**结构伪类**：按位置选元素（列表、表格必备）。

```css
li:first-child {}            /* 第一个子元素 */
li:last-child {}             /* 最后一个 */
li:nth-child(2n) {}          /* 偶数位（斑马纹） */
li:nth-child(odd) {}         /* 奇数位 */
p:nth-of-type(2) {}          /* 同类型中第 2 个 */
li:not(.disabled) {}         /* 排除某项 */
:root {}                     /* 文档根元素（定义 CSS 变量常用） */
:empty {}                    /* 没有子元素的空元素 */
```

**表单伪类**：

```css
input:checked { accent-color: #2d8cf0; }
input:disabled { opacity: 0.5; }
input:required { border-color: #f56c6c; }
```

**现代逻辑伪类**：

```css
:is(h1, h2, h3) { font-weight: 700; }   /* 并集选择，权重取最高者 */
:where(.card, .list) { margin: 0; }      /* 并集选择，权重恒为 0（好覆盖） */
:has(> img) { padding: 0; }              /* 父选择器：包含 img 的元素 */
```

### 五、伪元素（:: 造出来的部分）

| 伪元素 | 作用 | 注意 |
| :--- | :--- | :--- |
| `::before` | 元素内容前插一个装饰层 | 需配合 `content` |
| `::after` | 元素内容后插一个装饰层 | 需配合 `content` |
| `::first-letter` | 首字母（首字下沉） | 块级元素有效 |
| `::first-line` | 首行 | 块级元素有效 |
| `::selection` | 用户划选文字 | 只能设颜色相关 |

```css
.card::after {
  content: "→";               /* 没有 content 就不显示 */
  position: absolute;
  right: 12px;
}
```

### 六、优先级（权重）计算

规则命中冲突时，按权重裁决。**权重四元组（0,0,0,0）**，从左到右比较：

| 组成部分 | 权重 |
| :--- | :--- |
| 内联 style | (1,0,0,0) |
| ID 选择器 | (0,1,0,0) |
| 类 / 属性 / 伪类 | (0,0,1,0) |
| 元素 / 伪元素 | (0,0,0,1) |
| `!important` | 最高（慎用） |

```css
#box .card p { color: red; }  /* (0,1,1,1) */
.card p { color: blue; }      /* (0,0,1,1) → 前者胜 */
```

同级时**后写的胜**；`!important` 会压过一切（包括内联），滥用会难以维护。

### 语法速查

| 类别 | 示例 | 说明 |
| :--- | :--- | :--- |
| 基础 | `*` `div` `.cls` `#id` | 通配/元素/类/ID |
| 组合 | `A B` `A > B` `A + B` `A ~ B` | 后代/子/相邻/通用兄弟 |
| 属性 | `[attr^=]` `[attr$=]` `[attr*=]` | 开头/结尾/包含 |
| 伪类 | `:hover` `:nth-child(n)` `:not()` `:is()` `:has()` | 状态/位置/逻辑 |
| 伪元素 | `::before` `::after` | 装饰层（需 content） |
| 权重 | `!important` | 最高优先级，慎用 |

### 常见用法

**斑马纹表格**：

```css
tr:nth-child(even) { background: #f7f8fa; }
```

**按钮按类型批量设样式**：

```css
[class^="btn-"] { display: inline-block; padding: 6px 14px; border-radius: 6px; }
.btn-primary { background: #2d8cf0; color: #fff; }
.btn-danger { background: #f56c6c; color: #fff; }
```

**当前菜单项高亮 + 清除前一个的下划线**：

```css
.nav a:last-child { border-bottom: 2px solid #2d8cf0; }
.nav a:last-child ~ a { border-bottom: none; }
```

### 注意事项

- ⚠️ **ID 选择器权重高且必须唯一**：能用类就别用 ID，否则很难覆盖。
- ⚠️ `:nth-child` 数的是**所有子元素**（含不同类型），而 `:nth-of-type` 只数同类型元素——前者常出「没想到中间还有别的标签」的坑。
- ⚠️ 属性选择器的值区分大小写；`^=`/`$=`/`*=` 是子串匹配，别忘前后不加空格。
- ⚠️ `::before`/`::after` 不设 `content` 就不渲染；默认是行内元素，做装饰块要转 `block`/`absolute`。
- ⚠️ `:has()` 目前主流浏览器已支持，但老内核（如旧 Safari）需要 polyfill，线上谨慎使用。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)（居中/分栏都依赖选择器命中）
- 📖 相邻手册：[盒模型](/3-reference/1-handbook/css/box-model)、[文字与字体](/3-reference/1-handbook/css/typography)
