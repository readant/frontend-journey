---
title: CSS 过渡与动画完整手册
---

# CSS 过渡与动画

## 核心概念

过渡管「状态切换」，动画管「自主表演」—— 都靠 transform + opacity 跑在 GPU 上才流畅。

## 完整内容

### 是什么 / 为什么

- **过渡 transition**：属性从 A 变到 B 时，把瞬间变化变成平滑过程（如按钮 hover）。
- **动画 animation**：通过 `@keyframes` 定义多个关键帧，让元素自主循环表演（如加载动画）。
- **变换 transform**：位移、旋转、缩放、倾斜 —— 动画的真正「动作本体」。

### 一、变换 transform

```css
.box {
  transform: translate(10px, 20px);  /* 位移（可单独 translateX/Y） */
  transform: rotate(45deg);          /* 旋转（deg / turn） */
  transform: scale(1.5);             /* 缩放（x, y 可分别） */
  transform: skew(10deg);            /* 倾斜 */
  transform: translate(-50%, -50%);  /* 经典：配合 absolute 实现居中 */
  transform-origin: center;          /* 变换原点（默认中心，可设 left top） */
}
```

**3D 变换**：

```css
.card3d {
  transform: perspective(800px) rotateY(30deg);  /* 透视 + 绕 Y 轴 */
  transform-style: preserve-3d;                 /* 子元素保持 3D 空间 */
}
```

### 二、过渡 transition

```css
.btn {
  transition: all 0.3s ease;                    /* 属性 时长 缓动 */
  transition: transform 0.3s ease, opacity 0.2s linear; /* 分属性设置 */
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);  /* 自定义缓动 */
}
.btn:hover {
  transform: translateY(-2px);
}
```

**四要素**：

| 要素 | 说明 |
| :--- | :--- |
| `transition-property` | 哪些属性参与过渡（尽量指定，`all` 有性能损耗） |
| `transition-duration` | 时长（`0.3s` / `300ms`） |
| `transition-timing-function` | 缓动：`ease` / `linear` / `ease-in` / `ease-out` / `cubic-bezier()` |
| `transition-delay` | 延迟（`0.2s`，可让动画依次错开） |

### 三、关键帧动画 animation

```css
@keyframes float {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.box {
  animation: float 2s ease-in-out infinite;   /* 名称 时长 缓动 循环 */
}
```

**animation 全属性**：

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `animation-name` | 关键帧名 | 对应 `@keyframes` |
| `animation-duration` | 时长 | 一个周期时长 |
| `animation-timing-function` | 缓动 | 同上 |
| `animation-delay` | 时长（可负值） | 负值 = 从中间开始播 |
| `animation-iteration-count` | 数字 / `infinite` | 循环次数 |
| `animation-direction` | `normal` / `reverse` / `alternate` / `alternate-reverse` | 方向（alternate 来回摆） |
| `animation-fill-mode` | `none` / `forwards` / `backwards` / `both` | 结束后停在终点 |
| `animation-play-state` | `running` / `paused` | 暂停/继续 |

### 四、steps() 逐帧动画

```css
.sprite {
  animation: run 1s steps(8) infinite;  /* 像翻书一样逐帧切换（雪碧图） */
}
```

`steps(8)` 把动画分成 8 个不连续的台阶，适合帧动画精灵图。

### 语法速查

| 属性 | 值 | 说明 |
| :--- | :--- | :--- |
| `transform` | `translate` / `rotate` / `scale` / `skew` 组合 | 变换（多个用空格隔开） |
| `transform-origin` | 位置 | 变换中心点 |
| `transition` | `<属性> <时长> <缓动> <延迟>` | 状态切换过渡 |
| `@keyframes` | 关键帧百分比块 | 动画剧本 |
| `animation` | 名称 + 时长 + 缓动 + 循环等 | 自主动画 |
| `animation-fill-mode` | `forwards` / `both` | 保持终态 |

### 常见用法

**卡片悬停上浮 + 阴影加深**：

```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
```

**加载菊花（无限旋转）**：

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading {
  animation: spin 0.8s linear infinite;
}
```

**入场动画（淡入 + 上移 + 停留终态）**：

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.enter {
  animation: fade-up 0.6s ease both;   /* both：动画前隐藏，结束后保持 */
}
```

### 注意事项

- ⚠️ **只动画 transform 和 opacity**：动画 `width`/`top`/`margin` 触发重排，卡顿；位移用 `transform`。
- ⚠️ `transition: all` 会监听所有属性变化，切换场景一多就有性能损耗，尽量指名属性。
- ⚠️ 想「结束后停在终点」必须 `animation-fill-mode: forwards/both`，否则动画结束立刻跳回初始。
- ⚠️ 频繁的 `filter: blur()` 动画在移动端极耗性能，慎用。
- ⚠️ 元素 `display: none` 时动画不播放；进场动画要让元素先渲染再触发。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)（hover 反馈、入场动画）
- 📖 相邻手册：[颜色与背景](/3-reference/1-handbook/css/color-bg)（渐变与滤镜搭配）、[响应式](/3-reference/1-handbook/css/responsive)
