---
title: 01.4 交互方式
---

# 交互方式：与用户对话（alert/prompt/confirm）与开发者对话（console）

::: tip 前置要求需要先掌握 [如何运行 JavaScript](/03-js/01-foundation/02-how-to-run) 的浏览器控制台操作。本页的主角
`console` 与三个对话框都要在浏览器里运行。:::

## 它是什么

程序跑起来后，怎么"看见"它的结果？两类交互方式：

- **面向用户**：`alert` / `confirm` / `prompt`——浏览器弹出的原生对话框
- **面向开发者**：`console` 系列方法——输出到浏览器控制台，调试专用

新手阶段这两类是"验证代码是否生效"的最快手段，先掌握它们，后面的每个例子都能亲手跑出结果。

## 标准语法：与用户交互的三兄弟

### `alert(message)`——弹出一个"知道一下"的提示框

```javascript
alert("欢迎来到 JavaScript 世界");
```

**特点**：弹窗只有"确定"按钮，**阻塞**后续代码——用户点击前，后面的语句不会执行。适合"必须让用户看到"的提示。

### `confirm(message)`——弹出一个"是 / 否"的确认框

```javascript
const ok = confirm("确定要删除这条记录吗？");
console.log(ok); // 点"确定"→ true，点"取消"→ false
```

**特点**：**返回布尔值**（`true`/`false`），常配合 `if` 分支使用——这是它和 `alert` 的本质区别。

```javascript
if (confirm("要进入 VIP 模式吗？")) {
  alert("欢迎，尊贵的 VIP！");
} else {
  alert("普通模式继续努力");
}
```

### `prompt(message, default?)`——弹出一个"请输入"的输入框

```javascript
const name = prompt("你叫什么名字？");
console.log(name); // 用户输入的内容（字符串）
console.log(typeof name); // "string"
```

**特点**：

- 第二个参数是可选的**默认值**（预填在输入框里）
- 用户点"确定"→ 返回**输入内容（字符串）**；点"取消"→ 返回 `null`
- **⚠️ 返回的永远是字符串**：即使用户输入数字 `18`，得到的也是 `"18"`。要当数字用必须转换（见
  [类型转换](/03-js/01-foundation/07-type-conversion)）：

```javascript
const age = prompt("你的年龄？");
console.log(age + 1); // "181"（字符串拼接！）
console.log(Number(age) + 1); // 19（转成数字再算）
```

::: tip 一句话记住

`alert` 只告知 → 无返回值；`confirm` 问"是/否" → 返回布尔；`prompt` 问"输入什么" → 返回字符串或 `null`。

:::

## 标准语法：与开发者对话的 console 全家桶

`console` 不打扰用户，只在开发者工具里显示。它是调试的"主武器"，后面 [错误处理与调试](/03-js/08-error-debug/)
会系统讲，这里先认识最常用的：

```javascript
console.log("普通信息"); // 最常见的输出
console.info("提示信息"); // 信息级别（带 ℹ 图标）
console.warn("警告信息"); // 警告（黄色）
console.error("错误信息"); // 错误（红色）

// 查看对象/数组的结构化输出
const user = { name: "Alice", age: 18 };
console.log(user); // 可展开的对象树
console.table([user, { name: "Bob", age: 20 }]); // 表格视图

// 分组与清空
console.group("用户信息");
console.log(user);
console.groupEnd();
console.clear(); // 清空控制台
```

::: tip 与字符串拼接的快捷写法

`console.log` 支持**多个参数**与**占位符**，比字符串拼接更清晰：

```javascript
const price = 99;
console.log("价格是", price, "元"); // 多个参数
console.log(`价格是 ${price} 元`); // 模板字符串（数据类型页会讲）
```

:::

## 深入理解：阻塞、返回值与环境差异

### 1. 原生对话框是"阻塞式"的

`alert`/`confirm`/`prompt`
执行时，**当前页面所有 JS 暂停**，直到用户操作。这在需要"必须等到用户反馈"的场景是优点，但如果用得多会极其烦人——真实项目几乎不用原生对话框做交互（用页面内自定义弹窗替代），这里主要用于**学习阶段验证代码**。

### 2. 返回值类型是"分工"的关键

| 方法             | 返回值            | 典型用途   |
| ---------------- | ----------------- | ---------- |
| `alert(msg)`     | 无（`undefined`） | 单向告知   |
| `confirm(msg)`   | `true` / `false`  | 二选一决策 |
| `prompt(msg)`    | 字符串或 `null`   | 收集输入   |
| `console.log(x)` | 无（仅输出）      | 调试观察   |

### 3. 环境差异：浏览器才有这些

`alert`/`confirm`/`prompt`/`console` 都是**浏览器提供的 API**，不是 JS 语言本身的东西。Node.js 环境没有
`alert`/`confirm`/`prompt`（会报 `ReferenceError`），只有 `console`（且输出到终端）。

```bash
node -e "alert('hi')"        # ❌ ReferenceError: alert is not defined
node -e "console.log('hi')"  # ✅ hi
```

## 常见坑点

- **`prompt` 拿到的都是字符串**：`prompt("年龄")` 输入 `18` 得到 `"18"`，直接 `+ 1` 是字符串拼接，要 `Number()` 转换
- **`confirm` 点取消返回 `false` 而不是 `null`**：别写 `if (confirm(...) === null)`（除非你真的要区分）
- **`alert` 会阻塞**：循环里放 `alert` 会"弹窗风暴"卡死页面；调试循环用 `console.log` 就好
- **`console` 不是 `log` 专有**：错误排查时用 `console.error`/`console.warn`，控制台会高亮并可按级别过滤

## 小结

- **用户交互三兄弟**：`alert` 告知 / `confirm` 确认（布尔）/ `prompt` 输入（字符串或 `null`）
- **开发者交互**：`console.log/info/warn/error/table/clear` 输出到控制台，是调试主武器
- **原生对话框阻塞执行**，真实项目少用，学习阶段随便用
- **浏览器 API vs 语言本身**：`alert`/`prompt` 只在浏览器有，Node 只有 `console`

::: tip 速查卡片

`alert`/`confirm`/`prompt` 与 `console` 全家桶速查见
[JS 入门与运行手册](/3-reference/1-handbook/js/intro)；变量与数据类型相关速查见
[变量与数据类型速查](/cheatsheet/data/variable-type)；控制台调试技巧在 [调试方法论](/03-js/08-error-debug/03-debugging)
有完整梳理。

:::
