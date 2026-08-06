---
title: CSS 现代特性与工程化完整手册
---

# 现代 CSS 与工程化

## 核心概念

项目变大后，靠「人肉复制粘贴样式」必然失控。现代 CSS 的答案是：**变量统一管理、函数做动态计算、级联层控制覆盖、方法论约束命名**，让样式像代码一样可维护。

## 完整内容

### 是什么 / 为什么

一个样式系统要解决三件事：**值重复**（同一颜色出现 50 次）、**覆盖混乱**（第三方样式打架）、**命名失序**（类名全靠心情）。本页对应给出四件武器：变量、函数、@layer、方法论。

### 一、CSS 变量（自定义属性）

```css
:root {
  --brand: #2d8cf0;        /* 全局定义 */
  --space: 16px;
}

.card {
  color: var(--brand);              /* 使用 */
  padding: var(--space);
  color: var(--theme, #333);        /* 回退值：变量没定义时用 #333 */
}
```

| 特性 | 说明 |
| :--- | :--- |
| 定义 | `--名字: 值`（区分大小写，`--Brand` ≠ `--brand`） |
| 使用 | `var(--名字)`，可带第二个参数做回退 |
| 作用域 | 定义在哪个选择器上就作用于它及后代；`:root` = 全局 |
| 继承 | 变量**随继承传播**，子元素可以读到父级定义 |
| 动态修改 | JS 改 `el.style.setProperty("--x", v)`，或媒体查询里重定义 |

**主题切换**（无需重写组件，只改变量）：

```css
:root { --bg: #fff; --text: #222; }
[data-theme="dark"] { --bg: #1a1a2e; --text: #eee; }

body { background: var(--bg); color: var(--text); }
```

### 二、函数三兄弟：calc / clamp / min-max

```css
/* calc：任意单位混合运算（+ - * /，运算符号两边要有空格） */
width: calc(100% - 32px);
font-size: calc(1rem + 0.5vw);

/* clamp：区间字号 —— 不小于 14px、不超过 20px、随视口线性变化 */
font-size: clamp(14px, 2vw, 20px);

/* min / max：取较小 / 较大值 */
width: min(100%, 1200px);   /* 容器在窄屏自适应、宽屏封顶 1200px */
```

**使用场景**：侧边栏吸顶宽度、响应式字号、容器封顶——能算的别手写死值。

### 三、@layer 级联层

把样式**按信任度分层**，让「自己的样式」天然赢过「框架的样式」，告别 `!important` 军备竞赛：

```css
@layer reset, base, components, utilities;

/* 后面的层优先级更高：utilities > components > base > reset */
@layer base { .btn { padding: 8px 16px; } }
@layer components { .btn { padding: 10px 20px; } }  /* 胜出 */

/* 不写层的规则，优先级最高（隐式层） */
.btn { padding: 12px 24px; }
```

### 四、预处理器速览（Sass / Less）

| 特性 | 原生 CSS | Sass/SCSS |
| :--- | :--- | :--- |
| 变量 | ✅ `--x` | ✅ `$x` |
| 嵌套 | ✅ `&` 可嵌套一层 | ✅ 深度嵌套（易写烂） |
| 混入（mixin） | ❌（可用 `@apply` 思路替代） | ✅ `@mixin` |
| 计算 | ✅ `calc()` | ✅ 直接算 |
| 循环/条件 | ❌ | ✅ `@for` `@if` |

**判断标准**：小项目直接用现代 CSS（变量 + calc 已够）；项目大、需要 mixin 与循环时再上预处理器。预处理器输出仍是 CSS，编译期行为。

### 五、CSS 方法论：命名约束

| 方法论 | 核心思想 | 一句话 |
| :--- | :--- | :--- |
| **BEM** | 块-元素-修饰 | `.card__title--large`：块/元素/修饰三段式 |
| OOCSS | 结构与皮肤分离 | 布局类与主题类分开写、组合用 |
| SMACSS | 按角色分目录 | 基础/布局/模块/状态/主题五类 |

```css
/* BEM 示例：改状态不改结构 */
.card {}              /* 块 Block */
.card__title {}       /* 元素 Element：块名+双下划线 */
.card--featured {}    /* 修饰 Modifier：块名+双横线 */
```

**现代倾向**：组件框架（Vue SFC / CSS Modules）天然隔离作用域，配合 BEM 命名即可满足大部分项目，不必过度设计。

### 六、性能优化要点

| 手段 | 作用 |
| :--- | :--- |
| 选择器扁平 | 少用深层后代选择器（`.a .b .c`），命中成本高 |
| 避免频繁重排 | 动画只用 `transform` / `opacity`，少动几何属性 |
| `contain` | 告诉浏览器该容器独立，内部变化不外溢 |
| `content-visibility` | 屏外内容跳过渲染，长列表立省 |
| 关键 CSS 内联 | 首屏样式内联、其余异步加载 |
| 压缩 | 构建时 minify + 合并请求 |

### 语法速查

| 需求 | 写法 |
| :--- | :--- |
| 定义全局变量 | `:root { --x: 值 }` |
| 用变量 + 回退 | `var(--x, 默认值)` |
| 混合单位计算 | `calc(100% - 32px)` |
| 区间字号 | `clamp(14px, 2vw, 20px)` |
| 容器封顶 | `width: min(100%, 1200px)` |
| 分层控覆盖 | `@layer base, components, utilities;` |
| 命名约束 | BEM：`.block__elem--modifier` |

### 常见用法

**一键深色模式 + 间距体系**：

```css
:root {
  --space-1: 8px; --space-2: 16px; --space-3: 24px;
  --bg: #fff; --text: #222;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #141b4d; --text: #e6e9ff; }
}
```

### 注意事项

- ⚠️ `calc` 的 `+`/`-` **两边必须留空格**（`calc(100%-32px)` 会失效），`*`/`/` 可省但建议统一留。
- ⚠️ CSS 变量参与动画/过渡时，浏览器**不会**自动插值计算中间帧，动画属性应写在独立属性上。
- ⚠️ 预处理器嵌套**别超过三层**，深层嵌套 = 深层陷阱。
- ⚠️ `@layer` 老浏览器（2022 年前的 Safari）不支持，线上需确认目标设备。
- ⚠️ 变量名区分大小写，且不能以数字开头。

## 相关

- 📖 相邻手册：[基础语法与机制](/3-reference/1-handbook/css/basics)（层叠与单位）、[响应式](/3-reference/1-handbook/css/responsive)（clamp 响应式字号）
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
