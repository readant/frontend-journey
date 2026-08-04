---
title: 变量与数据类型速查
---

# 变量与数据类型速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 声明变量 | `const` 优先；需重新赋值用 `let`；永远不用 `var` |
| 判断类型 | `typeof`（注意 `null`/数组的坑） |
| 判断是否 NaN | `Number.isNaN()`（不用全局 `isNaN`） |
| 字符串转数字 | `Number()` / `parseInt()` / `parseFloat()`（注意差异） |
| 严格比较 | `===` / `!==`（永远不用 `==`） |
| 空值兜底 | `??`（只拦 null/undefined，不拦 0/""/false） |

## 核心代码

```javascript
// 声明
const PI = 3.14;          // 常量（对象可改属性，不可重新赋值）
let count = 0;            // 可变
count++;                  // ✅

// typeof 一览
typeof 42          // "number"
typeof "hi"        // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← 历史 bug，判断用 v === null
typeof {}          // "object"
typeof []          // "object"  ← 数组也是 object
typeof Symbol()    // "symbol"
typeof 10n         // "bigint"
typeof (() => {})  // "function"

// 显式转换
String(42)              // "42"
Number("42")            // 42
Number("42px")          // NaN
Boolean(0)              // false
parseInt("42px")        // 42
parseFloat("3.14m")     // 3.14

// 判断 NaN
Number.isNaN(NaN)       // true（正确）
isNaN("abc")            // true（坑：全局 isNaN 会先转数字）

// 空值兜底
const name = user?.name ?? "匿名";   // 可选链 + 空值合并
```

## 踩坑记录

- **`==` 会隐式转换**：`"5" == 5` 是 true；**一律用 `===`**（`null == undefined` 也是 true 的坑源）
- **`+` 遇到字符串就拼接**：`"2" + 2 === "22"`；其他算术运算符才转数字（`"2" - 2 === 0`）
- **`0.1 + 0.2 !== 0.3`**：IEEE 754 浮点精度问题，比较用 `Math.abs(a-b) < Number.EPSILON`，金额按"分"整数运算
- **`typeof null === "object"`**：历史遗留 bug，判断 null 只能 `v === null`
- **`const` 对象可改属性**：`const obj = {}; obj.a = 1` 合法；不能改的是"重新赋值"
- **let/const 有 TDZ**：声明前访问抛 `ReferenceError`；`var` 提升为 undefined 但行为更糟
- **`NaN === NaN` 是 false**：NaN 连自己都不相等
