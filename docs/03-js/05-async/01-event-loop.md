---
title: 05.1 事件循环
---

# 事件循环：异步的底层引擎

## 它是什么

JavaScript 是**单线程**语言——同一时刻只执行一段代码。那网页是怎么做到"边等网络请求、边响应用户点击"的？答案是：**把耗时的操作交给浏览器/Node 去等，主线程先干别的，等结果好了再插队回来处理**。协调这一切的"调度器"就是**事件循环（Event Loop）**。

把它想象成**餐厅只有一个厨师**（单线程）：

- 正在做的那道菜 = 正在执行的代码（在**调用栈**上）
- 点好的但还没做的菜 = 排队的任务（在**任务队列**里）
- 厨师忙完手头的菜，就从队列里取下一道菜——这就是"事件循环"转一圈

## 单线程 + 调用栈

```javascript
function add(a, b) { return a + b; }
function main() {
  const r = add(1, 2);
  console.log(r);
}
main();
```

执行时，函数调用会像"叠盘子"一样压进**调用栈**：`main` 压栈 → `main` 调 `add`，`add` 压栈 → `add` 执行完出栈 → `main` 执行完出栈。**栈空时，这一轮的同步代码就全部执行完了。**

::: tip 单线程的代价与补偿
单线程意味着"一段代码卡死，整个页面卡死"。所以**重计算要放到** `setTimeout` / `Web Worker` 等异步渠道，避免阻塞 UI。异步的引入正是为了补偿单线程的短板。
:::

## 调用栈与任务队列

事件循环每一轮做的事，用伪代码表示就是：

```
1. 执行调用栈里所有同步代码（直到栈空）
2. 清空"微任务队列"（一个不剩）
3. 从"宏任务队列"取一个任务执行
4. 回到第 2 步，再清空微任务……
```

## 宏任务 vs 微任务

| 对比 | **宏任务（macrotask）** | **微任务（microtask）** |
| --- | --- | --- |
| 典型成员 | `setTimeout`、`setInterval`、事件回调、`I/O` | `Promise.then`、`queueMicrotask`、`MutationObserver` |
| 优先级 | 低 | **高** |
| 执行时机 | 每轮只取**一个** | 每个宏任务结束后**全部**清空 |
| 类比 | 排队叫号吃饭的客人 | 厨师切好菜后"顺手先上"的加急单 |

```javascript
console.log("1 同步");

setTimeout(() => console.log("2 宏任务"), 0);

Promise.resolve().then(() => console.log("3 微任务"));

console.log("4 同步");
// 输出顺序：1 → 4 → 3 → 2
// 原因：先同步，再清空微任务，最后才轮到宏任务
```

::: danger 微任务永远先于宏任务
即使 `setTimeout(..., 0)` 表示"立即"，它也是宏任务，要等**当前所有微任务执行完**才轮得到。所以 **`Promise.then` 永远先于 `setTimeout` 打印**——这是面试必考、也是很多人第一次被 JS 顺序"惊到"的地方。
:::

## 执行顺序：同步 → 微任务 → 宏任务

记住这张顺序图，绝大多数顺序题都能推出来：

```
同步代码（调用栈）  →  微任务队列（全清）  →  宏任务（取一个）
                          ↑______________________|
                              （每轮循环重复）
```

```javascript
setTimeout(() => console.log("A 宏任务"), 0);

Promise.resolve()
  .then(() => console.log("B 微任务"))
  .then(() => console.log("C 微任务"));

console.log("D 同步");
// D → B → C → A
// 微任务之间也按"先入先出"排队：B 先入队，所以 B 先于 C
```

::: tip 微任务也会排队
微任务队列本身也是队列：多个 `then` 按注册顺序依次执行。执行第一个微任务时如果又产生新微任务，会**追加到队尾**，本轮的微任务队列要全部清空才轮到宏任务。
:::

## queueMicrotask：手动调度微任务

`queueMicrotask` 可以手动把一个函数放进微任务队列，等价于 `Promise.resolve().then(fn)`：

```javascript
queueMicrotask(() => console.log("下个微任务"));

Promise.resolve().then(() => console.log("一样是微任务"));
// 两个都在宏任务之前执行，顺序看谁先注册
```

**典型用途**：在浏览器**下一次渲染之前**做轻量的 DOM 更新（微任务在渲染前执行，宏任务在渲染后）。高频/大批量操作请慎用，因为微任务"不休息"，可能饿死渲染。

## 经典面试题：完整推导一遍

把知识组合起来，做一道必考题：

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");     // await 之后 = 微任务
}
async function async2() {
  console.log("async2");
}

console.log("script start");     // 同步

setTimeout(() => console.log("setTimeout"));   // 宏任务

async1();                        // 调用 async1

Promise.resolve().then(() => console.log("promise1"));  // 微任务

console.log("script end");       // 同步
```

**推导过程**：

1. 同步代码：`script start` → 进入 `async1`：`async1 start` → `await async2()`：执行 `async2` 打印 `async2`，然后把"`async1 end`"当作**微任务**入队 → 回到外层，`promise1` 入队 → `script end`
2. 同步结束，清空微任务：`async1 end` → `promise1`
3. 宏任务：`setTimeout`

```
输出顺序：
script start → async1 start → async2 → script end
→ async1 end → promise1       （清空微任务）
→ setTimeout                  （宏任务）
```

::: tip 一句话总结
`await` 之后的代码相当于 `.then` 回调（**微任务**）；`async` 函数体在 `await` 之前是**同步执行**的。抓住这两点，这类题不会错。
:::

## 常见坑点

- `setTimeout(..., 0)` 不是"立即执行"，是"尽快插入宏任务队列"，永远晚于当前同步代码和微任务
- 微任务里再注册微任务，会**推迟宏任务**的执行（无限注册微任务会"饿死"宏任务）
- `Promise.then` 里同步抛错会进入下一个 `catch`，不会变成宏任务——别和 `setTimeout` 混淆
- 事件循环是浏览器/Node 的**宿主机制**，不是 ECMAScript 规范的一部分，但行为有统一约定

## 小结

- JS 单线程，靠事件循环调度：**同步 → 微任务（全清）→ 宏任务（取一个）** 循环往复
- 微任务：`Promise.then` / `queueMicrotask`；宏任务：`setTimeout` / 事件回调
- **微任务永远先于宏任务**；`await` 之后的代码就是微任务
- `async` 函数在 `await` 前同步执行，`await` 后进入微任务队列

::: tip 速查卡片
事件循环顺序、Promise 静态方法、async/await 模板速查，见 [异步与 Promise 速查](/cheatsheet/data/promise)。
:::
