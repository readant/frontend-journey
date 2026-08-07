---
title: 02.4 箭头函数
---

# 箭头函数：写函数的"快捷键"

## 掌握目标

学完本页，你将能：

- 看懂 `=>` 箭头符号，说出它"前后各是什么"
- 写出三种写法的箭头函数（单参 / 多参 / 多语句）
- 知道返回对象的特殊写法 `({ ... })`
- 记住箭头函数最重要的特点：**没有自己的 this**

::: tip 前置要求
需要先掌握 [函数定义与调用](/03-js/02-functions/01-define-functions) 的三种定义方式与 `()` / `{}` 符号。
:::

## 概念引入：箭头函数是"普通函数的简写"

箭头函数是 ES6（2015 年）引入的**函数简写语法**。它就像普通函数的一张"便利贴"：把 `function`、`{}`、`return` 这些"废话"尽量省略，只留下最核心的部分。

它像一把**轻量瑞士军刀**：短小、方便、随身带，但**功能比普通函数少**（没有自己的 `this`、没有 `arguments`、不能 `new`）。该用哪种，取决于场景——学完本页你就知道怎么选了。

```javascript
// 普通函数（完整写法）
const add1 = function (a, b) { return a + b; };

// 箭头函数（同一功能的简写）
const add2 = (a, b) => a + b;
```

::: tip 一句话理解
**箭头函数 = 去掉 `function`、去掉 `{}`、去掉 `return`（单表达式时）的普通函数，换来的是"继承外层的 this"。**
:::

## 符号课堂：`=>`

### 符号：`=>` —— "把输入送进函数体"

`=>` 读作"箭头"，它是箭头函数的核心符号，像一条**传送带**：**左边是输入（参数），右边是函数体（计算）**。

| `=>` 左边 | `=>` 右边 |
| :--- | :--- |
| 参数列表（一个参数可省括号） | 函数体（单表达式自动返回，多语句要加 `{}` 和 `return`） |

**示例 ① 基础用法**：左边参数，右边表达式（自动返回结果）：

```javascript
const double = (x) => x * 2;
double(5);   // 10 —— 右边的 x * 2 会被自动返回
```

**示例 ② 常见错误**：多语句体忘写大括号和 `return`：

```javascript
const max = (a, b) => {          // ❌ 多语句必须加大括号
  if (a > b) return a;
  return b;
};
// const max = (a, b) => if (a > b) a;  // ❌ if 不能当单表达式

const max2 = (a, b) => (a > b ? a : b);  // ✅ 用三元表达式可以省掉大括号
```

**示例 ③ 返回对象字面量**：箭头函数的大括号会被当成"函数体"，想返回对象必须用括号包住：

```javascript
const getObj = () => ({ name: "小明" });   // ✅ () 包住 {}：返回对象
// const bad = () => { name: "小明" };     // ❌ 被当成函数体：{ name: ... } 是空语句
// bad() 返回 undefined，不会返回对象
```

## 标准语法：三种写法

```javascript
// 写法一：单个参数 —— 可以省略括号
const double = x => x * 2;

// 写法二：多个参数 —— 必须加括号；单表达式自动 return
const sum = (a, b) => a + b;

// 写法三：多语句函数体 —— 必须加大括号 + 显式 return
const max = (a, b) => {
  if (a > b) return a;
  return b;
};
```

::: warning 只有单表达式才能省 return
判断口诀：**函数体只有一行、且那一行就是你要返回的值** → 可以省 `{}` 和 `return`。否则老老实实写 `{}` + `return`。
:::

## 深入理解：箭头函数 vs 普通函数

| 对比项 | 普通函数 | 箭头函数 |
| :--- | :--- | :--- |
| `this` | 调用时动态决定 | **定义时继承外层**（词法绑定） |
| `arguments` | 有 | **没有**（用 `...rest` 替代） |
| 可否 `new` | 可以（构造函数） | **不可以**（报 TypeError） |
| 有无 `prototype` | 有 | 无 |
| 语法 | 完整 `function` | 简洁，单表达式省 return |

```javascript
// 箭头函数不能 new
const Fn = () => {};
// new Fn();              // ❌ TypeError: Fn is not a constructor
console.log(Fn.prototype);   // undefined

// 没有 arguments，用 rest 参数
const showArgs = (...args) => console.log(args);
showArgs(1, 2, 3);        // [1, 2, 3]
```

### 最关键的差异：this 继承外层

普通函数的 `this` 是**调用时**决定的（谁调用指向谁）；箭头函数**没有自己的 this**，它用的是**定义那一刻外层作用域的 this**，而且永远不变。可以把它想象成"**把外层的 this 复制了一份随身携带**"：

```javascript
const obj = {
  name: "js",
  normal: function () {
    console.log(this.name);        // "js" —— this = obj（方法调用）
  },
  arrow: () => {
    console.log(this.name);        // undefined —— this = 定义时的外层（全局/模块）
  },
};

obj.normal();   // "js"
obj.arrow();    // undefined —— 箭头函数不在乎"谁调用它"
```

::: tip 该用哪个？一句话选择
**回调、短小的遍历逻辑、想"借用外层 this"** → 箭头函数；**对象方法、需要动态 this、要当构造函数** → 普通函数。
:::

## 常见坑点

- **对象方法里用箭头函数**会拿不到 `obj`（this 指向外层）——方法用普通函数
- **事件回调里想用 `this` 指向当前元素**，箭头函数不行（`this` 是外层）——用普通函数或 `event.target`
- **返回对象忘了加括号** `() => { a: 1 }` 返回 undefined——见符号课堂示例 ③
- 多语句体忘写 `{}` 和 `return`——见符号课堂示例 ②

## 小结

- `=>` 左边是输入（参数），右边是函数体（计算）
- 三种写法：单参省括号 / 多参带括号 / 多语句必须 `{}` + `return`
- 返回对象要加括号：`() => ({ ... })`
- 箭头函数**没有自己的 this**（继承外层）、没有 `arguments`、不能 `new`
- 选择口诀：回调短逻辑用箭头，方法构造用普通

## 评估小测验（自测后再对答案）

1. 下面的箭头函数会返回什么？

```javascript
const fn = () => { name: "小明" };
fn();   // ？
```

2. 下面的代码输出什么？

```javascript
const obj = {
  name: "小明",
  say: () => console.log(this.name),
};
obj.say();   // ？
```

3. `(a, b) => a + b` 与 `function (a, b) { return a + b; }` 有什么不同？

::: details 点击查看答案
1. `undefined`——`{ name: "小明" }` 被当成函数体（里面是标签语句），不是对象。要返回对象得写 `() => ({ name: "小明" })`。
2. `undefined`——箭头函数没有自己的 this，`this` 是定义时外层的 this（这里是全局/模块），不是 `obj`。
3. 功能相同，但箭头函数没有自己的 `this`、`arguments`，且不能 `new`。
:::

::: tip 速查卡片
箭头函数的完整速查（三种写法 + 与普通函数对比），见 [JS 函数手册 · 箭头函数](/3-reference/1-handbook/js/functions)。
:::
