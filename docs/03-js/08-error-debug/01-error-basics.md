---
title: "08.1 错误基础"
---

# 错误基础：认识 Error 对象与错误类型

## 它是什么

程序出错时，JavaScript 引擎会**抛出一个 Error 对象**。你可以把它想象成快递派送失败时贴上的"异常回执"——回执上写明了：出了什么事（message）、这是哪类异常（name）、包裹从哪个网点一路转过来的（stack）。只有先看懂这张"回执"，你才知道去哪修。

```javascript
// 触发一个错误：读取 undefined 的属性
const obj = undefined;
console.log(obj.name);   // ❌ TypeError，控制台会打印出 Error 对象
```

::: tip 一句话记住
**错误不是玄学，而是引擎递给你的信息包。** 会读 Error 对象，就等于拿到了报错的"说明书"。
:::

## Error 对象三字段

每个 Error 对象都有三个关键字段，是最常用的排查入口：

| 字段 | 含义 | 用途 |
| --- | --- | --- |
| `message` | 错误描述文字 | 告诉用户/开发"哪里坏了" |
| `name` | 错误类型名（如 `TypeError`） | 区分错误类别 |
| `stack` | **调用栈**：从出错位置回溯到调用链 | 定位"谁触发了它" |

```javascript
try {
  undefinedVar.x = 1;              // undefinedVar 不存在
} catch (err) {
  console.log(err.name);           // "TypeError"
  console.log(err.message);        // "Cannot set properties of undefined (setting 'x')"
  console.log(err.stack);
  // TypeError: Cannot set properties of undefined (setting 'x')
  //     at <anonymous>:2:3
}
```

::: warning 别只看 message
`message` 只告诉你"表面症状"，**真正的线索在 `stack`**。排查时优先复制整段 `stack`，而不是只抄报错文字。
:::

## 内置错误类型

JS 内置了若干 `Error` 的子类，出错时会**自动按场景选择对应类型**。记住这 4 个最常见的：

| 类型 | 触发场景 | 典型例子 |
| --- | --- | --- |
| `TypeError` | 对错误的值类型做操作 | `undefined.x`、`null()`、`1.push()` |
| `ReferenceError` | 访问不存在的变量 | `console.log(nope)` |
| `RangeError` | 数值超出合法范围 | 递归过深、`new Array(-1)` |
| `SyntaxError` | 语法错误（**编译期**） | 少写括号、中文引号 |

```javascript
// TypeError：undefined 身上没有属性可读
undefined.x;                        // TypeError: Cannot read properties of undefined
// ReferenceError：访问未声明的变量
console.log(ghost);                 // ReferenceError: ghost is not defined
// RangeError：递归没有出口，栈被撑爆
function loop() { loop(); } loop(); // RangeError: Maximum call stack size exceeded
```

### SyntaxError 抓不到

`SyntaxError` 是**唯一特殊**的：它在代码**编译阶段**就报错，此时代码根本还没运行。因此 try/catch 在运行时**永远接不到它**——控制台直接红字，脚本直接不执行。

```javascript
// 这段代码是"病句"，编译期就被拒了，try 根本没机会执行
try {
  const a = 1 + ;                  // ❌ SyntaxError: Unexpected token ';'
} catch (err) {
  console.log("抓不到这里");
}
```

::: danger SyntaxError 只能靠"写对"
`SyntaxError` 不是运行时错误，**try/catch 对它是无效的**。唯一的解法是：用 IDE 的语法高亮、编辑器报错提示、或运行 `node --check 文件.js` 提前检查。
:::

## 错误传播链

没被 catch 的错误会**沿调用栈一级一级向上抛**——像接力棒一样，谁都没接住，就一路抛到最外层：

```
fnC 抛错 → fnB 没 catch → 继续向上抛
  → fnA 有 try/catch → 被捕获 ✅ / 全部没接 → 到达全局（控制台红字 + window.onerror）
```

```javascript
function fnC() { throw new Error("内层出错"); }
function fnB() { fnC(); }          // 没处理，继续抛
function fnA() {
  try {
    fnB();
  } catch (err) {
    console.log("被 fnA 接住:", err.message);   // "被 fnA 接住: 内层出错"
  }
}
fnA();
```

::: tip 传播链的意义
你不需要在**每一层**都写 try/catch——错误会自动向上冒泡。通常的做法是：**在业务入口（顶层）统一兜底**，中间层只处理自己"能补救"的错误。
:::

## throw 主动抛错

除了引擎自动抛错，你也可以**主动 throw**，把"业务逻辑上不允许的情况"变成明确的错误信号：

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为 0");   // 主动抛错
  }
  return a / b;
}

try {
  divide(1, 0);
} catch (err) {
  console.log(err.message);            // "除数不能为 0"
}
```

::: warning throw 要抛 Error 对象
`throw "error"`（抛字符串）虽然能跑，但会丢掉 `stack` 等关键信息。**永远 `throw new Error("可行动的描述")`**——描述里写明"哪个操作、什么条件下、期望什么"，比 `throw "error"` 有用一百倍。
:::

## 自定义错误类型

内置类型不够用时，可以用 `class extends Error` 定义自己的错误，附加业务字段，再用 `instanceof` **按类型区分处理**：

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";    // 覆盖类型名
    this.field = field;               // 附加业务字段：哪个字段不合法
  }
}

try {
  throw new ValidationError("邮箱格式不对", "email");
} catch (err) {
  if (err instanceof ValidationError) {        // 按类型精确处理
    console.log(`字段 ${err.field}: ${err.message}`);
  } else {
    console.log("未知错误", err);
  }
}
```

::: tip instanceof 的精髓
`instanceof` 判断的是"继承链上有没有这个类"。用它能写出**多分支的纠错逻辑**：`ValidationError` 走表单提示、`NetworkError` 走重试、其他错误走兜底上报——职责清晰，互不干扰。
:::

## 常见坑点

- **`name` 不传会被覆盖**：自定义错误里忘了 `this.name = "XxxError"`，`err.name` 就是默认的 `"Error"`，`instanceof` 仍可用但日志不直观
- **`message` 写成玄学**：`throw new Error("出错")` 让人无从下手，要写"哪一步 + 失败原因 + 期望结果"
- **用空 catch 吞错误**：`catch (e) {}` 会让 bug 静默消失，至少 `console.error(e)`
- **`JSON.parse` 可能抛错**：解析不可信字符串时用 try/catch 包一层，否则直接中断后续逻辑
- **把 `stack` 当噪音**：`err.stack` 第一行是类型+消息，往下是从里到外的调用链，排查必看

## 小结

- Error 对象三字段：`message` 描述、`name` 类型、`stack` 调用栈（排查主线索）
- 四大内置类型：`TypeError` / `ReferenceError` / `RangeError` 运行时可 catch，`SyntaxError` 编译期抓不到
- 错误沿调用栈**向上传播**，直到被 catch 或到达全局
- 业务异常用 `throw new Error(...)` 主动暴露，需要区分用 `class extends Error` + `instanceof`

::: tip 速查卡片
错误类型表、throw 模板与自定义错误速查，见 [错误与调试速查](/cheatsheet/data/error-debug)。
:::
