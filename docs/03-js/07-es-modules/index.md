---
title: 07. ES 模块
---

# ES Module 与动态导入

## 它是什么

ES Module（ESM）是 JavaScript 官方的**模块化标准**，用于把代码拆分成可复用的文件。每个文件是一个独立作用域，通过 `export` 导出、`import` 引入：

```javascript
// math.js
export function add(a, b) { return a + b; }

// main.js
import { add } from "./math.js";
console.log(add(1, 2));   // 3
```

模块化的价值：**隔离作用域（不污染全局）、显式依赖（一眼看清用了什么）、按需加载（tree-shaking 基础）**。

## 核心机制

### 1. 静态分析与"编译期"特性

ESM 的 `import`/`export` 是**顶层静态语法**——不是运行时 API，而是被解析器在**编译阶段**就确定下来的依赖关系。这带来两个关键能力：

- **静态依赖图**：打包器（Vite/Webpack）能静态分析出"谁依赖谁"，从而**摇树优化（tree-shaking）**——把没用的导出从产物里删掉
- **加载顺序确定性**：模块间的依赖在加载前就完整已知

```javascript
// import 必须在顶层（不能写在 if / 函数里）
// if (x) { import "./a.js" }   // ❌ 语法错误

// export 同理，必须顶层
export const a = 1;            // ✅
// if (x) { export const b = 2 } // ❌
```

### 2. 严格模式

模块**自动启用严格模式**（`"use strict"`），无需手动声明：

```javascript
// 模块内：
// 未声明的变量赋值会抛错
x = 1;                        // ❌ ReferenceError
// this 是 undefined（而不是全局对象）
console.log(this);            // undefined
```

### 3. 加载时机：defer 语义

模块脚本**默认延迟执行**（等价于 `defer`）：HTML 解析完才执行，且按依赖顺序。无需手动加 defer。

```html
<script type="module" src="main.js"></script>
<!-- 自动 defer：不阻塞解析，依赖加载完成后按序执行 -->
```

## 标准语法

### export 的三种形式

```javascript
// 1. 命名导出（推荐，可多个）
export const PI = 3.14;
export function square(x) { return x * x; }
export class Point {}

// 2. 默认导出（每个模块一个）
export default function greet(name) { return `hi ${name}`; }

// 3. 汇总导出（re-export：从一个模块再导出去）
export { PI, square } from "./math.js";
```

### import 的三种形式

```javascript
// 1. 命名导入（必须与导出名一致，可起别名）
import { square, PI as 圆周率 } from "./math.js";

// 2. 默认导入
import greet from "./greet.js";

// 3. 整体导入（命名空间对象）
import * as math from "./math.js";
math.square(3);              // 9

// 混合导入
import greet, { square } from "./utils.js";
```

### 动态导入（import()）

静态 `import` 不能写在运行时逻辑里，但 **`import()` 函数**可以——它返回一个 Promise，可**按需加载**：

```javascript
// 场景：路由懒加载、按需引入大库
button.addEventListener("click", async () => {
  const { default: chartLib } = await import("./chart-lib.js");
  chartLib.render();
});

// 返回的是一个模块命名空间对象
const mod = await import("./math.js");
mod.square(2);               // 4
```

### import.meta

```javascript
import.meta.url;             // 当前模块的完整 URL
// 可用于动态拼接资源路径
const assetUrl = new URL("./img/logo.png", import.meta.url);
```

## 深入理解

### 1. ESM vs CommonJS

Node.js 老生态用 CommonJS（`require`），两者差异是面试高频：

| 对比 | ES Module | CommonJS |
| --- | --- | --- |
| 语法 | `import` / `export` | `require` / `module.exports` |
| 时机 | **编译期静态**分析 | **运行时**执行 |
| 输出 | 值的**实时引用**（绑定） | 值的**拷贝** |
| 是否支持 tree-shaking | ✅ | ❌ |
| 浏览器 | 原生支持 | 不支持（需打包） |
| 加载 | 异步（defer） | 同步 |

```javascript
// CommonJS 的坑：解构拷贝
// a.js
let count = 1;
module.exports = { count, inc() { count++; } };

// b.js
const { count, inc } = require("./a");
inc();
console.log(count);   // 1（拷贝，不更新）

// ESM 的引用绑定：
// a.mjs
export let count = 1;
export function inc() { count++; }
// b.mjs
import { count, inc } from "./a.mjs";
inc();
console.log(count);   // 2（实时引用）
```

### 2. 循环依赖

循环依赖（A 引 B，B 引 A）在 ESM 中**可以工作**，但依赖"声明提升 + 实时绑定"——前提是循环引用处的值在使用时才读取：

```javascript
// a.js
import { b } from "./b.js";
export const a = "a";
console.log(b);       // 可能 undefined（b 还没初始化完）—— 时机敏感

// b.js
import { a } from "./a.js";
export const b = "b";
```

::: danger 循环依赖是坏味道
ESM 只是"容忍"循环依赖，不代表应该写。**设计上应避免模块互相引用**（抽公共模块）。工具库循环依赖会直接报 `Cannot access before initialization`。
:::

### 3. 为什么 import 是"引用"而 require 是"拷贝"

- ESM 在模块被加载时建立**实时绑定（live binding）**，导出值后续变化，导入方读到的始终是最新值
- 这保证了一致性，但要求**不要修改导入的模块导出对象**（改会互相影响）

### 4. tree-shaking 的条件

```javascript
// 能被摇掉的前提：纯 ES 模块 + 静态 import
// utils.js
export const used = () => 1;
export const unused = () => 2;   // 没人 import 它 → 构建时被删除

// 注意事项
// - 副作用代码（console.log 在模块顶层）不会被摇掉
// - 动态 import() 的内容无法被静态分析，不影响 tree-shaking 反而更优
```

### 5. 浏览器模块加载流程

```
解析 index.html
  → 发现 <script type="module">
  → 递归下载依赖图（并行）
  → 全部就绪后按依赖顺序执行（defer 语义）
```

关键点：**依赖先于使用方执行**，且一个模块只执行一次（有缓存）。

## 关联速查

::: tip 速查卡片
export/import 语法速查、ESM vs CJS 对比，见 [ES 模块速查](/cheatsheet/data/module)。
:::

::: info 延伸阅读
模块规范细节，见 [MDN - JavaScript 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)。
:::
