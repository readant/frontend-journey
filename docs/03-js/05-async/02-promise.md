---
title: 05.2 Promise
---

# Promise：告别回调地狱

## 它是什么

Promise 中文叫"承诺"——它代表**一个还没完成、但未来一定会有结果的操作**。就像点外卖：下单后你拿到一个"取餐号"（Promise），不用一直盯着厨房；做好了会通知你（成功），做砸了也会通知你（失败）。你用 `.then` / `.catch` 挂上"通知我之后的处理逻辑"即可。

在 Promise 之前，异步靠**回调函数**嵌套，一旦层级变深就成了"回调地狱"。Promise 的核心价值就是**把嵌套拍扁成链式调用**。

## Promise 状态机

一个 Promise 只有三种状态，**一旦从 `pending` 变出去就不可逆**：

```
pending（进行中）
  ├─ resolve(value) → fulfilled（已成功，拿结果）
  └─ reject(error)  → rejected（已失败，拿错误）
```

```javascript
const p = new Promise((resolve, reject) => {
  // 构造函数里放"耗时操作"，做完二选一：
  setTimeout(() => resolve("数据到手"), 1000);   // 成功 → resolve(结果)
  // setTimeout(() => reject(new Error("超时")), 1000);  // 失败 → reject(错误)
});

p.then(data => console.log(data))    // "数据到手"
 .catch(err => console.error(err));  // 失败时走这里
```

::: danger 状态不可逆
`resolve` 之后再调用 `reject` **无效**；反之亦然。状态只能变一次，就像外卖订单只能有一个最终结果——这是 Promise 可靠性的根基。

```javascript
const p = new Promise((resolve) => {
  resolve("第一次决定");
  resolve("第二次决定");   // ❌ 被忽略，状态已锁定
  reject("晚到的错误");    // ❌ 也被忽略
});
```
:::

## 消费 Promise：then / catch / finally

```javascript
fetch("/api/user")
  .then(res => res.json())     // 成功：拿到数据继续处理
  .then(user => console.log(user))
  .catch(err => console.error("出错了:", err))   // 失败：上面任意一环抛错都到这
  .finally(() => hideLoading());                 // 无论成败都执行（清理）
```

| 方法 | 时机 | 用途 |
| --- | --- | --- |
| `then(onOk, onErr)` | 成功（或前一个 then 返回后） | 处理结果、链式接续 |
| `catch(onErr)` | 失败 | 统一错误处理（也接住前面 then 里抛的错） |
| `finally(fn)` | 无论成败 | 清理工作（关 loading、关连接） |

::: tip catch 是"安全网"
`catch` 不仅接住 `reject`，还接住**前面任何 `then` 回调里抛出的异常**。所以把 `catch` 放在链尾，就相当于给整条链兜底。
:::

## 链式调用

`.then` 返回的**还是一个 Promise**，所以可以无限接续——这就是"拍扁嵌套"的关键：

```javascript
// 回调地狱（嵌套）
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});

// Promise 链（扁平）
getUser(id)
  .then(user => getPosts(user.id))        // 返回新 Promise，继续 .then
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));
```

**链式规则的三种情况**：`then` 回调返回一个**普通值**，会被包装成已完成的 Promise 传给下一环；返回**一个 Promise**，下一环等它完成；**抛异常**，直接跳到最近的 `catch`。

## 静态方法：all / allSettled / race / any

当有**多个** Promise 要协调时，用静态方法：

```javascript
const p1 = fetch("/a").then(r => r.json());
const p2 = fetch("/b").then(r => r.json());

Promise.all([p1, p2]);          // 全部成功 → 数组结果；任一失败 → 立即 reject
Promise.allSettled([p1, p2]);   // 全部完成后返回各自状态（失败不中断）
Promise.race([p1, p2]);         // 谁先完成用谁（超时控制常用）
Promise.any([p1, p2]);          // 第一个成功的结果（全部失败才报错）
```

| 方法 | 结果 | 失败策略 | 场景 |
| --- | --- | --- | --- |
| `all` | 全部结果的数组 | **任一失败立即失败** | 并行请求，全部就绪再渲染 |
| `allSettled` | 每个的状态对象数组 | 不失败，等所有结束 | 批量任务，不关心个别失败 |
| `race` | 第一个完成的结果 | 第一个完成的是失败就算失败 | 超时控制、竞速 |
| `any` | 第一个成功的结果 | 全部失败才失败 | "取最快成功" |

```javascript
// allSettled 的结果结构
const results = await Promise.allSettled([p1, p2]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.log(r.reason);   // 失败原因
});
```

## Promise.all 并行请求场景

典型场景：页面需要两个接口的数据，**互不依赖，应该并行发**：

```javascript
// ✅ 并行：同时发起两个请求，一起等
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
// users 和 posts 都就绪后，才继续渲染

// 也可以接 .then / .catch 处理失败
Promise.all([fetchA(), fetchB()])
  .then(([a, b]) => render(a, b))
  .catch(err => showError(err));
```

::: warning all 的"一票否决"
`Promise.all` 只要**一个失败就整体失败**，其他仍在途的请求结果会被丢弃（它们照常执行，只是不再被等待）。需要"个别失败不影响整体"时，改用 `allSettled`，或用 `p.catch(e => fallback)` 给单个请求兜底后再 `all`。
:::

## 常见坑点

- `new Promise` 的 executor（执行器）是**同步执行**的，只有 `resolve` / `reject` 之后的部分才是异步——`console.log` 放在 executor 里会立刻打印
- `then` 里**忘记 `return`** 会让下一环拿到 `undefined`，链式就会断
- 已经 `resolve` / `reject` 后的 Promise 再调状态方法**无效**（状态不可逆）
- `Promise.all` 参数里必须是 Promise（非 Promise 值会直接通过，等价于已 resolve）
- `.catch` 只接"前面"的错误；`catch` 之后还能继续 `.then`（因为 `catch` 也返回 Promise）

## 小结

- Promise 是"未来结果"的占位符：`pending → fulfilled / rejected`，**不可逆**
- 消费方式：`then`（成功/接续）、`catch`（失败兜底）、`finally`（清理）
- 链式调用把回调地狱拍扁成一行行 `.then`
- 多 Promise 协调：`all`（全成）、`allSettled`（全结束）、`race`（最快）、`any`（最快成功）
- 独立请求用 `Promise.all` 并行，别写成串行 `await`

::: tip 速查卡片
Promise 静态方法、链式模板完整速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::
