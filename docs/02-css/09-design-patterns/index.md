## 9.1 水平垂直居中

### 方案一：Flexbox（推荐）
```css
.center-flex {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 方案二：Grid（推荐）
```css
.center-grid {
    display: grid;
    place-items: center;
}

/* 或 */
.center-grid {
    display: grid;
    justify-items: center;
    align-items: center;
}
```

### 方案三：绝对定位 + translate
```css
.parent {
    position: relative;
}

.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

### 方案四：绝对定位 + margin auto
```css
.parent {
    position: relative;
    width: 300px;
    height: 300px;
}

.child {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 100px;
    height: 100px;
}
```

### 方案五：table-cell
```css
.parent {
    display: table;
    width: 100%;
    height: 300px;
}

.child {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
```

### 方案六：calc 计算
```css
.child {
    position: absolute;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    width: 100px;
    height: 100px;
}
```

### 各方案对比
| 方案 | 是否需要固定宽高 | 性能 | 兼容性 | 推荐度 |
|-----|----------------|-----|--------|--------|
| Flexbox | 否 | 高 | IE10+ | ⭐⭐⭐⭐⭐ |
| Grid | 否 | 高 | IE11+ | ⭐⭐⭐⭐⭐ |
| translate | 否 | 中 | IE9+ | ⭐⭐⭐⭐ |
| margin auto | 是 | 中 | 全兼容 | ⭐⭐⭐ |
| table-cell | 否 | 低 | 全兼容 | ⭐⭐ |
| calc | 是 | 中 | IE9+ | ⭐⭐ |

---

## 9.2 圣杯布局 / 双飞翼布局

### 圣杯布局（Holy Grail）
```html
<div class="container">
    <div class="header">头部</div>
    <div class="wrapper">
        <div class="left">左栏</div>
        <div class="main">主内容</div>
        <div class="right">右栏</div>
    </div>
    <div class="footer">底部</div>
</div>
```

```css
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.wrapper {
    display: flex;
    flex: 1;
}

.header, .footer {
    height: 60px;
    background: #333;
    color: white;
}

.left {
    width: 200px;
    background: #e74c3c;
}

.main {
    flex: 1;
    background: #f1f1f1;
}

.right {
    width: 200px;
    background: #3498db;
}

/* 响应式 */
@media (max-width: 768px) {
    .wrapper { flex-direction: column; }
    .left, .right { width: 100%; }
}
```

### Grid 实现（更简洁）
```css
.holy-grail {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 60px 1fr 60px;
    grid-template-areas:
        "header header header"
        "left main right"
        "footer footer footer";
    min-height: 100vh;
}

.hg-header { grid-area: header; }
.hg-left   { grid-area: left; }
.hg-main   { grid-area: main; }
.hg-right  { grid-area: right; }
.hg-footer { grid-area: footer; }
```

---

## 9.3 清除浮动

### 标准清除浮动
```css
.clearfix::after {
    content: "";
    display: block;
    clear: both;
}

/* 使用 */
<div class="clearfix">
    <div class="float-left"></div>
    <div class="float-right"></div>
</div>
```

### 扩展版（兼容旧浏览器）
```css
.clearfix::before,
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* 或使用双伪元素 */
.clearfix::after {
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
}
.clearfix {
    *zoom: 1;  /* IE6/7 兼容 */
}
```

### 替代方案
```css
/* 方案一：overflow */
.parent {
    overflow: hidden;
}

/* 方案二：flex 布局 */
.parent {
    display: flex;
}

/* 方案三：BFC */
.parent {
    display: flow-root;
}
```

### 各方案对比
| 方案 | 优点 | 缺点 |
|-----|------|------|
| clearfix | 通用、无副作用 | 需要额外代码 |
| overflow: hidden | 简单 | 裁剪溢出内容 |
| flex/grid | 现代、无副作用 | 需要重构布局 |
| display: flow-root | 简洁 | 浏览器支持有限 |

---

## 9.4 三角形与自定义形状

### 三角形（border 实现）
```css
/* 向上的三角形 */
.triangle-up {
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 60px solid red;
}

/* 向下的三角形 */
.triangle-down {
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-top: 60px solid blue;
}

/* 向左的三角形 */
.triangle-left {
    width: 0;
    height: 0;
    border-top: 40px solid transparent;
    border-right: 60px solid green;
    border-bottom: 40px solid transparent;
}

/* 向右的三角形 */
.triangle-right {
    width: 0;
    height: 0;
    border-top: 40px solid transparent;
    border-left: 60px solid orange;
    border-bottom: 40px solid transparent;
}
```

### 利用 CSS 变量的三角形
```css
.triangle {
    --size: 40px;
    --color: red;
    width: 0;
    height: 0;
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-bottom: calc(var(--size) * 1.5) solid var(--color);
}
```

### clip-path 自定义形状
```css
/* 三角形 */
.clip-triangle {
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

/* 六边形 */
.clip-hexagon {
    clip-path: polygon(
        25% 0%, 75% 0%,
        100% 50%, 75% 100%,
        25% 100%, 0% 50%
    );
}

/* 星形 */
.clip-star {
    clip-path: polygon(
        50% 0%, 61% 35%, 98% 35%,
        68% 57%, 79% 91%, 50% 70%,
        21% 91%, 32% 57%, 2% 35%, 39% 35%
    );
}

/* 圆形 */
.clip-circle {
    clip-path: circle(50% at 50% 50%);
}

/* 水滴形 */
.clip-drop {
    clip-path: path('M50,0 C50,30 0,30 0,60 A50,50 0 0 0 100,60 C100,30 50,30 50,0');
}
```

### border-radius 组合形状
```css
/* 胶囊形状 */
.capsule {
    border-radius: 50%;
}

/* 叶子形状 */
.leaf {
    border-radius: 0 100% 0 100%;
}

/* 不对称圆角 */
.asymmetric {
    border-radius: 30px 8px 30px 8px;
}

/* 花瓣形状 */
.petal {
    border-radius: 50% 0 50% 50%;
}
```

### 其他形状技巧
```css
/* 爱心 */
.heart {
    position: relative;
    width: 100px;
    height: 100px;
    transform: rotate(-45deg);
}
.heart::before,
.heart::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: red;
}
.heart::before { top: -50px; left: 0; }
.heart::after { top: 0; left: 50px; }

/* 对话气泡 */
.bubble {
    position: relative;
    padding: 20px;
    background: white;
    border-radius: 10px;
}
.bubble::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 30px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 15px solid white;
}
```

---

## 速查语法

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


---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 设计模式与实战 演示](/demos/02-css/09-design-patterns.html)
:::
