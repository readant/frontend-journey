---
title: 03.2 原型链
---

# 原型链：对象的"家族谱"

## 它是什么

每个对象都有一个隐藏的 `[[Prototype]]`，可以理解为它的"爸爸"。访问属性时，如果对象**自己身上没有**，就**沿着这条链向上找**，直到最顶层的 `Object.prototype`，再往上就是 `null`（尽头）。这条"爸爸的爸爸的爸爸……"的链条就是**原型链（Prototype Chain）**。

生活化比喻：你问一个问题，自己不会就去问爸爸，爸爸不会就去问爷爷……问到谁都不会就放弃（返回 `undefined`）。**这就是 JS 的继承实现方式**——不是"复制"，而是"向上查找"。

```
user（自身：name, age）
  └─ [[Prototype]] → Person.prototype（共享方法 greet）
       └─ [[Prototype]] → Object.prototype（toString 等通用方法）
            └─ [[Prototype]] → null（尽头）
```

```javascript
const person = { greet() { return "hi"; } };
const user = Object.create(person);   // user 的原型是 person
user.name = "Alice";

console.log(user.name);               // "Alice"（自身属性）
console.log(user.greet());            // "hi"（自身没有，沿原型链找到）
console.log(user.toString());         // "[object Object]"（Object.prototype 上的通用方法）
```

## 核心机制一：构造函数 + new 的四步原理

用构造函数 + `new` 创建对象时，`new` 悄悄做了**四件事**（理解它 = 理解原型链）：

```javascript
function Person(name) {
  this.name = name;            // 3. 执行构造函数，this 指向新对象
}
// 2. 新对象的 [[Prototype]] = Person.prototype
Person.prototype.greet = function () {
  return `Hi, ${this.name}`;
};

const alice = new Person("Alice");
// 1. 创建一个空对象 {}
// 2. 空对象的 [[Prototype]] 指向 Person.prototype
// 3. 执行 Person 函数，this = 这个空对象，给 this.name 赋值
// 4. 返回这个对象（构造函数没显式 return 时）
```

为什么方法要放在 `Person.prototype` 上？因为所有实例**共享**同一个原型对象——方法只存一份，所有实例都能沿原型链找到它，省内存：

```javascript
const alice = new Person("Alice");
const bob   = new Person("Bob");
alice.greet === bob.greet;   // true：同一个方法，不是每人一份副本
```

## 核心机制二：instanceof 的原理

`a instanceof B` 的本质：**沿着 `a` 的原型链向上找，看能不能遇到 `B.prototype`**：

```javascript
alice instanceof Person;    // true（原型链上有 Person.prototype）
alice instanceof Object;    // true（原型链继续向上，有 Object.prototype）
alice instanceof Array;     // false（原型链上找不到 Array.prototype）

// 手工模拟 instanceof 的查找逻辑
function myInstanceof(obj, Ctor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);   // 继续向上
  }
  return false;
}
```

## 原型验证：getPrototypeOf vs __proto__

```javascript
// 标准方式（推荐）：Object.getPrototypeOf
Object.getPrototypeOf(alice) === Person.prototype;   // true

// 老的非标准方式：__proto__（浏览器兼容，但规范不推荐使用）
alice.__proto__ === Person.prototype;                // true

// 查看"构造函数"属性
alice.constructor === Person;                        // true（默认原型上有 constructor 反向引用）
```

::: warning __proto__ 不是标准 API
`__proto__` 只是浏览器提供的便捷访问器，**不推荐在生产代码使用**；读取用 `Object.getPrototypeOf()`，设置用 `Object.setPrototypeOf()`（也很少需要）。
:::

## 核心机制三：for...in 遍历继承属性的坑

```javascript
const parent = { inherited: 1 };
const child = Object.create(parent);
child.own = 2;

for (const key in child) {
  console.log(key);          // "own" 然后 "inherited" —— 继承的属性也被遍历到了！
}

Object.keys(child);          // ["own"]  —— 只返回自身的可枚举属性 ✅
```

::: danger for...in 会遍历继承属性
遍历对象的键请用 `Object.keys()` / `Object.entries()`（只看自身），需要"自身 + 继承"或明确知道在遍历什么时才用 `for...in`。数组中同理，`for...in` 还会把数组方法也列出来，务必用 `for...of`。
:::

## 常见坑点

- 原型链查找是**运行时动态**的：`Person.prototype.greet = ...` 在创建实例**之后**添加，实例依然能访问（查找是"现查"的）
- **修改原型影响所有实例**：给 `Person.prototype` 加属性，所有已创建的实例都能看到
- `Object.create(null)` 的对象**没有原型**，也没有 `toString` 等方法，拼接/打印会报错——做纯字典时才好用
- `instanceof` 跨 iframe / 跨 realm 会失效（不同的全局对象，原型不是同一个），这时用 `Object.prototype.toString.call()` 判断类型更稳
- 不要**手动改 `__proto__`**：会影响所有共享该原型的对象，性能也差

## 小结

- 原型链 = 对象间的 `[[Prototype]]` 链条，属性访问"向上查找"
- `new` 四步：建空对象 → 挂原型 → 执行构造器（this = 新对象）→ 返回对象
- `instanceof` 本质：沿原型链找构造函数的 `prototype`
- 验证原型用 `Object.getPrototypeOf`，别用 `__proto__`
- 遍历用 `Object.keys`，慎用 `for...in`（会带出继承属性）

::: tip 速查卡片
原型链与 new 原理速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::
