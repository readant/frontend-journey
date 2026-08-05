---
title: 02. 函数与闭包
---

# 函数与闭包

欢迎来到 JavaScript 的第二章！上一章我们学会了用变量和类型"存数据"；从这一章开始，我们要学会**把动作打包成函数**，并攻克 JS 里最容易被问倒的两个概念：`this` 和闭包。

函数是 JavaScript 的**一等公民（First-Class Citizen）**：它可以像普通值一样被赋值、传递、返回。而**闭包（Closure）**是"函数 + 它定义时的词法环境"的组合——它是作用域、模块化、React Hooks 等一切高级特性的地基。

```javascript
// 函数是值：能存、能传、能返回
const greet = (name) => `你好，${name}`;

// 闭包：函数记住了出生时的环境
function makeCounter() {
  let count = 0;
  return () => ++count;   // count 不会因为函数结束而消失
}
```

## 本章路线

本章拆成 4 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [函数定义](/03-js/02-functions/01-define-functions) | 一等公民概念、函数声明/函数表达式/箭头函数/IIFE 四种写法、提升差异 |
| 2 | [箭头函数](/03-js/02-functions/02-arrow-functions) | 简洁语法、与普通函数的 this/arguments/new 差异、rest 与默认参数 |
| 3 | [作用域与闭包](/03-js/02-functions/03-scope-closure) | 作用域链、闭包本质、计数器/私有变量/防抖等经典应用、TDZ 与内存 |
| 4 | [this 绑定](/03-js/02-functions/04-this-binding) | 四种绑定规则、丢失 this、call/apply/bind、箭头函数无自己的 this |

## 学完你将能

- 用四种方式定义函数，并说清函数声明与函数表达式的提升差异
- 判断什么时候该用箭头函数、什么时候必须用普通函数
- 用闭包写出计数器、私有变量、防抖等经典模式
- 准确说出任意场景下 `this` 指向谁，并用 `call` / `apply` / `bind` 纠正
- 避开 `var` 循环陷阱、TDZ、this 丢失、内存泄漏等经典坑点

## 学习建议

- 每页代码都**亲手在浏览器控制台跑一遍**（F12 → Console），理解 > 记忆
- 第 1、2 页是语法基础；第 3、4 页是面试重点，务必反复咀嚼
- `this` 和闭包第一次看不懂很正常：先跑例子、看结果，再回头读原理，两遍就通了

## 关联速查

::: tip 速查卡片
函数定义方式、闭包模板与 this 绑定速查，见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::

::: info 延伸阅读
作用域与闭包的规范细节，见 [MDN - 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)。
:::
