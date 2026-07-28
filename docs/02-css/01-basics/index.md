---
title: 01. 基础语法与机制
---

## 1.1 语法结构

- **语法规则**: `选择器 { 属性: 值; }`
- **选择器**: 决定样式作用于哪些元素
- **声明块**: `{}` 包裹，由多个 `属性: 值;` 组成

```css
selector {
    property: value;
}

/* 示例 */
h1 {
    color: #1a73e8;
    text-align: center;
    font-size: 24px;
}
```

---

## 1.2 引入方式

### 内联样式
```html
<p style="color: red; font-size: 16px;">文字</p>
```

### 内部样式表
```html
<head>
    <style>
        p { color: blue; }
    </style>
</head>
```

### 外部样式表
```html
<!-- link 方式（推荐） -->
<link rel="stylesheet" href="styles.css">

<!-- @import 方式（不推荐，阻塞渲染） -->
<style>
    @import url("styles.css");
</style>
```

### 三种方式对比
| 引入方式 | 位置 | 作用范围 | 优缺点 |
|---------|------|---------|--------|
| 内联 | 标签 style 属性 | 当前元素 | 简单但不可复用 |
| 内部 | `<head>` 内 `<style>` | 当前页面 | 无外部依赖，不可跨页复用 |
| 外部 | `<link>` 或 `@import` | 多页面 | 分离结构与样式，可缓存复用 |

---

## 1.3 层叠性与优先级

### 优先级权重表

| 选择器类型 | 权重 (千百十个) | 示例 |
|-----------|--------------|------|
| `!important` | ∞ | `color: red !important;` |
| 内联样式 | 1,0,0,0 | `style=""` |
| ID 选择器 | 0,1,0,0 | `#header` |
| 类/伪类/属性选择器 | 0,0,1,0 | `.active`, `:hover` |
| 元素/伪元素 | 0,0,0,1 | `h1`, `::before` |
| 通配符 `*` | 0,0,0,0 | `*` |

### 权重计算方法
- 将选择器各部分对应位数相加
- 例：`#nav .menu a:hover` → 1ID + 1类 + 1元素 + 1伪类 = **0,1,2,1**

### 层叠规则
1. 权重不同 → 权重高的优先
2. 权重相同 → **后写的声明优先**
3. 继承样式权重为 0，直接设置的样式总会覆盖继承

::: warning 注意
- `!important` 应避免滥用
- 不要依赖内联样式来提权重
- 推荐通过提高选择器权重来解决冲突
:::
---

## 1.4 继承性

### ✅ 可继承的属性
- **字体**: `font-family`, `font-size`, `font-weight`, `line-height`
- **文本**: `color`, `text-align`, `text-indent`, `letter-spacing`
- **列表**: `list-style-type`, `list-style-position`
- **其他**: `visibility`, `cursor`

### ❌ 不可继承的属性
- **盒模型**: `width`, `height`, `padding`, `margin`, `border`
- **布局**: `float`, `position`, `display`, `z-index`
- **背景**: `background-color`, `background-image`
- **其他**: `overflow`, `transform`, `transition`, `animation`

### 强制继承/重置
```css
.child {
    border: inherit;     /* 强制继承父元素 */
    width: initial;      /* 重置为默认值 */
    color: unset;        /* 智能重置 */
    all: revert;         /* 重置为浏览器默认 */
}
```

---

## 1.5 单位与数值

### 相对单位（字体相关）
| 单位 | 含义 | 使用场景 |
|-----|------|---------|
| `em` | 当前元素 font-size 倍数 | 字体相关（嵌套会放大） |
| `rem` | 根元素 font-size 倍数 | **响应式尺寸（推荐）** |
| `ex` | 当前字体 x 高度 | 少用 |
| `ch` | 当前字体 "0" 的宽度 | 字符宽度相关 |

### 相对单位（视口相关）
| 单位 | 含义 | 使用场景 |
|-----|------|---------|
| `vw` | 视口宽度 1% | 响应式尺寸、全屏背景 |
| `vh` | 视口高度 1% | 全屏高度、全屏背景 |
| `vmin` | min(vw, vh) | 移动端适配 |
| `vmax` | max(vw, vh) | 少用 |

### 绝对单位
| 单位 | 说明 |
|-----|------|
| `px` | 像素 (1/96 英寸)，固定尺寸 |
| `cm/mm/in/pt/pc` | 物理/印刷单位，屏幕场景少用 |

### 百分比 %
- 相对父元素计算
- 常用于容器尺寸

### 颜色值表示方式
| 方式 | 格式 | 示例 |
|-----|------|------|
| 关键字 | 颜色名 | `red`, `blue`, `transparent` |
| HEX | #RRGGBB | `#ff0000`, `#f00` |
| HEX+Alpha | #RRGGBBAA | `#ff000080` |
| RGB | rgb(r,g,b) | `rgb(255,0,0)` |
| RGBA | rgba(r,g,b,a) | `rgba(255,0,0,0.5)` |
| HSL | hsl(h,s%,l%) | `hsl(0,100%,50%)` |
| HSLA | hsla(h,s%,l%,a) | `hsla(0,100%,50%,0.5)` |

### 经验法则
- 字体 → `rem`
- 容器相对尺寸 → `%`
- 全屏背景/大尺寸 → `vh` / `vw`
- 边框/阴影/小间距 → `px`

---

## 速查语法

### 引入方式
| 方式 | 语法 |
|-----|------|
| 内联 | `<p style="color:red">` |
| 内部 | `<style>p{color:red}</style>` |
| 外部 | `<link rel="stylesheet" href="style.css">` |
| @import | `@import url("style.css");` |

### 优先级权重
`!important` > 内联(1000) > ID(100) > 类/伪类/属性(10) > 元素/伪元素(1) > 通配(0)

### 可继承属性
字体/文本/列表/可见性：font-*, color, text-*, list-style, visibility, cursor

### 常用单位
- 字体: rem (推荐), em (嵌套放大)
- 视口: vw, vh, vmin, vmax
- 绝对: px, %, cm/mm/in
- 颜色: HEX(#fff), RGB/RGBA, HSL/HSLA

### 关键机制
- 层叠：权重高→后写优
- 继承：子元素默认继承父元素可继承属性
- 强制：inherit / initial / unset

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 基础语法与机制 演示](/demos/02-css/01-basics.html)
:::
