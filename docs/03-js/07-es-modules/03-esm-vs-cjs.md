---
title: 07.3 ESM vs CommonJS
---

# ESM vs CommonJS：两代模块化之争

## 它是什么

JavaScript 有**两套模块体系**：

- **CommonJS（CJS）**：诞生于 2009 年 Node.js 服务端时代，用 `require` / `module.exports`，至今 Node 老项目、npm 老包大量使用
- **ES Module（ESM）**：2015 年 ECMAScript 官方标准，用 `import` / `export`，现代前端（Vite/Webpack）和浏览器原生支持

前端面试几乎必问："**ESM 和 CommonJS 有什么区别？**"——这一页就是把对比讲透，并附上能直接背的要点。

```javascript
// CommonJS（Node 里）
const fs = require("fs");
module.exports = { read: fs.readFileSync };

// ES Module（浏览器 / 现代 Node）
import fs from "node:fs";
export { fs };
```

## 核心对比表

| 对比项 | ES Module | CommonJS |
| --- | --- | --- |
| 语法 | `import` / `export` | `require` / `module.exports` |
| 分析时机 | **编译期静态**分析 | **运行时**执行 |
| 输出方式 | 值的**实时引用**（live binding） | 值的**拷贝** |
| 是否支持 tree-shaking | ✅ 支持 | ❌ 不支持 |
| 浏览器支持 | ✅ 原生支持 | ❌ 不支持（需打包器转换） |
| 加载方式 | **异步**（defer，可并行） | **同步**（读盘即阻塞） |
| 顶层 `this` | `undefined` | `module.exports`（模块对象） |
| 严格模式 | 强制 | 默认不强制 |

::: tip 一句话记差异
**ESM 是"编译期静态、异步、实时引用"；CommonJS 是"运行时动态、同步、值拷贝"。** 背下这句，再展开细节。
:::

## require vs import 差异详解

**① 时机：静态 vs 动态**

```javascript
// CJS：require 是普通函数调用，可以在任何地方执行
const x = flag ? require("./a.js") : require("./b.js");   // ✅ 运行时决定
if (x) { const m = require("./m.js"); }                    // ✅ 合法

// ESM：import 必须顶层静态声明
// if (flag) { import "./a.js" }                           // ❌ 语法错误
```

**② 加载：异步 vs 同步**

```javascript
// CJS 同步：require 时文件必须已加载完，读大文件会阻塞
// ESM 异步：依赖图并行下载、按序执行，不阻塞解析
```

**③ 作用域与隔离**

```javascript
// CJS 模块里：
// this === module.exports（模块导出对象本身）
// ESM 模块里：
// this === undefined
```

## ESM 实时引用 vs CJS 值拷贝（重点！）

这是最能体现两者本质差异的实验：模块导出后**内部又修改了值**，导入方看到的是新的还是旧的？

```javascript
// ── CommonJS：值是"快照拷贝" ──────────────
// counter.js
let count = 1;
module.exports = { count, inc() { count++; } };

// main.js
const { count, inc } = require("./counter.js");
console.log(count);   // 1
inc();                // 内部 count 变成 2
console.log(count);   // 1（❌ 还是 1：解构拿到的是拷贝，不会更新）

// ── ES Module：值是"实时引用" ──────────────
// counter.mjs
export let count = 1;
export function inc() { count++; }

// main.mjs
import { count, inc } from "./counter.mjs";
console.log(count);   // 1
inc();                // 内部 count 变成 2
console.log(count);   // 2（✅ 实时绑定，读到的始终是最新值）
```

::: tip 为什么会有这个差异
CJS 的 `module.exports = { count, inc }` 在导出瞬间把 `count` 的**当前值**复制进对象；之后模块里的 `count++` 改的是模块内部变量，和已导出的对象无关。而 ESM 的 `export` 建立的是**指向模块内部变量的引用**，导入方每次读取都"现取"，所以永远是最新值。
:::

延伸结论：ESM 里**不要给导入的值重新赋值**（`import { count }` 后 `count = 5` 会报错——它是只读绑定）；CJS 里改导入对象的属性则是"各改各的拷贝"，互不干扰。

## 面试高频点

面试官常从这几个角度追问，先自己答一遍：

- **tree-shaking 为什么 CJS 不支持？** `require` 是运行时函数调用，传参可以是变量（`require(path)`），构建器无法静态判断加载了什么，自然无从裁剪；ESM 的 `import` 是顶层静态声明，依赖图可精确分析
- **循环依赖谁处理得更好？** 两者都"勉强支持"，但机制不同：ESM 靠声明提升 + 实时绑定（读的时候才取值）；CJS 靠"部分导出对象"（`exports` 默认是对象，可随时补属性），但循环里**用 `module.exports = fn` 整体替换**极易拿到半成品导致报错
- **浏览器为什么不能直接用 CJS？** 浏览器没有文件系统，`require` 是同步读盘；ESM 的异步加载天生适配网络环境，所以浏览器只原生支持 ESM
- **Node.js 现在该用哪个？** 新项目用 ESM（`.mjs` 或 `"type": "module"`）；维护 CJS 老项目时至少要知道两者差异

## 常见坑点

- **同一文件混用两种语法**：`import` 和 `require` 混写通常直接报错（在纯 ESM 文件里 `require` 未定义，在 CJS 文件里 `import` 语法错误）
- **CJS 解构是拷贝**：`const { count } = require(...)` 后模块内部再变，你手里的还是旧值——需要最新值就别解构，直接 `require` 整个对象再点属性
- **ESM 导入是只读的**：给 `import` 进来的值重新赋值会抛 `TypeError`
- **`__dirname` 在 ESM 里不存在**：CJS 有 `__dirname` / `__filename`，ESM 要用 `import.meta.url` + `fileURLToPath` 换算
- **浏览器标签写 CJS**：`<script>` 里直接 `require` 会报 `require is not defined`——浏览器只认 ESM 或全局变量

## 小结

- ESM：编译期静态、异步加载、实时引用、支持 tree-shaking、浏览器原生支持——现代标准
- CJS：运行时动态、同步加载、值拷贝、不支持 tree-shaking、仅 Node——历史生态
- 面试一句话：**"ESM 静态异步引用，CJS 动态同步拷贝"**
- 新项目用 ESM，别混用两种语法，注意 `__dirname` / 顶层 `this` 的差异

::: tip 速查卡片
ESM vs CJS 完整对比表，见 [ES 模块速查](/cheatsheet/data/module)。
:::
