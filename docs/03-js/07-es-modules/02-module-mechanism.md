---
title: 07.2 模块机制
---

# 模块机制：静态分析、加载流程与循环依赖

## 它是什么

模块机制讲的是"ESM 这套体系**底层是怎么运作的**"：为什么 `import` 不能写在 `if` 里？为什么构建工具能自动删掉没用的代码？浏览器加载多个模块文件时按什么顺序执行？

一个比喻：静态 `import` 不是"运行时喊一嗓子去拿东西"，而是**开工前就填好的物料清单**——谁依赖谁，在工程启动（解析）阶段就全部登记完毕。这决定了 ESM 的一系列"编译期特性"。

```javascript
// 这是"声明"，不是"命令"
import { add } from "./math.js";
```

## 静态分析：import/export 必须写在顶层

ESM 的 `import` / `export` 是**顶层静态语法**：解析器在**编译阶段**（执行前）就能确定每个模块依赖了谁。因此它们**不能**出现在 `if`、函数、循环里：

```javascript
// ❌ 语法错误：import 不能在条件里
// if (need) { import "./a.js"; }

// ❌ 语法错误：export 不能在块里
// if (x) { export const b = 2; }

// ✅ 正确：永远顶层
import "./a.js";
export const a = 1;
```

::: tip 想"条件加载"怎么办
需要运行时按条件加载用 **`import()` 动态导入**（见 07.1）——它是函数调用，不受顶层限制，代价是不参与静态分析。
:::

静态分析带来两个关键能力：

- **静态依赖图**：打包器（Vite/Webpack）能完整画出"谁依赖谁"，这是 tree-shaking 的前提
- **加载顺序确定性**：所有依赖在执行前就已知，浏览器可以放心地并行下载

## tree-shaking：怎么把没用的代码"摇掉"

tree-shaking（摇树优化）指构建时**删除"导出了但没人 import"的代码**，减小产物体积。原理正是依赖静态分析——构建器能精确统计每个导出被谁引用了。

```javascript
// utils.js
export const used = () => 1;
export const unused = () => 2;   // 全项目没人 import 它 → 构建时被删掉

// main.js
import { used } from "./utils.js";
```

::: warning tree-shaking 的生效条件
- 必须是**纯 ESM**（静态 `import`/`export`），CommonJS 的 `require` 是运行时动态的，无法分析，摇不掉
- 模块顶层**不要写有副作用的代码**（如顶层 `console.log`、修全局变量）——构建器保守起见不会删"可能产生副作用"的模块
- 使用**命名导入**（`import { used }`），`import * as` 整体导入会让构建器难以精确裁剪
- 配合 `"sideEffects": false` 或 `sideEffects` 白名单（在 `package.json` 里声明"本包无副作用"）
:::

## 模块自动严格模式

每个模块**默认就是严格模式**（相当于自动加了 `"use strict"`），无需手动声明。后果包括：

```javascript
// 模块内：
x = 1;                    // ❌ ReferenceError：未声明变量赋值直接报错
console.log(this);        // undefined（而不是 window！）
// 不能有重复参数名、不能 delete 变量……（严格模式的全部规则）
```

::: tip 为什么模块强制严格模式
严格模式把"静默出错"变成"直接抛错"，能提前暴露 bug；也让 ESM 的实现更可控（比如顶层 `this` 必须保持为 `undefined`，避免在模块顶层意外访问全局对象）。
:::

## defer 语义：模块默认延迟执行

模块脚本**天生延迟执行**（等价于加上了 `defer` 属性），不需要手动写：

```html
<script type="module" src="main.js"></script>
```

行为对比：

| 普通 `<script>` | `<script type="module">` |
| --- | --- |
| 遇到即下载并**阻塞解析** | 不阻塞解析，**HTML 解析完才执行** |
| 不保证依赖顺序 | 按依赖顺序执行 |
| 默认非严格模式 | 强制严格模式 |
| 没有作用域隔离 | 每个模块独立作用域 |

```html
<!-- 即使写在 body 里，模块也会等 HTML 解析完再执行 -->
<script type="module">console.log("我是模块");</script>
```

## 浏览器加载流程

浏览器加载 ESM 不是"一个文件一个文件"地执行，而是先**构建整个依赖图**：

```
解析 HTML
  └─ 发现 <script type="module" src="main.js">
       └─ 解析 main.js，发现 import "./a.js"、"./b.js"
            └─ 递归解析 a.js、b.js，发现它们各自的 import……
                 └─ 整个依赖图下载完毕（并行下载）
                      └─ 按依赖顺序执行（依赖先于使用方）
                           └─ 一个模块只执行一次（有模块缓存）
```

关键结论：

- **下载是并行的**，执行必须**按依赖顺序**：`a.js` 先于 `main.js` 执行
- **模块有缓存**：同一个模块被多处 import，**只执行一次**（例如两个文件都 `import "./utils.js"`，`utils.js` 只跑一遍）
- 因为执行顺序确定，ESM 天生支持**循环依赖**（见下节）

## 循环依赖与实时绑定

循环依赖指 A 引 B、B 又引 A。ESM 中**可以工作**，靠的是两件东西：声明提升 + 实时绑定。但值在"对方面前"可能还没初始化：

```javascript
// a.js
import { b } from "./b.js";
export const a = "a";
console.log(b);   // 可能是 undefined —— 此时 b.js 还没执行到声明

// b.js
import { a } from "./a.js";
export const b = "b";
```

::: danger 循环依赖是坏味道
ESM 只是**容忍**循环依赖，绝不代表应该写。设计上应尽量避免模块互相引用（抽公共模块、调整依赖方向）。若循环里一方在初始化时就读取对方的值，会直接报 `Cannot access before initialization`，且排查困难。
:::

至于"实时绑定（live binding）"：ESM 导出的是**指向模块内部变量的绑定**，模块里变量变了，导入方读到的永远是**最新值**（这在下一页 07.3 与 CommonJS 对比时体现得最明显）。

## 常见坑点

- **`import` 误写进条件/函数里**：直接语法错误，需要按需加载请用 `import()`
- **模块顶层写副作用代码**：会**阻止 tree-shaking**（构建器不敢删），还能让模块执行顺序的 bug 难排查
- **`this` 不是全局对象**：模块顶层 `this` 是 `undefined`，别依赖它拿全局，用 `globalThis`
- **循环依赖里初始化时取值**：可能在对方执行前读到 `undefined`，甚至直接抛错
- **两个入口引同一个模块**：不会执行两遍（有缓存），别在模块顶层放"只执行一次"的假设之外的逻辑

## 小结

- ESM 是**编译期静态**体系：`import`/`export` 必须顶层，构建器据此画依赖图、做 tree-shaking
- tree-shaking 条件：纯 ESM + 静态 import + 无顶层副作用 + 尽量命名导入
- 模块默认严格模式、默认 defer 延迟执行
- 加载流程：递归下载依赖图 → 按依赖顺序执行 → 一个模块只执行一次
- 循环依赖可被容忍但应避免，实时绑定保证读到最新值

::: tip 速查卡片
ESM 机制与加载流程速查，见 [ES 模块速查](/cheatsheet/data/module)。
:::
