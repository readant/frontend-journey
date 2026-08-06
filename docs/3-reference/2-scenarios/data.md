---
title: 数据处理场景速查
---

# 数据处理场景速查

## 一句话定位

「我要对数组/对象做增删改查、转换、统计」—— 所有数据加工需求从这里出发。

## 核心解法

数据处理四板斧对照如下，完整原理见 📖 [JS 数组手册](/3-reference/1-handbook/js/array) 与 [对象手册](/3-reference/1-handbook/js/object)。

## 速查摘要

### 数组

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **列表筛选** | `filter` | `arr.filter(x => x.price > 100)` |
| **逐个转换** | `map` | `arr.map(x => ({ ...x, total: x.price * x.count }))` |
| **累计统计**（求和/最大值） | `reduce` | `arr.reduce((sum, x) => sum + x.price, 0)` |
| **查找第一个匹配** | `find` | `arr.find(x => x.id === 3)` |
| **判断是否包含/满足** | `some` / `every` | `arr.some(x => x.age > 18)` |
| **去重** | `Set` | `[...new Set(arr)]` |
| **排序** | `sort` | `arr.slice().sort((a, b) => a.price - b.price)`（不改原数组） |
| **按字段分组** | `reduce` | `arr.reduce((g, x) => ((g[x.type] ??= []).push(x), g), {})` |
| **取前 N 条 / 分页** | `slice` | `arr.slice(0, 10)` / `arr.slice(page * size, (page + 1) * size)` |
| **扁平化** | `flat` / `flatMap` | `arr.flat(Infinity)`、`arr.flatMap(x => x.items)` |

### 对象

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **拷贝一份再改**（不污染原数据） | 展开符 | `{ ...obj, name: "新值" }` |
| **合并多个对象** | `Object.assign` / 展开 | `Object.assign({}, a, b)` |
| **取全部键/值** | `keys` / `values` / `entries` | `Object.entries(obj)` → 可直接遍历 |
| **判断有无某键** | `in` / `hasOwn` | `"name" in obj`（含原型） / `Object.hasOwn(obj, "name")` |
| **安全读取深层值** | 可选链 | `user?.profile?.name ?? "默认值"` |

## 完整阅读

📖 手册章节：

- [JS 数组（增删改查 / map-filter-reduce / 遍历迭代）](/3-reference/1-handbook/js/array)
- [JS 对象与原型（对象操作 / class / 深浅拷贝）](/3-reference/1-handbook/js/object)
- [JS 变量与类型（类型转换）](/3-reference/1-handbook/js/variables)

## 相关代码

📦 代码骨架（建设中）：防抖节流、深拷贝、按字段分组等完整片段将收录于 [代码骨架](/3-reference/) 区。

## 选型口诀

> **map 变身，filter 挑人，reduce 算总账，find 找第一个，Set 去重，slice 分页。**

## 相关

- 🔍 相邻场景：[异步场景](/3-reference/2-scenarios/async)、[事件场景](/3-reference/2-scenarios/event)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
