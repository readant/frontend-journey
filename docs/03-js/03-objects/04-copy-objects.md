---
title: 03.4 深浅拷贝
---

# 深浅拷贝：复制还是共享？

## 它是什么

对象是**引用类型**：变量里存的不是对象本身，而是对象的"地址"。所以 `const b = a` 并不是复制——`a` 和 `b` 指向**同一个对象**，改一个，另一个也跟着变。这就是为什么需要"拷贝"。

生活化比喻：引用像**门牌号**。把门牌号抄一份给别人（`b = a`），两人去敲的还是同一扇门。拷贝则是**重新盖一栋一样的房子**——住址独立了，但"里面还住着同一户人"（嵌套对象）就是浅拷贝，连住户也搬家了才是深拷贝。

```javascript
const a = { name: "Alice" };
const b = a;            // 只是复制门牌号
b.name = "Bob";
console.log(a.name);    // "Bob" —— 改的是同一个对象！
```

## 浅拷贝：只复制第一层

**浅拷贝（Shallow Copy）**复制了第一层属性，但**嵌套对象仍然是同一个引用**。两种写法：

```javascript
const original = { a: 1, nested: { b: 2 } };

const copy1 = { ...original };           // 展开运算符
const copy2 = Object.assign({}, original); // assign

copy1.a = 100;
console.log(original.a);     // 1  ✅ 第一层独立了

copy1.nested.b = 99;
console.log(original.nested.b);  // 99  ❌ 嵌套对象还是共享的！
```

::: danger 为什么第一层独立、嵌套还共享
`{ ...original }` 只是把 `original` 的每个**键值**抄到新对象里。值 `nested` 本身是个"地址"，抄过来的还是同一个地址——所以新对象和原对象的 `nested` 指向同一个嵌套对象。
:::

### 数组的浅拷贝同理

```javascript
const arr = [1, [2, 3]];
const arrCopy = [...arr];          // 或 arr.slice()
arrCopy[0] = 99;
console.log(arr[0]);               // 1 ✅ 第一层独立
arrCopy[1].push(4);
console.log(arr[1]);               // [2, 3, 4] ❌ 嵌套数组仍共享
```

## 深拷贝：彻底独立

**深拷贝（Deep Copy）**递归复制所有层级，嵌套对象也各自独立。首选现代浏览器原生的 **`structuredClone`**：

```javascript
const original = { a: 1, nested: { b: 2 }, date: new Date(), arr: [1, 2] };

const deep = structuredClone(original);
deep.nested.b = 999;
deep.date.setFullYear(2000);
deep.arr.push(3);

console.log(original.nested.b);   // 2    ✅ 完全独立
console.log(original.date);       // 原日期不变 ✅
console.log(original.arr);        // [1, 2] ✅
```

`structuredClone` 支持 Date、Map、Set、TypedArray 等绝大多数内置类型，且**支持循环引用**——是目前最省心的深拷贝方案。

## JSON 深拷贝：三个坑

老方案 `JSON.parse(JSON.stringify(obj))` 也能深拷贝，但**坑很多**，务必知道：

```javascript
const original = {
  name: "Alice",
  fn: function () {},          // ① 函数
  undef: undefined,            // ① undefined
  sym: Symbol("s"),            // ① Symbol
  date: new Date(),            // ② Date
  reg: /abc/g,                 // ② RegExp
};
original.self = original;      // ③ 循环引用！

JSON.parse(JSON.stringify(original));
// ① 丢失：fn / undef / sym 直接消失（键都没了）
// ② 变形：date 变成字符串 "2026-..."；reg 变成空对象 {}
// ③ 报错：Uncaught TypeError: Converting circular structure to JSON
```

::: danger 三个坑速记
1. **丢失** `undefined`、`function`、`Symbol`（直接消失）
2. **变形** `Date` → 字符串、`RegExp` → `{}`、`NaN/Infinity` → `null`
3. **报错** 循环引用 → `TypeError`

有以上任意一种情况，必须用 `structuredClone`（或 lodash 的 `cloneDeep`）。
:::

## 场景判断：什么时候用哪种

```javascript
// 只要第一层独立、数据全是原始值 → 浅拷贝够用
const config = { theme: "dark", size: 14 };
const nextConfig = { ...config };        // 浅拷贝即可

// 有嵌套对象/数组、需要彻底独立 → 深拷贝
const state = { user: { name: "A", tags: ["a"] } };
const copy = structuredClone(state);     // 深拷贝

// 纯 JSON 数据（无函数/日期/循环引用）→ 三个方案都能用，按性能/兼容选
```

::: tip 兼容性提示
`structuredClone` 在较新的浏览器和 Node 17+ 原生支持。老环境可用 lodash 的 `cloneDeep`，或手写递归（注意处理数组、循环引用，别在面试里翻车）。
:::

## 常见坑点

- `const b = a` 不是拷贝，是**共享引用**——先问自己"要不要独立"
- 浅拷贝对嵌套对象的修改会"穿透"：改了副本，原对象跟着变
- `Object.assign` 与展开运算符在**浅拷贝**层面完全等价
- JSON 深拷贝对 `Date`、`function`、`undefined`、循环引用全部不可用
- 函数内部拷贝对象时，`structuredClone` 不能克隆**函数**和 DOM 节点——函数本来就该共享

## 小结

- 引用类型赋值的不是内容，是地址；拷贝才能产生独立对象
- 浅拷贝（展开/assign）只复制第一层，嵌套对象仍共享
- 深拷贝用 `structuredClone`，彻底递归独立
- `JSON.parse(JSON.stringify())` 有三个坑：丢 undefined/function/Symbol、Date 变字符串、循环引用报错

::: tip 速查卡片
深浅拷贝模板与 JSON 坑点速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::
