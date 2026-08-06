---
title: CSS 浮动布局（float）完整手册
---

# 浮动布局 float

## 核心概念

让元素脱离文档流，向容器左侧或右侧贴靠，后面的行内内容（文字）环绕它流动。如今**只保留图文混排一个场景**，其余布局需求交给 flex / grid。

## 完整内容

### 是什么 / 为什么

浮动是布局演化史的第一代工具（见 [布局总览](/3-reference/1-handbook/css/layout)），曾用于多栏布局，但因「脱离文档流 + 塌陷」的副作用，现代布局已弃用。只有「文字绕图」它仍不可替代。

**怎么用**：

```css
.float-left {
  float: left;   /* 向左浮动 */
  float: right;  /* 向右浮动 */
  float: none;   /* 不浮动（默认） */
}
```

**核心行为**：

- 浮动元素脱离文档流，但**没有脱离文字** —— 后续文字会环绕它。
- 多个浮动元素会沿同一方向依次排列（这是早期多栏布局的原理）。
- 浮动元素会收缩宽度（类似 inline-block），可以显式设宽高。

**经典问题：父容器塌陷**。浮动元素脱离文档流后，父容器的高度不再包含它：

```html
<div class="wrap">
  <div class="box">左栏</div>
  <div class="box">右栏</div>
</div>
```

```css
.box { float: left; width: 50%; }
/* .wrap 的高度塌陷为 0，背景和边框消失 */
```

**清除浮动（三选一）**：

```css
/* 方案一：伪元素 clearfix（最通用） */
.wrap::after {
  content: "";
  display: table;
  clear: both;
}

/* 方案二：让父元素建立 BFC（触发块级格式化上下文） */
.wrap {
  display: flow-root;      /* 现代写法，无副作用 */
  /* 或 overflow: hidden;   /* 旧写法，副作用是裁剪溢出内容 */
}

/* 方案三：在末尾追加一个清除元素 */
.clear { clear: both; }
```

**BFC（块级格式化上下文）**：一个独立的渲染区域，内部元素的浮动/外边距不会影响到外部。触发 BFC 的常见方式：`overflow` 非 `visible`、`display: flow-root`、`display: flex/grid` 容器、`float` 自身、`position: absolute/fixed`。

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `float` | `left` / `right` / `none` | 浮动方向 |
| `clear` | `left` / `right` / `both` | 禁止某侧出现浮动元素（用于清除浮动） |

### 注意事项

- ⚠️ 浮动已不是主流布局手段，**只留给图文混排**。
- ⚠️ 浮动元素会脱离文档流，可能导致元素重叠，务必清除浮动或使用 BFC 包裹。
- ⚠️ 浮动元素默认会收缩宽度，需要显式设置宽度。

## 相关

- 📖 同章手册：[布局总览](/3-reference/1-handbook/css/layout)、[弹性布局 Flexbox](/3-reference/1-handbook/css/layout/flex)、[网格布局 Grid](/3-reference/1-handbook/css/layout/grid)
- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
