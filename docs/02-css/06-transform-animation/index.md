---
title: 06. 变换与动画
---

## 6.1 2D/3D 变换

### transform 属性
```css
.transform-demo {
    transform: translate(50px, 100px);    /* 平移 */
    transform: rotate(45deg);              /* 旋转 */
    transform: scale(1.5);                 /* 缩放 */
    transform: scaleX(2) scaleY(0.5);
    transform: skewX(10deg) skewY(5deg);   /* 倾斜 */
    transform: matrix(1, 0, 0, 1, 50, 100);  /* 矩阵变换 */

    /* 多个变换组合 */
    transform: translate(50px, 100px) rotate(45deg) scale(1.5);
}
```

### 2D 变换函数
| 函数 | 说明 | 示例 |
|-----|------|------|
| `translate(x, y)` | 平移 | `translate(50px, 100px)` |
| `translateX(x)` | X 轴平移 | `translateX(50px)` |
| `translateY(y)` | Y 轴平移 | `translateY(100px)` |
| `rotate(angle)` | 旋转 | `rotate(45deg)` |
| `scale(n)` | 缩放 | `scale(1.5)` |
| `scaleX(n)` | X 轴缩放 | `scaleX(2)` |
| `scaleY(n)` | Y 轴缩放 | `scaleY(0.5)` |
| `skewX(angle)` | X 轴倾斜 | `skewX(10deg)` |
| `skewY(angle)` | Y 轴倾斜 | `skewY(5deg)` |

### 3D 变换函数
```css
.transform-3d {
    transform: translate3d(50px, 100px, 0);
    transform: translateZ(100px);
    transform: rotateX(45deg);
    transform: rotateY(45deg);
    transform: rotateZ(45deg);
    transform: scale3d(1, 1, 1);
    transform: perspective(500px) rotateY(45deg);
}
```

### 透视与背面
```css
.perspective-container {
    perspective: 1000px;           /* 透视距离 */
    perspective-origin: center;    /* 透视起点 */
}

.face {
    backface-visibility: hidden;  /* 背面隐藏 */
    transform-style: preserve-3d; /* 保留 3D 空间 */
}
```

### transform-origin
```css
.transform-demo {
    transform-origin: center center;     /* 默认值 */
    transform-origin: top left;
    transform-origin: 50% 50%;
    transform-origin: 0 0 0;             /* 3D 变换的原点 */
}
```

---

## 6.2 过渡

### transition 属性
```css
.transition-demo {
    transition-property: all;           /* 要过渡的属性 */
    transition-duration: 0.3s;         /* 过渡时间 */
    transition-timing-function: ease;   /* 缓动函数 */
    transition-delay: 0s;               /* 延迟时间 */

    /* 简写 */
    transition: all 0.3s ease 0s;

    /* 多个属性分别设置 */
    transition:
        background-color 0.3s ease,
        color 0.3s ease 0.1s,
        transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.transition-demo:hover {
    background-color: red;
    color: white;
    transform: scale(1.05);
}
```

### transition-property 取值
| 值 | 说明 |
|---|------|
| `all` | 所有可过渡属性 |
| `color`, `transform`, `opacity` 等 | 指定属性 |
| `none` | 无过渡 |

### timing-function 取值
| 值 | 说明 |
|---|------|
| `linear` | 匀速 |
| `ease` | 先慢后快再慢（默认） |
| `ease-in` | 先慢后快 |
| `ease-out` | 先快后慢 |
| `ease-in-out` | 先慢后快再慢 |
| `cubic-bezier(n,n,n,n)` | 自定义贝塞尔曲线 |
| `steps(n, start/end)` | 分步动画 |

### 可过渡的属性
- 颜色: `color`, `background-color`, `border-color`
- 数值: `width`, `height`, `margin`, `padding`, `font-size`
- 位置: `top`, `left`, `right`, `bottom`
- 变换: `transform`, `opacity`, `filter`
- **不可过渡**: `display`, `font-family`, `background-image`

---

## 6.3 关键帧动画

### @keyframes 定义
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-30px);
    }
    60% {
        transform: translateY(-15px);
    }
}

@keyframes slideInLeft {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
```

### animation 属性
```css
.animated-element {
    animation-name: fadeIn;           /* 动画名称 */
    animation-duration: 1s;            /* 持续时间 */
    animation-timing-function: ease;  /* 缓动函数 */
    animation-delay: 0s;              /* 延迟时间 */
    animation-iteration-count: infinite; /* 循环次数 */
    animation-direction: normal;       /* 播放方向 */
    animation-fill-mode: both;        /* 填充模式 */
    animation-play-state: running;     /* 播放状态 */

    /* 简写 */
    animation: fadeIn 1s ease 0s infinite normal both;
}
```

### animation 属性详解
| 属性 | 取值 | 说明 |
|-----|------|------|
| `animation-name` | keyframes 名称 | 指定动画 |
| `animation-duration` | `1s`, `500ms` | 单次时长 |
| `animation-timing-function` | 同 transition | 缓动曲线 |
| `animation-delay` | `0s`, `-1s` | 延迟时间（负值跳到中途） |
| `animation-iteration-count` | `1`, `3`, `infinite` | 循环次数 |
| `animation-direction` | `normal`, `reverse`, `alternate`, `alternate-reverse` | 播放方向 |
| `animation-fill-mode` | `none`, `forwards`, `backwards`, `both` | 非动画期间的样式 |
| `animation-play-state` | `running`, `paused` | 播放/暂停 |

### direction 取值说明
| 值 | 说明 |
|---|------|
| `normal` | 正向播放 |
| `reverse` | 反向播放 |
| `alternate` | 奇数次正向，偶数次反向 |
| `alternate-reverse` | 奇数次反向，偶数次正向 |

### fill-mode 取值说明
| 值 | 动画前 | 动画后 |
|---|--------|--------|
| `none` | 最终样式 | 当前样式 |
| `forwards` | 当前样式 | 最终样式 |
| `backwards` | 起始样式 | 当前样式 |
| `both` | 起始样式 | 最终样式 |

::: danger @keyframes 中的 !important 无效
在 `@keyframes` 规则内部声明的 `!important` **会被忽略**，不要试图用它提升关键帧优先级。
:::

::: danger 动画优先级高于过渡
同一元素上 `animation` 与 `transition` 作用于同一属性时，**动画优先**。动画运行期间，过渡对该属性不生效。
:::

::: warning 入场动画务必设置 fill-mode
入场动画不写 `forwards` / `both` 时，动画结束后元素会**回到初始样式**（闪现回起点）。延迟期还想保持起始帧则用 `backwards`。
:::

### steps() 逐帧动画（精灵图）

`steps(n)` 将动画划分为 n 段"跳变"，常用于精灵图（Sprite Sheet）逐帧播放：

```css
.sprite {
    width: 100px;
    height: 100px;
    background: url('sprite.png') 0 0 no-repeat;
    animation: spriteAnim 0.8s steps(4, end) infinite;  /* 4 帧精灵图 */
}

@keyframes spriteAnim {
    from { background-position: 0 0; }
    to   { background-position: -400px 0; }  /* 总宽度 = 帧数 × 帧宽 */
}
```

::: tip steps() 技巧
- `steps(1)` 等价于 `step-end`（直接跳到终点）；`steps(1, start)` 等价于 `step-start`
- 精灵图动画中步数 = 帧数 - 1 区间，背景图从 0 移动到总宽度
:::

### 性能优化
```css
/* 使用 transform 和 opacity 触发 GPU 加速 */
.optimized {
    transform: translateZ(0);
    will-change: transform, opacity;
}

/* 避免重排重绘 */
.transform-only {
    transform: translate(50px);    /* 只触发合成层 */
    /* left: 50px; */             /* 会触发重排 */
}
```

---

::: tip 速查手册
本章核心语法已收录到独立的 [速查手册](/cheatsheet/) 中，方便开发时快速查阅。
:::

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 变换与动画 演示](/demos/02-css/06-transform-animation.html)
:::
