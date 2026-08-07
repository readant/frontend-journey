---
title: "08.2 错误处理"
---

# 错误处理：try/catch 与异步兜底

## 它是什么

错误处理是让程序<strong>"优雅失败"</strong>而不是"直接崩溃"的机制。可以把 try/catch 想象成给危险动作**加安全网**：能救的救回来（兜底逻辑），救不了的也要留下痕迹（日志/上报），而不是让整段程序当场摔死。

```javascript
// 没有兜底：一旦 JSON.parse 失败，整个脚本中断
const data = JSON.parse(brokenStr);       // ❌ 崩溃

// 有兜底：出错后走 fallback，程序继续活着
try {
  const data = JSON.parse(brokenStr);
} catch (err) {
  console.error("解析失败:", err.message);
}
```

::: tip 一句话记住
**try 包住"可能出错的代码"，catch 处理"出错后怎么办"，finally 保证"收尾必须执行"。**
:::

## try / catch / finally 结构

三段结构各有分工，缺一不可：

```javascript
try {
  // ① 可能出错的代码
  const data = JSON.parse(maybeBroken);
  use(data);
} catch (err) {
  // ② 出错时执行：err 是抛出的 Error 对象
  console.error("出错:", err);
  fallback();                   // 兜底逻辑：用默认值/提示用户/重试
} finally {
  // ③ 无论成败都执行：清理现场
  hideLoading();
}
```

三个注意点：

- `catch (err)` 里的 `err` 是本次抛出的 Error 对象，不想要时可省略括号直接 `catch {`
- 没有 `catch` 时 `try` 必须跟 `finally`（`try/finally` 组合常用于"记录日志但继续抛"）
- **`finally` 里的代码无论是否出错、是否 return，都会执行**

### finally 的清理用途

`finally` 专治"忘了收尾"：关 loading、释放资源、清除定时器、断开连接……这些不管成败都该做：

```javascript
function fetchData() {
  showLoading();
  try {
    const data = load();
    return data;                      // 成功：return 也会先走 finally
  } catch (err) {
    report(err);
    return [];                        // 失败：返回默认值
  } finally {
    hideLoading();                    // 两种路径都会执行到这里
  }
}
```

::: warning return 与 finally 的顺序
哪怕 try 里 `return` 了，**`finally` 也会先执行完才真正返回**。所以不要把"返回值计算"放进 finally——它可能覆盖 return 的结果，让人懵圈。
:::

## 异步错误处理

同步代码 try/catch 能直接接住；但**异步代码的错误不会自动冒泡到外层的 try/catch**，必须用对应语法接：

```javascript
// Promise 链：用 .catch() 接住 reject
fetch("/api/data")
  .then((res) => res.json())
  .catch((err) => console.error("请求失败:", err));

// async/await：用 try/catch 接住 await 抛出的错误
async function load() {
  try {
    const res = await fetch("/api/data");
    return await res.json();
  } catch (err) {
    console.error("请求失败:", err);
    return [];                        // 出错也返回默认值，页面不白屏
  }
}
```

::: tip 两种写法等价
`await` 只是把 Promise 的 `then/catch` 写成同步样式的语法糖。**`await` 抛出的错误 = Promise 的 reject**，所以 async 函数里用 try/catch，等价于 `.catch()`。
:::

### Promise 错误必须 catch

Promise 里的 reject 如果没人接，就会变成 `unhandledrejection`——**不打断其他代码、不崩页面，只在控制台留一条警告**。这比直接崩溃更危险：错误被**静默吞掉**，线上用户看到的是"无响应"，而你一无所知。

::: danger Promise 错误必须 catch
每个 Promise 链**必须要有 catch**（或 `await` + try/catch）。否则 reject 会变成 `unhandledrejection` 静默丢失——尤其 `fetch`、定时器、事件回调产生的 Promise，漏一个就是一次线上"灵异事件"。
:::

```javascript
// ❌ 危险：reject 后没人接，错误静默消失
fetch("/api/nope").then((res) => res.json());

// ✅ 正确：每个链都收尾
fetch("/api/nope")
  .then((res) => res.json())
  .catch((err) => console.error("请求失败:", err));
```

## 全局错误兜底

异步错误、事件回调里的错误，try/catch 经常鞭长莫及。生产环境靠**全局监听**做最后一道防线，并上报到监控平台（Sentry 等）：

```javascript
// 同步错误兜底：页面里任何未捕获的运行时错误都会到这里
window.addEventListener("error", (e) => {
  console.error("全局错误:", e.message, e.filename, e.lineno);
  reportToMonitor(e);               // 上报（含错误位置）
});

// Promise 错误兜底：未处理的 reject 都到这里
window.addEventListener("unhandledrejection", (e) => {
  console.error("未处理的 Promise 失败:", e.reason);
  reportToMonitor(e.reason);
});
```

::: tip 兜底不是万能
全局监听是"保险丝"，不是"灭火器"。它只能**记录**错误，救不回已经出错的流程。真正的修复还是要靠定位根因（见 08.3 调试方法论）。
:::

## 常见坑点

- **try/catch 抓不到 `setTimeout` 里的异步错误**——回调在另一个时间片执行，外层 try 早已结束：

```javascript
// ❌ 抓不到！
try {
  setTimeout(() => { throw new Error("异步错误"); }, 100);
} catch (err) {
  console.log("这里不会执行");
}

// ✅ 正确：在回调内部 try/catch，或用 Promise 管理异步任务
setTimeout(() => {
  try {
    risky();
  } catch (err) {
    console.error("异步回调里的错误:", err);
  }
}, 100);
```

- **不要用空 catch 吞错误**：`catch (e) {}` 会掩盖问题，至少 `console.error(e)`，最好再上报
- **catch 里抛出二次错误**：`catch` 里再 `throw` 会中断当前处理链，别在兜底逻辑里无意抛错
- **所有 Promise 都要收尾**：漏掉 catch 的 fetch 在线上只是 console 一条警告，用户却要面对"没反应"的页面
- **try/catch 包得太大**：一个 try 包整个函数，出错后不知道是哪一段出的——**缩小 try 范围**到真正危险的那一行

## 小结

- `try` 包风险代码、`catch` 处理错误、`finally` 无条件收尾（关 loading / 清资源）
- 异步错误各用各的语法：Promise 用 `.catch()`，async/await 用 try/catch
- Promise 的 reject 必须接住，否则变成 `unhandledrejection` 静默丢失
- 生产环境用 `window error` + `unhandledrejection` 全局兜底并上报
- `setTimeout` 回调里的错误外层 try/catch 抓不到，要在回调内部处理

::: tip 速查卡片
try/catch 模板与异步兜底写法速查，见 [错误与调试速查](/cheatsheet/data/error-debug)。
:::
