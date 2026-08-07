---
title: JS 入门与运行完整手册
---

# JS 入门与运行

## 核心概念

「代码写在哪、怎么跑起来、怎么看到结果」是 JS 的第一课：三种运行方式（控制台 / `<script>` /
Node.js）、三种网页引入形式、语句与表达式、四组交互 API。跑起第一行 JS，从这里出发。

## 完整内容

### 一、三种运行方式

| 方式            | 环境          | 适用场景                       | 上手 |
| :-------------- | :------------ | :----------------------------- | :--- |
| 浏览器控制台    | F12 → Console | 试一句代码、调试               | ★    |
| HTML `<script>` | 浏览器        | 网页开发（正式写法）           | ★★   |
| Node.js         | 命令行        | 脱离浏览器跑 JS、写工具/服务端 | ★★   |

```bash
# 控制台：输入后回车立即出结果
> 1 + 2
3

# Node.js：运行文件 / 直接执行字符串
node app.js
node -e "console.log(1 + 2)"
```

### 二、网页引入 JS 三种形式

| 形式     | 写法                             | 定位                               |
| :------- | :------------------------------- | :--------------------------------- |
| 内联脚本 | `<script>代码</script>`          | 小段代码 / 教学演示                |
| 外部脚本 | `<script src="app.js"></script>` | **正式项目首选**（可复用、可缓存） |
| 事件属性 | `<button onclick="alert('hi')">` | 老式写法，仅用于看得懂旧代码       |

```html
<!-- 外部脚本：中间不写任何代码（写了会被忽略） -->
<script src="app.js"></script>

<!-- 放 </body> 前，或加 defer：保证 DOM 就绪再执行 -->
<script defer src="app.js"></script>
```

::: tip 约定习惯

- 正式项目**首选外部脚本**：一个 `.js` 文件可复用、可缓存
- `<script>` 放 `</body>` 前或加 `defer`，避免"元素还没出来就操作"
- 事件属性写法（`onclick`）别在自己项目里用，用 `addEventListener`

:::

### 三、语句、表达式与分号

| 概念   | 定义                       | 例子                            |
| :----- | :------------------------- | :------------------------------ |
| 表达式 | **产生一个值**的片段       | `1 + 2`、`x > 3`、`user?.name`  |
| 语句   | **执行一个动作**的完整命令 | `let a = 1;`、`console.log(a);` |
| 分号   | 语句结束符；统一显式加分号 | `let a = 1;`                    |

```javascript
// 统一加分号，避开自动分号插入（ASI）的坑
let a = 1;
a = a + 1;
console.log(a);

// 经典 ASI 坑：return 换行会被拆成两句
function test() {
  return; // ❌ 提前返回 undefined
  1 + 2;
}
```

::: tip 约定习惯

- **统一加分号**（本项目约定），显式分号让语句边界一目了然
- 注释讲"为什么"，不照抄"是什么"
- 缩进统一 2 空格；编辑器和 Prettier 负责统一风格

:::

### 四、交互 API 速查

**与用户交互（浏览器专属，阻塞式）**：

| API                    | 作用     | 返回值              | 代码                       |
| :--------------------- | :------- | :------------------ | :------------------------- |
| `alert(msg)`           | 弹提示框 | 无（`undefined`）   | `alert("你好")`            |
| `confirm(msg)`         | 弹确认框 | `true` / `false`    | `if (confirm("继续？"))`   |
| `prompt(msg, 默认值?)` | 弹输入框 | **字符串**或 `null` | `const n = prompt("年龄")` |

**与开发者交互（console 全家桶）**：

| API                                      | 作用                  | 代码                      |
| :--------------------------------------- | :-------------------- | :------------------------ |
| `console.log(x)`                         | 普通输出              | `console.log(user)`       |
| `console.warn(x)` / `console.error(x)`   | 警告 / 报错（高亮）   | `console.error("出错了")` |
| `console.table(arr)`                     | 表格视图（对象/数组） | `console.table(users)`    |
| `console.group()` / `console.groupEnd()` | 分组折叠              | 调试多段日志              |
| `console.clear()`                        | 清空控制台            | —                         |

```javascript
// ⚠️ prompt 返回的永远是字符串：输入 18 得到 "18"
const age = prompt("你的年龄？");
console.log(age + 1); // "181"（字符串拼接！）
console.log(Number(age) + 1); // 19（转数字再算）
```

::: tip 环境差异

`alert` / `confirm` / `prompt` 是**浏览器 API**，Node.js 没有（会报 `ReferenceError`）；`console` 两边都有。

:::

## 常见坑点

- **`prompt` 拿到的是字符串**：直接 `+ 1` 是拼接，要用 `Number()` 转换
- **`alert` 会阻塞**：循环里放 `alert` 会弹窗风暴，调试用 `console.log`
- **`<script src>` 又写代码**：内嵌部分被忽略且不报错，容易莫名"没效果"
- **Node 里用浏览器 API**：`alert` / `document` 直接 `ReferenceError`

## 关联学习

- 📖 学习层详解：[初识 JavaScript](/03-js/01-foundation/01-javascript-intro) ·
  [如何运行](/03-js/01-foundation/02-how-to-run) · [程序的基本结构](/03-js/01-foundation/03-program-structure) ·
  [交互方式](/03-js/01-foundation/04-interaction)
- 🔍 相邻手册：[变量与类型](/3-reference/1-handbook/js/variables) · [运算符](/3-reference/1-handbook/js/operators)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
