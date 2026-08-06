---
title: CSS 移动 Web 适配完整手册
---

# 移动 Web 适配

## 核心概念

移动端 ≠ 缩小版桌面端。适配的五个维度：**视口**（布局基准）、**单位**（弹性尺寸）、**高清屏**（清晰度与 1px）、**安全区**（刘海屏）、**触控**（交互差异）。缺一环就出「手机上看不对劲」的怪问题。

## 完整内容

### 是什么 / 为什么

手机浏览器默认把页面按「桌面宽度的抽象视口」渲染再整体缩小——这就是为什么没写 viewport meta 的页面在手机上「字小得看不清，一捏就放大」。适配的本质是：**告诉浏览器按真实设备宽度排版，再让尺寸、图片、交互都适配这个小屏世界**。

### 一、视口（viewport）基础

```html
<!-- 响应式前提：缺了它，一切移动端适配都白搭 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- 需要适配刘海屏时再加 viewport-fit -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

| 参数 | 作用 | 建议 |
| :--- | :--- | :--- |
| `width=device-width` | 按设备真实宽度布局 | **必加** |
| `initial-scale=1.0` | 初始缩放 100% | 必加 |
| `maximum-scale=1` / `user-scalable=no` | 禁用缩放 | ⚠️ **别加**：伤无障碍，WCAG 视为失败 |
| `viewport-fit=cover` | 内容铺满到刘海区域 | 要用安全区时加 |

### 二、尺寸适配方案

| 方案 | 原理 | 适用 |
| :--- | :--- | :--- |
| **vw / clamp 流式**（现代首选） | 尺寸随视口线性变化，`clamp()` 设上下限 | 新项目、设计稿 375/750 宽 |
| **rem 动态根字号** | JS 按屏幕宽设置 `html` 字号，全站 rem 跟随 | 老项目迁移、全局等比缩放 |
| 百分比 + Flex/Grid | 结构性尺寸自适应，内容自主伸缩 | 任何项目的基础盘 |

```css
/* vw 流式：设计稿 750 宽，1px 设计稿 = 100/750 vw */
.hero-title {
  font-size: clamp(24px, 8vw, 56px);   /* 随屏变化但限 24–56px */
  padding: 0 clamp(12px, 4vw, 48px);
}

/* rem 方案：JS 设根字号 = 屏幕宽 / 10，全站 1rem 即 1/10 屏宽 */
html { font-size: 37.5px; }  /* 375 屏：1rem = 37.5px，设计稿 px 除以 100 即 rem */
```

**怎么选**：新项目用 vw + clamp；**字号别用 vw 裸写**（无下限会小到看不清），必须 `clamp()` 收边界。

### 三、高清屏与 1px 问题

- **devicePixelRatio（DPR）**：iPhone 多为 3、安卓旗舰 2~3。物理像素 = CSS 像素 × DPR，所以 1 个 CSS px 实际是 2~3 个物理点。
- **图片清晰度**：用 `srcset` 提供 `@2x`/`@3x` 图（见 [HTML 音视频与图片](/3-reference/1-handbook/html/media)），CSS 里字体/图标用 SVG 保证任意 DPR 清晰。
- **「1px 边框变粗」**：真机 1 CSS px 在部分屏上显示为物理 2px。解决：`transform: scaleY(0.5)` 画 0.5px 细线。

```css
.hairline {
  position: relative;
}
.hairline::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: #ddd;
  transform: scaleY(0.5);   /* 高分屏下细一半，视觉 1px */
  transform-origin: bottom;
}
```

### 四、安全区与刘海屏

`viewport-fit=cover` 生效后，内容可能被刘海/底部横条遮挡，用 `env()` 安全区变量规避：

```css
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 0px); /* 底部留出 Home 条空间 */
}
.header {
  padding-top: env(safe-area-inset-top, 0px);       /* 顶部避开刘海 */
}
```

| 变量 | 含义 |
| :--- | :--- |
| `safe-area-inset-top` | 顶部安全距离（刘海） |
| `safe-area-inset-bottom` | 底部安全距离（Home 条） |
| `safe-area-inset-left/right` | 左右安全距离（挖孔屏横屏） |

### 五、触控交互差异

| 桌面习惯 | 移动端现实 | 对策 |
| :--- | :--- | :--- |
| `mouseenter`/`mouseleave` | 没有悬停概念 | 用 `click` 或 tap 态 |
| `:hover` 样式 | 点一下永久粘住 | 关键态用 `:active`，别依赖 `:hover` |
| 点击后蓝色高亮 | iOS 默认出现 | `-webkit-tap-highlight-color: transparent`（配自定义反馈） |
| 点击目标过小 | 手指误差 ±10px | 触摸目标 ≥ 44×44px（WCAG） |
| `click` 有 300ms 延迟 | 老浏览器双击缩放判定 | 有 viewport meta 后已消除；仍用 `touchstart` 追求零延迟 |

```js
// touch 事件：touchstart / touchmove / touchend
el.addEventListener("touchstart", () => {
  el.classList.add("pressed");   // 按下反馈
});
el.addEventListener("touchend", () => {
  el.classList.remove("pressed");
});
```

### 六、移动端表单细节

```css
input, select, textarea {
  font-size: 16px;   /* < 16px 时 iOS 聚焦会自动放大页面，极其劝退 */
}
```

```html
<!-- inputmode：调出合适键盘 -->
<input type="number" inputmode="decimal" />   <!-- 数字键盘 -->
<input type="text" inputmode="url" />         <!-- 网址键盘 -->
<input type="text" enterkeyhint="search" />   <!-- 回车键显示「搜索」 -->
```

### 语法速查

| 需求 | 写法 |
| :--- | :--- |
| 响应式前提 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| 刘海屏适配 | 加 `viewport-fit=cover` + `env(safe-area-inset-*)` |
| 流式字号 | `font-size: clamp(14px, 2vw, 20px)` |
| 1px 细线 | `transform: scaleY(0.5)` |
| 消除点击高亮 | `-webkit-tap-highlight-color: transparent` |
| 防聚焦放大 | 输入控件 `font-size: 16px` |
| 调键盘类型 | `inputmode` / `enterkeyhint` |

### 常见用法

**移动优先的基础样板**：

```css
/* 基础样式先写手机 → min-width 逐级放大（移动优先） */
* { box-sizing: border-box; }
html { font-size: 16px; }
button { touch-action: manipulation; }   /* 消除双击缩放干扰 */
@media (min-width: 768px) { /* 平板 */ }
@media (min-width: 1024px) { /* 桌面 */ }
```

### 注意事项

- ⚠️ **没有 viewport meta 一切适配白搭**——先查 head。
- ⚠️ 别禁缩放：`maximum-scale=1` / `user-scalable=no` 会导致无障碍审核失败，且用户没法放大看细节。
- ⚠️ 移动端字号别 `px` 定死小字，正文用 `rem`，`16px` 以下聚焦会「自动放大」。
- ⚠️ `env()` 在不支持的环境返回 `auto`，务必给回退值 `env(..., 0px)`。
- ⚠️ 真机看效果别只靠 DevTools 设备模拟：字体渲染、安全区、滚动条只有真机一致。
- ⚠️ 触摸目标小于 44px 时，相邻元素易误触——宁可大一点也别为了「精致」牺牲易用。

## 相关

- 📖 相邻手册：[响应式](/3-reference/1-handbook/css/responsive)（媒体查询与断点）、[基础语法](/3-reference/1-handbook/css/basics)（vw/rem 单位）、[HTML 音视频与图片](/3-reference/1-handbook/html/media)（srcset 高清图）、[JS 事件](/3-reference/1-handbook/js/event)（touch 事件）
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
