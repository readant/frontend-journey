---
title: JS 闭包完整手册
---

# JS 闭包

## 核心概念

闭包 = 函数 + 它「出生时」所在作用域的引用 —— 让内部函数记住外层变量。

## 完整内容

### 是什么 / 为什么

每次函数被创建，它都会**记住**创建它时的词法作用域。即使外层函数已经执行完毕，内部函数仍能访问外层变量 —— 这个「内部函数 + 记住的外层变量」整体就是闭包。

### 一、作用域回顾（闭包的地基）

```javascript
// 全局作用域：任何地方能访问
const global = 1;

function outer() {
  // 函数作用域：outer 内部能访问 global
  const local = 2;

  function inner() {
    // inner 内部能访问 local 和 global
    console.log(local);   // 2 —— 这就是闭包的来源
  }
}
```

**变量查找规则**：先找自己的作用域，找不到往上一层，直到全局。这个「向外的引用链」被内部函数抓住不放，就是闭包。

### 二、闭包的本质与特征

```javascript
function createCounter() {
  let count = 0;              // 私有变量：外部无法直接访问
  return function () {
    count++;                  // 内部函数抓住 count 不放
    return count;
  };
}

const counter = createCounter();
counter();  // 1
counter();  // 2
counter();  // 3
// count 没有被销毁：被返回的函数引用了
```

**三个特征**：

1. 内层函数访问外层函数的变量
2. 外层函数已返回，变量**依然存活**
3. 每次调用外层函数，闭包是**独立的**（count 互不干扰）

### 三、经典应用

**1. 封装私有变量（模块模式）**：

```javascript
const bank = (function () {
  let balance = 0;                    // 外部读不到
  return {
    deposit(n) { balance += n; },
    withdraw(n) { if (balance >= n) balance -= n; },
    getBalance() { return balance; },
  };
})();
bank.getBalance();   // 0
bank.deposit(100);
bank.getBalance();   // 100
```

**2. 函数工厂（柯里化）**：

```javascript
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}
const add5 = makeAdder(5);
add5(10);   // 15
```

**3. 防抖 / 节流（每次调用独立保存定时器）**：

```javascript
function debounce(fn, delay = 300) {
  let timer;                       // 闭包变量：记住上次的定时器
  return function (...args) {
    clearTimeout(timer);           // 取消上一次
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

### 四、闭包陷阱（循环与 let）

```javascript
// 陷阱：var 是函数作用域，所有回调共享同一个 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 3 3 3
}

// 修复 1：let 每次迭代创建独立作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 0 1 2 ✓
}

// 修复 2：IIFE 立即捕获当前值（旧写法）
for (var i = 0; i < 3; i++) {
  ((n) => setTimeout(() => console.log(n)))(i);  // 0 1 2 ✓
}
```

### 语法速查

| 场景 | 写法 | 说明 |
| :--- | :--- | :--- |
| 私有变量 | `function f() { let v; return () => v }` | 外部不可直接改 v |
| 函数工厂 | `const addN = make(x => y => x + y)` | 逐步给参数 |
| 防抖 | `debounce(fn, delay)` | 连续触发只执行最后一次 |
| 节流 | `throttle(fn, delay)` | 固定频率执行 |
| 模块 | IIFE 返回对象 | 命名空间 + 私有 |

### 常见用法

**节流（throttle）**：

```javascript
function throttle(fn, delay = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}
```

**记忆化（缓存计算结果）**：

```javascript
function memoize(fn) {
  const cache = {};
  return function (key) {
    if (key in cache) return cache[key];
    return (cache[key] = fn(key));
  };
}
```

### 注意事项

- ⚠️ 闭包长期持有大对象会导致**内存泄漏**，用完记得置空引用。
- ⚠️ 循环里用 `var` + 闭包是经典陷阱，一律用 `let`。
- ⚠️ 每次调用外层函数生成**独立闭包**，别指望共享状态。
- ⚠️ 防抖/节流每次渲染/调用会新建闭包，注意在框架里用稳定的实例引用。

## 相关

- 🔍 场景索引：[异步场景](/3-reference/2-scenarios/async)（防抖节流）、[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[函数](/3-reference/1-handbook/js/functions)、[对象与原型](/3-reference/1-handbook/js/object)
