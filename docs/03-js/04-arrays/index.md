---
title: 04. 数组与方法
---

# 数组、类数组与迭代器

欢迎来到数组这一章！数组是 JS 里**最高频使用的数据结构**——后端返回的列表、前端渲染的表格、购物车里的商品，全是数组。数组的方法极多，但真正常用的就那十几个，把这十几个用熟，日常开发基本畅通无阻。

数组（`Array`）是**有序元素的集合**，本质是一个特殊对象——键是数字索引，自带 `length` 属性。它自带大量内置方法，其中 `map` / `filter` / `reduce` 是**函数式编程**的核心三件套，几乎取代了手写 for 循环。

```javascript
const fruits = ["苹果", "香蕉", "橙子"];
console.log(fruits[0]);     // "苹果"（索引从 0 开始）
console.log(fruits.length); // 3
```

## 本章路线

本章拆成 4 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [数组增删改查](/03-js/04-arrays/01-basic-operations) | 数组的本质、会改原数组 vs 不改原数组的方法、`sort` 数字排序坑、查找与判断 API |
| 2 | [map / filter / reduce](/03-js/04-arrays/02-higher-order) | 函数式三件套逐个详解、`reduce` 执行过程与初始值规则、链式组合 |
| 3 | [遍历与迭代](/03-js/04-arrays/03-iteration) | `forEach` / `for...of` / `for...in` 对比、稀疏数组、类数组转真数组、迭代器协议 |
| 4 | [实战模式](/03-js/04-arrays/04-practical-patterns) | 去重、对象数组去重、分组、扁平化、常用操作组合模板 |

## 学完你将能

- 一眼分清哪个方法**会改原数组**、哪个**返回新数组**
- 用 `map` / `filter` / `reduce` 写出简洁优雅的数据变换，告别手写 for 循环
- 手写一个可被 `for...of` 遍历的自定义迭代器
- 正确把 `arguments` / `NodeList` 等类数组转成真数组
- 避开 `sort` 数字排序、稀疏数组 `map` 跳过空洞等经典陷阱

## 学习建议

- 每页代码都**亲手在浏览器控制台跑一遍**（F12 → Console），并试着改参数观察输出
- 第 1、2 页是面试和开发的绝对高频，务必吃透；第 3、4 页偏进阶，理解为主
- 学完记得翻到「关联速查」卡片，开发时随手查阅方法签名

## 关联速查

::: tip 速查卡片
数组方法分类表、去重/分组/扁平化模板，见 [数组方法速查](/cheatsheet/data/array-unique)。
:::

::: info 延伸阅读
迭代协议规范，见 [MDN - 迭代器与生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators)。
:::
