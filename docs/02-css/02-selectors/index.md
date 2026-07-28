---
title: 02. 选择器
---

## 2.1 基础选择器

### 通配选择器 `*`
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 标签选择器
```css
p { color: #333; }
h1 { font-size: 24px; }
```

### 类选择器 `.`
```css
.highlight { background: yellow; }
.text-bold { font-weight: bold; }
```

```html
<!-- 多类名叠加 -->
<p class="highlight text-bold">文字</p>
```

### ID 选择器 `#`
```css
#main-title { font-size: 32px; color: blue; }
```

### 四种基础选择器对比
| 选择器 | 语法 | 权重 | 唯一性 | 使用频率 |
|-------|------|-----|--------|---------|
| 通配 `*` | `*` | 0,0,0,0 | 否 | 低 |
| 标签 | `p` | 0,0,0,1 | 否 | 中 |
| 类 `.` | `.active` | 0,0,1,0 | 否 | **高** |
| ID `#` | `#header` | 0,1,0,0 | 是 | 低 |

::: warning 注意
- ID 在页面中必须唯一
- 权重过高，不推荐滥用
- 推荐使用类选择器替代
:::
---

## 2.2 组合选择器

### 后代选择器（空格）
- 语法: `祖先 后代 { }`
- 选中**所有**后代元素（不限层级）
```css
div p { color: red; }
.container .item { ... }
```

### 子代选择器 `>`
- 语法: `父元素 > 子元素 { }`
- 仅选中**直接子元素**
```css
div > p { color: blue; }
```

### 相邻兄弟选择器 `+`
- 语法: `元素1 + 元素2 { }`
- 选中紧邻的**下一个**兄弟元素
```css
h1 + p { margin-top: 10px; }
```

### 通用兄弟选择器 `~`
- 语法: `元素1 ~ 元素2 { }`
- 选中后面**所有**兄弟元素
```css
h1 ~ p { color: gray; }
```

### 四种关系对比
| 选择器 | 符号 | 选择范围 | 方向 |
|-------|------|---------|------|
| 后代 | `空格` | 所有后代 | 向下不限层级 |
| 子代 | `>` | 直接子元素 | 向下仅一级 |
| 相邻兄弟 | `+` | 紧邻的下一个 | 向下紧邻一个 |
| 通用兄弟 | `~` | 后面所有兄弟 | 向下所有 |

---

## 2.3 属性选择器

### 存在性选择
```css
input[disabled] { opacity: 0.5; }
```

### 精确匹配 `=`
```css
input[type="email"] { border-color: blue; }
```

### 开头匹配 `^=`
```css
a[href^="https"] { padding-right: 20px; }
```

### 结尾匹配 `$=`
```css
a[href$=".pdf"] { color: red; }
```

### 包含匹配 `*=`
```css
img[src*="logo"] { width: 100px; }
```

### 五种属性选择器对比
| 选择器 | 语法 | 含义 |
|-------|------|------|
| 存在性 | `[attr]` | 具有某属性 |
| 精确匹配 | `[attr=val]` | 属性值完全等于 |
| 开头匹配 | `[attr^=val]` | 属性值以 val 开头 |
| 结尾匹配 | `[attr$=val]` | 属性值以 val 结尾 |
| 包含匹配 | `[attr*=val]` | 属性值包含 val |

---

## 2.4 伪类

### 动态伪类（用户交互）
```css
a:link { color: blue; }        /* 未访问 */
a:visited { color: purple; }   /* 已访问 */
a:hover { color: red; }        /* 鼠标悬停 */
a:active { color: orange; }    /* 激活中 */
```

::: warning LVHA 顺序
必须按 `:link` → `:visited` → `:hover` → `:active` 顺序书写
:::
### 结构伪类
```css
li:first-child { color: red; }        /* 第一个子元素 */
li:last-child { color: blue; }        /* 最后一个子元素 */
li:nth-child(n) { ... }               /* 第 n 个子元素 */
li:nth-child(odd) { ... }             /* 奇数 */
li:nth-child(even) { ... }            /* 偶数 */
li:nth-child(3n+1) { ... }            /* 3n+1 位置 */
li:only-child { ... }                 /* 独生子元素 */
:not(:first-child) { ... }            /* 非第一个 */
```

### 目标伪类
```css
#section:target { background: yellow; }  /* URL 锚点指向的元素 */
```

### 焦点与表单伪类

| 伪类 | 作用 |
|------|------|
| `:focus` | 元素获得焦点 |
| `:focus-within` | 元素或其子元素获得焦点（用于父容器高亮） |
| `:focus-visible` | 键盘聚焦时高亮（鼠标点击不高亮） |
| `:checked` | 选中的 radio/checkbox |
| `:disabled` / `:enabled` | 禁用/可用状态 |
| `:valid` / `:invalid` | 表单验证通过/失败 |
| `:required` / `:placeholder-shown` | 必填项/占位符正在显示 |

### 结构伪类（of-type 系列）

| 伪类 | 作用 |
|------|------|
| `:nth-of-type(n)` | 同类型元素中第 n 个 |
| `:first-of-type` | 同类型第一个 |
| `:last-of-type` | 同类型最后一个 |
| `:only-of-type` | 同类型唯一一个 |

::: tip :nth-child vs :nth-of-type
`nth-child` 不区分标签类型（所有子元素一起数），`nth-of-type` 只数同标签类型的元素。例如 `p:nth-child(2)` 要求 p 是父元素的第 2 个子元素；`p:nth-of-type(2)` 要求 p 是第 2 个 `<p>` 元素。
:::

### 现代选择器（CSS4+）

```css
/* :is() —— 匹配列表中任意一个，权重取最大值 */
:is(h1, h2, h3) { color: blue; }

/* :where() —— 同 :is()，但权重为 0 */
:where(h1, h2, h3) { color: blue; }

/* :has() —— 父选择器（匹配包含特定子元素的父元素） */
div:has(> img) { padding: 10px; }       /* 包含 img 的 div */
card:has(.badge) { border-color: gold; }  /* 含 .badge 的 card */
```

| 选择器 | 权重 | 用途 |
|--------|------|------|
| `:is()` | 取参数中最大权重 | 简化多选择器 |
| `:where()` | **0**（始终为 0） | 低权重覆盖 |
| `:has()` | 参数权重 + 1 个类 | 父元素选择 |

::: warning :has() 浏览器支持
`:has()` 已被主流浏览器支持（2023 起），但旧版浏览器不兼容。生产环境使用前查 [caniuse.com](https://caniuse.com/css-has)。
:::

### 补充属性选择器

| 语法 | 匹配规则 |
|------|---------|
| `[attr~=val]` | val 是空格分隔列表中的一个词 |
| `[attr|=val]` | 等于 val 或以 val- 开头（用于 lang） |

---

## 2.5 伪元素

### 常用伪元素
```css
::before { content: "→"; }
::after { content: "←"; }
::first-line { font-size: 18px; }
::selection { background: blue; color: white; }
```

### ::before / ::after 核心用法
```css
.element {
    position: relative;
}
.element::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 20px; height: 20px;
    background: red;
}
```

::: danger content 属性
- 必填属性，可为空字符串 `""`
- 支持字符串、URL、计数器等
- 常用于：装饰元素、三角形、清除浮动、图标
:::
### 伪元素与伪类的区别
| 伪类 | 伪元素 |
|-----|--------|
| 用 `:` 开头 | 用 `::` 开头 |
| 选择已存在的元素状态 | 创建新的虚拟元素 |
| 如 `:hover`, `:first-child` | 如 `::before`, `::first-line` |

---

::: tip 速查手册
本章核心语法已收录到独立的 [速查手册](/cheatsheet/css) 中，方便开发时快速查阅。
:::


---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 选择器 演示](/demos/02-css/02-selectors.html)
:::
