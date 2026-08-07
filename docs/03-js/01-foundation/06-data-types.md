---
title: 01.6 数据类型
---

# 数据类型：原始类型与引用类型

::: tip 前置要求需要先掌握上一页 [变量声明](/03-js/01-foundation/05-variables) 的 `let` /
`const`。本页回答"变量里能装什么"——8 种数据类型。:::

## 它是什么

数据类型就是**"值"的种类**。JavaScript 只有两大类：

- **原始类型（Primitive）**：7 种，存的是**数据本身**
- **引用类型（Object）**：存的是**内存地址**

:::
tip 生活化比喻原始类型像"写在纸条上的数字"——复印一份给对方，改对方的纸条不影响你的；引用类型像"共用一个储物柜的钥匙"——两个人拿的是同一把钥匙，谁开了柜子改东西，另一个也看得见。:::

## 两大类型阵营

```
JavaScript 类型
├── 原始类型（Primitive，7 种）
│   ├── number  数字（含 NaN / Infinity）
│   ├── string  字符串
│   ├── boolean 布尔
│   ├── undefined 未定义
│   ├── null      空值
│   ├── symbol    唯一标识
│   └── bigint    大整数
└── 引用类型（Object）
    ├── object    普通对象
    ├── array     数组
    ├── function  函数
    └── ...       其他内置对象
```

### 原始类型逐个认识

| 类型        | 含义     | 示例                   | 新人直觉       |
| ----------- | -------- | ---------------------- | -------------- |
| `number`    | 数字     | `42`、`3.14`、`NaN`    | 数学里的数     |
| `string`    | 文本     | `"你好"`、`` `模板` `` | 引号包起来的字 |
| `boolean`   | 是/否    | `true`、`false`        | 开关           |
| `undefined` | 未赋值   | 声明后不赋值           | "还没给"       |
| `null`      | 显式空值 | `null`                 | "就是没有"     |
| `symbol`    | 唯一标识 | `Symbol()`             | 独一无二的标签 |
| `bigint`    | 超大整数 | `10n`                  | 超过 2^53 用   |

### 引用类型（对象）

对象是**键值对集合**，数组、函数、日期、正则……在 JS 里统统是对象：

```javascript
const obj = { name: "Alice" }; // 普通对象
const arr = [1, 2, 3]; // 数组（特殊对象）
function fn() {} // 函数（特殊对象）
```

## 核心机制：按值 vs 按引用

这是理解 JS 类型最重要的一个区别：

```javascript
// 原始类型：复制的是值（拷贝一份）
let a = 10;
let b = a; // b 拿到 10 的副本
b = 20;
console.log(a); // 10（a 不受影响）

// 引用类型：复制的是引用（共享同一个对象）
let obj1 = { n: 10 };
let obj2 = obj1; // obj2 和 obj1 指向同一个对象
obj2.n = 20;
console.log(obj1.n); // 20（互相影响！）
```

:::
danger 最常见的 bug 来源把对象"赋值"给另一个变量，然后改动它，结果原对象也变了——因为两个变量指向**同一个对象**。需要独立副本时要用拷贝（见对象章节的「深浅拷贝」）。:::

## typeof 运算符

`typeof` 返回值的类型字符串，但有**两个著名的坑**：

```javascript
typeof 42; // "number"
typeof "hi"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof 10n; // "bigint"
typeof {}; // "object"
typeof []; // "object"   ← 坑 1：数组也是 object
typeof null; // "object"   ← 坑 2：历史遗留 bug！null 不是对象
typeof function () {}; // "function" ← 函数特殊处理
```

::: warning 判断 null 的正确姿势 `typeof null === "object"` 是 JS 诞生时的历史遗留，无法修复。判断 null 必须用：

```javascript
const v = null;
console.log(v === null); // true（唯一可靠方式）
console.log(!v && typeof v === "object"); // true 的兜底写法
```

:::

## 字面量写法速览

你写的每个**字面量**在运行时都有一个真实类型：

```javascript
// 数字：整数、浮点、科学计数、不同进制
const n1 = 42;
const n2 = 3.14;
const n3 = 1e6; // 1000000
const n4 = 0b1010; // 二进制 10
const n5 = 0x1f; // 十六进制 31

// 字符串：单引号 / 双引号 / 模板字符串
const s1 = "single";
const s2 = "double";
const s3 = `模板字符串，可插值 ${n1}`; // 推荐：可嵌入变量

// 布尔、空值
const yes = true;
const nothing = null;
let notAssigned; // undefined（声明未赋值）
```

## null vs undefined（高频面试）

| 对比 | `null`                        | `undefined`                              |
| ---- | ----------------------------- | ---------------------------------------- |
| 含义 | 显式"值为空"                  | "从未赋值"                               |
| 类型 | `typeof` 返回 "object"（bug） | "undefined"                              |
| 来源 | 开发者**主动**设置            | 声明未赋值、函数无返回、访问不存在的属性 |
| 用途 | 表示"这里有值但为空"          | 表示"这里没有值"                         |

```javascript
let x; // undefined
const obj = {}; // obj.any 是 undefined
function f() {} // f() 返回 undefined
const empty = null; // 显式置空用 null
```

::: tip 记忆口诀 **`null` 是"我要的字段，值为空"；`undefined` 是"根本没这个字段/没赋值"。**
区分它们能让代码表达更准确。:::

## 常见坑点

- `typeof null === "object"`：判断 null 用 `=== null`
- `typeof [] === "object"`：判断数组用 `Array.isArray(arr)`
- 对象/数组赋值给新变量是**共享引用**，不是拷贝
- 把变量赋值为 `undefined` 不如用 `null`（表示"主动清空"）

## 小结

- JS 只有两大类类型：原始（7 种，按值）与引用（按引用）
- 原始类型复制安全，引用类型赋值是共享——改动要格外小心
- `typeof` 有 `null` 和数组两个历史坑，各有替代判断法
- `null` = 显式空值，`undefined` = 从未赋值

::: tip 速查卡片类型表与判断方法的完整速查，见 [变量与数据类型速查](/cheatsheet/data/variable-type)。:::
