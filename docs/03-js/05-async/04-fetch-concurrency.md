---
title: 05.4 fetch 与并发
---

# fetch 与并发：发请求的正确姿势

## 它是什么

`fetch` 是浏览器/Node 内置的**发网络请求的 API**，返回一个 Promise——正好把前面学的 Promise、async/await 用在实际场景。这一页讲清三件事：**怎么发 GET/POST**、**怎么判断请求真的失败**、以及**多个请求如何组织成并发**（含超时控制）。

## fetch 基础：GET / POST

```javascript
// GET：默认就是 GET
const res = await fetch("/api/users");
const users = await res.json();       // 解析 JSON 响应体

// 带查询参数的 GET
const res2 = await fetch(`/api/users?id=${id}`);
```

```javascript
// POST：提交数据到服务器
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },   // 声明提交的是 JSON
  body: JSON.stringify({ name: "Alice", age: 18 }),  // 序列化成字符串
});
```

| 参数 | 作用 |
| --- | --- |
| `method` | `"GET"` / `"POST"` / `"PUT"` / `"DELETE"` |
| `headers` | 请求头，POST JSON 必须带 `Content-Type` |
| `body` | 请求体，对象要先 `JSON.stringify` |

```javascript
// 响应对象 res 的常用读取方式
await res.json();        // 解析成 JSON
await res.text();        // 解析成纯文本
res.ok;                  // 布尔：HTTP 状态码在 200~299 之间为 true
res.status;              // 状态码数字：200、404、500……
```

::: warning body 是"一次性"的
`res.json()` 读完后，`res` 的 body 就被消费了，再调 `res.text()` 会拿不到内容。按需选择一种读取方式即可。
:::

## 核心坑：fetch 只在网络层失败才 reject

这是新手最大的误解：**`fetch` 不会因为 HTTP 404 / 500 而进入 `catch`**——只要服务器回了响应（哪怕是错误页），`fetch` 都认为"成功了"。只有**网络层失败**（断网、DNS 解析失败、请求被取消）才会 reject。

```javascript
const res = await fetch("/api/not-exist");   // 返回 404
// ❌ 这里不会抛错，代码正常往下走！

// ✅ 必须手动检查 res.ok
if (!res.ok) {
  throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
```

```javascript
// 完整模板：检查状态 + 兜底
async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
```

::: danger res.ok 必须手动检查
**404 / 500 时 `fetch` 不会 reject**，而是正常 resolve 一个 `ok: false` 的响应。不检查 `res.ok`，代码会把"失败响应"当成成功继续处理，错误数据就悄悄溜进业务逻辑了。
:::

## 串行 await 误区 vs Promise.all 并行

多个**互不依赖**的请求，写成串行 `await` 是常见误区——两个请求本可同时发出，串行却让总耗时变成"两个耗时之和"：

```javascript
// ❌ 串行：fetchA 完成才开始 fetchB，总耗时 = A + B
const a = await fetchA();
const b = await fetchB();

// ✅ 并行：同时发起，一起等待，总耗时 ≈ max(A, B)
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

::: tip 什么时候用串行
**有依赖关系**时必须串行：先拿用户 id，再拿该用户的文章——第二步要用第一步的结果，只能 `await` 串着写。判断标准：**后一个请求的参数是否依赖前一个的结果**。独立 → 并行；依赖 → 串行。
:::

## 超时控制：用 Promise.race 实现

`fetch` 默认**没有超时时间**——网络挂起时可能一直等下去。用 `Promise.race`（谁先完成用谁）和超时定时器赛跑：

```javascript
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("请求超时")), ms)
    ),
  ]);
}

// 用法：3 秒没响应就失败
try {
  const res = await withTimeout(fetch("/api/data"), 3000);
  const data = await res.json();
} catch (err) {
  console.error(err.message);   // "请求超时" 或 网络错误
}
```

**原理**：`race` 取"最先完成"的结果——正常请求先完成就用数据；`setTimeout` 先触发就 reject 超时错误。注意超时后**底层请求并不会被取消**，只是不再等待它的结果。

::: tip 取消请求（进阶）
真正取消网络请求要用 `AbortController`：`const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal })`，超时/手动操作时 `ctrl.abort()` 会真正中断请求，并让 fetch reject。
:::

## 错误处理兜底

网络不可控，请求代码**必须有兜底**——失败时给出友好提示或默认值，而不是让页面白屏：

```javascript
async function loadUser(id) {
  try {
    const res = await withTimeout(fetch(`/api/users/${id}`), 5000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // 兜底：记录日志 + 返回默认值（或抛给上层统一处理）
    console.error("加载用户失败:", err.message);
    return { name: "未知用户" };
  } finally {
    hideLoading();   // 无论成败都关掉 loading
  }
}

const user = await loadUser(1);
render(user);        // 一定有数据可渲染（可能是兜底值）
```

```javascript
// 多个请求"个别失败不影响整体"：给单个请求加 catch 后再 all
const [users, stats] = await Promise.all([
  request("/api/users"),
  request("/api/stats").catch(() => ({ count: 0 })),   // stats 失败用默认值
]);
```

::: tip 兜底设计原则
- **能降级就降级**：失败返回默认数据，页面继续可用
- **能记录就记录**：`console.error` / 上报，别吞掉错误
- **别让 catch 变空**：`catch {}` 会吞掉错误让排查变难，至少打一条日志
:::

## 常见坑点

- 404 / 500 **不会**触发 catch，必须检查 `res.ok`
- 忘写 `await`：`const res = fetch(...)` 拿到的是 Promise 而不是响应
- POST 忘写 `headers` 或忘 `JSON.stringify`，后端可能解析不到 body
- 独立请求写串行 `await` → 白白变慢；用 `Promise.all` 并行
- `fetch` 没有超时，网络挂起会无限等；用 `race` + `setTimeout` 控制

## 小结

- `fetch` 返回 Promise：GET 用默认，POST 用 `method/headers/body`
- **网络层失败才 reject**，HTTP 404/500 要手动检查 `res.ok` 并抛错
- 独立请求用 `Promise.all` 并行，依赖请求才串行 `await`
- 超时控制：`Promise.race([fetchPromise, timeoutPromise])`
- 兜底三原则：能降级、能记录、别吞错

::: tip 速查卡片
fetch 模板、并发与超时控制完整速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::
