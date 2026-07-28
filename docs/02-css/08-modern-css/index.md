---
title: 08. 工程化与现代 CSS
---

## 8.1 CSS 变量

### 定义与使用
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --font-size-base: 16px;
    --spacing: 20px;
    --border-radius: 8px;
}

.btn {
    background-color: var(--primary-color);
    color: white;
    font-size: var(--font-size-base);
    padding: var(--spacing);
    border-radius: var(--border-radius);
}
```

### 作用域
```css
/* 全局变量 */
:root {
    --color: red;
}

/* 局部变量（组件级） */
.component {
    --color: blue;
    background: var(--color);  /* blue */
}

.component .child {
    background: var(--color);  /* 继承父级 blue */
}
```

### 回退值
```css
.fallback {
    color: var(--unknown-var, #333);  /* 变量不存在时使用 #333 */
}
```

### 动态修改
```css
:root {
    --theme: light;
}

/* 暗色模式 */
body.dark {
    --bg: #1a1a2e;
    --text: #eee;
}

/* JS 动态修改 */
:root {
    --user-color: blue;
}

// JavaScript 修改
document.documentElement.style.setProperty('--user-color', 'red');
```

### 实际应用场景
- 主题色管理（换肤）
- 统一间距/圆角
- 字体大小系统
- 深色/浅色模式切换
- 组件样式 token

---

## 8.2 预处理器核心概念

### Sass/SCSS
```scss
// 变量
$primary: #3498db;
$spacing: 20px;

// 嵌套
.card {
    background: white;
    padding: $spacing;

    &:hover {
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    &.active {
        border: 2px solid $primary;
    }

    .title {
        font-size: 18px;
    }
}

// 混合 (mixin)
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.centered {
    @include flex-center;
}

// 带参数的 mixin
@mixin respond-to($breakpoint) {
    @media (max-width: $breakpoint) {
        @content;
    }
}

@include respond-to(768px) {
    .sidebar { display: none; }
}

// 继承
%base-button {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
}

.btn-primary {
    @extend %base-button;
    background: $primary;
    color: white;
}

// 函数
@function calculate-rem($px) {
    @return $px / 16px * 1rem;
}

.container {
    padding: calculate-rem(24);
}
```

### Less
```less
// 变量
@primary: #3498db;

// 嵌套
.card {
    background: white;

    &:hover {
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
}

// 混合
.flex-center() {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    .flex-center();
}

// 运算
@width: 100px;
@padding: @width / 2;

.box {
    width: @width;
    padding: @padding;
}

// 函数
.colors() {
    primary: @primary;
    secondary: @primary + #111;
}
```

### Stylus
```stylus
// 变量（无 $ 或 @）
primary = #3498db

// 嵌套（无大括号）
.card
    background white
    &:hover
        box-shadow 0 4px 10px rgba(0,0,0,0.1)

// 混合
flex-center()
    display flex
    justify-content center
    align-items center

// 运算
width = 100px
padding = width / 2
```

### 预处理器功能对比
| 功能 | Sass/SCSS | Less | Stylus |
|-----|-----------|------|--------|
| 变量 | `$var` | `@var` | `var =` |
| 嵌套 | ✅ | ✅ | ✅ |
| 混入 | `@mixin` / `@include` | `.mix()` | `mix()` |
| 继承 | `@extend` | `&:extend` | `@extend` |
| 函数 | `@function` | 无原生 | 有 |
| 运算 | ✅ | ✅ | ✅ |

---

## 8.3 CSS 方法论

### BEM (Block-Element-Modifier)
```css
/* Block: 独立的功能单元 */
.button { }

/* Element: 组成 Block 的部分，用 __ 连接 */
.button__icon { }
.button__text { }

/* Modifier: 状态或变体，用 -- 连接 */
.button--primary { }
.button--large { }
.button__icon--right { }

/* 实际例子 */
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--featured { }
.card__title--large { }
```

### OOCSS (Object-Oriented CSS)
```css
/* 结构类（不关心皮肤） */
.media {
    display: flex;
    gap: 16px;
}

.media__image {
    flex-shrink: 0;
}

.media__body {
    flex: 1;
}

/* 皮肤类（不关心结构） */
.media--highlight {
    background: yellow;
}

.media--bordered {
    border: 1px solid #ccc;
}
```

### SMACSS (Scalable Modular Architecture CSS)
- **Base**: 基础样式（normalize, reset）
- **Layout**: 页面布局（header, sidebar, footer）
- **Module**: 可复用模块（.btn, .card）
- **State**: 状态样式（.is-active, .is-hidden）
- **Theme**: 主题样式（.theme-dark）

### 命名规范对比
| 方法论 | 命名格式 | 适用场景 |
|-------|---------|---------|
| BEM | `block__element--modifier` | 组件化开发 |
| OOCSS | 结构类 + 皮肤类 | 大型项目 |
| SMACSS | 分层组织 | 团队协作 |

::: tip 推荐
- 个人项目：BEM
- 团队项目：SMACSS + BEM 结合
- React/Vue 项目：CSS Modules + BEM
:::
---

## 8.4 性能优化

### CSS 压缩
- 删除空格、注释
- 合并相同规则
- 使用工具：cssnano, clean-css

### 关键 CSS 提取
- 首屏必须的 CSS 内联
- 非首屏 CSS 异步加载
- 工具：Critical, Penthouse

### 减少重排重绘
| 操作 | 性能影响 |
|-----|---------|
| 修改 `transform`, `opacity` | 仅合成层（最快） |
| 修改 `color`, `background` | 重绘 |
| 修改 `width`, `height`, `top`, `left` | 重排（最慢） |

### 优化手段
```css
/* 1. GPU 加速 */
.gpu-accelerated {
    transform: translateZ(0);
    will-change: transform;
}

/* 2. 减少选择器深度 */
/* 不好 */
div.container > ul.nav > li > a > span { }
/* 好 */
.nav-link__text { }

/* 3. 使用 flex/grid 替代 float */

/* 4. 合理使用 transition */
.smooth {
    transition: transform 0.3s ease;  /* 只过渡 transform */
}

/* 5. 避免 !important */

/* 6. 使用 content-visibility */
.off-screen {
    content-visibility: auto;
    contain-intrinsic-size: 0 500px;
}
```

### 加载优化
- 将 `<link rel="stylesheet">` 放在 `<head>` 顶部
- 使用 `preload` 预加载关键 CSS
- 内联首屏 CSS（约 14KB 以内）
- 异步加载非关键 CSS
- CDN 加速分发

```html
<link rel="preload" href="critical.css" as="style">
<link rel="stylesheet" href="critical.css">
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
```

---

## 速查语法

### CSS 变量
```css
:root { --color: #3498db; }
.el { color: var(--color, #333); }
/* JS: element.style.setProperty('--var', 'value') */
```

### Sass/Less 对比
| 功能 | Sass | Less |
|-----|------|------|
| 变量 | $var | @var |
| 混入 | @mixin/@include | .mix() |
| 继承 | @extend | &:extend |
| 函数 | @function | 无 |

### BEM 命名
block__element--modifier
例: card__title--large

### OOCSS 结构+皮肤分离
### SMACSS Base/Layout/Module/State/Theme 分层

### 性能优化
- 压缩工具: cssnano, clean-css
- 减少重排: 修改 transform/opacity > color > width/top
- 关键CSS内联(~14KB)
- content-visibility: auto
- 选择器深度不超过3层

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 工程化与现代 CSS 演示](/demos/02-css/08-modern-css.html)
:::
