---
title: JS 数组完整手册
---

# JS 数组

## 核心概念

数组 = 有序列表，配套一套「遍历、变换、筛选、聚合」的方法族 —— 处理列表数据的标准答案。

## 完整内容

### 是什么 / 为什么

数组存「一组数据」，本身是对象的一种。核心心智模型：**方法分两类**——修改原数组的（变异）与返回新数组的（纯函数，推荐）。纯函数方法配合链式调用是数据处理的现代范式。

### 一、创建与基础操作

```javascript
const arr = [1, 2, 3];
const arr2 = Array.from({ length: 5 }, (_, i) => i);  // [0,1,2,3,4]
const arr3 = Array.of(1, 2, 3);

// 增删（变异方法）
arr.push(4);        // 尾部加 → [1,2,3,4]
arr.pop();          // 尾部删
arr.unshift(0);     // 头部加
arr.shift();        // 头部删
arr.splice(1, 1);   // 从下标 1 删 1 个
arr.splice(1, 0, "x"); // 在下标 1 插入

// 拼接与截取（纯函数）
const merged = arr.concat([4, 5]);   // 返回新数组
const slice = arr.slice(1, 3);       // 截取 [1,3)，不改原数组
```

### 二、核心高阶方法（重点）

| 方法 | 作用 | 返回 | 是否改原数组 |
| :--- | :--- | :--- | :--- |
| `map` | 每个元素变换 | 新数组（同长度） | ❌ |
| `filter` | 筛选满足条件的 | 新数组（可能变短） | ❌ |
| `reduce` | 逐个累积成单个值 | 任意值 | ❌ |
| `forEach` | 遍历执行副作用 | `undefined` | ❌ |
| `some` | 有一个满足 → true | 布尔 | ❌ |
| `every` | 全部满足 → true | 布尔 | ❌ |
| `find` | 返回第一个满足的元素 | 元素 / undefined | ❌ |
| `findIndex` | 返回第一个满足的下标 | 下标 / -1 | ❌ |
| `includes` | 是否包含某值 | 布尔 | ❌ |
| `flat` / `flatMap` | 数组拍平 / 拍平 + 映射 | 新数组 | ❌ |
| `sort` | 排序（**默认按字符串！**） | 原数组（变异） | ✅ |
| `reverse` | 反转 | 原数组（变异） | ✅ |

```javascript
const nums = [1, 2, 3, 4];

nums.map((n) => n * 2);          // [2,4,6,8]
nums.filter((n) => n % 2 === 0); // [2,4]
nums.reduce((sum, n) => sum + n, 0); // 10
nums.find((n) => n > 2);         // 3
nums.some((n) => n > 3);         // true
nums.every((n) => n > 0);        // true
```

### 三、reduce 的经典应用

```javascript
// 求和
const sum = arr.reduce((acc, cur) => acc + cur, 0);

// 分组
const grouped = users.reduce((acc, u) => {
  (acc[u.city] ||= []).push(u);   // 按城市分组
  return acc;
}, {});

// 扁平化
const flat = [[1, 2], [3]].reduce((acc, cur) => acc.concat(cur), []);

// 去重
const uniq = [...new Set([1, 1, 2, 3, 3])];
```

### 四、排序与遍历

```javascript
// 数字排序必须传比较函数（默认按字符串排，10 会排在 2 前面）
[3, 10, 1].sort();                 // [1, 10, 3] ❌
[3, 10, 1].sort((a, b) => a - b);  // [1, 3, 10] ✓ 升序
[3, 10, 1].sort((a, b) => b - a);  // [10, 3, 1] ✓ 降序

// 对象按字段排序
users.sort((a, b) => a.age - b.age);

// 遍历拿下标
[1, 2].forEach((v, i) => console.log(i, v));
```

### 语法速查

| 意图 | 方法 | 注意 |
| :--- | :--- | :--- |
| 变换 | `map` | 长度不变 |
| 筛选 | `filter` | 返回新数组 |
| 聚合 | `reduce` | 万能，但别滥用 |
| 查找 | `find` / `findIndex` / `includes` | 找不到：undefined / -1 / false |
| 判断 | `some` / `every` | 布尔 |
| 排序 | `sort((a,b) => a-b)` | 必传比较函数 |
| 增删 | `push/pop/unshift/shift/splice` | 变异，注意引用 |
| 去重 | `[...new Set(arr)]` | 简单去重 |
| 拍平 | `flat(深度)` / `flatMap` | 多维数组 |
| 截取 | `slice(开始, 结束)` | 左闭右开 |

### 常见用法

**链式数据处理**：

```javascript
const result = users
  .filter((u) => u.age >= 18)
  .map((u) => ({ name: u.name, year: u.age }))
  .sort((a, b) => b.year - a.year);
```

**求和 / 平均 / 最大最小**：

```javascript
const sum = nums.reduce((a, b) => a + b, 0);
const avg = sum / nums.length;
const max = Math.max(...nums);   // 展开运算符
const min = Math.min(...nums);
```

### 注意事项

- ⚠️ `sort()` 不传比较函数就是字符串排序，数字 10 会在 2 前面。
- ⚠️ `map`/`filter` 返回**新数组**，别指望它改原数组；想改原数组要重新赋值或显式变异。
- ⚠️ `forEach` 里 `return` 不能跳出循环，用 `some`/`every`/`for...of`。
- ⚠️ 判断元素是否存在用 `includes`（值）/ `some`（条件），别用 `indexOf > -1` 的老写法。
- ⚠️ `splice` 是变异且下标易错，能 `slice` 就别 `splice`。
- ⚠️ 深层嵌套用 `flat(Infinity)` 一次性拍平。

## 相关

- 🔍 场景索引：[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[对象与原型](/3-reference/1-handbook/js/object)、[运算符](/3-reference/1-handbook/js/operators)
