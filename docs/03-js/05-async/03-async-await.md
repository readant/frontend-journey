---
title: 05.3 async / await
---

# async / await：同步风格写异步

## 它是什么

`async / await` 是 Promise 的**语法糖**——底层还是 Promise，但写法上像同步代码，读起来顺序、清晰，是当前写异步的**首选方式**。`async` 标记一个"异步函数"，`await` 用来"等一个 Promise 完成并取出结果"。

打个比方：Promise 时代像"拿到取餐号，然后告诉自己'出餐了再处理'"（`.then`）；async/await 时代像"排队等餐，拿到了再走下一步"——大脑的认知负担大大降低。

## async 函数：返回值自动包装成 Promise

**只要函数声明为 `async`，它的返回值就自动被包装成 Promise**：

```javascript
async function hello() {
  return "你好";
}
// hello() 返回的是 Promise<"你好">，不是字符串！

hello().then(msg => console.log(msg));   // "你好"

// 等价于：
function hello2() {
  return Promise.resolve("你好");
}
```

```javascript
// 返回值是 Promise 时原样透传
async function getUser() {
  return fetch("/api/user");   // 直接返回 Promise，不再包装
}
```

::: tip async 函数里的同步错误也会变成 reject
`async` 函数里**抛出的异常**会自动转成 `rejected` 的 Promise，所以在外面可以统一 `.catch`，或在调用处 `try/catch`。
:::

## await：等待 Promise 的同步风格

`await` 只能用在 `async` 函数内（模块顶层也支持）。它做两件事：**暂停当前函数**，等 Promise 完成；**取出结果**继续往下走。

```javascript
async function load() {
  const res = await fetch("/api/user");  // 等到响应才继续
  const data = await res.json();         // 等到解析完才继续
  return data;                           // 返回 Promise<data>
}

// 调用方也要 await（或 .then）
const user = await load();
```

::: warning await 不能用在普通函数里
```javascript
function wrong() {
  await fetch("/api/user");   // ❌ SyntaxError: await is only valid in async functions
}
```
如果收到 "await is only valid in async functions"，先检查外层函数有没有 `async`。
:::

## 错误处理：try / catch / finally

`await` 的失败不会"悄悄消失"，而是**抛异常**，用 `try/catch` 接住——和同步代码一模一样的姿势：

```javascript
async function load() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("请求失败:", err.message);
    return null;                  // 失败兜底：返回默认值，调用方不用再判错
  } finally {
    hideLoading();                // 无论成败都执行
  }
}
```

**try/catch 覆盖整条 await 链**：只要链上任意一个 `await` 失败，就进入 `catch`。不再需要像 Promise 那样在每个环节挂 `.catch`。

::: tip 什么时候用 try/catch，什么时候用 .catch
在 `async` 函数内部：用 `try/catch`。在**外部**拿到一个 `async` 函数返回的 Promise：用 `.catch()` 或调用处 `await` + `try/catch`。两种混用也没问题，只是别重复兜底。
:::

## 演进对比：回调 → Promise → async/await

同一件事，三代写法的差别一目了然：

```javascript
// ① 回调地狱：嵌套深、顺序难读
getUser((user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});

// ② Promise 链：扁平了，但仍是"接续"思维
getUser()
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));

// ③ async/await：完全同步风格，最接近人类阅读顺序
async function showComments() {
  try {
    const user = await getUser();
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error(err);
  }
}
```

::: tip 演进本质
三代代码**能力完全相同**，差别只在"表达方式"。`async/await` 没有引入新机制，它只是让"等结果"这件事长得像普通语句，从而大幅降低阅读与排错成本。
:::

## await 之后的代码相当于微任务

结合 05.1 节的知识点：**`await` 之后的代码等同于 `.then` 回调，会进入微任务队列**：

```javascript
async function demo() {
  console.log("A");          // 同步执行
  await Promise.resolve();   // 挂起
  console.log("B");          // 微任务（相当于 then 回调）
}

console.log("C");
demo();
console.log("D");
// 输出：C → A → D → B
```

**推导**：调用 `demo()` 时，`A` 在 await 之前是同步的；遇到 `await` 把后面的 `B` 入队微任务，函数挂起返回；外层同步继续打印 `D`；同步结束后清空微任务，打印 `B`。

::: danger await 前后顺序题必考
面试常考"`async1 start → async2 → script end → async1 end → promise1 → setTimeout`"这类顺序。核心就一条：**async 函数在第一个 await 之前是同步执行的，await 之后全部是微任务**。
:::

## 常见坑点

- `await` 放在**非 async** 函数里 → 语法错误；想用就把外层函数改成 `async`
- 忘记在**调用处** `await`：`const user = getUser()` 拿到的不是数据而是 Promise，需 `await getUser()`
- `async` 函数的返回值永远是 Promise——`const v = await asyncFn()` 才对，直接赋值是 Promise 对象
- 多个**互不依赖**的 `await` 串行写会变慢（一个等完才发下一个），应改用 `Promise.all`（见 05.4 节）
- `finally` 里的 `return` 会**覆盖** try/catch 的返回值，别在 `finally` 里 return

## 小结

- `async` 让函数返回 Promise；`await` 暂停函数、取出 Promise 的结果
- 错误处理用 `try/catch/finally`，和同步代码一致
- 演进：回调地狱 → Promise 链 → async/await，能力相同、表达越来越直观
- `await` 之后的代码是微任务，执行顺序按"同步 → 微任务 → 宏任务"推导

::: tip 速查卡片
async/await 模板、错误处理模式完整速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::
