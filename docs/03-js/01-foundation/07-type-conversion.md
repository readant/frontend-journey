---
title: 01.7 类型转换
---

# 类型转换：显式转换、隐式转换与 == vs ===

## 它是什么

类型转换就是**把一个类型变成另一个类型**。比如把字符串 `"42"` 变成数字 `42`，或把任意值变成布尔值。

JS 的转换分两种：

- **显式转换**：你主动调用 `String()`、`Number()` 等，意图明确
- **隐式转换**：运算符自动触发（`"2" + 2`），**这是所有"诡异行为"的源头**

## 显式转换（主动调用）

```javascript
String(42)          // "42"
Number("42")        // 42
Number("42px")      // NaN（不能转换就 NaN）
Boolean(1)          // true
parseInt("42px")    // 42（从左解析到非数字就停）
parseFloat("3.14m") // 3.14
```

### 三大转换的"强制规则"表

| 转成 → | 规则 |
| --- | --- |
| **字符串** | 数字/布尔直接拼：`String(42) → "42"`；对象走 ToPrimitive（见深入理解） |
| **数字** | `Number("") → 0`、`Number(" 42 ") → 42`（自动去空格）、`Number("abc") → NaN`、`Number(null) → 0`、`Number(undefined) → NaN`、`Number(true) → 1` |
| **布尔** | 只有 6 个**假值**：`false`、`0`、`""`（空串）、`null`、`undefined`、`NaN`；其余**全是真值**（含 `"0"`、`[]`、`{}`！） |

::: warning 布尔转换最容易记反
`Boolean("0")` 是 `true`（非空字符串都是真）！`Boolean([])` 也是 `true`（空数组是真值）。**只有空字符串、0、NaN、null、undefined、false 这 6 个是假值。**
:::

## 隐式转换（运算符触发）——最大的坑源

```javascript
"2" + 2        // "22"   字符串拼接优先！+ 遇到字符串就转字符串
"2" - 2        // 0      算术运算符强制转数字
"2" * "3"      // 6
+ "42"         // 42     一元 + 强制转数字
!!"hi"         // true   一元 ! 转布尔
```

**核心记忆口诀**：

- `+`：**只要一边是字符串 → 字符串拼接**
- `-` `*` `/`：**一律转数字**
- `!` / `!!`：转布尔

## 深入理解：强制转换规则（ToPrimitive）

隐式转换不是随机的，而是走一套固定算法：

- `+` 运算符：只要一边是字符串，就转成字符串拼接
- 其余算术运算符（`-` `*` `/`）：一律转成数字
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

## == vs ===（最重要的面试点）

| 运算符 | 含义 | 是否转换类型 |
| --- | --- | --- |
| `==` | 宽松相等 | **会**（先转换再比） |
| `===` | 严格相等 | **不会**（类型 + 值都要求相同） |

```javascript
"5" == 5       // true   值相同（类型被忽略）
"5" === 5      // false  严格相等：类型 + 值都要求相同
```

::: danger 黄金法则
**永远使用严格相等 `===` / `!==`**，避免隐式转换带来的意外。这是所有 JS 风格指南的共同第一条。
:::

## NaN：唯一不等于自己的值

```javascript
Number("abc")   // NaN
NaN === NaN     // false  ← NaN 连自己都不等于
```

判断 NaN 必须用 `Number.isNaN()`：

```javascript
Number.isNaN(NaN)   // true
Number.isNaN("abc") // false（"abc" 不是 NaN）
isNaN("abc")        // true  ← 老的全局 isNaN 会先把 "abc" 转成 NaN，坑！
```

::: warning 老 isNaN 的坑
全局 `isNaN("abc")` 会先把字符串转成数字，转失败得到 NaN，于是返回 true——**误判**。永远用 `Number.isNaN()`。
:::

## 浮点精度陷阱

```javascript
0.1 + 0.2 === 0.3    // false！结果是 0.30000000000000004
```

JS 数字遵循 IEEE 754 双精度浮点，二进制无法精确表示 0.1。**解决方式**：

```javascript
// 方式一：比较时用误差范围（Number.EPSILON 是"最小可辨识差值"）
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true

// 方式二：金额转成分（整数）运算后再显示
const total = Math.round((0.1 * 100 + 0.2 * 100));  // 30（分）
console.log((total / 100).toFixed(2));              // "0.30"
```

## 常见坑点

- `"2" + 2` 是 `"22"` 不是 `4`：拼接 vs 算术，看有没有字符串
- `Boolean([])` 是 `true`、`Boolean("0")` 是 `true`：别用 `if (arr.length)` 之外的怪写法
- `NaN` 判断必须用 `Number.isNaN()`
- 金额计算避免直接浮点运算，先转整数
- 永远 `===`，宽松 `==` 只在 `x == null`（同时匹配 null/undefined）这种极少数场景考虑

## 小结

- 显式转换：`String()` / `Number()` / `Boolean()` 主动且明确
- 隐式转换：`+` 遇字符串拼接，算术运算符转数字——容易踩坑
- `===` 是黄金法则；`NaN` 用 `Number.isNaN()`；浮点比较用误差范围

::: tip 速查卡片
类型转换规则的完整速查，见 [变量与数据类型速查](/cheatsheet/data/variable-type)。
:::
