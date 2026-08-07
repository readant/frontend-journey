---
title: 01.2 如何运行 JavaScript
---

# 如何运行 JavaScript：代码写在哪、如何被执行

## 它是什么

"代码写在哪、怎么让它跑起来"是每个新手的第一个现实问题。JavaScript 有**三种主流运行方式**，各有适用场景：

| 方式                 | 运行环境                | 适合场景                       | 上手难度 |
| -------------------- | ----------------------- | ------------------------------ | -------- |
| ① 浏览器控制台       | Chrome/Edge 的 DevTools | 随手试一句代码、调试           | ★        |
| ② HTML 中 `<script>` | 浏览器                  | 网页开发（正式写法）           | ★★       |
| ③ Node.js            | 本地命令行              | 脱离浏览器跑 JS、写工具/服务端 | ★★       |

## 标准语法：三种方式逐一上手

### 方式一：浏览器控制台（最快，零文件）

1. 打开任意网页（或空白标签页），按 **F12**（或右键 → 检查）
2. 切到 **Console（控制台）** 标签
3. 在 `>` 提示符后输入代码，回车立即执行

```javascript
> 1 + 2
3

> const greeting = "Hello, JS!";
> console.log(greeting);
Hello, JS!
```

控制台会**直接打印表达式的结果**（输入 `1 + 2` 就回显
`3`），还能自动补全、查看变量。它是新手最重要的"试验田"，本书所有代码都建议先在控制台敲一遍。

::: tip 一句话记住

**F12 → Console → 输入代码回车**：这是 5 秒内跑起 JS 的唯一路径，也是后续调试的主战场。

:::

### 方式二：HTML 中引入 JS（网页标配）

在 HTML 文件里引入 JavaScript，有**三种形式**：前两种负责"写代码"（内联/外部），第三种是绑事件的**老式写法**（现在只用来"看得懂"）。浏览器打开页面时，写进来的 JS 会自动执行。

**① 内联脚本（inline）**——JS 直接写在 `<script>` 标签里：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>第一个脚本</title>
  </head>
  <body>
    <h1>我的第一个页面</h1>

    <script>
      // 页面加载时会执行这里
      console.log("JS 运行起来了！");
      alert("欢迎来到 JS 世界");
    </script>
  </body>
</html>
```

**② 外部脚本（external）**——JS 写在独立的 `.js` 文件里，用 `src` 引入（推荐：HTML 与 JS 分离，便于维护）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>第一个脚本</title>
  </head>
  <body>
    <h1>我的第一个页面</h1>

    <!-- 通过 src 引入外部 .js 文件 -->
    <script src="app.js"></script>
  </body>
</html>
```

```javascript
// app.js（与 HTML 同目录）
console.log("我是外部文件里的 JS");
```

**③ 事件属性（HTML attribute）**——直接在 HTML 标签上用 `onclick` 等属性写 JS：

```html
<button onclick="alert('你点了我！')">点我</button>
```

::: warning 为什么说它是"老式写法"

事件属性把 JS 散落在 HTML 里，代码难维护、难复用；且属性里的代码在**全局作用域**执行，容易造成变量污染。现代写法是**事件监听**（第 6 章 DOM 操作会讲）：`document.getElementById("btn").addEventListener("click", ...)`。这里提它，只是为了让你**看得懂老代码/别人的代码**，自己写请用外部脚本。

:::

::: tip 约定俗成的编写习惯

- 外部脚本**不带内容**，`<script src="app.js"></script>` 中间不写任何代码（写了会被忽略）
- `<script>` 通常放在 `</body>` 之前，保证脚本执行时 DOM 已解析完毕（或使用 `defer` 属性，见下）
- 一个页面可以引入**多个** `<script>`（含内联 + 外部混用），按出现顺序依次执行
- 正式项目**首选外部脚本**：一个 `.js` 文件可供多个页面复用，且浏览器会缓存它

:::

### 方式三：Node.js（脱离浏览器运行）

安装了 Node.js 后，JS 就能像脚本语言一样在命令行运行：

```bash
# 1. 准备一个 JS 文件 app.js，内容：console.log("Hello from Node!");
# 2. 运行
node app.js
# 输出：Hello from Node!
```

也可以直接执行字符串：

```bash
node -e "console.log(1 + 2)"
# 输出：3
```

::: tip 与浏览器的区别

Node.js 环境**没有
`alert`/`prompt`/DOM**（这些是浏览器提供的 API），但能访问文件系统、网络等系统能力。同一个 JS 语法，在两个环境的"可用 API"不同——第 6 章 DOM 操作、第 7 章模块化时会再次遇到这个差异。

:::

## 深入理解：脚本加载时机（为什么 `<script>` 要放对位置）

浏览器解析 HTML 是**从上到下**的，遇到 `<script>` 会**先下载并执行 JS，再继续解析后面的 HTML**。如果脚本放在 `<head>`
里且代码要操作按钮等元素，会因元素还没解析到而报错：

```html
<head>
  <script>
    // ❌ 此时 <button> 还没解析，拿到的是 null
    document.getElementById("btn").onclick = () => {};
  </script>
</head>
<body>
  <button id="btn">按钮</button>
</body>
```

两种正确姿势：

1. **放 `</body>` 前**（最常用，简单直接）
2. 加 `defer` 属性：告诉浏览器"先下载，等 HTML 解析完再执行"，可以放 `<head>` 里

```html
<head>
  <script defer src="app.js"></script>
</head>
```

::: tip 为什么推荐 `defer`

`defer` 让脚本**不阻塞页面解析**，且保证执行时 DOM 已就绪——性能与正确性兼得，是现在的主流做法。本书示例多用"放 `</body>`
前"便于理解，实际项目建议 `defer`。

:::

## 常见坑点

- **F12 控制台不是 HTML 页面**：在控制台输入 `alert()` 会弹窗，但输入 HTML 标签不会生效（那是 HTML 的事）
- **外部脚本路径写错**：`<script src="app.js">` 相对路径基于**当前 HTML 文件**的位置，路径不对控制台会报 404
- **`<script>` 内嵌代码被忽略**：用了 `src` 又写代码，内嵌部分不执行且不报错，容易莫名"没效果"
- **Node 环境没有浏览器 API**：`alert`、`document` 在 Node 里会报 `ReferenceError`

## 小结

- **三种运行方式**：浏览器控制台（试验）→ HTML `<script>`（网页）→ Node.js（脱离浏览器）
- **网页引入 JS 三种形式**：内联脚本 / 外部脚本 `src` / 事件属性（老式）；正式项目首选**外部脚本**
- **新手路径**：先控制台练语法 → 再 `<script>` 引入做网页 → 最后 Node.js 跑脚本
- **`<script>` 放 `</body>` 前或加 `defer`**，避免"元素还没出来就操作"
- **环境决定 API**：浏览器有 DOM、Node 有文件系统，语法共通

::: tip 速查卡片

运行方式、网页引入形式的完整速查，见 [JS 入门与运行手册](/3-reference/1-handbook/js/intro)。

:::

::: tip 延伸阅读

`defer` 与 `async` 的完整对比、脚本加载性能细节，见
[MDN - script 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)。

:::
