---
title: 06. DOM 操作与事件
---

# DOM 操作与事件

欢迎来到前端三大件之一的 DOM 章节！写网页最日常的工作，就是**操作页面**：把数据显示出来、让按钮响应点击、动态增删列表项。而 DOM（Document Object Model）就是浏览器把 HTML 解析成的**内存对象树**，JavaScript 通过它读写页面。

所有页面操作可以浓缩成三步：**找到元素 → 改它的内容/结构 → 绑定事件**：

```javascript
const title = document.querySelector("h1");  // 找到
title.textContent = "新标题";                  // 改内容
title.addEventListener("click", () => {});    // 绑定事件
```

本章把这块拆成 4 个递进的页面：先学会"找到元素"，再学会"增删改"，然后理解"事件是怎么传播的"，最后掌握高效管理事件的"事件委托"。

## 本章路线

本章拆成 4 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [查询与遍历](/03-js/06-dom-api/01-query-dom) | `querySelector` / `querySelectorAll`、旧式 API、NodeList 与数组差异、classList 与属性操作 |
| 2 | [修改节点](/03-js/06-dom-api/02-modify-dom) | 创建/插入/删除元素、`textContent` vs `innerHTML`、XSS 安全、`DocumentFragment` 性能优化 |
| 3 | [事件机制](/03-js/06-dom-api/03-events) | 事件流三阶段（捕获→目标→冒泡）、`addEventListener` 第三参数、事件对象四件套 |
| 4 | [事件委托](/03-js/06-dom-api/04-event-delegation) | 委托原理、`event.target` + `closest` 判断、动态元素响应、`stopPropagation` 的坑 |

## 学完你将能

- 熟练用 CSS 选择器找到任意页面元素，并在节点间自由遍历
- 自如地创建、插入、移动、删除元素，写出安全的渲染代码（不踩 XSS）
- 说清点击事件的完整传播路径（捕获 → 目标 → 冒泡）以及三个阶段各自触发什么监听器
- 用一个监听器管理整个列表，动态新增的元素也自动响应
- 知道何时用 `preventDefault`、何时不该用 `stopPropagation`，避开经典事件坑

## 学习建议

- 每页代码都**打开浏览器控制台亲手跑一遍**（F12 → Console），改选择器、改类名看即时反馈
- 第 3、4 页是面试重点：事件流顺序、`target` vs `currentTarget`、委托原理必考
- 用「小项目练手」：做一个 todo 列表，把增删改 + 事件委托一次全用上
- 学完记得翻到「关联速查」卡片，开发时随手查阅

## 关联速查

::: tip 速查卡片
DOM 查询、增删改、事件流与委托模板的完整速查，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::

::: info 延伸阅读
事件规范的完整细节，见 [MDN - 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)。
:::
