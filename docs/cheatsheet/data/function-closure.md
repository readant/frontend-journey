---
title: 函数与闭包速查
---

# 函数与闭包速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 定义可提升的函数 | 函数声明 `function fn() {}` |
| 定义回调/箭头语义 | 箭头函数 `() => {}`（无自己的 this） |
| 需要动态 this | 普通函数（对象方法、事件回调） |
| 收集剩余参数 | rest 参数 `(...args)`（不用 arguments） |
| 创建私有状态/防抖节流 | 闭包 |
| 立即隔离作用域 | IIFE |

## 核心代码

```javascript
// 四种定义方式
function add(a, b) { return a + b; }          // 声明（提升）
const sub = function (a, b) { return a - b; }; // 表达式
const mul = (a, b) => a * b;                  // 箭头
(function () { /* 私有作用域 */ })();          // IIFE

// 闭包：计数器
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c = makeCounter();
c(); c(); c();        // 1 2 3（count 被闭包捕获，持续存活）

// 闭包：防抖
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 参数
function greet(name = "访客") { return `你好，${name}`; }
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }

// this 绑定
obj.fn();              // this = obj（方法调用）
fn.call(ctx, a, b);    // 显式绑定
fn.apply(ctx, [a, b]);
fn.bind(ctx)(a, b);    // 永久锁定
```

## 踩坑记录

- **箭头函数没有自己的 this**：`this` 继承外层定义环境；事件回调里想取 `e.currentTarget` 用普通函数或 `event.target`
- **箭头函数没有 arguments**：用 rest 参数 `(...args)` 替代
- **箭头函数不能 new**：没有 `[[Construct]]`，`new (()=>{})` 抛 TypeError
- **`var` 循环陷阱**：`for (var i...) { setTimeout(()=>console.log(i)) }` 全输出 3；用 `let` 或 IIFE 捕获
- **闭包持有外层引用**：滥用导致变量无法回收（内存泄漏），用完置 `null`
- **函数声明提升 vs 表达式不提升**：表达式先调用会 `TypeError: not a function`
- **`this` 丢失**：`const fn = obj.method; fn()` 中 this 变成 undefined（严格模式）/全局
