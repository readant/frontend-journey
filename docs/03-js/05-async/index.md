---
title: 05. 异步编程
---

# 异步编程：回调 → Promise → async/await

欢迎来到异步编程这一章！网页要"等网络请求、定时器、用户操作"，不能干等——**异步编程就是让耗时的操作先挂起，主线程继续干别的，等结果好了再回来处理**。这是前端开发的日常，也是面试的重灾区。

JavaScript 是**单线程**语言，异步方案的演进，本质是"如何优雅地表达'等一会儿再执行'"：

```
回调函数（Callback）        → 容易"回调地狱"
Promise                     → 链式调用，消除嵌套
async / await               → 同步风格，最易读
```

```javascript
// 直观感受一下现代写法
async function getUser() {
  const res = await fetch("/api/user");
  return res.json();
}
```

## 本章路线

本章拆成 4 个知识点页面，建议按顺序学习：

| 顺序 | 知识点 | 你将学会 |
|:----:|--------|----------|
| 1 | [事件循环](/03-js/05-async/01-event-loop) | 单线程与调用栈、宏任务 vs 微任务、执行顺序推导、经典面试题 |
| 2 | [Promise](/03-js/05-async/02-promise) | 状态机、`then` / `catch` / `finally`、链式调用、`all` / `race` 等静态方法 |
| 3 | [async / await](/03-js/05-async/03-async-await) | 返回值自动包装、`await` 同步风格、`try/catch` 错误处理、三代写法演进 |
| 4 | [fetch 与并发](/03-js/05-async/04-fetch-concurrency) | GET/POST 用法、`res.ok` 检查、串行 vs 并行、超时控制与兜底 |

## 学完你将能

- 推导任意"同步 + 微任务 + 宏任务"混排代码的输出顺序（面试必考）
- 用 Promise 链和 async/await 写出可读、可维护的异步代码，告别回调地狱
- 正确处理请求失败：检查 `res.ok`、`try/catch` 兜底、`finally` 清理
- 用 `Promise.all` 把独立请求并行化，用 `Promise.race` 实现超时控制
- 理解 `await` 之后的代码为什么是微任务，以及它和 `setTimeout` 谁先执行

## 学习建议

- 事件循环的输出顺序题，**自己拿纸笔推导一遍**再跑控制台验证，胜过看十遍
- 第 1 页是地基，后面的 Promise / async/await / fetch 全建立在它之上
- 每页代码都在浏览器控制台或 Node REPL 里**亲手跑一遍**，改改参数看输出变化

## 关联速查

::: tip 速查卡片
Promise 静态方法、async/await 模板、事件循环顺序速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::

::: info 延伸阅读
事件循环规范细节，见 [MDN - 事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)。
:::
