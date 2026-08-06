---
title: 事件场景速查
---

# 事件场景速查

## 一句话定位

「我要监听点击/键盘/滚动，并高效响应」—— 所有交互类需求从这里出发。

## 核心解法

事件处理要点对照如下，完整原理见 📖 [JS 事件系统手册](/3-reference/1-handbook/js/event) 与 [DOM 手册](/3-reference/1-handbook/js/dom)。

## 速查摘要

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **监听点击** | `click` | `btn.addEventListener("click", handler)` |
| **监听键盘** | `keydown` | `e.key === "Enter"` 判断（注意 `e.key` 而非 `e.keyCode`） |
| **监听滚动** | `scroll` + 节流 | `window.addEventListener("scroll", throttle(handler, 200))` |
| **表单输入** | `input` | `input.addEventListener("input", ...)`（比 `change` 更实时） |
| **动态列表批量监听** | 事件委托 | 父级 `addEventListener` + `e.target.closest("li")` |
| **表单提交** | `submit` | `form.addEventListener("submit", e => e.preventDefault())` |
| **只触发一次** | `{ once: true }` | `el.addEventListener("click", fn, { once: true })` |
| **移除监听** | `removeEventListener` | 必须引用**同一个函数**才能移除 |
| **阻止默认行为** | `preventDefault` | 阻止跳转/刷新（`a` 链接、表单提交） |
| **阻止冒泡** | `stopPropagation` | 阻止事件传给父级（谨慎，可能误伤委托） |

## 完整阅读

📖 手册章节：

- [JS 事件系统（事件流 / 监听 / 事件委托）](/3-reference/1-handbook/js/event)
- [JS DOM 操作（查询 / 增删改节点）](/3-reference/1-handbook/js/dom)

## 相关代码

📦 代码骨架（建设中）：事件委托、防抖节流、滚动加载等完整片段将收录于 [代码骨架](/3-reference/) 区。

## 选型口诀

> **加监听用 addEventListener，动态元素用委托，submit 记得 preventDefault，移除监听要同一个函数。**

## 相关

- 🔍 相邻场景：[异步场景](/3-reference/2-scenarios/async)、[数据处理](/3-reference/2-scenarios/data)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
