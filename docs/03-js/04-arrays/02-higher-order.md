---
title: 04.2 map / filter / reduce
---

# 函数式三件套：map / filter / reduce

## 它是什么

`map` / `filter` / `reduce` 是数组的**函数式三件套**——它们都接受一个回调函数，用"声明式"的方式描述数据变换，**不会改变原数组**，而是返回新结果。把它们想成流水线：原料进、成品出，中间不碰原料本身。

```javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);      // [2, 4, 6, 8]
```

用熟三件套后，你会很少再手写 `for (let i = 0; i < arr.length; i++)`，因为**表达意图**（"每个都变换"、"挑出满足的"）比**描述步骤**（"循环、判断、push"）更清晰、更不容易出错。

## 逐个拆解

### 1. map：一对一变换

`map` 对**每个元素**执行回调，把回调返回值收集成**等长的新数组**。

```javascript
const nums = [1, 2, 3];

// 回调参数：(当前元素, 索引, 原数组)
nums.map((n, index) => `${index}: ${n * 10}`);
// ["0: 10", "1: 20", "2: 30"]

// 典型场景：后端返回的用户对象 → 只取姓名
const users = [{ name: "Alice", age: 18 }, { name: "Bob", age: 20 }];
users.map(u => u.name);   // ["Alice", "Bob"]
```

::: tip map 的黄金法则
map 是"**一对一**"：输入 n 个元素，输出必定 n 个元素。如果你发现 map 里在写 `if` 想"跳过某些"——那应该用 `filter` 或 `flatMap`。
:::

### 2. filter：筛选

`filter` 对每个元素执行回调，回调**返回 `true` 的留下**，组成新数组。

```javascript
const nums = [1, 2, 3, 4, 5, 6];

nums.filter(n => n % 2 === 0);   // [2, 4, 6]（偶数留下）

// 回调返回"真值"即保留，也可用于过滤空值
["a", "", "b", null, "c"].filter(Boolean);  // ["a", "b", "c"]
```

`filter` 不会缩短元素、不会变换元素，只做"留与不留"的筛选。

### 3. reduce：累加折叠

`reduce` 把整个数组**折叠成一个值**（数字、对象、数组都可以），是三者中能力最强、也最难上手的。

```javascript
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, cur) => acc + cur, 0);   // 10
```

- `acc`（accumulator）：**累计器**，上一次回调的返回值
- `cur`：当前元素
- 最后的 `0`：**初始值**

## reduce 的完整执行过程

把求和过程逐步展开，一次性看懂：

```javascript
const nums = [1, 2, 3, 4];
nums.reduce((acc, cur) => acc + cur, 0);

// 第 1 次: acc = 0,  cur = 1  → 返回 1
// 第 2 次: acc = 1,  cur = 2  → 返回 3
// 第 3 次: acc = 3,  cur = 3  → 返回 6
// 第 4 次: acc = 6,  cur = 4  → 返回 10  ← 最终结果
```

`reduce` 像一条**传送带**：每经过一个元素，把"到目前为止的结果"（acc）和当前元素合并，再传给下一站。最终从传送带末尾出来的就是结果。

### reduce 初始值的规则

```javascript
// 不传初始值：acc 取第一个元素，cur 从第二个开始
[1, 2, 3, 4].reduce((acc, cur) => acc + cur);
// 第 1 次: acc = 1, cur = 2 → 3
// 结果依然是 10，但对"求和"这种场景可以省略初始值

// 空数组不传初始值 → 直接报错！
[].reduce((acc, cur) => acc + cur);
// ❌ TypeError: Reduce of empty array with no initial value
```

::: danger reduce 空数组报错
**空数组 + 不传初始值 = 运行时错误**。所以处理"可能为空的数组"时，**永远传初始值**。而且传了初始值后语义更稳定（空数组也能正常返回初始值），建议养成传初始值的习惯。
:::

## 链式组合

三件套可以像流水线一样**串联**，每个环节只做一件事：

```javascript
const nums = [1, 2, 3, 4, 5, 6];

// 需求：取所有偶数 → 翻倍 → 求和
const result = nums
  .filter(n => n % 2 === 0)   // [2, 4, 6]
  .map(n => n * 2)            // [4, 8, 12]
  .reduce((a, b) => a + b, 0);// 24
```

::: tip 链式执行顺序
链式是**从左到右逐段执行**的：`filter` 先算出完整结果，再整体交给 `map`。每一步都返回新数组，所以每一步的结果都可以单独打印验证——这是链式代码好调试的原因。
:::

## map vs forEach 对比

很多人分不清 `map` 和 `forEach`，记住一句话：**map 有产出，forEach 没有**。

| 对比 | `map` | `forEach` |
| --- | --- | --- |
| 返回值 | 新数组（可链式） | `undefined` |
| 用途 | **变换数据**（产出新数组） | 遍历执行副作用（打印、写日志、改外部变量） |
| 是否改变原数组 | 否（回调里自己改除外） | 否 |
| 能否 break / return | 不能 | 不能 |

```javascript
// ✅ 想要新数组 → map
const names = users.map(u => u.name);

// ✅ 只做动作 → forEach
items.forEach(item => console.log(item.id));

// ❌ 反例：map 的返回值不用，就是浪费
nums.map(n => console.log(n));   // 该用 forEach
```

::: warning map 返回值必须用
回调里没有 `return` 时，`map` 会产出充满 `undefined` 的数组。**"map 的返回值不用就是浪费"**——只遍历请用 `forEach`。
:::

## 常见坑点

- `map` / `filter` 回调**忘记 `return`** → map 得到全 `undefined`，filter 得到空数组
- 空数组不传初始值调 `reduce` → TypeError，**永远传初始值**
- `filter(Boolean)` 会同时过滤掉 `0` / `""` / `false`，注意 `0` 是否是你需要的合法值
- 三件套都不改原数组，但**回调里对元素做 `arr[i].x = 1` 会改到原对象**（对象是引用传递）

## 小结

- `map` 一对一变换、`filter` 筛选保留、`reduce` 折叠成一个值
- `reduce` 不传初始值时空数组报错；执行过程是"传送带"式逐步累积
- 链式组合让数据流清晰：`filter → map → reduce` 是万能模板
- `map` 有产出可链式，`forEach` 只做动作——别混用

::: tip 速查卡片
三件套更多用法与组合模板，见 [数组方法速查](/cheatsheet/data/array-unique)。
:::
