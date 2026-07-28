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

---

## 速查语法

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

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 视觉样式与美化 演示](/demos/02-css/05-visual-styling.html)
:::
