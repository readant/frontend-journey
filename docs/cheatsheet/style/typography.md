---
title: 字体与单位速查
---

# 字体与单位速查

## 何时用

- 设置字号、字重、行高、字间距等排版参数
- 选择尺寸单位（rem 响应式 / em 嵌套 / vw 视口）
- 处理可继承属性（font、color 等无需重复设置）

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>字体与单位演示</title>
<style>
  :root { font-size: 16px; } /* rem 的基准（默认就是 16px） */

  .text {
    font-family: "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif; /* 系统字体栈 */
    font-size: 1.25rem;      /* = 20px，跟随根字号 */
    font-weight: 600;        /* normal(400) | bold(700) | 100~900 */
    line-height: 1.6;        /* 无单位，相对自身字号 */
    letter-spacing: 1px;     /* 字间距 */
  }

  /* 单位对照 */
  .units li { margin: 6px 0; }
  .px  { font-size: 16px; }
  .rem { font-size: 2rem; }    /* 32px，跟随 :root */
  .em  { font-size: 1.5em; }   /* 相对父元素字号，嵌套会放大 */
  .vw  { font-size: 3vw; }     /* 相对视口宽度，随窗口变化 */

  /* 继承：color/font 等自动继承，无需在子元素重复写 */
  .parent { color: #3498db; font-family: "PingFang SC", sans-serif; }
  .child  { }  /* 子元素自动继承父级颜色与字体 */
</style>
</head>
<body>
  <p class="text">1.25rem 字号 + 1.6 行高 + 1px 字间距</p>

  <ul class="units">
    <li class="px">px：16px 固定</li>
    <li class="rem">rem：2rem = 32px</li>
    <li class="em">em：1.5em（相对父级）</li>
    <li class="vw">vw：3vw（随视口缩放）</li>
  </ul>

  <div class="parent">父级颜色
    <div class="child">子元素继承了 color 和 font（无需重复声明）</div>
  </div>
</body>
</html>
```

## 踩坑记录

- **rem 的基准是 `<html>` 的 `font-size`**（默认 16px），改 `:root` 字体大小全站联动，适合做响应式字号
- **em 相对父元素字号且会嵌套放大**：`font-size: 1.5em` 在多层嵌套中越乘越大，除非有意识利用，否则用 rem
- **line-height 用无单位数值**（如 `1.6`）：有单位（如 `1.6em`）会算成绝对像素，继承时子元素字号变化会导致行高错误
- **字重别写数值以外的花哨值**：多数系统字体只有 400/700 两档有效，`font-weight: 500` 可能不生效
- **中文网页记得带中文字体**：系统字体栈要包含 `"PingFang SC"`、`"Microsoft YaHei"` 等，否则回退到默认宋体
- **可继承属性**：`font-*`、`color`、`text-*`、`list-style`、`visibility`、`cursor`；不可继承的如 `margin/padding/border/width/height/background`
