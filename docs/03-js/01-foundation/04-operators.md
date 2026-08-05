---
title: 01.4 表达式与运算符
---

# 表达式与运算符：短路、可选链、空值合并

## 它是什么

**表达式（Expression）**是"会产生一个值"的代码片段：`1 + 2`、`x > 3`、`user?.name`。**运算符**就是连接它们的符号。掌握本节几个"现代运算符"，能让代码更短、更安全、更少崩溃。

```javascript
const total = price * count;     // 算术表达式
const ok = score >= 60;          // 比较表达式
const name = user?.name ?? "匿名"; // 安全取值表达式
```

## 算术与比较运算符（快速过一遍）

```javascript
// 算术
1 + 2; 2 - 1; 3 * 4; 10 / 2; 7 % 3;   // 加减乘除、取余（% 常用于判断奇偶/循环取模）
2 ** 3;                                // 8（幂运算）
let n = 5; n++; n--; n += 2;           // 自增、自减、复合赋值

// 比较（返回布尔值）
5 > 3; 5 >= 5; 5 < 3; 3 === 3; 3 !== 4;
```

## 逻辑短路：&& 与 ||

`&&` 和 `||` 的返回值**不是布尔值**，而是**参与运算的某个原值**——这是它们最强大也最容易误解的地方。

### `a && b`：a 为假 → 返回 a；a 为真 → 返回 b

适合"**有值才继续**"的场景（安全调用）：

```javascript
const user = { name: "Alice" };
user && user.name;        // "Alice"（user 为真，继续取 name）
// 若 user 为 null：返回 null，不会报错

// 经典用途：对象存在才调方法
data && render(data);
```

### `a || b`：a 为真 → 返回 a；a 为假 → 返回 b

适合"**取默认值**"场景（但有陷阱，见下文 `??`）：

```javascript
const price = input || 0;     // 没传就用 0
```

::: warning `||` 的陷阱
`||` 会把所有**假值**（`0`、`""`、`NaN`）都当成"没有"。如果 `input` 是合法的 `0`，也会被替换成默认值。

```javascript
const count = 0 || 10;        // 10  ← 0 被当成"没有"了！
```
要"只拦截 null/undefined"用下面的 `??`。
:::

### `!` 与 `!!`：转布尔

```javascript
!true        // false
!!"hi"       // true（把一个值转成布尔）
!!0          // false
```

## 空值合并 `??`：只拦 null/undefined

`??` 的逻辑：**左边是 `null` 或 `undefined` 才取右边**。它是 `||` 的"精准版"：

```javascript
const a = 0 ?? 10;        // 0    ← 0 是合法值，保留！
const b = null ?? 10;     // 10
const c = undefined ?? 10;// 10
const d = "" ?? "默认";   // ""   ← 空字符串也保留
```

::: danger `??` 不能和 `||`/`&&` 直接混用
`a ?? b || c` 会语法报错，需要加括号：`(a ?? b) || c`。
:::

## 可选链 `?.`：安全地链式取值

访问深层属性时，中间任何一环为 `null`/`undefined` 都会**直接崩溃**。可选链让整条链自动短路：

```javascript
// 老写法：层层判断，又长又容易漏
const name = user && user.profile && user.profile.name;

// 可选链：一行搞定，中间为空直接返回 undefined，不抛错
const name = user?.profile?.name;

// 配合调用方法、索引
user?.profile?.getInfo?.();   // 方法不存在也不报错
arr?.[0];                     // 数组索引也可用 ?.
```

```javascript
// 没写可选链 vs 写了可选链
const address = user.address;        // user 为 null 时 → TypeError 崩溃 ❌
const address = user?.address;       // user 为 null 时 → undefined ✅
```

## 三元运算符：简洁的条件赋值

```javascript
const status = score >= 60 ? "及格" : "不及格";
// 等价于：
let status;
if (score >= 60) {
  status = "及格";
} else {
  status = "不及格";
}
```

::: tip 使用建议
单层条件用三元（一行）；多层嵌套条件**不要**用三元（可读性差），用 `if/else` 或 `switch`。
:::

## 综合实战：安全链式取值 + 兜底

把可选链、空值合并组合起来，是当代前端最常用的"防崩溃三件套"：

```javascript
// 深层取值，任何一环为空都不崩，最终兜底默认值
const name = user?.profile?.name ?? "匿名用户";

// 配置项缺省
const theme = config?.theme ?? "light";

// 事件数据安全读取
const id = event?.detail?.userId ?? -1;
```

## 常见坑点

- `&&`/`||` 返回的是**原值**不是布尔，用 `!!` 或直接放在条件里
- `0`、`""` 是假值：用 `||` 取默认值会误伤，需求是"只拦空"时用 `??`
- `?.` 只防 `null`/`undefined`，防不了**变量本身不存在**（`ReferenceError`）
- 三元不要多层嵌套，会变成"可读性灾难"

## 小结

- `&&`（有值才继续）与 `||`（取默认值）返回原值
- `??` 只拦 `null`/`undefined`，比 `||` 更精准
- `?.` 安全链式取值，配合 `??` 兜底，是防崩溃的黄金组合

::: tip 速查卡片
运算符速查见 [变量与数据类型速查](/cheatsheet/data/variable-type)。
:::
