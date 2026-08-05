---
title: 04.3 遍历与迭代
---

# 遍历与迭代：for...of 与迭代器协议

## 它是什么

**遍历**就是"把数组里的每个元素过一遍"。JS 提供了多种遍历方式：`forEach`、`for...of`、`for...in`、普通 for 循环……它们看起来都能"循环"，但**适用场景和底层机制完全不同**。这一页讲清楚它们的区别，并揭开 `for...of` 背后的**迭代器协议**——这是面试高频，也是理解 `展开运算符`、`Array.from` 的关键。

## forEach 与 for...of、for...in 的对比

```javascript
const arr = ["a", "b", "c"];

// forEach：数组方法，回调式，不能 break / continue / return
arr.forEach((item, index) => console.log(index, item));

// for...of：迭代器遍历，取"值"，可以 break / continue
for (const item of arr) {
  if (item === "b") break;   // ✅ 可中断
  console.log(item);         // "a"
}

// for...in：遍历"键"（枚举属性），数组上别用！
for (const key in arr) {
  console.log(key);          // "0" "1" "2"（字符串索引）
}
```

| 方式 | 遍历出 | 可 break / continue | 适用 |
| --- | --- | --- | --- |
| `forEach` | 值（回调参数） | ❌ | 数组简单遍历（不中断） |
| `for...of` | 值 | ✅ | 数组、字符串、Set、Map 等**可迭代对象** |
| `for...in` | **键**（字符串） | ✅ | 遍历**对象属性**（数组上慎用） |
| 普通 for | 索引 | ✅ | 需要索引且要中断的场合 |

::: warning 别用 for...in 遍历数组
`for...in` 遍历的是**可枚举属性名**，数组上会得到字符串索引，且**可能把原型链上扩展的属性也列出来**，顺序还不保证。数组遍历请用 `forEach` 或 `for...of`。
:::

## 稀疏数组陷阱

稀疏数组（有"空洞"的数组）在不同遍历方式下行为**不一致**，这是经典陷阱：

```javascript
const sparse = [1, , 3];        // 中间是空洞（不是 undefined，是"不存在"）

sparse.map(x => x * 2);         // [2, 空, 6]   ← map 跳过空洞，空洞被保留
sparse.filter(x => x > 0);      // [1, 3]       ← filter 跳过空洞
sparse.forEach(x => console.log(x)); // 只打印 1 和 3（空洞不执行回调）

for (const v of sparse) console.log(v);  // 1, undefined, 3（for...of 把空洞当 undefined 遍历）
```

::: tip 如何制造空洞
`const arr = []; arr[100] = "x";` 就会得到一个长度 101、前 99 个都是空洞的数组。日常代码里**别主动制造稀疏数组**，它只会带来意外。
:::

## 类数组（Array-Like）

**有 `length` 和数字索引、但没有数组方法**的对象叫类数组：

```javascript
// 典型类数组 ①：arguments（函数内）
function demo() {
  console.log(arguments.length);   // 3
  // arguments.map(...)            // ❌ 没有 map 方法！
}
demo(1, 2, 3);

// 典型类数组 ②：NodeList（DOM 查询结果）
document.querySelectorAll("div");  // 类数组，没有 push 等数组方法

// 典型类数组 ③：字符串（可索引 + 有 length）
"hello"[1];   // "e"
```

::: tip 类数组的根源
类数组的根源就是 04.1 节说的"数组是对象"——一个普通对象只要满足"数字键 + `length`"，就长得像数组。但它**没有继承 `Array.prototype`**，所以没有 `map` / `filter` 等方法。
:::

### 转真数组的三种方式

```javascript
const nodeList = document.querySelectorAll("div");

// 方式一：Array.from（推荐，还支持第二个参数做映射）
const arr1 = Array.from(nodeList);
const texts = Array.from(nodeList, el => el.textContent);  // 边转边取

// 方式二：展开运算符
const arr2 = [...nodeList];

// 方式三：老式 slice 借用
const arr3 = Array.prototype.slice.call(nodeList);
```

::: tip 现代推荐
新代码用 `Array.from` 或 `[...x]`。`arguments` 在现代 JS 里已被 **rest 参数**取代——`function demo(...args)` 拿到的 `args` 直接是真数组，`.map` 等数组方法随手可用。
:::

## 迭代器协议：for...of 的本质

`for...of` 能遍历数组、字符串、Set、Map……是因为它们都实现了 **可迭代协议**：

- **可迭代对象（iterable）**：有 `Symbol.iterator` 方法的对象
- **迭代器（iterator）**：`Symbol.iterator()` 返回的对象，带 `next()` 方法，`next()` 返回 `{ value, done }`

```javascript
const arr = ["a", "b"];
const it = arr[Symbol.iterator]();   // 拿到迭代器

it.next();   // { value: "a", done: false }
it.next();   // { value: "b", done: false }
it.next();   // { value: undefined, done: true }  ← done 为 true 表示遍历结束
```

**`for...of` 的底层本质**：反复调用 `next()`，直到 `done` 为 `true`：

```javascript
// for...of 展开后的等价逻辑
const it2 = arr[Symbol.iterator]();
let step;
while (!(step = it2.next()).done) {
  console.log(step.value);   // "a" "b"
}
```

::: tip 一句话
`for...of`、`展开运算符 [...]`、`Array.from` 三者的共同前提都是**可迭代对象**——它们都在内部调用 `Symbol.iterator()`。这也解释了为什么 `[...nodeList]` 能用而 `[...arguments]` 在旧环境不行（旧环境没实现迭代器）。
:::

## 手写 range 迭代器

理解协议后，我们可以让**任何对象**变得可迭代。下面手写一个 `range(1, 3)`，让它能被 `for...of` 遍历：

```javascript
function range(start, end) {
  return {
    [Symbol.iterator]() {          // 返回迭代器
      let current = start;
      return {
        next() {                   // 迭代器的核心：每次产出下一个值
          return current <= end
            ? { value: current++, done: false }
            : { value: undefined, done: true };
        },
      };
    },
  };
}

for (const n of range(1, 3)) console.log(n);  // 1 2 3
console.log([...range(1, 3)]);                // [1, 2, 3]（展开也走迭代器）
```

**关键点**：迭代器要"记住自己走到哪了"（闭包里的 `current`）；`next()` 既要给值，也要用 `done` 告诉消费者"还有没有下一个"。

## 常见坑点

- `forEach` 里 `return` / `break` **不会中断遍历**，想中断用 `for...of` + `break`
- `for...in` 拿到的是**字符串键**而不是值，数组上几乎永远是错误选择
- 稀疏数组的 `map` 会**保留空洞**，结果数组里可能出现"空气"
- 类数组**没有** `map` / `push` 等方法，先转真数组（`Array.from`）再用
- 自己写的迭代器如果忘记返回 `{ done: true }`，`for...of` 会无限循环

## 小结

- 数组遍历：`forEach`（不可中断）/ `for...of`（可中断，取值）/ 普通 for（要索引）
- `for...in` 遍历键，留给对象；稀疏数组行为不一，别主动制造
- 类数组转真数组：`Array.from`（推荐）> `[...x]` > `slice.call`
- 迭代器协议 = `Symbol.iterator()` + `next()` 返回 `{ value, done }`，`for...of` 本质就是循环调 `next()`

::: tip 速查卡片
数组方法分类表与迭代相关模板，见 [数组方法速查](/cheatsheet/data/array-unique)。
:::
