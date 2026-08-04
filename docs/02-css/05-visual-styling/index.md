---
title: 05. 视觉样式与美化
---

## 5.1 文本与字体

### font 属性
```css
.font-demo {
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: bold;          /* normal, bold, 100-900 */
    font-style: italic;          /* normal, italic, oblique */
    font-variant: small-caps;
    line-height: 1.6;            /* 行高，可设为无单位数值 */
    letter-spacing: 2px;        /* 字间距 */
    word-spacing: 5px;          /* 词间距 */
}
```

### text 属性
```css
.text-demo {
    text-align: center;          /* left, right, center, justify */
    text-indent: 2em;            /* 首行缩进 */
    text-decoration: underline;  /* none, underline, overline, line-through */
    text-transform: uppercase;   /* none, uppercase, lowercase, capitalize */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    white-space: nowrap;         /* normal, nowrap, pre, pre-wrap */
    word-break: break-all;       /* normal, break-all, keep-all */
    overflow-wrap: break-word;
}
```

### 常用字体栈
```css
/* 无衬线字体（系统默认） */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* 衬线字体 */
font-family: Georgia, 'Times New Roman', Times, serif;

/* 等宽字体 */
font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace;

/* 中文优先 */
font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

::: tip 字体栈书写规范
1. 字体名含空格或中文时**必须加引号**
2. 通用字体族（`serif` / `sans-serif` / `monospace`）不加引号且放最后
3. 先写西文字体，再写中文字体
:::

### @font-face 与 font-display

```css
@font-face {
  font-family: "MyFont";
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-display: swap;
}
```

**font-display 加载策略**：控制字体加载期间的渲染行为（FOIT / FOUT）

| 值 | 行为 |
|----|------|
| `block` | 短时间不可见等待字体（FOIT） |
| `swap` | 立即用后备字体显示，加载后替换（FOUT） |
| `fallback` | 短时间等待，超时永久使用后备 |
| `optional` | 短暂等待，不阻塞渲染 |

::: tip font-display 选择建议
- **正文内容**：推荐 `swap`，保证文本始终可见，避免 FOIT
- **图标字体**：推荐 `block`，避免图标缺失导致布局错乱
- **装饰性字体**：推荐 `optional`
:::

::: warning 数值字重需字体支持
并非所有字体都支持 100~900 全部字重，缺失时浏览器会近似匹配（如 `font-weight: 300` 可能渲染为 `400`）。
:::

### 行高与文本省略

```css
line-height: 1.5;      /* 推荐无单位，相对当前字号 */
```

::: tip 无单位行高
使用无单位的 `line-height`（如 `1.5`），子元素继承时会按**自身** `font-size` 重新计算，避免继承错位。
:::

**单行省略（三件套缺一不可）**：
```css
.ellipsis {
  white-space: nowrap;      /* 强制不换行 */
  overflow: hidden;         /* 隐藏溢出 */
  text-overflow: ellipsis;  /* 省略号 */
}
```

**多行省略**：
```css
.clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

::: warning 多行省略兼容性
`-webkit-line-clamp` 基于旧版 `-webkit-box` 实现，与现代 Flexbox / Grid 布局不兼容（元素本身若用了 flex 布局会受影响）。
:::

---

## 5.2 颜色与背景

### background 属性
```css
.bg-demo {
    background-color: #f0f0f0;
    background-image: url('bg.jpg');
    background-repeat: no-repeat;   /* repeat, repeat-x, repeat-y, no-repeat */
    background-position: center top; /* left/center/right + top/center/bottom */
    background-size: cover;          /* auto, cover, contain, 100px 50% */
    background-attachment: fixed;    /* scroll, fixed, local */

    /* 简写 */
    background: #f0f0f0 url('bg.jpg') no-repeat center / cover fixed;
}
```

### 渐变背景
```css
/* 线性渐变 */
background: linear-gradient(to right, red, blue);
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background: linear-gradient(to bottom,
    red 0%, red 50%,
    blue 50%, blue 100%);

/* 径向渐变 */
background: radial-gradient(circle, #ff6b6b, #feca57);
background: radial-gradient(ellipse at center, #ff6b6b, #feca57);

/* 锥形渐变 */
background: conic-gradient(red, orange, yellow, green, blue, red);
```

### 多重背景
```css
background:
    url('top-image.png') no-repeat top center,
    url('bottom-image.png') no-repeat bottom center,
    linear-gradient(to bottom, #ff6b6b, #feca57);
```

::: tip 多重背景叠加顺序
先声明的背景在上层，后声明的在下层；最后一项常用纯色作为兜底背景色。
:::

::: warning background 简写注意
1. 简写时未指定的属性会**重置为默认值**
2. `position` 与 `size` 用 `/` 分隔（如 `center/cover`）
3. 只改单个属性时用单属性写法更清晰
:::

### cover vs contain

| 值 | 行为 | 副作用 |
|----|------|--------|
| `cover` | 图片完全覆盖容器 | **可能裁剪**图片 |
| `contain` | 图片完整显示 | **可能留白** |

### 文字渐变（background-clip: text）

```css
.gradient-text {
  background: linear-gradient(45deg, #f00, #00f);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;  /* 文字变透明，露出背景渐变 */
}
```

---

## 5.3 边框与圆角

### border-radius 圆角
```css
border-radius: 10px;                      /* 统一圆角 */
border-radius: 50%;                       /* 圆形 */
border-radius: 10px 20px 30px 40px;       /* 左上 右上 右下 左下 */
border-radius: 10px 20px;                 /* 左上/右下 右上/左下 */
border-top-left-radius: 10px;
border-bottom-right-radius: 20px;
```

### box-shadow 阴影
```css
.box-shadow {
    box-shadow:
        0 4px 6px rgba(0,0,0,0.1),       /* 外阴影 */
        0 10px 20px rgba(0,0,0,0.15),
        inset 0 2px 4px rgba(0,0,0,0.1), /* 内阴影 */
        0 0 0 3px rgba(255,0,0,0.5);    /* 光晕 */
}

/* 参数: x y blur spread color inset */
box-shadow: [offset-x] [offset-y] [blur] [spread] [color] [inset];
```

### outline 轮廓
```css
.outline-demo {
    outline: 2px solid red;
    outline-offset: 4px;
}
/* outline 不占据空间，不影响布局 */
```

---

## 5.4 列表与表格

### 列表样式
```css
.list-demo {
    list-style-type: circle;     /* disc, circle, square, decimal, none */
    list-style-position: inside; /* outside, inside */
    list-style-image: url('bullet.png');

    /* 简写 */
    list-style: square inside;
}
```

### 表格样式
```css
.table-demo {
    border-collapse: collapse;     /* collapse, separate */
    border-spacing: 0;           /* 边框间距（separate 模式下） */
    caption-side: bottom;        /* caption 位置 */
    table-layout: fixed;         /* fixed, auto */
}

.table-demo th,
.table-demo td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.table-demo tr:nth-child(even) {
    background-color: #f9f9f9;
}
```

---

## 5.5 滤镜与混合模式

### filter 滤镜
```css
.filter-demo {
    filter: blur(5px);
    filter: brightness(1.5);
    filter: contrast(2);
    filter: saturate(2);
    filter: grayscale(0.8);
    filter: sepia(0.5);
    filter: hue-rotate(90deg);
    filter: invert(1);
    filter: opacity(0.5);
    filter: drop-shadow(4px 4px 10px rgba(0,0,0,0.5));

    /* 多个滤镜 */
    filter: brightness(1.5) contrast(1.2) blur(2px);
}
```

### backdrop-filter 背景滤镜
```css
.glass-morphism {
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
/* 毛玻璃效果 */
```

### mix-blend-mode 混合模式
```css
.blend-demo {
    mix-blend-mode: normal;       /* 正常 */
    mix-blend-mode: multiply;     /* 正片叠底 */
    mix-blend-mode: screen;       /* 滤色 */
    mix-blend-mode: overlay;      /* 叠加 */
    mix-blend-mode: darken;       /* 变暗 */
    mix-blend-mode: lighten;       /* 变亮 */
    mix-blend-mode: color-dodge;  /* 颜色减淡 */
    mix-blend-mode: color-burn;   /* 颜色加深 */
    mix-blend-mode: difference;   /* 差值 */
    mix-blend-mode: exclusion;    /* 排除 */
}
```

::: tip drop-shadow vs box-shadow
`filter: drop-shadow()` 会跟随元素的**实际形状**（包括透明 PNG 的轮廓），而 `box-shadow` 始终是盒子形状。不规则形状元素用 `drop-shadow` 更真实。
:::

::: warning backdrop-filter 性能
`backdrop-filter`（毛玻璃）是 GPU 密集型操作，在移动设备上避免大面积使用，可配合 `will-change` 提示浏览器优化。
:::

---

::: tip 速查手册
本章核心语法已收录到独立的 [速查手册](/cheatsheet/) 中，方便开发时快速查阅。
:::

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 视觉样式与美化 演示](/demos/02-css/05-visual-styling.html)
:::
