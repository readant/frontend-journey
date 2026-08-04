---
title: 04. 数组与方法
---

# 数组、类数组与迭代器

## 它是什么

数组（`Array`）是 JS 中**有序元素的集合**，本质是一个特殊对象——键是数字索引，自带 `length` 属性。它提供了大量内置方法，其中 `map` / `filter` / `reduce` 是**函数式编程**的核心三件套，几乎取代了手写 for 循环。

```javascript
const fruits = ["苹果", "香蕉", "橙子"];
console.log(fruits[0]);    // "苹果"（索引从 0 开始）
console.log(fruits.length);// 3
```

## 核心机制

### 1. 数组是对象：稀疏数组

```javascript
const sparse = [];
sparse[100] = "a";
console.log(sparse.length);   // 101（空洞：中间全是 undefined 但不算值）
sparse[1];                    // undefined

// 稀疏数组陷阱：map 会跳过空洞！
const arr = [1, , 3];         // 中间是空洞
arr.map(x => x * 2);          // [2, 空, 6]  ← 空洞被保留
arr.forEach(x => console.log(x)); // 1, 3（空洞不执行回调）
```

### 2. 类数组（Array-Like）

有 `length` 和数字索引，但**没有数组方法**的对象：

```javascript
// 典型类数组：arguments、NodeList、字符串
function demo() {
  console.log(arguments.length);   // 3
  // arguments.map(...)            // ❌ arguments 没有 map
}
demo(1, 2, 3);

document.querySelectorAll("div"); // NodeList（类数组）
"hello"[1];                        // "e"（字符串也可索引 + length）
```

转成真数组的三种方式：

```javascript
Array.from(nodeList);          // 推荐：真正的数组
[...nodeList];                 // 展开运算符
Array.prototype.slice.call(args); // 老式写法
```

### 3. 迭代协议（Iterator Protocol）

- **可迭代对象（iterable）**：实现了 `Symbol.iterator` 方法（数组、字符串、Map、Set 都是）
- **迭代器（iterator）**：`{ next() { return { value, done } } }`

```javascript
const arr = ["a", "b"];
const it = arr[Symbol.iterator]();  // 拿到迭代器
it.next();   // { value: "a", done: false }
it.next();   // { value: "b", done: false }
it.next();   // { value: undefined, done: true }

// 底层机制：for...of 就是反复调用 next() 直到 done
for (const item of arr) { console.log(item); }
```

## 标准语法

### 增删改查（会改变原数组）

```javascript
const arr = [1, 2, 3];

arr.push(4);          // [1,2,3,4]  末尾加
arr.pop();            // 4          末尾删
arr.unshift(0);       // [0,1,2,3]  头部加
arr.shift();          // 0          头部删
arr.splice(1, 1, 9);  // 从索引1删1个，插入9
arr.sort();           // 排序（默认按字符串！数字排序要传比较函数）
arr.reverse();        // 反转
```

::: warning sort 的数字坑
```javascript
[10, 9, 100].sort();          // [10, 100, 9]  ← 默认按字符串排序！
[10, 9, 100].sort((a, b) => a - b);  // [9, 10, 100] ✅ 必须传比较函数
```
:::

### 查找与判断（不改变原数组）

```javascript
[1, 2, 3].indexOf(2);       // 1（找不到返回 -1）
[1, 2, 3].includes(2);      // true
[1, 2, 3].find(x => x > 1); // 2（返回第一个满足的元素）
[1, 2, 3].findIndex(x => x > 1); // 1
[1, 2, 3].some(x => x > 2); // true（有一个满足即可）
[1, 2, 3].every(x => x > 0);// true（全部满足）
```

### 核心三件套：map / filter / reduce

```javascript
const nums = [1, 2, 3, 4];

// map：一对一变换，返回等长新数组
const doubled = nums.map(n => n * 2);       // [2, 4, 6, 8]

// filter：筛选，返回满足条件的新数组
const evens = nums.filter(n => n % 2 === 0); // [2, 4]

// reduce：累加折叠，返回一个值（或对象/数组）
const sum = nums.reduce((acc, n) => acc + n, 0);  // 10

// 组合：取所有偶数并翻倍求和
const result = nums
  .filter(n => n % 2 === 0)   // [2, 4]
  .map(n => n * 2)            // [4, 8]
  .reduce((a, b) => a + b, 0);// 12
```

### 其他遍历方法

```javascript
// forEach：遍历副作用（不返回值）
arr.forEach((item, index) => console.log(index, item));

// for...of：迭代器遍历（可用 break/continue，比 forEach 灵活）
for (const item of arr) { if (item > 2) break; }

// 扁平化
[1, [2, [3]]].flat(2);        // [1, 2, 3]（flat(Infinity) 全展开）
[1, [2]].flatMap(x => [x, x * 10]); // [1, 10, 2, 20]
```

## 深入理解

### 1. reduce 的完整执行过程

```javascript
const nums = [1, 2, 3, 4];
nums.reduce((acc, cur) => acc + cur, 0);
// 第1次: acc=0,  cur=1 → 1
// 第2次: acc=1,  cur=2 → 3
// 第3次: acc=3,  cur=3 → 6
// 第4次: acc=6,  cur=4 → 10
```

不传初始值时，`acc` 取第一个元素、`cur` 从第二个开始——空数组直接报错 `Reduce of empty array with no initial value`。

### 2. map vs forEach

| 对比 | `map` | `forEach` |
| --- | --- | --- |
| 返回值 | 新数组（可链式） | `undefined` |
| 用途 | **变换数据** | 遍历执行副作用 |
| 是否改变原数组 | 否（回调里改除外） | 否 |

原则：**需要"产出新数组"用 map，只做"遍历动作"用 forEach**。map 的返回值不用就是浪费。

### 3. 不可变操作实战（面试高频）

**数组去重**：

```javascript
// 方式一：Set（最推荐）
[...new Set([1, 2, 2, 3])];       // [1, 2, 3]

// 方式二：filter + indexOf
[1, 2, 2, 3].filter((v, i, arr) => arr.indexOf(v) === i);
```

**对象数组去重（按某字段）**：

```javascript
const users = [{ id: 1, n: "a" }, { id: 2, n: "b" }, { id: 1, n: "c" }];
const unique = [...new Map(users.map(u => [u.id, u])).values()];
// 按 id 去重，保留每个 id 的最后一条
```

**分组（reduce）**：

```javascript
const people = [{ g: "男", n: "A" }, { g: "女", n: "B" }];
const grouped = people.reduce((acc, p) => {
  (acc[p.g] ||= []).push(p);   // ||= 空则赋空数组
  return acc;
}, {});
// { 男: [{g:'男',n:'A'}], 女: [{g:'女',n:'B'}] }
```

### 4. 类数组 → 真数组的时机

- `Array.from(arrayLike)` 还支持映射：`Array.from(nodelist, el => el.textContent)`
- `arguments` 在现代代码中用 **rest 参数**替代：

```javascript
function demo(...args) {
  args.map(...)   // args 是真数组，直接可用
}
```

### 5. 迭代器手写（理解 for...of 本质）

```javascript
function range(start, end) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          return current <= end
            ? { value: current++, done: false }
            : { value: undefined, done: true };
        },
      };
    },
  };
}
for (const n of range(1, 3)) console.log(n);  // 1 2 3
```

## 关联速查

::: tip 速查卡片
数组方法分类表、去重/分组/扁平化模板，见 [数组方法速查](/cheatsheet/data/array-unique)。
:::

::: info 延伸阅读
迭代协议规范，见 [MDN - 迭代器与生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators)。
:::
