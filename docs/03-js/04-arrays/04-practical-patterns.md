---
title: 04.4 实战模式
---

# 实战模式：去重 / 分组 / 扁平化

## 它是什么

前几页学的是数组的**零件**，这一页把它们**组装成日常开发中最常用的小工具**：数组去重、对象数组按字段去重、分组、扁平化。这些模式在面试和工作中反复出现，**背熟模板 + 理解原理**，遇到就能秒写。

## 数组去重

### 方式一：Set（最推荐）

`Set` 天然"不允许重复"，把数组丢进去再展开回来即可：

```javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];   // [1, 2, 3]

// 一行版
const dedupe = arr => [...new Set(arr)];
```

::: tip Set 的判等规则
`Set` 内部用 `SameValueZero` 判等（类似 `===`），所以 `NaN` 也能正确去重（`NaN === NaN` 是 false，但 Set 认为相等）。这是 `filter + indexOf` 方案做不到的。
:::

### 方式二：filter + indexOf（理解原理）

```javascript
const arr = [1, 2, 2, 3];
const unique = arr.filter((v, i) => arr.indexOf(v) === i);
// indexOf 返回"第一次出现"的位置，只有第一次出现时位置才等于当前索引
// [1, 2, 3]
```

**执行过程**：遍历到第二个 `2` 时，`indexOf(2)` 是 1，而当前索引是 2，`1 !== 2` → 被过滤掉。

::: warning 两种方式的适用性
`Set` 对数字、字符串、`NaN` 都好用；`filter + indexOf` 处理的是"值比较"，**无法去重对象**（两个内容相同的对象 `===` 不相等）。对象去重请看下一节。
:::

## 对象数组按字段去重（Map）

按对象的某个字段（如 `id`）去重，用 **`Map` 以字段为键**：

```javascript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Carol" },   // 与第一条 id 重复
];

const unique = [...new Map(users.map(u => [u.id, u])).values()];
// 结果保留每个 id 的"最后一条"：[{id:2},{id:1,name:"Carol"}]

// 拆开看每一步：
const pairs = users.map(u => [u.id, u]);   // [[1,{...}],[2,{...}],[1,{...}]]
const map = new Map(pairs);                // Map 键重复时后写覆盖先写
const result = [...map.values()];          // 只取值
```

::: tip 想保留"第一条"怎么办
用 `Map` 配合 `reduce`，重复的键不覆盖即可：

```javascript
const first = users.reduce((map, u) => {
  if (!map.has(u.id)) map.set(u.id, u);    // 只放第一条
  return map;
}, new Map());
[...first.values()];
```
:::

## 分组（reduce）

把数组按某个字段**分成几组**，是报表、图表、分类展示的常见需求。用 `reduce` 累积一个"组名 → 数组"的对象：

```javascript
const people = [
  { gender: "男", name: "A" },
  { gender: "女", name: "B" },
  { gender: "男", name: "C" },
];

const grouped = people.reduce((acc, p) => {
  (acc[p.gender] ||= []).push(p);   // ||= ：该组不存在就先用空数组
  return acc;
}, {});
// { 男: [{gender:'男',name:'A'},{gender:'男',name:'C'}], 女: [{gender:'女',name:'B'}] }
```

**执行过程**：第一次遇到"男"时 `acc["男"]` 是 `undefined`，`||=` 把它补成 `[]` 再 `push`；之后每次遇到"男"都往同一个数组里追加。

::: tip 分组模板（可复用）
把上面的逻辑封装成 `function groupBy(list, keyFn) { ... }`，用 `keyFn(item)` 取分组键，就能对任意数据按字段分组——统计报表、分类展示都能直接用。
:::

## 扁平化：flat / flatMap

### flat：展平嵌套数组

```javascript
[1, [2, [3]]].flat();          // [1, 2, [3]]  默认只展 1 层
[1, [2, [3]]].flat(2);         // [1, 2, 3]    展 2 层
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]  全展平
```

### flatMap：先 map 再 flat(1)

`flatMap` 在回调里**返回数组**，会自动把返回的数组展开一层：

```javascript
// 场景：每个单词拆成字母
["hi", "ok"].flatMap(w => w.split(""));   // ["h","i","o","k"]

// 场景：条件性展开——返回 [] 就相当于"跳过"
[1, 2, 3].flatMap(n => (n % 2 === 0 ? [n * 10] : []));
// [20]（奇数返回空数组被丢弃，偶数翻倍）
```

::: tip flatMap 替代 map + filter 组合
"既要变换又要过滤"时，`flatMap` 常常比 `map(...).filter(...)` 更直观：返回 `[]` 即过滤，返回 `[x]` 即保留并变换。
:::

## 常用操作组合模板

把前面所有模式串起来，三个高频"一站式"模板：

```javascript
// ① 数据清洗：去空值 → 翻倍 → 求和
const raw = [1, "", 2, null, 3];
raw.filter(Boolean).map(n => n * 2).reduce((a, b) => a + b, 0);  // 12

// ② 统计：按状态分组后统计每组数量
const orders = [
  { status: "done", amount: 10 },
  { status: "pending", amount: 5 },
  { status: "done", amount: 20 },
];
const stats = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;   // 计数
  acc[o.status + "Sum"] = (acc[o.status + "Sum"] || 0) + o.amount;  // 求和
  return acc;
}, {});
// { done: 2, doneSum: 30, pending: 1, pendingSum: 5 }

// ③ 列表转字典：把 id 数组转成"id → 元素"的 Map（查表 O(1)）
const idMap = new Map(users.map(u => [u.id, u]));
idMap.get(2);   // { id: 2, name: "Bob" }
```

::: tip 查表思维
频繁按 `id` 找元素时，先 `new Map(users.map(u => [u.id, u]))` 转成"字典"，查找从 O(n) 变 O(1)，数据量大时性能差异明显。
:::

## 常见坑点

- 去重对象用 `Set` **无效**（对象引用各不相同），必须按字段用 `Map`
- `new Map(pairs)` 键重复时**后者覆盖前者**，想保留第一条要改用 `reduce` + `has` 判断
- `flat()` 默认只展一层，深层嵌套要传层数或 `Infinity`
- `flatMap` 只会展开**一层**，回调返回的数组里再有数组不会继续展平
- 分组时**必须返回 `acc`**，`reduce` 回调忘 return 会导致分组结果为 `undefined`

## 小结

- 去重：简单值用 `[...new Set(arr)]`；对象按字段用 `[...new Map(...).values()]`
- 分组：`reduce` + `(acc[key] ||= []).push(item)`，一行核心逻辑
- 扁平化：`flat(n)` 展平，`flatMap` 一边变换一边展开（可兼作过滤）
- 组合模板：`filter → map → reduce` 清洗数据；`Map` 建索引查表

::: tip 速查卡片
去重 / 分组 / 扁平化模板完整速查，见 [数组方法速查](/cheatsheet/data/array-unique)。
:::
