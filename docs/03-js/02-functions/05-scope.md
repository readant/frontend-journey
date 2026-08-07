---
title: 02.5 作用域与词法环境
---

# 作用域与词法环境：变量"住在哪一层楼"

> 本页是学习**闭包（下一页）的必修前置课**。学完本页并**通过结尾小测验**，再进入闭包。

## 掌握目标

学完本页，你将能：

- 分清全局、函数、块级三种作用域
- 用**内存图**画出词法环境的结构与作用域链
- 说出变量查找规则："先找自己这层，再逐层向外"
- 理解变量生命周期（提升 / TDZ），知道 `let` / `const` 为什么比 `var` 安全

::: tip 前置要求
需要先掌握 [函数定义与调用](/03-js/02-functions/01-define-functions)。本页**不再讲函数语法**，只讲"变量住在哪、怎么找"。
:::

## 概念引入：作用域就像一栋楼的楼层

想象一栋**公寓楼**：

- **一楼大厅（全局作用域）**：谁都能进出，电梯门口贴着整栋楼的公告（全局变量，人人可见）
- **二楼房间（函数作用域）**：只有住二楼的人（函数内部）能开门进去
- **三楼房间（块级作用域）**：只有住三楼的人（`{}` 块内部）能进去
- **核心规则：楼上能往下看，楼下看不到楼上**——内层能访问外层变量，外层访问不到内层变量

```javascript
let lobby = "一楼大厅公告";      // 全局：谁都看得到

function secondFloor() {
  let room2 = "二楼的私人物品";  // 函数作用域：只有函数内可见
  if (true) {
    let room3 = "三楼的东西";    // 块级作用域：只有这个 {} 内可见
    console.log(lobby, room2, room3);   // ✅ 楼上看楼下：全部可见
  }
  // console.log(room3);         // ❌ 二楼下楼后看不到三楼
}
// console.log(room2);           // ❌ 大厅看不到二楼
```

::: tip 一句话理解
**作用域（Scope）= 变量"可见的范围"。内层能访问外层，外层访问不到内层——像楼上看楼下。**
:::

## 标准语法：三种作用域

| 作用域 | 由什么划分 | 例子 | 常见变量 |
| :--- | :--- | :--- | :--- |
| 全局作用域 | 整个程序 | 文件最外层 | `let` / `const` / `var` 写在最外层 |
| 函数作用域 | 每个函数体 `{}` | `function f() { ... }` 内部 | 函数内声明的变量 |
| 块级作用域 | 任意一对 `{}` | `if` / `for` / `while` 的大括号 | `let` / `const` 声明 |

```javascript
let globalVar = "全局";               // 全局作用域

function f() {
  var fnVar = "函数作用域";           // var：函数作用域（注意不是块级！）
  if (true) {
    let blockVar = "块级作用域";      // let/const：块级作用域
  }
  console.log(fnVar);                 // ✅ 函数内可见
  // console.log(blockVar);           // ❌ 块外不可见
}
```

::: warning var 的特殊性
`var` 没有块级作用域，只有函数作用域——所以 `for (var i...)` 里的 `i` 会"逃出"循环体。这是无数 bug 的来源（下一页闭包会用它讲经典陷阱）。
:::

## 深入理解一：词法环境（内存图 1）

JS 引擎在**定义函数 / 执行代码块**时，会在内存里建一个**词法环境（Lexical Environment）**，它由两部分组成：

```
词法环境（Lexical Environment）
├── 环境记录（Environment Record）   ← 这个作用域里的变量/函数都登记在这
│     ├── globalVar: "全局"
│     └── f: function f() {...}
└── 外部环境引用（outer）            ← 指向"上一层"的环境（形成链条）
      └── null（全局环境的外层是 null，链的终点）
```

用代码对应：

```javascript
const globalVar = "全局";

function outer() {
  const a = "A";
  function inner() {
    const b = "B";
    console.log(b);   // 自己的记录里有 b → 直接命中
  }
}
```

- 执行 `outer()` 时：为 outer 新建一个词法环境，登记 `a` 和 `inner`，`outer` 指向全局环境
- 执行 `inner()` 时：为 inner 再建一个，登记 `b`，`inner` 指向 outer 的环境

## 深入理解二：作用域链（内存图 2）

这些"环境 → 外部引用 → 再外部……"串成的链条，就是**作用域链（Scope Chain）**。变量查找规则：

> **先在自己这层找 → 找不到就顺着 `outer` 引用向外找 → 直到全局 → 还找不到就报 `ReferenceError`。**

```javascript
const g = "G";              // 全局环境：{ g }

function outer() {
  const a = "A";            // outer 环境：{ a } → 外部指向全局
  function inner() {
    const b = "B";          // inner 环境：{ b } → 外部指向 outer
    console.log(g, a, b);   // 查找：b 在自己这层 → a 到 outer → g 到全局
  }
  inner();
}
outer();
```

```
查找 console.log(g, a, b) 时，引擎的"爬楼"过程：

第 1 步：inner 环境        [ b: "B" ]           → b ✅ 命中；a? g? 不在
第 2 步：顺着 outer 引用   [ a: "A", inner ]    → a ✅ 命中；g? 不在
第 3 步：顺着 outer 引用   [ g: "G", outer ]    → g ✅ 命中
第 4 步：再向外 = null     程序停止（本例用不到）
```

::: tip 关键点：定义时的环境决定链条
作用域链是**定义（书写）位置**决定的，不是调用位置。函数写在哪个作用域里，它就能访问哪些外层变量——这叫**词法作用域（Lexical Scope）**。
:::

## 深入理解三：变量生命周期（内存图 3）

一个变量的一生：**声明 → 初始化 → 赋值 → 使用 → 失效**。不同声明方式，前两步的时序完全不同：

```
                    var x                 let y                function f
提升后（代码开始）   已声明=undefined      已声明但不可访问(TDZ)   已就绪可调用
声明语句执行后       正式赋值             正式赋值                ——
```

```javascript
console.log(v);      // undefined —— var 提升 + 初始化为 undefined（不报错，但危险）
var v = 1;

console.log(l);      // ❌ ReferenceError：let 处于暂时性死区（TDZ）
let l = 2;

f();                 // ✅ 函数声明整体就绪，可以提前调用
function f() {}
```

**暂时性死区（TDZ, Temporal Dead Zone）**：`let` / `const` 声明从"作用域开始"到"声明语句执行"之间，访问该变量会直接报错——这是 JS 主动拦下"先使用后声明"的错误，比 `var` 的静默 `undefined` 安全得多。

::: tip TDZ 的价值
**越早报错，越好修。** TDZ 让"用错顺序"在运行时立刻暴露，而不是带着 `undefined` 一路跑出更隐蔽的 bug。
:::

## 常见坑点

- `var` 没有块级作用域，循环变量会"逃逸"——用 `let` / `const`
- 忘记声明直接赋值（`x = 1`）会悄悄创建**全局变量**，污染全局——用 `let` / `const`
- 内层声明了与外层同名变量，会**遮蔽（shadow）**外层——想清楚你是要新建还是复用
- 函数名与变量名冲突时，函数声明优先（提升顺序），避免同名

## 小结

- 作用域 = 变量可见范围；三种：全局 / 函数 / 块级
- 词法环境 = 环境记录 + 外部引用（outer）
- 作用域链查找：自己这层 → 逐层向外 → 全局 → 报错
- 变量生命周期：`var` 提升为 undefined；`let` / `const` 有 TDZ；函数声明整体就绪
- **内层能访问外层，外层访问不到内层**

## 评估小测验（通过后再进入闭包页）

1. 下面的代码，`console.log(x)` 会输出什么？

```javascript
let x = 10;
function f() {
  let x = 20;
  if (true) {
    let x = 30;
    console.log(x);
  }
}
f();
```

2. 下面的代码会输出什么？

```javascript
console.log(a);
var a = 1;
```

3. 下面的代码会报错吗？报什么错？

```javascript
console.log(b);
let b = 1;
```

4. 作用域链是由"定义位置"还是"调用位置"决定的？

5. 猜一猜：为什么 `for (var i = 0; i < 3; i++)` 里用 `var` 声明循环变量容易出问题？

::: details 点击查看答案
1. `30`——最内层块级作用域里的 `x` 遮蔽了外层的两个 `x`。
2. `undefined`——`var` 提升并被初始化为 `undefined`（不报错）。
3. 报 `ReferenceError`——`let` 在 TDZ 中，声明语句执行前不可访问。
4. **定义位置**（词法作用域）——函数写在哪个作用域里，就能访问哪些外层变量。
5. `var` 没有块级作用域，循环 3 次共享同一个 `i`；`let` 每次迭代创建独立作用域。下一页闭包会详细演示这个陷阱。
:::

::: tip 速查卡片
作用域与词法环境的完整速查（三种作用域 / 作用域链 / TDZ），见 [JS 函数手册 · 作用域](/3-reference/1-handbook/js/functions)。
:::
