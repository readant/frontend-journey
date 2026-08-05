---
title: 02.1 函数定义
---

# 函数定义：一等公民与四种写法

## 它是什么

函数就是**把一段可以重复使用的代码打包成一个"盒子"**，给它起个名字，需要时调用它。你可以把它想象成厨房里的食谱：写一次，以后每次做菜照着执行即可。

```javascript
function greet(name) {
  return `你好，${name}`;
}
greet("小明");   // "你好，小明" —— 调用一次执行一次
```

但 JavaScript 里的函数比别的语言更特殊——它是**一等公民（First-Class Citizen）**：函数和数字、字符串一样，是一种"值"，可以像数据一样被赋值、传递、返回。

```javascript
// 1. 函数可以赋值给变量
const fn = function () { console.log("我是值"); };
const another = fn;          // 像复制数字一样复制函数

// 2. 函数可以作为参数（回调函数）
[1, 2, 3].map(x => x * 2);   // x => x * 2 就是作为参数传进去的

// 3. 函数可以作为返回值（闭包的入口）
function makeCounter() {
  return function () { /* ... */ };
}
```

::: tip 一句话理解
**函数是值** —— 能存、能传、能返回。这是回调、闭包、高阶函数的地基。
:::

## 为什么"一等公民"这么重要

在很多语言里，函数只能"被调用"，不能像数据一样被传来传去。而 JS 把函数当作普通值，带来两大好处：

**① 可以"注入行为"**——把要执行的动作作为参数传给另一个函数，这就是回调（callback）：

```javascript
function repeat(times, action) {
  for (let i = 0; i < times; i++) action(i);
}
repeat(3, (i) => console.log(`第 ${i} 次`));  // 行为由调用者决定
```

**② 可以"生成函数"**——函数返回函数，外层函数可以"记住"一些状态，这就是闭包的雏形（详见 [02.3 作用域与闭包](/03-js/02-functions/03-scope-closure)）。

## 四种定义方式

### 1. 函数声明（Function Declaration）

以 `function` 关键字开头，直接定义具名函数：

```javascript
function add(a, b) {
  return a + b;
}
add(1, 2);   // 3
```

特点是**有提升（hoisting）**：整个函数体在代码执行前就被准备好了，所以可以在定义之前调用（详见下文）。

### 2. 函数表达式（Function Expression）

把函数当作值赋给变量，函数本身可以匿名：

```javascript
const sub = function (a, b) {
  return a - b;
};
sub(5, 2);   // 3
```

**没有提升**：必须等赋值语句执行完才能用。注意这里**语句末尾有分号**——因为它是"赋值语句"。

### 3. 箭头函数（Arrow Function）

用 `=>` 写，语法最简洁：

```javascript
const mul = (a, b) => a * b;
mul(3, 4);   // 12

// 多语句体需要大括号 + 显式 return
const div = (a, b) => {
  if (b === 0) throw new Error("不能除以 0");
  return a / b;
};
```

单表达式时可省略 `return` 和大括号。它没有自己的 `this` 和 `arguments`，详见 [02.2 箭头函数](/03-js/02-functions/02-arrow-functions)。

### 4. 立即执行函数表达式（IIFE）

定义完立刻执行一次，格式为 `(函数体)(参数)`：

```javascript
(function () {
  const privateVar = "只在内部可见";
  console.log(privateVar);
})();          // 定义 + 立即调用

// 也可以传参
(function (version) {
  console.log(`当前版本：${version}`);
})("v1.0");
```

::: tip IIFE 的作用
IIFE 创建了一个**独立作用域**：里面的变量不会泄漏到全局，外界也访问不到。这正是"一个文件只想暴露少量全局变量"时代的模块化雏形（现在用 ES Module 替代了它）。
:::

## 核心机制：函数声明 vs 函数表达式

两者的本质区别是**提升行为**不同。函数声明会整体提升（连函数体一起），函数表达式只提升变量名（赋值之前值是 `undefined`）：

```javascript
// ✅ 函数声明：可以先调用后定义
hello();                    // "hi"
function hello() { return "hi"; }

// ❌ 函数表达式：调用时变量还没赋值
greet();                    // TypeError: greet is not a function
const greet = function () { return "hi"; };
```

为什么会报 `TypeError` 而不是别的错误？因为 `const greet` 在声明语句执行前处于**暂时性死区（TDZ）**，访问它本身就报 `ReferenceError`；如果是 `var greet = ...` 写法，变量会被提升为 `undefined`，调用 `undefined()` 自然报"不是函数"：

```javascript
// var 版：不报 ReferenceError，但报 TypeError
var f;
f();                        // TypeError: f is not a function
f = function () { return "hi"; };
```

::: warning 建议
依赖"提前调用"会降低代码可读性。**推荐做法是永远先定义、再使用**——不依赖提升，逻辑顺序一目了然。
:::

## 常见坑点

- 函数表达式忘记加 `const`/`let` 会创建**全局变量**，严格模式下直接报错
- 具名函数表达式（`const f = function g() {}`）：内部可用 `g` 自引用，外部访问不到——极少用，知道即可
- IIFE 前面**忘了分号**可能被上一行"吃掉"：`const a = 1\n(function(){})()` 会被解析成 `1(function(){})()` 而报错
- 一个文件里混用函数声明和箭头函数两种风格，维护成本高——和团队统一即可

## 小结

- 函数是一等公民：是值，可赋值、可传递、可返回
- 四种定义方式：函数声明、函数表达式、箭头函数、IIFE
- 函数声明有提升（可提前调用）；函数表达式没有（提前调用报 TypeError）
- IIFE 用于创建独立作用域，避免污染全局

::: tip 速查卡片
函数定义的完整速查（四种写法 + 提升规则），见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::
