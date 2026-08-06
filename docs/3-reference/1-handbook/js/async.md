---
title: JS 异步完整手册
---

# JS 异步

## 核心概念

异步 = 「先答应你，回头再办」—— 从回调到 Promise 再到 async/await，层层解决「等」的问题。

## 完整内容

### 是什么 / 为什么

JS 单线程，但很多操作（网络请求、定时器、读取文件）要「等」。异步编程让代码在等待时不阻塞界面，等结果回来再继续。**演进脉络**：回调（容易地狱）→ Promise（可链式）→ async/await（写起来像同步）。

### 一、事件循环（异步的底层机制）

```
调用栈（同步任务）→ 微任务队列（Promise.then 等）→ 宏任务队列（setTimeout 等）
```

- **同步任务**：立即执行
- **微任务**：每个同步任务完成后、渲染前清空（Promise、queueMicrotask）
- **宏任务**：一轮轮地取（setTimeout、setInterval、I/O）

```javascript
console.log(1);                        // 1
setTimeout(() => console.log(2));      // 宏任务 → 最后
Promise.resolve().then(() => console.log(3)); // 微任务 → 次之
console.log(4);                        // 4
// 输出顺序：1 4 3 2
```

### 二、Promise

**三个状态**：`pending`（进行中）→ `fulfilled`（成功）或 `rejected`（失败），一旦确定不可变。

```javascript
const p = new Promise((resolve, reject) => {
  // 异步操作
  if (ok) resolve("成功数据");
  else reject(new Error("失败原因"));
});

p.then((data) => {
  // 成功回调
}).catch((err) => {
  // 失败回调
}).finally(() => {
  // 无论成败都执行
});
```

**链式传递**：`then` 返回新 Promise，可继续链，数据逐级传递。

```javascript
fetchData()
  .then((data) => transform(data))
  .then((result) => save(result))
  .catch((err) => handleError(err));
```

**静态方法**：

| 方法 | 行为 |
| :--- | :--- |
| `Promise.resolve(v)` | 包装成已成功 |
| `Promise.reject(e)` | 包装成已失败 |
| `Promise.all([p1, p2])` | **全部**成功才成功，一个失败整体失败（并行） |
| `Promise.allSettled([p1, p2])` | 全部结束，各自报告结果（不中断） |
| `Promise.race([p1, p2])` | 最快完成的一个胜出 |
| `Promise.any([p1, p2])` | 第一个成功的胜出（全失败才拒绝） |

```javascript
const [users, posts] = await Promise.all([
  fetch("/users").then((r) => r.json()),
  fetch("/posts").then((r) => r.json()),
]);
```

### 三、async / await（Promise 的语法糖）

```javascript
async function loadUser(id) {
  try {
    const res = await fetch(`/users/${id}`);   // 等 Promise 完成
    const user = await res.json();
    return user;                                // 自动包成 Promise
  } catch (err) {
    console.error("加载失败", err);
    return null;
  }
}
```

**要点**：

- `async` 函数总是返回 Promise
- `await` 只能在 `async` 函数里用（顶层 await 需模块环境）
- `try/catch` 捕获 await 的失败（替代 .catch）
- 需要并行的请求：先发起再一起 await（`Promise.all`），别串行 await

```javascript
// ❌ 串行：两个请求一个等一个
const a = await fetchA();
const b = await fetchB();

// ✅ 并行：同时发出，一起等待
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### 四、fetch（现代网络请求）

```javascript
// GET
const res = await fetch("/api/users");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();          // 或 res.text()

// POST
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "张三" }),
});
```

**超时控制**：

```javascript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 5000);
try {
  const res = await fetch(url, { signal: controller.signal });
} catch (err) {
  if (err.name === "AbortError") console.log("请求超时");
}
clearTimeout(timer);
```

### 语法速查

| 场景 | 写法 |
| :--- | :--- |
| 创建 | `new Promise((resolve, reject) => {})` |
| 成功 | `resolve(value)` |
| 失败 | `reject(error)` |
| 消费 | `.then(fn).catch(fn).finally(fn)` |
| 等待 | `await promise`（async 函数内） |
| 并行 | `Promise.all` / `Promise.allSettled` |
| 请求 | `fetch(url, { method, headers, body })` |
| 超时 | `AbortController` + `signal` |
| 定时 | `setTimeout`（宏任务）`queueMicrotask`（微任务） |

### 常见用法

**封装请求工具（统一错误处理）**：

```javascript
async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`请求失败：${res.status}`);
  return res.json();
}
```

**串行循环异步（逐项等待）**：

```javascript
for (const item of list) {
  await process(item);   // 一个一个来
}
```

### 注意事项

- ⚠️ `await` 串行会拖慢性能，独立请求用 `Promise.all` 并行。
- ⚠️ `Promise.all` 一个失败就整体失败且不等待其它，要「都跑完再看」用 `allSettled`。
- ⚠️ `async` 函数里的报错是「拒绝的 Promise」，必须 `try/catch` 或 `.catch` 兜底，否则静默丢失。
- ⚠️ 别忘记 `res.ok` 检查：`fetch` 只在网络错误时拒绝，HTTP 404/500 也算「成功返回」。
- ⚠️ 事件循环顺序：微任务先于宏任务，「setTimeout 明明写在前面却最后执行」。

## 相关

- 🔍 场景索引：[异步场景](/3-reference/2-scenarios/async)
- 📖 相邻手册：[闭包](/3-reference/1-handbook/js/closure)（防抖节流）、[事件系统](/3-reference/1-handbook/js/event)
