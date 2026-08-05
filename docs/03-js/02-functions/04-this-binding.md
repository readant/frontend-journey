---
title: 02.4 this 绑定
---

# this 绑定：谁调用，指向谁

## 它是什么

`this` 是函数内部的一个特殊关键字，代表"当前执行上下文的主人"。它**不是函数定义时决定的**（箭头函数除外），而是**调用方式**决定的——所以叫"绑定"。

生活化比喻：`this` 就像一个话筒。谁拿起话筒说话，话筒就"属于"谁。同一个函数，被不同的人（对象）调用，里面的 `this` 就指向不同的人。

```javascript
const alice = { name: "Alice", say() { console.log(this.name); } };
const bob   = { name: "Bob",   say: alice.say };   // 同一个函数

alice.say();   // "Alice"（话筒在 alice 手里）
bob.say();     // "Bob"（话筒换到了 bob 手里 —— 函数没变，this 变了）
```

## 四种绑定规则

| 调用场景 | 写法 | `this` 指向 |
| --- | --- | --- |
| 直接调用 | `fn()` | 全局对象（严格模式 `undefined`） |
| 方法调用 | `obj.fn()` | **obj**（点号前面的对象） |
| 构造调用 | `new Fn()` | 新创建的对象 |
| 显式绑定 | `fn.call(obj)` / `apply` / `bind` | 你指定的 obj |

::: tip 判断口诀
看函数**是怎么被调用的**：前面有"点"就指向点前面的对象；有 `new` 就指向新对象；有 `call/apply/bind` 就指向指定的对象；什么都没有就指向全局（严格模式 undefined）。
:::

## 规则一：直接调用

```javascript
function show() {
  console.log(this);
}
show();              // window（浏览器全局）；严格模式下是 undefined
```

```javascript
"use strict";
function show() {
  console.log(this); // undefined（严格模式下，裸调用的 this 是 undefined）
}
show();
```

## 规则二：方法调用 vs 独立调用（丢失 this）

**方法调用**：`obj.fn()`，`this` 是 obj。但一旦把方法"拿出来单独调用"，`this` 就丢了：

```javascript
const user = {
  name: "Alice",
  say() { console.log(this.name); },
};

user.say();              // "Alice"（方法调用，this = user）

const fn = user.say;     // 把方法取出来存成变量
fn();                    // undefined（独立调用，this = 全局/undefined）
```

::: danger 为什么会丢失
`fn()` 是"裸调用"，前面没有点，`this` 回到全局/undefined，自然读不到 `user.name`。**把对象方法赋值给变量、作为回调传参（如 `setTimeout(user.say)`、事件监听）都会丢失 this**，这是最常见的 this 大坑。
:::

事件监听的经典场景——普通函数里 `this` 是触发元素，但取出后赋值给变量就丢了：

```javascript
button.addEventListener("click", function () {
  console.log(this);      // button（事件框架内部用"点"调用回调）
});
```

## 规则三：new 构造调用

`new Fn()` 时 `this` 指向新创建的对象（详见 [03.2 原型链](/03-js/03-objects/02-prototype-chain)）：

```javascript
function Person(name) {
  this.name = name;       // this = 正在创建的新对象
}
const alice = new Person("Alice");
console.log(alice.name);  // "Alice"
```

## 规则四：call / apply / bind（显式绑定）

三个方法都可以**手动指定 this**。`call` 和 `apply` 是"立即调用"，区别只是传参方式；`bind` 是"返回一个新函数，永久锁定 this"：

```javascript
const user = { name: "Alice" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

// call：逐个传参，立即调用
greet.call(user, "你好", "!");     // "你好, Alice!"

// apply：参数放数组里，立即调用
greet.apply(user, ["你好", "!"]);  // "你好, Alice!"

// bind：返回绑定好的新函数，之后调用 this 固定
const boundGreet = greet.bind(user, "你好");
boundGreet("!");                   // "你好, Alice!"
```

`apply` 的经典用法：把类数组转成真数组（现在多用 `Array.from` 或展开运算符）：

```javascript
function argsToArray() {
  return Array.prototype.slice.apply(arguments);
}
argsToArray(1, 2, 3);   // [1, 2, 3]
```

## 箭头函数：没有自己的 this

箭头函数**不参与 this 绑定**——它没有自己的 `this`，读取时直接沿用**定义时外层作用域**的 `this`，且永远不变（词法绑定）：

```javascript
const obj = {
  name: "js",
  normal: function () {
    setTimeout(function () {
      console.log(this.name);   // undefined：回调里的 this 是全局（经典丢失）
    }, 0);
  },
  arrow: function () {
    setTimeout(() => {
      console.log(this.name);   // "js"：箭头函数继承外层 normal 的 this（= obj）
    }, 0);
  },
};
```

事件监听场景对比（再次强调）：

```javascript
// 普通函数：this 动态指向当前元素
button.addEventListener("click", function () {
  this.style.color = "red";     // ✅ this 是 button
});

// 箭头函数：this 是外层，取不到元素
button.addEventListener("click", () => {
  this.style.color = "red";     // ❌ this 是外层（window 等），可能报错
});
```

::: danger 箭头函数没有自己的 this
在需要 `this` 动态指向调用者的场景（对象方法、DOM 事件回调、构造函数）**不要用箭头函数**；在需要"继承外层 this"的场景（回调嵌套、定时器、Promise 链）**优先用箭头函数**。
:::

## 常见坑点

- 把方法赋值给变量再调用 → this 丢失，用 `bind` 或箭头函数修
- `setTimeout(obj.method, 0)` → 方法被独立调用，this 丢失；改 `() => obj.method()`
- 箭头函数里想用 `arguments` → 没有，用 rest 参数
- 回调里混用 `this` 指代混乱时，先想清楚"这里 this 是谁"再动手

## 小结

- this 由**调用方式**决定：直接调用 / 方法调用 / new / 显式绑定
- 方法取出单独调用会**丢失 this**（裸调用指向全局/undefined）
- `call`/`apply` 立即调用并指定 this；`bind` 返回永久锁定的新函数
- 箭头函数**没有自己的 this**，继承外层且不变——用它解决回调丢失

::: tip 速查卡片
this 四种绑定规则与 call/apply/bind 速查，见 [函数与闭包速查](/cheatsheet/data/function-closure)。
:::
