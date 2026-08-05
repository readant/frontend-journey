---
title: 08. 错误处理与调试
---

# 错误处理与调试

代码总会出错——区别在于你会不会**主动兜底**和**快速定位**。这一章从"读懂错误"开始，到"接住错误"，最后到"用工具和流程找出根因"，把"出错"这件事从玄学变成一门可掌握的手艺。

**错误处理**是让程序在出错时"优雅失败"而不是"直接崩溃"的机制：try/catch 是安全网，异步兜底是保险丝。**调试**是定位错误根因的方法论：console 是电笔，断点是监控器，五步法是排查流程。

```javascript
// 这一章你会反复看到的三件套：先看懂错误、再兜住错误、最后定位错误
try {
  const data = JSON.parse(str);          // 可能出错的代码
} catch (err) {
  console.error("解析失败:", err);        // 出错后处理
}
```

## 本章路线

本章拆成 3 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [错误基础](/03-js/08-error-debug/01-error-basics) | Error 对象三字段、四大内置错误类型、错误传播链、throw 与自定义错误 |
| 2 | [错误处理](/03-js/08-error-debug/02-error-handling) | try/catch/finally、异步错误处理、Promise 必须 catch、全局兜底 |
| 3 | [调试方法论](/03-js/08-error-debug/03-debugging) | console 全家桶、错误栈读法、断点三连、Source Map、五步调试法 |

## 学完你将能

- 一眼看懂控制台报错：`name` 类型、`message` 描述、`stack` 调用栈怎么配合定位
- 用 try/catch/finally 让程序"优雅失败"，并分清哪些错误（`SyntaxError`、`setTimeout` 里的）根本抓不到
- 正确处理异步错误：每个 Promise 都有 catch，async/await 用 try/catch 接住
- 给生产环境加全局兜底（`error` + `unhandledrejection`），错误不漏报
- 用五步调试方法论 + 断点/console 工具，独立把 bug 从"复现"追到"修复验证"

## 学习建议

- 每页代码都**亲手在浏览器控制台跑一遍**（F12 → Console），故意写错再观察报错长相，理解 > 记忆
- 第 1、2 页的坑点（SyntaxError 抓不到、Promise 静默丢失）面试常考，务必吃透
- 第 3 页的调试方法论值得**长期练习**：以后每遇到 bug 都按"复现 → 二分 → 检查输入 → 看栈 → 验证"走一遍
- 学完记得翻到「关联速查」卡片，开发时随手查阅

## 关联速查

::: tip 速查卡片
try/catch 模板、console 方法、错误类型表与断点快捷键速查，见 [错误与调试速查](/cheatsheet/data/error-debug)。
:::

::: info 延伸阅读
调试规范细节，见 [MDN - 控制台 API](https://developer.mozilla.org/zh-CN/docs/Web/API/console)。
:::
