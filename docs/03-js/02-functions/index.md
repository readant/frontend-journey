---
title: 02. 函数与闭包
---

# 函数与闭包

## 它是什么

函数是 JavaScript 的**一等公民（First-Class Citizen）**：函数可以像普通值一样被赋值给变量、作为参数传递、作为返回值返回。

```javascript
// 函数也是值
const greet = function (name) {
  return `你好，${name}`;
};

// 函数作为参数（回调）
[1, 2, 3].map(x => x * 2);

// 函数作为返回值（闭包的入口）
function makeCounter() {
  return function () { /* ... */ };
}
```

而**闭包（Closure）**是"函数 + 它定义时的词法环境"的组合——它是 JS 中作用域、模块、React Hooks 等一切高级特性的地基。

## 核心机制

### 1. 词法环境（Lexical Environment）

每个函数定义时，都会**记住它所在的作用域环境**（环境记录 + 对外部环境的引用）。

```
全局环境
└── outer 变量（词法环境记录）
    └── makeCounter 函数（闭包记录 outer 的环境）
        └── inner 函数
```

当函数执行时，JS 引擎按 **作用域链（Scope Chain）** 查找变量：**先找自己内部，再逐层向外**，直到全局。

```javascript
const global = "G";

function outer() {
  const a = "A";
  function inner() {
    const b = "B";
    console.log(global, a, b); // 都能访问：沿作用域链向外查找
  }
  inner();
}
outer();
```

### 2. 闭包的本质

**闭包 = 内层函数 + 它捕获的外层词法环境**。即使外层函数已经执行完毕，内层函数仍然持有对那层环境的引用，所以外层变量"死而不僵"：

```javascript
function makeCounter() {
  let count = 0;                 // count 被闭包捕获
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
counter();  // 1
counter();  // 2
// makeCounter 早已执行完，但 count 仍存活 —— 因为返回的函数持有它的引用
```

::: tip 一句话理解闭包
**闭包是"函数记住了自己出生时的环境"**。只要函数还活着，它出生环境里的变量就跟着活着。
:::

## 标准语法

### 函数定义的四种方式

```javascript
// 1. 函数声明（有提升，可提前调用）
function add(a, b) { return a + b; }

// 2. 函数表达式（无提升）
const sub = function (a, b) { return a - b; };

// 3. 箭头函数（无自己的 this / arguments）
const mul = (a, b) => a * b;

// 4. 立即执行函数表达式 IIFE（创建独立作用域，避免污染全局）
(function () {
  const privateVar = "只在内部可见";
})();
```

### 函数声明 vs 表达式（提升差异）

```javascript
// 函数声明：提升，可以先调用后定义
hello();                 // "hi" ✅

function hello() { return "hi"; }

// 函数表达式：不提升，先调用会报错
// greet();              // ❌ TypeError: greet is not a function
const greet = function () { return "hi"; };
```

### 箭头函数与普通函数的区别

| 对比 | 普通函数 | 箭头函数 |
| --- | --- | --- |
| `this` | 调用时动态绑定 | **定义时**继承外层（词法绑定） |
| `arguments` | 有 | 无（用 rest 参数替代） |
| `new`（构造） | 可 | 不可 |
| 语法 | 完整 function | 简洁，单表达式可省略 return |

```javascript
// this 差异：箭头函数没有自己的 this
const obj = {
  name: "js",
  normal: function () {
    console.log(this.name);          // "js"（this = obj）
  },
  arrow: () => {
    console.log(this.name);          // undefined（this = 外层，这里是全局）
  },
};

// 事件监听里的经典场景：
button.addEventListener("click", function () {
  // this 是 button
});
button.addEventListener("click", () => {
  // this 是外层（箭头没有 this）
});
```

::: danger 箭头函数没有自己的 this
在需要 `this` 动态指向调用者的场景（对象方法、事件回调需用 this 取当前元素、构造函数）**不要用箭头函数**。箭头函数的 this 在定义时就已经"锁死"为外层。
:::

### 参数进阶

```javascript
// 默认参数
function greet(name = "访客") { return `你好，${name}`; }

// rest 参数（收集剩余参数，替代 arguments）
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);          // 6

// 解构参数
function show({ name, age = 0 }) {
  console.log(name, age);
}
```

## 深入理解

### 1. 变量提升（Hoisting）与 TDZ

- **var**：声明提升到函数顶部，初始化为 `undefined`（可提前访问但不报错）
- **let/const**：声明提升到块顶部，但处于**暂时性死区（TDZ）**，访问即报错

```javascript
console.log(v);   // undefined（var 提升 + 初始化）
var v = 1;

console.log(l);   // ❌ ReferenceError: Cannot access 'l' before initialization
let l = 2;        // let 在 TDZ 中
```

TDZ 的存在让"先使用后声明"的错误**尽早暴露**，这是 let/const 优于 var 的原因之一。

### 2. 闭包的经典应用

**① 计数器 / 私有变量**（模拟私有状态）：

```javascript
function createBankAccount(initial) {
  let balance = initial;
  return {
    deposit(amount) { balance += amount; return balance; },
    getBalance() { return balance; },   // balance 对外不可直接改
  };
}
```

**② 防抖（debounce）**——闭包保存 timer：

```javascript
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
const onSearch = debounce(() => fetchData(), 300);
```

**③ 循环中创建函数**（经典陷阱与解法）：

```javascript
// 错误：var 共享同一个 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 3 3 3
}

// 正确：let 每次迭代创建新块级作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 0 1 2
}
```

### 3. this 的四种绑定规则

| 场景 | this 指向 |
| --- | --- |
| 直接调用 `fn()` | 全局（严格模式 undefined） |
| 方法调用 `obj.fn()` | obj |
| `new Fn()` | 新创建的对象 |
| `fn.call(obj)` / `apply` / `bind` | 显式指定的 obj |

```javascript
const user = { name: "Alice", say() { console.log(this.name); } };
user.say();                      // Alice（方法调用）

const fn = user.say;
fn();                            // undefined（独立调用，丢失 this）

user.say.call({ name: "Bob" });  // Bob（显式绑定）
const bound = user.say.bind(user);
bound();                         // Alice（bind 永久锁定）
```

### 4. 闭包与内存

闭包会**长期持有**外层环境，滥用会导致变量无法被垃圾回收（内存泄漏）。用完的闭包引用记得置空（`counter = null`）。

## 关联速查

::: tip 速查卡片
函数定义方式、闭包模板与 this 绑定速查，见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::

::: info 延伸阅读
作用域与闭包的规范细节，见 [MDN - 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)。
:::
