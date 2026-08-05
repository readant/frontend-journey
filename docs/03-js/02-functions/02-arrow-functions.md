---
title: 02.2 箭头函数
---

# 箭头函数：简洁与词法 this

## 它是什么

箭头函数是 ES6 引入的**函数简写语法**，用 `=>`（箭头）把参数和函数体连接起来。它像一把"轻量瑞士军刀"：短小、方便，但**少了普通函数的几个能力**（自己的 `this`、`arguments`、不能 `new`）。

```javascript
// 普通函数
const add1 = function (a, b) { return a + b; };

// 箭头函数：同一个函数
const add2 = (a, b) => a + b;
```

::: tip 一句话理解
箭头函数 = 普通函数去掉 `function`、去掉 `{}`、去掉 `return`（单表达式时），换来的是**继承外层的 this**。
:::

## 简洁语法：三种写法

```javascript
// 1. 单参数可省略括号
const double = x => x * 2;

// 2. 多参数需要括号；单表达式自动 return
const sum = (a, b) => a + b;

// 3. 多语句函数体：需要大括号 + 显式 return
const max = (a, b) => {
  if (a > b) return a;
  return b;
};
```

注意区分：**括号 vs 大括号**。`=> ({...})` 表示返回一个对象字面量，`=> {...}` 表示函数体：

```javascript
const getObj = () => ({ name: "Alice" });   // 返回对象 ✅
// const bad = () => { name: "Alice" };     // ❌ 被当作函数体，什么都不返回
```

## 与普通函数的对比

| 对比项 | 普通函数 | 箭头函数 |
| --- | --- | --- |
| `this` | 调用时动态绑定 | **定义时继承外层**（词法绑定） |
| `arguments` | 有 | **无**（用 rest 参数替代） |
| 可否 `new` | 可（是构造函数） | **不可**（报错） |
| 有无 `prototype` | 有 | 无 |
| 语法 | 完整 `function` | 简洁，单表达式省略 return |

```javascript
// new 箭头函数会直接报错
const Fn = () => {};
// new Fn();        // ❌ TypeError: Fn is not a constructor

// 没有 prototype
console.log(Fn.prototype);   // undefined
```

## 核心机制：this 继承外层

普通函数的 `this` 是**调用时**才决定的（谁调用指向谁）；箭头函数**没有自己的 this**，它的 `this` 是定义那一刻**外层作用域的 this**，而且永远不变（词法绑定）。把它想象成"把外层的 this 复制了一份随身携带"：

```javascript
const obj = {
  name: "js",
  normal: function () {
    console.log(this.name);        // "js" —— this = obj（方法调用）
  },
  arrow: () => {
    console.log(this.name);        // undefined —— this = 外层，这里是全局/模块
  },
};

obj.normal();   // "js"
obj.arrow();    // undefined（哪怕通过 obj 调用，this 也不变）
```

### 事件监听场景对比（经典）

```javascript
// 普通函数：this 动态指向触发事件的元素
button.addEventListener("click", function () {
  console.log(this);       // button 元素 ✅（this 是调用者）
});

// 箭头函数：this 是外层，取不到当前元素
button.addEventListener("click", () => {
  console.log(this);       // 外层（如 window）❌
});
```

所以需要"用 `this` 取当前元素"时用普通函数；需要"用外层上下文"时用箭头函数。

## arguments 与 rest 参数

箭头函数**没有 `arguments` 对象**，访问会报错（`arguments is not defined`）。替代方案是 **rest 参数**，它比 `arguments` 更好用：

```javascript
// 普通函数：arguments 是类数组，要转数组才能用数组方法
function sum1() {
  return [...arguments].reduce((a, b) => a + b, 0);
}

// 箭头函数：用 rest 参数（真正的数组，还可以继续传参）
const sum2 = (...nums) => nums.reduce((a, b) => a + b, 0);

sum2(1, 2, 3);   // 6
```

::: tip rest 参数为什么更好
`arguments` 是类数组对象（没有 `map`/`filter`），且**不包含**显式声明的参数、也不能与 rest 混用；rest 参数是**真正的数组**，只收集"多余"的参数，语义更清晰。
:::

## 参数进阶：默认参数 + 解构

箭头函数和普通函数共用同一套参数语法，这里一起学会：

```javascript
// 默认参数：只在传 undefined 时生效
const greet = (name = "访客") => `你好，${name}`;
greet();               // "你好，访客"
greet("Alice");        // "你好，Alice"
greet(undefined);      // "你好，访客"（undefined 触发默认值）
greet(null);           // "你好，null"（null 不触发默认值！）

// rest 参数收集剩余参数
const describe = (first, ...rest) => ({ first, rest });
describe("a", "b", "c");   // { first: "a", rest: ["b", "c"] }

// 解构参数：直接把对象/数组拆开用
const showUser = ({ name, age = 0 }) => `${name} ${age}岁`;
showUser({ name: "Alice" });       // "Alice 0岁"
showUser({ name: "Bob", age: 18 }); // "Bob 18岁"

// 数组解构参数
const firstTwo = ([a, b]) => [a, b];
firstTwo([1, 2, 3]);   // [1, 2]
```

::: warning 解构默认值的坑
解构默认值只在**值为 undefined** 时生效：`const { x = 1 } = { x: null }` 的结果是 `null`，不是 `1`。默认值不是"空值兜底"。
:::

## 常见坑点

- **对象方法别用箭头函数**：`obj.fn = () => ...` 里的 `this` 不是 obj，而是外层（最常踩的坑）
- **构造函数不能用**：`new` 箭头函数直接抛 `TypeError`
- **没有 `arguments`**：需要剩余参数时用 rest 参数
- `=> ({...})` 与 `=> {...}` 的区别：前者返回对象，后者是函数体
- 在需要**动态 this** 的场景（DOM 事件回调、`arguments` 依赖）坚持用普通函数

## 小结

- 箭头函数语法简洁：单参数省括号、单表达式省 return
- **没有自己的 this**：定义时继承外层，且永不改变（词法绑定）
- 没有 `arguments`、不能 `new`、没有 `prototype`
- rest 参数 + 默认参数 + 解构参数，是箭头函数传参的完整工具箱

::: tip 速查卡片
箭头函数与普通函数对比、参数进阶速查，见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::
