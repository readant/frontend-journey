---
title: 数组方法速查
---

# 数组方法速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 一对一变换 | `map`（返回新数组） |
| 筛选 | `filter` |
| 累加/分组/计数 | `reduce` |
| 找元素/索引 | `find` / `findIndex` / `indexOf` |
| 判断存在 | `includes` / `some` / `every` |
| 去重 | `[...new Set(arr)]` |
| 类数组转真数组 | `Array.from()` / `[...]` |
| 展平嵌套 | `flat(Infinity)` / `flatMap` |

## 核心代码

```javascript
const nums = [1, 2, 3, 4];

// 三件套
nums.map(n => n * 2);                     // [2,4,6,8]
nums.filter(n => n % 2 === 0);            // [2,4]
nums.reduce((acc, n) => acc + n, 0);      // 10

// 查找
nums.find(n => n > 2);        // 3（第一个满足）
nums.findIndex(n => n > 2);   // 2
nums.includes(2);             // true
nums.some(n => n > 3);        // true
nums.every(n => n > 0);       // true

// 去重
[...new Set([1, 2, 2, 3])];               // [1,2,3]
// 对象按 id 去重
[...new Map(users.map(u => [u.id, u])).values()];

// 展平
[1, [2, [3]]].flat(2);        // [1,2,3]

// 类数组 → 真数组
Array.from(document.querySelectorAll("div"));
[...document.querySelectorAll("div")];

// 排序（必须传比较函数）
[10, 9, 100].sort((a, b) => a - b);   // [9,10,100]

// 分组
const grouped = people.reduce((acc, p) => {
  (acc[p.g] ??= []).push(p);
  return acc;
}, {});
```

## 踩坑记录

- **`sort()` 默认按字符串排序**：`[10, 9, 100].sort()` → `[10, 100, 9]`；数字排序必须传 `(a,b) => a - b`
- **`map` 跳过稀疏数组的空洞**：`[1, , 3].map(x => x*2)` → `[2, 空, 6]`；`forEach` 直接跳过
- **`reduce` 不传初始值时空数组报错**：`Reduce of empty array with no initial value`；空数组也要传 `0` 初始值
- **`indexOf` 找不到返回 -1**：判断存在优先 `includes`（语义清晰）
- **`map` 用于副作用是浪费**：只遍历做操作用 `forEach`
- **`Array.from(arrayLike)` 才完整**：`slice.call` 老写法对新式可迭代对象（Set/Map）无效
- **`flat` 默认只展平一层**：深层嵌套用 `flat(Infinity)`
