---
title: "08.3 调试方法论"
---

# 调试方法论：从 console 到断点

## 它是什么

调试是**定位错误根因的方法论**，不是运气活。如果把报错比作"家里跳闸"，console.log 是拿电笔挨个插座试，断点则是直接在关键开关上装"监控器"——走到那里就暂停，让你看清楚电流（数据）当时到底是什么状态。工具是次要的，**一套可重复的排查流程才是核心**。

::: tip 一句话记住
**调试 = 缩小范围 + 看清状态。** 工具（console / 断点 / Source Map）都是为了这两个目标服务。
:::

## Console 方法大全

`console` 不只是 `log`，用对方法能大幅提高"看到问题"的效率：

```javascript
console.log(obj);                        // 基础输出（展开对象结构）
console.log("%c彩色文字", "color:red;font-size:20px");   // %c 自定义样式
console.table(users);                    // 数组/对象数组 → 表格视图，比对字段超方便
console.group("请求阶段");                // 折叠分组：把相关日志收在一起
console.log("step 1");
console.groupEnd();                      // 结束分组

console.time("计算耗时");                 // 计时开始
heavyWork();
console.timeEnd("计算耗时");              // 输出 "计算耗时: 12.3 ms"

console.trace();                         // 打印当前调用栈（谁调到了这里）
console.error("红色错误");                // 错误样式（带 stack）
console.warn("黄色警告");                 // 警告样式
```

::: tip 什么时候用哪个
- **看数据结构** → `console.table` / `console.log`
- **怀疑性能** → `console.time` / `timeEnd` 测耗时
- **想知道"谁调用了这个函数"** → `console.trace`
- **确认执行顺序** → `console.group` 把日志分组，一眼看出哪段先跑
:::

## 错误栈的读法

报错时的 `stack` 是**自下而上**读的——最上面是出错的确切位置，往下是"谁调用了它"的整条链路：

```
TypeError: Cannot read properties of undefined (reading 'x')
    at showName (app.js:12:5)        ← ① 真正出错的地方（第 12 行第 5 列）
    at render (app.js:20:9)          ← ② render 调用了 showName
    at init (app.js:31:3)            ← ③ init 调用了 render
```

排查顺序：先看**第一行**确认出错的代码位置 → 再看下面的 `at` 逐层回溯，找出是**哪个流程、哪个调用**把错误引到了这里。

::: warning 别从下往上读
错误栈和阅读顺序相反。新手最容易犯的错是盯着最后一层看——那只是最外层的入口，**真正的病灶永远在栈顶（最里层）**。
:::

## Source 面板断点三连

浏览器 DevTools 的 Sources（源代码）面板是断点调试的主战场，核心就三步：

1. **下断点**：点击行号打点（红点即断点）；右键 → "编辑断点条件"可打**条件断点**，如 `i === 5` 时才停
2. **触发 + 步进**：`F10` 单步跳过（不进入函数）、`F11` 单步进入（钻进函数内部）、`F8` 继续执行到下一个断点
3. **观察**：三个面板配合使用——**Watch** 跟踪表达式（如 `data.length`）、**Call Stack** 看调用链、**Scope** 看当前作用域所有变量

```javascript
function process(data) {
  const normalized = data.map((x) => x * 2);
  const filtered = normalized.filter((x) => x > 5);   // ← 在这里下断点
  return filtered;
}
```

::: tip 断点的优势
断点比 console.log 强在**"暂停时全部现场"**：那一刻所有变量的值、调用链、执行位置都是活的，可以任意检查。console.log 只能看到你"提前想到要打印"的东西。
:::

## debugger 语句

不想用鼠标点行号？可以在代码里直接写 `debugger` 语句——**执行到这一行自动暂停**，等价于在这里下断点：

```javascript
function process(data) {
  const normalized = data.map(...);
  debugger;                     // 执行到这里暂停，可检查 normalized 的值
  return normalized;
}
```

::: warning 上线前删掉 debugger
`debugger` 在用户浏览器里也会生效——线上环境遇到它页面直接暂停，**发布前务必删除**（或用构建工具的 strip-debugger 插件统一清理）。
:::

## Source Map 原理

线上代码是压缩过的（变量名变成 `a`、`b`，多行并成一行），报错行号根本无法对应源码。**Source Map**（`.map` 文件）就是"压缩代码 ↔ 源码"的映射表，DevTools 会自动读取并还原出**原始源码、原始行号**——这就是生产环境报错仍能定位到源码的原因。

```javascript
// 压缩产物（真实运行的是它）
function p(d){const n=d.map(function(x){return x*2});return n}

// Source Map 让 DevTools 给你看的是这个（源码）
function process(data) {
  const normalized = data.map((x) => x * 2);
  return normalized;
}
```

::: tip 构建工具默认带
webpack / Vite 生产构建默认会产出 `.map` 文件，只是**不要把 `.map` 部署到公网**（会泄露源码）——放内网监控平台或只供开发调试使用。
:::

## 五步调试方法论

比任何工具都重要的是这套**可复用的排查流程**：

1. **复现**：先稳定复现 bug——最小化触发条件（"点 A 再点 B 才崩"比"偶尔崩"好查一百倍）
2. **二分定位**：用断点 / console.log 把范围一分为二，先判断是"**数据不对**"还是"**渲染不对**"，逐层收窄
3. **检查输入**：出错前先看函数**入参**——最常见的 bug 就是参数不是预期的类型/值（比如该传数组传了 `undefined`）
4. **看调用栈**：从 `stack` 自下而上找"是谁错误地调用了它"，而不是盯着报错行猜
5. **验证修复**：修复后用**原来触发 bug 的输入**反向验证；再跑一遍边界输入，确保没修出新问题

::: danger 最常见的调试误区
跳过"复现"直接改代码、跳过"检查输入"直接改逻辑、修完不验证。**三步都是省时间的关键**——90% 的 bug 在"检查输入"这一步就真相大白了。
:::

## 常见坑点

- **console.log 打印对象是"活的"**：展开时看到的是**展开那一刻**的值，不是打印那一刻的——需要看历史快照用 `console.log(JSON.stringify(obj))`
- **只 log 不分组**：日志一多就分不清先后，用 `console.group` 或加 `[函数名]` 前缀
- **断点打在压缩代码上**：线上的 app.js 是压缩产物，断点没意义——记得开启 Sources 里的 Source Map 支持
- **修完不验证**：改一行就"感觉好了"，结果边界情况又崩——按五步法的第 5 步反向验证
- **`debugger` 残留上线**：页面在用户端莫名暂停，多半是忘了删 `debugger`

## 小结

- `console` 全家桶：`table` 看数据、`time` 测性能、`trace` 查调用链、`group` 理顺序、`%c` 上色
- 错误栈**自下而上**读，栈顶是出错确切位置，往上是调用链
- Source 面板断点三连：下断点 → `F10`/`F11`/`F8` 步进 → Watch / Call Stack / Scope 观察
- `debugger` 语句=代码里的断点，上线前必删
- Source Map 让压缩产物也能映射回源码调试
- 五步方法论：**复现 → 二分定位 → 检查输入 → 看调用栈 → 验证修复**

::: tip 速查卡片
console 方法清单与断点快捷键速查，见 [错误与调试速查](/cheatsheet/data/error-debug)。
:::
