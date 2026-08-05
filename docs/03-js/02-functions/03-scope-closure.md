---
title: 02.3 作用域与闭包
---

# 作用域与闭包：函数记住了出生时的环境

## 它是什么

**作用域（Scope）** 是变量"可见的范围"——在哪个区域能访问到某个变量。**闭包（Closure）** 则是"函数 + 它定义时的词法环境"的组合。

用生活化比喻：作用域像一栋楼的楼层。一楼（全局）的东西每层都能看到；但顶层（最内层函数）的东西，只有顶层自己能用；而且**楼里任何一个房间，都能顺着楼梯往下看到楼下的东西**——这就是"内层能访问外层"。

```javascript
let globalVar = "一楼大厅";       // 全局：谁都看得到

function outer() {
  let outerVar = "二楼";          // 只有 outer 内部及更内层可见
  function inner() {
    let innerVar = "三楼";        // 只有 inner 内部可见
    console.log(globalVar, outerVar, innerVar);  // 全部可见
  }
  // console.log(innerVar);       // ❌ 二楼看不到三楼
}
```

## 核心机制一：词法环境与作用域链

JS 引擎在**定义**函数时，会记录下它所在的环境，称为**词法环境（Lexical Environment）**：它包含"自己的变量记录" + "对外部环境的引用"。这个"引用链条"就是**作用域链（Scope Chain）**。

变量查找规则很简单：**先在自己这一层找，找不到就顺着作用域链往外找，直到全局**，再找不到报 `ReferenceError`：

```javascript
const global = "G";

function outer() {
  const a = "A";
  function inner() {
    const b = "B";
    console.log(global, a, b);   // G A B：逐层向外查找
  }
  inner();
}
outer();

// 查找过程：inner 自己有 b → 没有 a？向外到 outer → 没有 global？向外到全局
```

注意是**定义时的环境**决定作用域链，而不是调用位置。函数写在哪个作用域里，它就能访问哪些外层变量——这叫做**词法作用域（Lexical Scope）**。

## 核心机制二：闭包的本质

**闭包 = 内层函数 + 它捕获的外层词法环境**。即使外层函数已经执行完毕，内层函数仍然"握着"那层环境的引用，所以外层变量"死而不僵"：

```javascript
function makeCounter() {
  let count = 0;                 // count 被返回的函数捕获
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
counter();   // 1
counter();   // 2
// makeCounter 早已执行完，但 count 仍存活 —— 因为返回的函数持有它的引用
```

::: tip 一句话理解闭包
**闭包是"函数记住了自己出生时的环境"**。只要函数还活着，它出生环境里的变量就跟着活着。
:::

闭包在 React Hooks、事件处理、防抖节流、模块封装中无处不在——它是现代 JS 的地基。

## 闭包的经典应用

### ① 计数器 / 私有变量

`count` 对外完全不可直接修改，只能通过暴露的方法操作——这就是**模拟私有变量**：

```javascript
function createBankAccount(initial) {
  let balance = initial;         // 私有：外部拿不到
  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) { balance -= amount; return balance; },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(100);
account.deposit(50);     // 150
// account.balance;      // ❌ undefined：外部访问不到内部变量
account.getBalance();    // 150
```

### ② 防抖（debounce）——闭包保存 timer

防抖：事件触发后**延迟执行**，延迟期间再次触发就**重置计时**。timer 必须被"记住"，这正是闭包的用武之地：

```javascript
function debounce(fn, delay = 300) {
  let timer = null;                       // timer 被返回的函数闭包捕获
  return function (...args) {
    clearTimeout(timer);                  // 重置：取消上一次的定时器
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const onSearch = debounce((kw) => fetchData(kw), 300);
// 输入框每敲一个字就调用 onSearch —— 只有停下来 300ms 才会真正请求
```

### ③ 循环中创建函数：var vs let 陷阱

```javascript
// ❌ 错误：var 没有块级作用域，三次迭代共享同一个 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 3 3 3（循环结束时 i 已经是 3）
}

// ✅ 正确：let 每次迭代创建独立块级作用域，各自捕获自己的 i
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j));   // 0 1 2
}
```

::: warning 记住结论
循环里要创建"各自独立"的闭包，**用 `let` 声明循环变量**，让每次迭代都拥有独立作用域。
:::

## 变量提升（Hoisting）与 TDZ

**提升**：声明会被"搬运"到所在作用域的顶部。但三种声明方式表现不同：

- **`var`**：提升并初始化为 `undefined`——能访问，但不报错（危险）
- **`function` 声明**：提升且整个函数体就绪——能正常调用
- **`let` / `const`**：提升但处于**暂时性死区（TDZ）**——访问直接报错

```javascript
console.log(v);   // undefined（var 提升 + 初始化为 undefined）
var v = 1;

console.log(l);   // ❌ ReferenceError: Cannot access 'l' before initialization
let l = 2;        // let 在 TDZ 中：声明语句执行前不可访问
```

::: tip TDZ 的价值
TDZ 让"先使用后声明"的错误**尽早暴露**，而不是悄悄得到 `undefined` 继续往下跑——越早报错，越容易修。
:::

## 闭包与内存

闭包会**长期持有**外层环境的引用，滥用会导致本该回收的变量无法被垃圾回收（内存泄漏）。用完的闭包引用记得置空：

```javascript
let counter = makeCounter();
counter();            // 使用中……
counter = null;       // 置空后，闭包及其捕获的环境才能被 GC 回收
```

## 常见坑点

- 闭包捕获的是**变量本身**，不是当时的"值"——循环陷阱正源于此
- `var` 函数级作用域 + 闭包 = 共享同一个变量；`let` 块级作用域 + 闭包 = 各自独立
- 忘记 `let`/`const` 而直接赋值（`x = 1`）会创建全局变量，破坏作用域隔离
- 大量不必要的闭包（如事件监听里反复创建）可能造成内存泄漏，记得解绑

## 小结

- 作用域链：内层函数能访问外层变量，查找逐层向外
- 闭包 = 函数 + 出生时的词法环境；外层函数执行完，捕获的变量仍存活
- 经典应用：计数器、私有变量、防抖、循环中的独立作用域
- `let`/`const` 有 TDZ，`var` 只有 undefined 初始化——用 `let`/`const`
- 闭包持有引用，用完置空防内存泄漏

::: tip 速查卡片
闭包模板与作用域速查，见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::
