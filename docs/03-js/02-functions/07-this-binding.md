---
title: 02.7 this 绑定
---

# this 绑定：谁拿起话筒，声音就属于谁

## 掌握目标

学完本页，你将能：

- 说出 `this` 是什么、什么时候被决定
- 用**四种绑定规则**判断任意调用下 `this` 指向谁
- 识别"丢失 this"的场景，并用 `call` / `apply` / `bind` / 箭头函数修复
- 说清箭头函数为什么"没有自己的 this"

::: tip 前置要求需要先掌握 [函数定义与调用](/03-js/02-functions/01-define-functions)（普通函数）与
[箭头函数](/03-js/02-functions/04-arrow-functions)（词法 this）。:::

## 概念引入：this 就是"话筒"

`this` 是函数内部的一个特殊关键字，代表"**当前执行上下文的主人**"。用一个生活化类比：`this` 像一支**话筒**。

> **谁拿起话筒说话，话筒就属于谁。** 同一个函数，被不同的人（对象）调用，里面的 `this` 就指向不同的人。

```javascript
const alice = {
  name: "Alice",
  say() {
    console.log(this.name);
  },
};
const bob = { name: "Bob", say: alice.say }; // 同一个函数

alice.say(); // "Alice"（话筒在 alice 手里）
bob.say(); // "Bob"（话筒换到 bob 手里 —— 函数没变，this 变了）
```

关键点：`this` **不是函数定义时决定的**（箭头函数除外），而是**调用方式**决定的——所以叫"绑定"。

::: tip 一句话理解 **`this` 的值 = 由"函数怎么被调用"决定。看调用方式，不看定义位置。** :::

## 符号课堂：`this`

### 符号：`this` —— "指向当前主人"

`this` 是一个**只在函数内部有意义**的关键字，它永远指向"某个对象"，但指向谁**运行时才定**。

**示例 ① 基础用法**：方法调用时 `this` 指向点号前的对象：

```javascript
const user = {
  name: "小明",
  who() {
    console.log(this);
  },
};
user.who(); // { name: "小明", who: ... } —— this = user
```

**示例 ② 常见错误**：以为 `this` 等于"函数所在的对象"，把方法拿出来调用就翻车：

```javascript
const user = {
  name: "小明",
  who() {
    console.log(this.name);
  },
};
const fn = user.who; // 方法被"拿了出来"
fn(); // ❌ undefined：裸调用时 this = 全局/undefined，不是 user
// 记住：this 跟着"调用方式"走，不跟着"定义位置"走
```

**示例 ③ 用箭头函数"锁住"this**：

```javascript
const obj = {
  name: "js",
  normal: function () {
    setTimeout(function () {
      console.log(this.name); // ❌ undefined：回调里的 this 是全局（丢失）
    }, 0);
  },
  arrow: function () {
    setTimeout(() => {
      console.log(this.name); // ✅ "js"：箭头函数继承外层 normal 的 this
    }, 0);
  },
};
obj.normal(); // undefined
obj.arrow(); // "js"
```

## 四种绑定规则（判断流程）

判断 `this` 指向，**按下面的顺序问自己**：

```
函数怎么被调用的？
│
├─ 前面有"点"？        → obj.method()  → this = 点前面的对象
├─ 用了 new？          → new Fn()      → this = 新创建的对象
├─ 用了 call/apply/bind？→ fn.call(x)  → this = 指定的 x
└─ 都不是（裸调用）     → fn()          → this = 全局（严格模式 undefined）
```

| 调用场景 | 写法                              | `this` 指向                      |
| :------- | :-------------------------------- | :------------------------------- |
| 直接调用 | `fn()`                            | 全局对象（严格模式 `undefined`） |
| 方法调用 | `obj.fn()`                        | **obj**（点号前面的对象）        |
| 构造调用 | `new Fn()`                        | 新创建的对象                     |
| 显式绑定 | `fn.call(obj)` / `apply` / `bind` | 你指定的 obj                     |

### 规则一：直接调用

```javascript
function show() {
  console.log(this);
}
show(); // window（浏览器全局）
```

```javascript
"use strict";
function show() {
  console.log(this); // undefined（严格模式下，裸调用的 this 是 undefined）
}
show();
```

### 规则二：方法调用 vs 独立调用（丢失 this）

```javascript
const user = {
  name: "Alice",
  say() {
    console.log(this.name);
  },
};

user.say(); // "Alice"（方法调用，this = user）
const fn = user.say; // 把方法取出来存成变量
fn(); // undefined（独立调用，this 丢失）
```

::: danger 为什么会丢失 `fn()` 是"裸调用"，前面没有点，`this` 回到全局/undefined，自然读不到
`user.name`。**把对象方法赋值给变量、作为回调传参（如
`setTimeout(user.say)`、事件监听）都会丢失 this**——这是最常见的 this 大坑。:::

事件监听场景（普通函数由框架"点调用"，this 是元素）：

```javascript
button.addEventListener("click", function () {
  console.log(this); // button（事件框架内部用"点"调用回调）
});
```

### 规则三：new 构造调用

```javascript
function Person(name) {
  this.name = name; // this = 正在创建的新对象
}
const alice = new Person("Alice");
console.log(alice.name); // "Alice"
```

### 规则四：call / apply / bind（显式绑定）

三个方法都能**手动指定 this**。`call` 和 `apply` 立即调用，区别只是传参方式；`bind` 返回"永久锁定 this"的新函数：

```javascript
const user = { name: "Alice" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

// call：逐个传参，立即调用
greet.call(user, "你好", "!"); // "你好, Alice!"

// apply：参数放数组里，立即调用
greet.apply(user, ["你好", "!"]); // "你好, Alice!"

// bind：返回绑定好的新函数，之后调用 this 固定
const boundGreet = greet.bind(user, "你好");
boundGreet("!"); // "你好, Alice!"
```

## 箭头函数：没有自己的 this

箭头函数**不参与 this 绑定**——它没有自己的 `this`，读取时直接沿用**定义时外层作用域**的
`this`，且永远不变（词法绑定）。想象它"把外层的 this 复制了一份随身携带"：

```javascript
// 事件监听场景对比（面试高频）
button.addEventListener("click", function () {
  this.style.color = "red"; // ✅ 普通函数：this 动态指向 button
});

button.addEventListener("click", () => {
  this.style.color = "red"; // ❌ 箭头函数：this 是外层（window 等），可能报错
});
```

::: danger 一句话选择在需要 `this`
**动态指向调用者**的场景（对象方法、DOM 事件回调、构造函数）**不要用箭头函数**；在需要**继承外层 this**
的场景（回调嵌套、定时器、Promise 链）**优先用箭头函数**。:::

## 常见坑点

- 把方法赋值给变量再调用 → this 丢失，用 `bind` 或箭头函数修
- `setTimeout(obj.method, 0)` → 方法被独立调用，this 丢失；改 `() => obj.method()`
- 箭头函数里想用 `arguments` → 没有，用 rest 参数
- 回调里混用 `this` 指代混乱时，先想清楚"这里 this 是谁"再动手

## 小结

- `this` 由**调用方式**决定，看"点 / new / call·apply·bind / 裸调用"
- 方法取出单独调用会**丢失 this**
- `call` / `apply` 立即调用并指定 this；`bind` 返回永久锁定的新函数
- 箭头函数**没有自己的 this**，继承外层且不变——用它解决回调丢失

## 评估小测验（自测后再对答案）

1. 下面的代码输出什么？

```javascript
const user = {
  name: "小明",
  say() {
    console.log(this.name);
  },
};
const fn = user.say;
fn(); // ？
```

2. 下面的代码输出什么？

```javascript
const obj = { name: "js", show: () => console.log(this.name) };
obj.show(); // ？
```

3. `call` 和 `bind` 的区别是什么？

4. 事件回调里想用 `this` 指向触发元素，应该用普通函数还是箭头函数？

::: details 点击查看答案

1. `undefined`——`fn()` 是裸调用，this 丢失（指向全局/undefined），不是 user。
2. `undefined`——箭头函数没有自己的 this，这里的 this 是定义时外层（全局/模块）。
3. `call` 立即调用并指定 this；`bind` 返回一个永久锁定 this 的新函数，之后调用 this 不再改变。
4. 普通函数——箭头函数的 this 是外层，取不到触发元素；要元素用普通函数或 `event.currentTarget`。:::

::: tip 速查卡片 this 四种绑定规则与 call/apply/bind 速查，见
[JS 函数手册 · this 绑定](/3-reference/1-handbook/js/functions)。:::
