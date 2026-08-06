---
title: CSS 颜色与背景完整手册
---

# CSS 颜色与背景

## 核心概念

颜色定基调，背景做氛围 —— 从纯色到渐变、图片、滤镜，一层层把页面「铺」出来。

## 完整内容

### 是什么 / 为什么

颜色（`color`）作用于文字，背景（`background`）作用于盒子。两者组合起来决定页面的第一眼观感，也是 CSS 变量最容易发挥价值的地方。

### 一、颜色表示法

```css
color: red;               /* 关键字（140+ 个） */
color: #ff0000;           /* HEX 十六进制，6 位 */
color: #f00;              /* HEX 缩写（每两位相同可缩） */
color: #ff000080;         /* HEX 8 位：后两位是透明度 */
color: rgb(255, 0, 0);    /* 红绿蓝，0-255 */
color: rgba(255, 0, 0, 0.5); /* 加透明度（0-1） */
color: hsl(0, 100%, 50%); /* 色相 饱和度 亮度（调色更直观） */
color: hsla(0, 100%, 50%, 0.5);
```

**选型建议**：

| 写法 | 场景 |
| :--- | :--- |
| HEX | 设计稿直接取色，最常用 |
| `rgba()` | 需要透明度的文字/边框 |
| `hsl()` | 做色板/主题时调整色相很直观 |
| CSS 变量 | 主题色抽出来统一管理 |

**透明度三兄弟**（语义不同，别混用）：

```css
opacity: 0.5;      /* 整个元素（含子元素）一起半透明 */
background: rgba(0,0,0,.5); /* 仅背景半透明，文字不受影响 */
color: rgba(0,0,0,.5);      /* 仅文字半透明 */
```

### 二、背景

```css
.box {
  background-color: #f5f7fa;      /* 底色 */
  background-image: url("bg.png"); /* 背景图 */
  background-repeat: no-repeat;   /* repeat / repeat-x / repeat-y */
  background-size: cover;         /* cover 铺满裁剪 / contain 完整包含 / 具体尺寸 */
  background-position: center;    /* 图片位置（center / top left / 百分比 / px） */
  background-attachment: fixed;   /* 视口固定（视差效果） */
}
```

**background 简写（顺序固定）**：

```css
background: #fff url("bg.png") no-repeat center / cover;
```

**背景图的两种铺法**：

| 值 | 效果 | 适用 |
| :--- | :--- | :--- |
| `cover` | 铺满容器，**可能裁剪**边缘 | 首屏 banner、卡片配图 |
| `contain` | 完整显示图片，**可能留白** | 产品图、logo |

### 三、渐变（渐变是「背景图」）

```css
/* 线性渐变：方向 + 色标 */
background: linear-gradient(135deg, #6ea8ff 0%, #7b86ff 100%);

/* 径向渐变：从圆心向外扩散 */
background: radial-gradient(circle, #ffd76a, #ff9a3d);

/* 多色标 + 硬转折 */
background: linear-gradient(90deg, #f00 0%, #f00 50%, #00f 50%, #00f 100%);
```

### 四、滤镜与混合（视觉增强）

```css
.filter {
  filter: blur(4px);                 /* 高斯模糊 */
  filter: brightness(1.2);           /* 亮度 0-2 */
  filter: grayscale(1);              /* 灰度 0-1（黑白照片） */
  filter: saturate(1.5);             /* 饱和度 */
  filter: contrast(1.2);             /* 对比度 */
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,.5)); /* 按形状投影 */
}
```

**毛玻璃（毛玻璃效果）**：

```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);      /* 让背景「透过」模糊 */
}
```

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `color` | 各颜色写法 | 文字颜色 |
| `background-color` | 颜色 | 背景色 |
| `background-image` | `url()` / `linear-gradient()` / `radial-gradient()` | 背景图 / 渐变 |
| `background-repeat` | `repeat` / `no-repeat` / `repeat-x` / `repeat-y` | 平铺方式 |
| `background-size` | `cover` / `contain` / 尺寸 | 图片尺寸策略 |
| `background-position` | `center` / 方位 / 百分比 | 图片位置 |
| `background` | 简写 | 一次设置全部背景 |
| `opacity` | `0-1` | 元素整体透明度 |
| `filter` | `blur()` / `brightness()` / `grayscale()` 等 | 滤镜 |
| `backdrop-filter` | `blur()` 等 | 背景滤镜（毛玻璃） |

### 常见用法

**渐变主题按钮**：

```css
.btn {
  background: linear-gradient(135deg, #5073e8, #7b86ff);
  color: #fff;
  border: none;
  border-radius: 8px;
}
```

**文字渐变（background-clip）**：

```css
.gradient-text {
  background: linear-gradient(90deg, #ffd76a, #ff9a3d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;      /* 关键：文字透明露出背景 */
}
```

**主题色抽成 CSS 变量**：

```css
:root {
  --brand: #3451b2;
  --brand-soft: rgba(52, 81, 178, 0.14);
  --bg: #ffffff;
}
.box {
  background: var(--brand-soft);
  border: 1px solid var(--brand);
}
```

### 注意事项

- ⚠️ `opacity` 会连子元素一起透明，只想透明背景请用 `rgba()`。
- ⚠️ 渐变属于 `background-image`，`background-color` 会在渐变失败时兜底显示。
- ⚠️ `background-size: cover` 在小图上会放大变糊，配图要准备足够大的素材。
- ⚠️ 文字渐变必须三件套：`background-clip: text` + `color: transparent` + 渐变背景。
- ⚠️ `filter` 会创建新的层叠上下文（类似 transform），影响 `z-index` 比较层级。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)（按钮/卡片视觉）
- 📖 相邻手册：[文字与字体](/3-reference/1-handbook/css/typography)、[过渡与动画](/3-reference/1-handbook/css/animation)
