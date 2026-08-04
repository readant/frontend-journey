---
title: 01. 变量与基础
---

# 变量、数据类型与类型转换

## 它是什么

JavaScript 是一门**动态类型（Dynamic Typing）**语言：变量本身不绑定类型，可以随时被赋值为任意类型。

```javascript
let x = 42;          // 数字
x = "hello";         // 变成字符串 —— 合法！
x = { a: 1 };        // 变成对象 —— 依然合法
```

这和静态类型语言（如 Java/C）有本质区别：**类型属于"值"，不属于"变量"**。理解这一点是掌握 JS 一切"诡异行为"（如 `"2" + 2 === "22"`、`[] + [] === ""`）的前提。

## 核心机制

### 1. 两大类型阵营

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

**核心区别**：原始类型**按值存储**（直接存数据），引用类型**按引用存储**（存的是内存地址）。

```javascript
// 原始类型：复制的是值
let a = 10;
let b = a;          // b 拿到 10 的副本
b = 20;
console.log(a);     // 10（a 不受影响）

// 引用类型：复制的是引用（指针）
let obj1 = { n: 10 };
let obj2 = obj1;    // obj2 和 obj1 指向同一个对象
obj2.n = 20;
console.log(obj1.n); // 20（互相影响）
```

### 2. typeof 运算符

`typeof` 返回值的类型字符串，但有几个"历史坑"：

```javascript
typeof 42          // "number"
typeof "hi"        // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 10n         // "bigint"
typeof {}          // "object"
typeof []          // "object"   ← 数组也是 object
typeof null        // "object"   ← 历史遗留 bug！null 不是对象
typeof function(){} // "function" ← 函数特殊处理
```

::: warning 判断 null 的正确姿势
`typeof null === "object"` 是 JS 诞生时的历史遗留，无法修复。判断 null 必须用：

```javascript
const v = null;
console.log(v === null);      // true（唯一可靠方式）
console.log(!v && typeof v === "object"); // true 的兜底写法
```
:::

### 3. 动态类型的"价值归属"

在 JS 中，你写的每个**字面量**在运行时都会有一个真实类型：

```javascript
42            // number
"42"          // string（数字包在引号里就是字符串）
true          // boolean
undefined     // 声明未赋值时的默认值
null          // 显式"没有值"
```

## 标准语法

### 变量声明三兄弟

| 关键字 | 作用域 | 提升 | 可否重新赋值 | 可否重复声明 |
| --- | --- | --- | --- | --- |
| `var` | 函数级 | 提升（undefined） | 可 | 可（不推荐） |
| `let` | **块级** | 提升（但 TDZ 暂存死区） | 可 | 不可 |
| `const` | **块级** | 提升（但 TDZ） | **不可**（对象可改属性） | 不可 |

```javascript
// 现代规范：const 优先，确实要改才用 let，永远不用 var
const PI = 3.14;
let count = 0;
count++;            // let 可重新赋值

const obj = { a: 1 };
obj.a = 2;          // ✅ 允许：const 限制的是"重新赋值"，不是"修改内容"
// obj = { b: 1 };  // ❌ TypeError：不能给 const 重新赋值
```

### 数据类型字面量

```javascript
// 数字：整数、浮点、科学计数
const n1 = 42;
const n2 = 3.14;
const n3 = 1e6;        // 1000000
const n4 = 0b1010;     // 二进制 10
const n5 = 0x1f;       // 十六进制 31

// 字符串：单引号 / 双引号 / 模板字符串
const s1 = 'single';
const s2 = "double";
const s3 = `模板字符串，可插值 ${n1}`;   // 推荐

// 布尔、空值
const yes = true;
const nothing = null;
let notAssigned;       // undefined
```

### 类型转换

**① 显式转换（主动调用）**

```javascript
String(42)          // "42"
Number("42")        // 42
Number("42px")      // NaN（不能转换就 NaN）
Boolean(1)          // true
parseInt("42px")    // 42（从左解析到非数字）
parseFloat("3.14m") // 3.14
```

**② 隐式转换（运算符触发）——最大的坑源**

```javascript
"2" + 2        // "22"   字符串拼接优先！+ 遇到字符串就转字符串
"2" - 2        // 0      算术运算符强制转数字
"2" * "3"      // 6
+ "42"         // 42     一元 + 强制转数字
!!"hi"         // true   一元 ! 转布尔

// 相等比较（宽松 == 会隐式转换）
"5" == 5       // true   值相同（类型被忽略）
"5" === 5      // false  严格相等：类型 + 值都要求相同
```

## 深入理解

### 1. 强制转换规则（ToPrimitive）

隐式转换不是随机，而是走一套固定算法。**核心规则**：

- `+` 运算符：**只要一边是字符串，就转成字符串拼接**
- 其余算术运算符（`-` `*` `/`）：**一律转成数字**
- 宽松 `==`：null/undefined 互相相等；一边数字一边字符串 → 字符串转数字；一边布尔 → 布尔转数字

```javascript
[] + []        // ""    空数组转字符串为 ""（"" + ""）
[] + {}        // "[object Object]"
{} + []        // 0？   ← 这是语句块不是对象（{} 被解析为代码块）
42 + []        // "42"  数字 + 空数组 → 数组转 ""

"2" == 2       // true
false == 0     // true  （布尔 false 转数字 0）
null == undefined // true（特殊规则）
null == 0      // false （null 只与 undefined 相等）
```

::: danger 黄金法则
**永远使用严格相等 `===` / `!==`**，避免隐式转换带来的意外。这是所有 JS 风格指南的共同第一条。
:::

### 2. NaN：唯一不等于自己的值

```javascript
Number("abc")   // NaN
NaN === NaN     // false  ← NaN 连自己都不等于
```

判断 NaN 必须用 `Number.isNaN()`（`isNaN()` 会把非数字先转数字，结果失真）：

```javascript
Number.isNaN(NaN)   // true
Number.isNaN("abc") // false（"abc" 不是 NaN）
isNaN("abc")        // true  ← 老的全局 isNaN 会先把 "abc" 转成 NaN，坑！
```

### 3. 浮点精度陷阱

```javascript
0.1 + 0.2 === 0.3    // false！结果是 0.30000000000000004
```

JS 数字遵循 IEEE 754 双精度浮点，二进制无法精确表示 0.1。**解决方式**：比较时用误差范围，或按分处理金额：

```javascript
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true 近似比较
// 金额：转成分（整数）运算后再显示
```

### 4. null vs undefined

| 对比 | `null` | `undefined` |
| --- | --- | --- |
| 含义 | 显式"值为空" | "从未赋值" |
| 类型 | `typeof` 返回 "object"（bug） | "undefined" |
| 来源 | 开发者主动设置 | 声明未赋值、函数无返回、访问不存在的属性 |
| 用途 | 表示"这里有值但为空" | 表示"这里没有值" |

```javascript
let x;                 // undefined
const obj = {};        // obj.any 是 undefined
function f() {}        // f() 返回 undefined
const empty = null;    // 显式置空用 null
```

### 5. 表达式与运算符要点

- **逻辑短路**：`a && b`（a 假则返回 a）、`a || b`（a 真则返回 a）、`??` 空值合并（只拦 null/undefined）
- **可选链**：`obj?.a?.b`，中间为空直接返回 undefined，不抛错
- **三元**：`cond ? x : y`

```javascript
const name = user?.profile?.name ?? "匿名";   // 安全链式取值 + 兜底
```

## 关联速查

::: tip 速查卡片
变量声明、类型表与强制转换规则的完整速查，见 [变量与数据类型速查](/cheatsheet/data/variable-type)。
:::

::: info 延伸阅读
类型转换的底层算法（ToPrimitive / ToNumber）在 [MDN - 类型转换](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_precedence) 有更完整说明。
:::
