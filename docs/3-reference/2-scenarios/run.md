---
title: 运行与调试场景速查
---

# 运行与调试场景速查

## 一句话定位

「我要运行 JS / 让代码跑起来 / 看程序输出」—— 新手起步的第一个场景，所有调试从这里开始。

## 核心解法

运行三选一，完整原理见 📖 [JS 入门与运行手册](/3-reference/1-handbook/js/intro)。

## 速查摘要

### 我该在哪运行？

| 需求 | 首选方案 |
| :--- | :--- |
| 试一句代码、练语法 | 浏览器 **F12 → Console**，输入回车立即出结果 |
| 做网页 | HTML 里加 `<script>`（内联或外部 `src`） |
| 跑脚本/工具/服务端 | `node app.js` |

### 网页里怎么引入 JS？

| 形式 | 写法 | 什么时候用 |
| :--- | :--- | :--- |
| 内联脚本 | `<script>代码</script>` | 小段演示代码 |
| 外部脚本 | `<script src="app.js"></script>` | **正式项目首选** |
| 事件属性 | `<button onclick="...">` | 仅看老代码（自己别写） |

### 怎么看输出 / 调试？

| 意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| 打印普通信息 | `console.log` | `console.log(user)` |
| 警示 / 报错 | `console.warn` / `console.error` | `console.error("出错了")` |
| 看对象/数组结构 | `console.table` | `console.table(users)` |
| 需要用户确认 | `confirm` | `if (confirm("继续？"))` |
| 收集用户输入 | `prompt` | `const n = prompt("年龄")`（⚠️ 返回字符串） |

### 最常见的报错

| 报错 | 含义 | 修复 |
| :--- | :--- | :--- |
| `xxx is not defined` | 变量没声明 / 大小写写错 | 检查拼写与声明 |
| `SyntaxError` | 语法错误（如全角符号） | 检查 `;` `()` 是否为英文半角 |
| `ReferenceError: alert is not defined` | 在 Node 里用了浏览器 API | 改用 `console.log` 或换浏览器环境 |

## 完整阅读

📖 手册章节：

- [JS 入门与运行（运行方式 / 引入形式 / 语句表达式 / 交互 API）](/3-reference/1-handbook/js/intro)

## 选型口诀

> **练手控制台，做页 script，跑脚本 node；看输出 console，问用户 confirm，收输入 prompt。**

## 相关

- 🔍 相邻场景：[异步场景](/3-reference/2-scenarios/async)、[事件场景](/3-reference/2-scenarios/event)
- 📖 学习层详解：[如何运行 JavaScript](/03-js/01-foundation/02-how-to-run) · [程序的基本结构](/03-js/01-foundation/03-program-structure)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
