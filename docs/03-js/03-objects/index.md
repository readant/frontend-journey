---
title: 03. 对象与原型
---

# 对象、原型链与 class

欢迎来到 JavaScript 的第三章！前两章我们学会了"存数据"和"打包动作"；这一章把两者合起来：**用对象组织数据**，再用**原型链**理解 JS 独特的继承方式，最后学会安全地复制对象。

JavaScript 的对象是**无序键值对集合**，几乎所有"非原始类型"的东西都是对象——数组、函数、日期、正则都是对象。但对象真正的精髓不是"键值对"，而是**原型（Prototype）机制**：对象之间通过隐藏的 `[[Prototype]]` 链接共享属性，这就是继承在 JS 中的实现方式。

```javascript
// 对象：键值对 + 方法
const user = {
  name: "Alice",
  age: 25,
  greet() { return `Hi, I'm ${this.name}`; },
};
```

## 本章路线

本章拆成 4 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [对象创建与属性](/03-js/03-objects/01-create-objects) | 字面量 / Object.create / 构造函数三种创建方式、属性增删改查与遍历、不可变性 |
| 2 | [原型链](/03-js/03-objects/02-prototype-chain) | `[[Prototype]]` 向上查找、new 的四步原理、instanceof、原型验证与 for...in 的坑 |
| 3 | [class 语法](/03-js/03-objects/03-class-syntax) | 语法糖本质、constructor/实例方法/静态方法、extends 继承、super 规则与多态 |
| 4 | [深浅拷贝](/03-js/03-objects/04-copy-objects) | 引用与共享的原理、浅拷贝/深拷贝、structuredClone、JSON 深拷贝的三个坑 |

## 学完你将能

- 用三种方式创建对象，熟练操作属性（增删改查、动态键名、判断存在性）
- 画出任意对象到 `Object.prototype` 的原型链，并解释 `new` 的四步原理
- 用 `class` + `extends` 写出继承结构，并遵守"先 super 再 this"的规则
- 分清深浅拷贝，遇到嵌套对象复制不再"改一个动一片"
- 避开 `for...in` 遍历继承属性、JSON 深拷贝丢数据等经典坑点

## 学习建议

- 每页代码都**亲手在浏览器控制台跑一遍**（F12 → Console），理解 > 记忆
- 原型链和 `new` 是 JS 面试的"必考题"，多画几次链式图就会了
- 第 3 页的 class 与第 2 页的原型链是同一件事的两种写法，对照着学效率最高
- 学完记得翻到「关联速查」卡片，开发时随手查阅

## 关联速查

::: tip 速查卡片
对象创建、原型方法、拷贝模板速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::

::: info 延伸阅读
原型链的规范细节，见 [MDN - 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)。
:::
