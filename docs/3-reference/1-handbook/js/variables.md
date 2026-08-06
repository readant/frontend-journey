---
title: JS 变量与类型完整手册
---

# JS 变量与类型

## 核心概念

`let` / `const` 声明变量，`typeof` 查类型 —— 变量是装数据的盒子，类型决定盒子能装什么。

## 完整内容

### 是什么 / 为什么

JavaScript 是**动态类型**语言：变量本身不锁类型，同一个变量可以装不同种类的值。理解七种数据类型与强制转换规则，是写出不踩坑代码的第一步。

### 一、变量声明三兄弟

| 关键字 | 可重新赋值 | 可重复声明 | 作用域 | 场景 |
| :--- | :--- | :--- | :--- | :--- |
| `var` | ✅ | ✅ | 函数级（会提升） | 旧代码，新代码**别用** |
| `let` | ✅ | ❌ | 块级 `{}` | 值会变的变量 |
| `const` | ❌ | ❌ | 块级 `{}` | 值不变的变量（**默认首选**） |

```javascript
const PI = 3.14;        // 常量，不能重新赋值
let count = 0;          // 可变计数
count += 1;

// 注意：const 只锁「绑定」，不锁「内容」
const arr = [1, 2, 3];
arr.push(4);            // ✅ 数组内容可以改
// arr = [5];           // ❌ 重新赋值报错
```

**块级作用域陷阱**（var 时代经典 bug）：

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));  // 打印 3 3 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j));  // 打印 0 1 2 ✓
}
```

### 二、七种数据类型

**基本类型（6 种，按值存储）**：

| 类型 | typeof 结果 | 说明 |
| :--- | :--- | :--- |
| `number` | `"number"` | 整数浮点都算 number（含 `NaN` `Infinity`） |
| `string` | `"string"` | 字符串（单/双/反引号都行） |
| `boolean` | `"boolean"` | `true` / `false` |
| `undefined` | `"undefined"` | 声明了但没赋值 |
| `null` | `"object"`（历史 Bug） | 表示「空」，手动赋值 |
| `symbol` | `"symbol"` | 唯一标识（对象键） |

**引用类型（1 种，按引用存储）**：

| 类型 | typeof 结果 |
| :--- | :--- |
| `object`（含数组/函数） | `"object"`（函数是 `"function"`） |

```javascript
typeof "hi";            // "string"
typeof 42;              // "number"
typeof true;            // "boolean"
typeof undefined;       // "undefined"
typeof null;            // "object" ← 语言历史遗留 Bug
typeof [];              // "object"（数组要 Array.isArray() 判断）
typeof (() => {});      // "function"
```

**值传递 vs 引用传递**（最易踩的坑）：

```javascript
let a = 10;
let b = a;              // 基本类型：复制值，互不影响
b = 20;                 // a 仍是 10

let obj1 = { n: 1 };
let obj2 = obj1;        // 引用类型：复制引用，指向同一个对象
obj2.n = 99;            // obj1.n 也变成 99
```

### 三、类型转换（隐式与显式）

**显式转换（推荐，可预测）**：

```javascript
Number("42");           // 42
Number("abc");          // NaN
parseInt("12.9px");     // 12（解析到非数字为止）
parseFloat("3.14rem");  // 3.14
String(42);             // "42"
Boolean(0);             // false
```

**隐式转换（== 会转换，全等 === 不会）**：

```javascript
"5" == 5;               // true（== 先转再比，不推荐）
"5" === 5;              // false（=== 类型不同直接 false，推荐）
1 + "2";                // "12"（数字 + 字符串 → 拼接）
"5" - 2;                // 3（减法会尝试转数字）
```

**真值与假值**（if 判断的依据）：

```javascript
// 假值（falsy）只有 6 个：
false, 0, ""(空串), null, undefined, NaN
// 其余都是真值，包括 [] 和 {}（空数组空对象是真值！）

if ([]) console.log("执行");      // 执行：空数组是真值
if (arr.length) console.log("有"); // 判断数组有没有内容要用 length
```

### 语法速查

| 操作 | 写法 | 说明 |
| :--- | :--- | :--- |
| 声明 | `const` / `let` | 默认 const，会变才 let |
| 查类型 | `typeof x` | 返回类型字符串 |
| 查数组 | `Array.isArray(x)` | 正确判断数组 |
| 转数字 | `Number(x)` / `parseInt(x)` / `parseFloat(x)` | 显式转换 |
| 转字符串 | `String(x)` / `x.toString()` | 显式转换 |
| 严格相等 | `===` / `!==` | 类型一致才相等，推荐 |
| 宽松相等 | `==` / `!=` | 会隐式转换，别用 |

### 常见用法

**变量命名与解构**：

```javascript
// 对象解构
const { name, age } = user;
// 数组解构
const [first, second] = [1, 2];
```

**可选链与空值合并**（防访问报错）：

```javascript
user?.profile?.avatar;   // 中间任何一层为 null/undefined 就返回 undefined，不报错
const count = data?.count ?? 0;  // ?? 只在 null/undefined 时取默认值
```

### 注意事项

- ⚠️ 永远用 `const` 起步，需要改值才换 `let`；`var` 只在读旧代码时认识它。
- ⚠️ 判断数组用 `Array.isArray()`，`typeof []` 是 `"object"`。
- ⚠️ 判断「有没有值」用 `=== null` 或 `??`，别用 `!x`（`0`/`""` 会被误杀）。
- ⚠️ 比较一律用 `===`；`0.1 + 0.2 !== 0.3` 是浮点精度问题，金额计算用整数分或 `toFixed`。
- ⚠️ `const` 数组/对象的内容可改，别指望 const 给你深不可变性。

## 相关

- 🔍 场景索引：[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[运算符](/3-reference/1-handbook/js/operators)、[函数](/3-reference/1-handbook/js/functions)
