# CSS 基础入门

CSS 简介与选择器基础。

## 学习内容

1. **CSS 简介** → `01-css-intro.html`
   - CSS 是什么、如何引入 CSS
2. **选择器详解** → `02-selectors.html`
   - 基础选择器、组合选择器、伪类选择器

## 核心知识点

### CSS 引入方式

```html
<!-- 1. 内联样式 -->
<div style="color: red;">红色文字</div>

<!-- 2. 内部样式表 -->
<style>
  .box { color: red; }
</style>

<!-- 3. 外部样式表（推荐） -->
<link rel="stylesheet" href="style.css">
```

### 基础选择器

| 选择器 | 语法 | 示例 |
|--------|------|------|
| 标签选择器 | `标签名` | `div { }` |
| 类选择器 | `.类名` | `.box { }` |
| ID 选择器 | `#id` | `#header { }` |
| 通配符选择器 | `*` | `* { margin: 0; }` |

## 在线演示

查看本模块的 CSS 案例文件：[案例演示](/frontend-journey/examples/02-css/01-basics/)
