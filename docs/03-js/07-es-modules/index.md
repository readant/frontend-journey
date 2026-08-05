---
title: 07. ES 模块
---

# ES Module 与动态导入

欢迎进入模块化章节！写代码到一定规模，你会发现把所有逻辑塞进一个文件会"拧成一团"。**模块化**就是按职责把代码拆成多个文件，每个文件独立作用域，通过 `export` 导出、`import` 引入——这是现代前端（Vite/Webpack/React/Vue）的地基。

```javascript
// math.js
export function add(a, b) { return a + b; }

// main.js
import { add } from "./math.js";
console.log(add(1, 2));   // 3
```

模块化的三大价值：**隔离作用域**（不污染全局）、**显式依赖**（一眼看清用了什么）、**按需加载**（tree-shaking 的基础）。本章从"语法怎么用"讲到"底层怎么运作"，再和 CommonJS 对比，三层递进。

## 本章路线

本章拆成 3 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [export/import 语法](/03-js/07-es-modules/01-export-import) | 三种导出、三种导入、动态导入 `import()`、`import.meta.url` |
| 2 | [模块机制](/03-js/07-es-modules/02-module-mechanism) | 静态分析、tree-shaking 原理与条件、严格模式、defer 语义、浏览器加载流程、循环依赖 |
| 3 | [ESM vs CommonJS](/03-js/07-es-modules/03-esm-vs-cjs) | 两代模块体系对比、`require` vs `import`、实时引用 vs 值拷贝、面试高频点 |

## 学完你将能

- 熟练写出命名导出/默认导出/汇总导出，以及三种对应的导入方式
- 用动态导入 `import()` 实现路由懒加载和按需引入大库
- 解释清楚为什么 `import` 必须写在顶层、tree-shaking 为什么能删代码
- 说清浏览器加载模块文件的顺序，以及循环依赖为什么"能跑但别写"
- 在面试中完整回答"ESM 与 CommonJS 的区别"（语法/时机/输出/tree-shaking/加载）

## 学习建议

- 语法页（第 1 页）可以**边抄边在浏览器控制台跑**：用 `<script type="module">` 直接试
- 第 2 页的机制是"理解题"：先记结论（静态/顶层/只执行一次），再看示例
- 第 3 页是**面试必背**：对比表的六行逐行能解释、能写"引用 vs 拷贝"的示例
- 动手小实验：把上一章 todo 项目的工具函数拆成多个模块，体验模块化带来的清晰
- 学完记得翻到「关联速查」卡片，开发时随手查阅

## 关联速查

::: tip 速查卡片
export/import 语法速查、ESM vs CJS 对比，见 [ES 模块速查](/cheatsheet/data/module)。
:::

::: info 延伸阅读
模块规范的完整细节，见 [MDN - JavaScript 模块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)。
:::
