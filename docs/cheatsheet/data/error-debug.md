---
title: 错误与调试速查
---

# 错误与调试速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 包裹可能出错的代码 | `try/catch/finally` |
| 主动抛错给调用方 | `throw new Error("描述")` |
| 区分错误类型 | `err instanceof ValidationError` |
| Promise/async 失败兜底 | `.catch` / try/catch |
| 全局兜底上报 | `window.onerror` + `unhandledrejection` |
| 调试输出 | `console.log/table/group/time/trace` |
| 断点调试 | DevTools Source 面板 / `debugger` 语句 |

## 核心代码

```javascript
// 基础错误处理
try {
  const data = JSON.parse(str);
  use(data);
} catch (err) {
  console.error("解析失败:", err.name, err.message);
  fallback();
} finally {
  hideLoading();          // 无论成败都执行
}

// 主动抛错
function divide(a, b) {
  if (b === 0) throw new Error("除数不能为 0");
  return a / b;
}

// 自定义错误类型
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
try { throw new ValidationError("邮箱格式错误", "email"); }
catch (err) {
  if (err instanceof ValidationError) console.log(err.field);
}

// 全局兜底
window.addEventListener("error", (e) => report(e.message));
window.addEventListener("unhandledrejection", (e) => report(e.reason));

// console 家族
console.log("普通");  console.error("错误");
console.table(users);              // 表格
console.time("x"); /* 代码 */ console.timeEnd("x");  // 计时
console.trace();                   // 打印调用栈
console.group("分组"); console.groupEnd();

// 断点
function process(data) {
  debugger;                        // 执行到这行自动暂停
  return data.map(...);
}
```

## 踩坑记录

- **`try/catch` 抓不到 `setTimeout` 回调里的错误**：异步回调在另一个时间片执行，要在回调内部 try/catch 或用 Promise
- **`Promise` reject 必须接住**：否则 `unhandledrejection`，错误静默丢失
- **`SyntaxError` 是编译期错误**：try/catch 抓不到（代码根本没法执行）
- **空 catch 会吞错**：`catch (e) {}` 掩盖问题，至少 `console.error(e)`
- **`JSON.parse` 会抛错**：来源不可信必须 try/catch
- **`throw "字符串"` 不推荐**：抛 `new Error("可行动的描述")` 才有 message/stack
- **错误栈自下而上读**：最上面是出错位置，往下是调用链（定位根因）
