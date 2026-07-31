---
title: CSS 速查
---

# CSS 速查

## 1. 基础语法与机制

### 引入方式

| 方式 | 语法 |
| ----- | ------ |
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

## 2. 选择器

### 选择器速查

| 类型 | 语法 | 权重 |
| ----- | ------ | ----- |
| 通配 | `*` | 0 |
| 标签 | `p` | 1 |
| 类 | `.class` | 10 |
| ID | `#id` | 100 |
| 后代 | `div p` | 1+1 |
| 子代 | `div > p` | 1+1 |
| 相邻兄弟 | `h1 + p` | 1+1 |
| 通用兄弟 | `h1 ~ p` | 1+1 |
| 属性 | `[attr=val]` | 10 |
| 伪类 | `:hover` `:nth-child(n)` | 10 |
| 伪元素 | `::before` `::after` | 1 |

### 伪类要点

- LVHA 顺序: link→visited→hover→active
- nth-child: n/odd/even/3n+1
- 结构: first-child/last-child/only-child
- 目标: :target (URL锚点)

### 伪元素要点

- ::before/::after 需 content 属性
- 应用场景: 装饰/三角形/清除浮动/图标

## 3. 盒模型

### 盒模型公式

- 标准(content-box): width = content, 总宽 = width + padding*2 + border*2 + margin*2
- 怪异(border-box): width = content + padding + border, 总宽 = width + margin*2

### 核心属性

| 属性 | 可否负 | 背景填充 |
| ----- | ------- | --------- |
| content | 否 | 是 |
| padding | 否 | 是 |
| border | 否 | 是 |
| margin | 是 | 否 |

### margin 合并

- 规则: 正值取大，一正一负相减，负取绝对大
- 场景: 相邻兄弟/父子/空元素
- 解决: padding替代 / border阻隔 / overflow:hidden / flex布局

### 最佳实践

```css
*, *::before, *::after { box-sizing: border-box; }
```

## 4. 布局与定位

### 文档流

- 块级: div/h1/p/ul, 独占一行, display:block
- 行内: span/a/strong, 不独占一行, display:inline
- 行内块: img/input, 可设宽高, display:inline-block

### float 属性

float: left/right/none; 清除: clear: both;
经典Clearfix:

```css
.clearfix::after { content:""; display:block; clear:both; }
```

### position 属性

| 值 | 脱流 | 参考 | 场景 |
| --- | ----- | ------ | ----- |
| static | 否 | — | 默认 |
| relative | 否 | 自身 | 微调/父容器 |
| absolute | 是 | 最近定位祖先 | 弹窗/下拉/角标 |
| fixed | 是 | 视口 | 固定导航/返回顶部 |
| sticky | 否 | 视口+父容器 | 吸顶/目录跟随 |

### z-index 规则

同级z-index大者在上; 父级创建层叠上下文后子级无法突破

### Flexbox 容器属性

flex-direction | justify-content | align-items | flex-wrap | gap

### Flexbox 项目属性

flex-grow | flex-shrink | flex-basis | flex | order

### Grid 核心

grid-template-columns | grid-template-rows | gap | grid-area | grid-column | grid-row
fr 比例单位（进阶: repeat()/minmax()/auto-fit）

## 5. 视觉样式与美化

### 字体属性

font-family / font-size / font-weight(normal/bold/100-900) / line-height / letter-spacing

### 背景

background-color / background-image / background-repeat / background-position / background-size(cover/contain) / background-attachment

### 渐变

- 线性: linear-gradient(dir, color1, color2)
- 径向: radial-gradient(shape, color1, color2)
- 锥形: conic-gradient(c1, c2, ...)

### 边框圆角

border / border-radius(px/%) / box-shadow(x y blur spread color inset)

### 表格

border-collapse: collapse / table-layout: fixed

### 滤镜

filter: blur() / brightness() / contrast() / grayscale() / drop-shadow()
backdrop-filter: blur() (毛玻璃)
mix-blend-mode: multiply/screen/overlay

## 6. 变换与动画

### 2D 变换

transform: translate(x,y) | rotate(deg) | scale(n) | skewX(deg)

### 3D 变换

translate3d(x,y,z) | perspective(n) | rotateX/Y/Z | translateZ

### 过渡

transition: property duration timing-function delay;
timing: linear/ease/ease-in-out/cubic-bezier/steps

### 关键帧

@keyframes name { from {} to {} }
animation: name duration timing-function delay iteration direction fill-mode play-state;

### animation 属性

animation-name / duration / timing-function / delay / iteration-count(n/infinite)
animation-direction(normal/reverse/alternate)
animation-fill-mode(none/forwards/backwards/both)

### 性能优化

- 优先使用 transform/opacity (GPU加速)
- will-change: transform
- translateZ(0) 强制硬件加速

## 7. 响应式设计

### viewport 设置

<meta name="viewport" content="width=device-width, initial-scale=1.0">

### 媒体查询

```css
@media screen and (min-width: 768px) { ... }
@media screen and (max-width: 767px) { ... }
```

### 逻辑操作符

and / or(,) / not / only

### 断点策略

- Mobile First: 默认移动端, min-width 向上
- Desktop First: 默认桌面端, max-width 向下
- 常用断点: 768px / 1024px / 1440px

### 容器查询

```css
.container { container-type: inline-size; }
@container (min-width: 400px) { ... }
```

### 进阶工具（正文未展开，了解即可）

- `clamp(min, ideal, max)` 响应式字号
- `repeat(auto-fit, minmax(min, 1fr))` 自适应网格
- `srcset`/`sizes` 响应式图片

## 8. 工程化与现代 CSS

### CSS 变量

```css
:root { --color: #3498db; }
.el { color: var(--color, #333); }
/* JS: element.style.setProperty('--var', 'value') */
```

### Sass/Less/Stylus 对比

| 功能 | Sass | Less | Stylus |
| ----- | ------ | ------ | -------- |
| 变量 | $var | @var | var = |
| 混入 | @mixin/@include | .mix() | 函数调用 |
| 继承 | @extend | &:extend | @extend |
| 函数 | @function | 无 | 支持 |

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

## 9. 设计模式与问题解决

### 水平垂直居中

```css
/* Flex */
.parent { display:flex; justify-content:center; align-items:center; }
/* Grid */
.parent { display:grid; place-items:center; }
/* 绝对定位+translate */
.child { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); }
/* margin auto */
.child { position:absolute; top:0;left:0;right:0;bottom:0; margin:auto; width:100px; height:100px; }
/* table-cell */
.parent { display:table; } .child { display:table-cell; vertical-align:middle; text-align:center; }
```

### 三栏布局

Flex: 侧栏固定 + 主栏flex:1
Grid: grid-template-columns: 200px 1fr 200px + grid-template-areas

### 三角形

```css
.tri { width:0; height:0; border-left:Xpx solid transparent; border-right:Xpx solid transparent; border-bottom:Ypx solid color; }
```

### Clearfix

```css
.clearfix::after { content:""; display:block; clear:both; }
```

### 自定义形状

clip-path: polygon() / circle() / inset() / path()
border-radius 组合 (胶囊/叶子/花瓣)
