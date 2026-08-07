---
title: CSS 基础语法与机制完整手册
---

# CSS 基础语法与机制

## 核心概念

CSS 的一切建立在三块地基上：**语法结构**（规则怎么写）、**层叠**（冲突时听谁的）、**继承与单位**（值怎么算）。地基不稳，后面的技巧都是空中楼阁。

## 完整内容

### 是什么 / 为什么

样式不生效时，90% 的原因可以归到三类：选择器没写对、优先级被压过、单位换算错了。本页把这三类问题的底层机制一次性讲透，是排查一切样式问题的起点。

### 一、语法结构

一条 CSS 规则 = **选择器 + 声明块**，声明 = **属性: 值**。

```css
/* 选择器        声明块 */
.card {
  color: #333;      /* 声明：属性: 值 */
  padding: 16px;
}

/* 注释 */
/* 这是一条注释，CSS 没有 // 行注释 */
```

- 最后一个声明可带可不带分号，但**统一加分号**可减少复制粘贴丢分号的坑。
- 属性名与值之间有空格、值之间用空格分隔（如 `border: 1px solid #ccc`）。

### 二、引入方式

| 方式 | 写法 | 优先级 | 特点 |
| :--- | :--- | :--- | :--- |
| 外部样式表 | `<link rel="stylesheet" href="a.css">` | 中 | **首选**：可缓存、可复用、按需加载 |
| 内部样式表 | `<style> ... </style>` | 中 | 单页小型样式、临时覆盖 |
| 内联样式 | `style="color: red"` | 最高 | 权重最高、难维护，能不用就不用 |
| `@import` | `@import url(a.css);` | — | 串行加载拖慢渲染，**生产环境不用** |

```html
<!-- 推荐：外部样式表放 head，避免样式闪烁 -->
<link rel="stylesheet" href="style.css" />

<!-- 内联：仅紧急覆盖或动态设置时用 -->
<div style="color: red;">警告</div>
```

**经验**：新项目一律外部样式表；页面级少量覆盖用内部；内联只留给 JS 动态设置的极少数场景。

### 三、层叠与优先级

同元素多条规则命中时按以下顺序裁决（从低到高）：

```
1. 浏览器默认样式
2. 用户样式（几乎不存在）
3. 作者样式（我们写的）← 主要战场
   内联 style > ID > 类/属性/伪类 > 元素/伪元素
4. !important（作者）> !important（用户）
```

| 组成部分 | 权重 |
| :--- | :--- |
| 内联 style | (1,0,0,0) |
| ID 选择器 | (0,1,0,0) |
| 类 / 属性 / 伪类 | (0,0,1,0) |
| 元素 / 伪元素 | (0,0,0,1) |

```css
#box .card p { color: red; }  /* (0,1,1,1) */
.card p { color: blue; }      /* (0,0,1,1) → 前者胜 */

.card { color: red; }
.card { color: blue; }        /* 权重相同 → 后写的胜 */
```

**层叠完整流程**：先按来源与 `!important` 分层 → 再比选择器权重 → 同级比后写者 → 内联最后兜底。

### 四、继承性

子元素自动继承**文本类**属性，不继承**盒类**属性：

| 可继承 ✅ | 不可继承 ❌ |
| :--- | :--- |
| `color`、`font-*`、`line-height` | `margin`、`padding` |
| `text-align`、`text-indent` | `border`、`background` |
| `visibility`、`white-space` | `width`、`height` |
| `opacity`（特殊） | `position`、`display`、`float` |

**四个重置关键字**：

```css
inherit  /* 强制继承父值 */
initial  /* 恢复浏览器默认 */
unset    /* 可继承→继承；不可继承→initial */
revert   /* 回退到上一层样式来源 */
```

### 五、单位与数值

| 单位 | 含义 | 使用建议 |
| :--- | :--- | :--- |
| `px` | 绝对像素 | 边框、小字号、固定尺寸 |
| `em` | 相对**父级**字号 | 单个组件内部比例；深嵌套会放大 |
| `rem` | 相对<strong>根（html）</strong>字号 | **正文与间距首选**，改根字号即全局缩放 |
| `%` | 相对父级 | 宽高、定位偏移、文字排版缩进 |
| `vw` / `vh` | 视口宽 / 高的 1% | 全屏大标题、跟随视口的布局 |
| `vmin` / `vmax` | 视口短边 / 长边 | 保持比例的视觉元素 |
| `ch` | 字符「0」的宽度 | 等宽对齐 |

**经验法则**：字号用 `rem`，间距用 `rem`，边框用 `px`，视口级布局用 `vw`/`clamp()`，局部细节用 `%`。移动端适配详见 [移动 Web 适配](/3-reference/1-handbook/css/mobile)。

### 语法速查

| 需求 | 写法 |
| :--- | :--- |
| 引入样式 | `<link rel="stylesheet">`（外部） |
| 最高优先级 | 内联 style（慎用） |
| 强推规则 | `!important`（万不得已才用） |
| 强制继承 | `inherit` |
| 重置为默认 | `initial` / `unset` / `revert` |
| 全局字号基准 | `html { font-size: 16px; }` + `rem` |
| 视口单位 | `vw` / `vh` / `vmin` / `vmax` |

### 常见用法

**主题字号一键缩放**（rem 的经典价值）：

```css
html { font-size: 16px; }        /* 默认 */
@media (max-width: 480px) {
  html { font-size: 14px; }      /* 小屏整体缩小，无需改任何 rem 声明 */
}
```

**CSS 变量 + 层叠做主题切换**（详见 [现代 CSS](/3-reference/1-handbook/css/modern-css)）：

```css
:root { --brand: #2d8cf0; }
.theme-dark { --brand: #1a1a2e; }
```

### 注意事项

- ⚠️ **优先级不是「类 > 标签」这么简单**：ID 会压过无数个类；内联会压过 ID；`!important` 会压过内联。
- ⚠️ `em` 会随嵌套**逐级放大**，深嵌套时字体会失控，组件内用 `em`、跨组件用 `rem`。
- ⚠️ `%` 的参照物随属性而异：`width: 50%` 相对父宽，`margin-top: 50%` 相对**父宽**（不是高），`font-size: 50%` 相对父字号——别想当然。
- ⚠️ 忘记写 `<!DOCTYPE html>` 时怪异模式会改变盒模型与 `%` 的算法。
- ⚠️ 能写全 CSS 语法就写全：旧代码里常见的 `*{margin:0}` 通配重置如今更推荐 `reset.css` 或 `normalize.css` 方案。

## 相关

- 📖 相邻手册：[选择器](/3-reference/1-handbook/css/selectors)（优先级计算详表）、[现代 CSS](/3-reference/1-handbook/css/modern-css)（变量与函数）、[移动 Web 适配](/3-reference/1-handbook/css/mobile)（视口单位实战）
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
