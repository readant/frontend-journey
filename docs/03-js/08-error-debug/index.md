---
title: 08. 错误处理与调试
---

# 错误处理与调试

## 它是什么

**错误处理**是让程序在出错时"优雅失败"而不是"直接崩溃"的机制；**调试**是定位错误根因的方法论。两者是前端开发者的日常：代码总会出错，区别在于你会不会**主动兜底**和**快速定位**。

```javascript
// 错误处理：把可能出错的代码包起来
try {
  const data = JSON.parse(str);
} catch (err) {
  console.error("解析失败:", err.message);
}
```

## 核心机制

### 1. Error 对象与类型

所有错误都是 `Error` 的子类，包含三个关键字段：

| 字段 | 含义 |
| --- | --- |
| `message` | 错误描述 |
| `name` | 错误类型名（如 `TypeError`） |
| `stack` | **调用栈**：从出错位置回溯到调用链 |

```javascript
try {
  undefinedVar.x = 1;
} catch (err) {
  console.log(err.name);     // "TypeError"
  console.log(err.message);  // "Cannot set properties of undefined"
  console.log(err.stack);    // 完整调用栈（定位根因的关键）
}
```

内置错误类型：

| 类型 | 触发场景 |
| --- | --- |
| `TypeError` | 对错误类型调用方法（`undefined.x`、`null()`） |
| `ReferenceError` | 访问不存在的变量 |
| `RangeError` | 数值超出合法范围（递归过深） |
| `SyntaxError` | 语法错误（**编译期**，try/catch 抓不到） |

### 2. 错误传播

未捕获的错误会**沿调用栈向上抛**，直到被 catch 或到达全局：

```
fnC 抛错
  → fnB 未 catch → 向上抛
  → fnA 有 try/catch → 被捕获 ✅
  → 都没有 → 全局（浏览器控制台红字 + window.onerror）
```

## 标准语法

### try / catch / finally

```javascript
try {
  // 可能出错的代码
  const data = JSON.parse(maybeBroken);
  use(data);
} catch (err) {
  // 出错时执行（err 是错误对象）
  console.error("出错:", err);
  fallback();                 // 兜底逻辑
} finally {
  // 无论成败都执行（清理：关 loading、释放资源）
  hideLoading();
}
```

### throw 主动抛错

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为 0");   // 主动抛错，调用方必须处理
  }
  return a / b;
}

try {
  divide(1, 0);
} catch (err) {
  console.log(err.message);   // "除数不能为 0"
}
```

### 自定义错误类型

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";   // 覆盖类型名
    this.field = field;
  }
}

try {
  throw new ValidationError("邮箱格式不对", "email");
} catch (err) {
  if (err instanceof ValidationError) {   // 按类型区分处理
    console.log(`字段 ${err.field}: ${err.message}`);
  } else {
    console.log("其他错误", err);
  }
}
```

### 异步错误处理

```javascript
// Promise：reject 错误要用 catch 接住
fetch("/api/data")
  .then(res => res.json())
  .catch(err => console.error("请求失败:", err));

// async/await：try/catch 接住
async function load() {
  try {
    const res = await fetch("/api/data");
    return await res.json();
  } catch (err) {
    console.error("请求失败:", err);
    return [];
  }
}
```

::: danger Promise 错误必须 catch
Promise 里的 reject 如果没有被 `catch`/`await` 接住，会变成 `unhandledrejection`——**不报错地静默丢失**（或只在控制台警告）。每个 Promise 链都要有 catch。
:::

### 调试工具：Console

```javascript
console.log(obj);            // 基础输出
console.log("%c彩色文字", "color:red;font-size:20px");
console.table(users);        // 表格展示数组/对象数组
console.group("分组");       // 折叠分组
console.groupEnd();
console.time("耗时");        // 计时开始
// ...代码...
console.timeEnd("耗时");     // 计时结束（输出毫秒）
console.trace();             // 打印调用栈
console.error("红色错误");   // 错误样式
console.warn("黄色警告");    // 警告样式
```

## 深入理解

### 1. 错误栈的读法

```
TypeError: Cannot read properties of undefined (reading 'x')
    at showName (app.js:12:5)
    at render (app.js:20:9)
    at init (app.js:31:3)
```

**自下而上读**：最上面是出错的确切位置（`app.js` 第 12 行第 5 列），往下是"谁调用了它"的链路。先看最上层定位错误，再往下看是哪个流程触发。

### 2. 全局错误兜底

```javascript
// 同步错误兜底
window.addEventListener("error", (e) => {
  console.error("全局错误:", e.message);
  // 上报到监控平台（Sentry 等）
});

// Promise 错误兜底
window.addEventListener("unhandledrejection", (e) => {
  console.error("未处理的 Promise 失败:", e.reason);
});
```

### 3. Source 面板调试流程（断点三连）

1. **下断点**：点击行号，或条件断点（右键 → 编辑断点条件）
2. **触发 + 步进**：`F10` 单步跳过、`F11` 单步进入（进函数内部）、`F8` 继续
3. **观察**：Watch 面板跟踪表达式、Call Stack 看调用链、Scope 看变量

```javascript
// 也可以代码里写 debugger 语句：执行到这一行自动暂停
function process(data) {
  const normalized = data.map(...);
  debugger;                  // 到这里暂停，可检查 normalized
  return normalized;
}
```

### 4. Source Map：压缩代码也能调试

线上代码经过压缩（变量名变 a、b），Source Map 记录"压缩代码 ↔ 源码"的映射。DevTools 会自动读取 `.map` 文件，让你在压缩产物上也能看到**原始源码和行号**——这就是生产环境报错仍能定位到源码的原因。

### 5. 调试方法论（比工具更重要）

1. **复现**：先稳定复现 bug（最小化触发条件）
2. **二分定位**：用断点/console.log 二分缩小范围，先判断"数据对不对"还是"渲染对不对"
3. **检查输入**：出错前先看函数入参（最常见 bug 是参数不是预期的类型/值）
4. **看调用栈**：从 stack 自下而上找"是谁错误地调用了它"
5. **验证修复**：修复后反向验证（原来触发 bug 的输入现在正常）

### 6. 常见坑点

- **`JSON.parse` 不是百无一失**：来源不可信就 try/catch，或先用 `JSON.stringify` 调试看结构
- **`try/catch` 抓不到 `setTimeout` 里的异步错误**：

```javascript
try {
  setTimeout(() => { throw new Error("异步错误"); }, 100);
} catch (err) {
  // 抓不到！异步回调在另一个"时间片"执行
}
// 正确：在 setTimeout 回调内部 try/catch，或用 Promise 管理
```

- **不要用空 catch 吞错误**：`catch (e) {}` 会掩盖问题，至少要 `console.error(e)`
- **错误信息要可行动**：`throw new Error("调用 getData 时网络请求失败")` 比 `throw "error"` 有用地多

## 关联速查

::: tip 速查卡片
try/catch 模板、console 方法、错误类型表速查，见 [错误与调试速查](/cheatsheet/data/error-debug)。
:::

::: info 延伸阅读
调试规范细节，见 [MDN - 控制台 API](https://developer.mozilla.org/zh-CN/docs/Web/API/console)。
:::
