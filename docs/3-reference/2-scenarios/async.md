---
title: 异步场景速查
---

# 异步场景速查

## 一句话定位

「我要等网络请求返回 / 让任务按顺序执行」—— 所有异步类需求从这里出发。

## 核心解法

异步三件套对照如下，完整原理见 📖 [JS 异步手册](/3-reference/1-handbook/js/async)。

## 速查摘要

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **发起网络请求** | `fetch` | `const res = await fetch(url); const data = await res.json();` |
| **等一个 Promise** | `await` | `await promise`（必须包在 async 函数里） |
| **多个请求并行** | `Promise.all` | `Promise.all([fetch(a), fetch(b)])`（谁慢等谁，一起返回） |
| **多个请求竞速** | `Promise.race` | 返回**第一个**落定的结果（如超时兜底） |
| **多个请求任一成功** | `Promise.any` | 返回第一个成功的（全失败才 reject） |
| **全部失败才报错** | `Promise.allSettled` | 每个结果都返回 `{status, value/reason}`，不中断 |
| **定时延迟** | `setTimeout` 封装 | `await new Promise(r => setTimeout(r, 1000))` |
| **错误兜底** | `try/catch` | `try { await p() } catch (e) { /* 降级处理 */ }` |
| **串行任务队列** | for...of + await | `for (const t of tasks) await t()`（逐个完成） |

## 完整阅读

📖 手册章节：

- [JS 异步（回调 / Promise / async-await / fetch 并发）](/3-reference/1-handbook/js/async)

## 相关代码

📦 代码骨架（建设中）：请求封装、超时控制、串行队列等完整片段将收录于 [代码骨架](/3-reference/) 区。

## 选型口诀

> **await 单发，all 并行，race 竞速，allSettled 全查。先 await 后 catch，超时交给 race。**

## 相关

- 🔍 相邻场景：[数据处理](/3-reference/2-scenarios/data)、[事件场景](/3-reference/2-scenarios/event)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
