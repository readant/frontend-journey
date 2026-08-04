---
title: 05. 异步编程
---

# 异步编程：回调 → Promise → async/await

## 它是什么

JavaScript 是**单线程**语言——同一时刻只执行一段代码。但网页需要"等待网络请求、定时器、用户操作"，不能干等。异步编程就是**让耗时的操作先挂起，主线程继续干别的，等结果好了再回来处理**。

异步方案的演进，本质是"如何优雅地表达'等一会儿再执行'"：

```
回调函数（Callback）        → 容易"回调地狱"
Promise                     → 链式调用，消除嵌套
async / await               → 同步风格，最易读
```

## 核心机制

### 1. 事件循环（Event Loop）——异步的底层引擎

浏览器（和 Node.js）维护了**调用栈**和**任务队列**，事件循环不停重复：

```
执行栈清空
  └→ 先执行完所有"微任务队列"（microtask）
  └→ 再取一个"宏任务"（macrotask）执行
  └→ 回到微任务队列……
```

| 队列 | 包含 | 优先级 |
| --- | --- | --- |
| **宏任务**（macrotask） | `setTimeout`、`setInterval`、事件回调、`I/O` | 低 |
| **微任务**（microtask） | `Promise.then`、`queueMicrotask`、`MutationObserver` | **高**（每轮宏任务后立刻清空） |

```javascript
console.log("1 同步");

setTimeout(() => console.log("2 宏任务"), 0);

Promise.resolve().then(() => console.log("3 微任务"));

console.log("4 同步");
// 输出顺序：1 → 4 → 3 → 2
// 原因：先同步，再清空微任务，最后才轮到宏任务
```

::: danger 微任务先于宏任务
即使 `setTimeout(..., 0)` 已经"立即"，它也要等当前所有微任务执行完。所以 **`Promise.then` 永远先于 `setTimeout`**。
:::

### 2. Promise 状态机

Promise 是一个"承诺结果"的对象，有三种状态，**一旦变化就不可逆**：

```
pending（进行中）
  ├─ resolve(value) → fulfilled（已成功）
  └─ reject(error)  → rejected（已失败）
```

```javascript
const p = new Promise((resolve, reject) => {
  // 异步操作成功 → resolve(结果)
  // 异步操作失败 → reject(错误)
  setTimeout(() => resolve("数据到手"), 1000);
});

p.then(data => console.log(data))   // "数据到手"
 .catch(err => console.error(err)); // 失败时走这里
```

## 标准语法

### 1. Promise 核心 API

```javascript
// 创建与消费
new Promise((resolve, reject) => { /* ... */ })
  .then(res => res)          // 成功回调，可链式返回新 Promise
  .catch(err => {})          // 失败回调（也捕获 then 里抛的错）
  .finally(() => {})         // 无论成败都执行（清理工作）

// 静态方法
Promise.all([p1, p2]);        // 全部成功 → 数组结果；任一失败 → 立即 reject
Promise.allSettled([p1, p2]); // 全部完成后返回各自状态（不因失败中断）
Promise.race([p1, p2]);       // 谁先完成用谁（超时控制）
Promise.any([p1, p2]);        // 第一个成功的结果（全失败才报错）
```

```javascript
// all 典型场景：并行请求，全部就绪再渲染
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
```

### 2. async / await

```javascript
// async 函数：返回值自动包装成 Promise
async function getUser() {
  const res = await fetch("/api/user");   // await 等待 Promise 结果
  const data = await res.json();          // 同步风格的顺序代码
  return data;                            // 实际返回 Promise<data>
}

// 调用方也要 await（或在 .then 中消费）
const user = await getUser();
```

### 3. 错误处理

```javascript
async function load() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("请求失败:", err.message);
    return null;                 // 失败兜底
  } finally {
    hideLoading();               // 无论成败都执行
  }
}
```

## 深入理解

### 1. 回调地狱 → Promise → async/await 的演进

```javascript
// ① 回调地狱：三层嵌套已难以阅读，多层更糟
getUser((user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // 逻辑越深，缩进越深
    });
  });
});

// ② Promise 链：扁平的 .then 链
getUser()
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));

// ③ async/await：读起来就是同步代码
async function showComments() {
  const user = await getUser();
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return comments;
}
```

### 2. 经典面试题：事件循环执行顺序

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");     // 微任务
}
async function async2() {
  console.log("async2");
}

console.log("script start");     // 同步

setTimeout(() => console.log("setTimeout"));  // 宏任务

async1();

Promise.resolve().then(() => console.log("promise1")); // 微任务

console.log("script end");       // 同步

// 输出顺序：
// script start → async1 start → async2 → script end
// → async1 end → promise1       （清空微任务）
// → setTimeout                  （宏任务）
```

**要点**：`await` 之后的代码相当于 `.then` 回调（微任务）；`async` 函数体在 `await` 前是同步执行的。

### 3. fetch：现代异步请求标准

```javascript
// GET
const res = await fetch("/api/users");
const users = await res.json();

// POST
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice" }),
});

// 注意：fetch 只有网络层失败（断网）才 reject，
// HTTP 404/500 也算成功，要手动检查 res.ok
```

### 4. await 与并发（常见误区）

```javascript
// ❌ 串行等待：两个请求其实互不依赖，白白浪费时间
const a = await fetchA();
const b = await fetchB();

// ✅ 并行：同时发起，一起等待
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

**原则：相互依赖的用 await 串行，相互独立的用 Promise.all 并行。**

### 5. 超时控制（race 实战）

```javascript
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("请求超时")), ms)
    ),
  ]);
}
```

### 6. 微任务手动调度

```javascript
queueMicrotask(() => console.log("下个微任务"));
// 等价于 Promise.resolve().then(...)，用于在渲染前做 DOM 更新
```

## 关联速查

::: tip 速查卡片
Promise 静态方法、async/await 模板、事件循环顺序速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::

::: info 延伸阅读
事件循环规范细节，见 [MDN - 事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)。
:::
