---
title: 异步与 Promise 速查
---

# 异步与 Promise 速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 串行依赖的异步流程 | `async/await`（同步风格） |
| 并发并行请求 | `Promise.all` |
| 全部完成（含失败） | `Promise.allSettled` |
| 竞速/超时控制 | `Promise.race` |
| 任一成功即可 | `Promise.any` |
| 发起网络请求 | `fetch` |

## 核心代码

```javascript
// 创建 Promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("数据"), 1000);   // 成功
  // setTimeout(() => reject(new Error("失败")), 1000); // 失败
});
p.then(data => console.log(data))
 .catch(err => console.error(err))
 .finally(() => console.log("清理"));

// async/await
async function load() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("请求失败:", err);
    return null;
  }
}

// 并发
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// 超时控制
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("请求超时")), ms)
    ),
  ]);
}

// POST 请求
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice" }),
});
```

## 踩坑记录

- **微任务先于宏任务**：`Promise.then` 永远先于 `setTimeout` 执行；执行顺序：同步 → 微任务 → 宏任务
- **Promise 链必须有 catch**：reject 没被接住 → `unhandledrejection`，错误静默丢失
- **`fetch` 的 404/500 也算成功**：只有断网才 reject；必须手动 `if (!res.ok) throw`
- **`Promise.all` 任一失败整体失败**：需要"逐个结果"用 `allSettled`
- **`await` 串行浪费**：无依赖的请求要 `Promise.all` 并行
- **`new Promise` 里抛错会变成 reject**：`async` 函数内 throw 也会 reject
- **`await` 只能在 async 函数/模块顶层使用**：普通函数里用 `Promise.then`
