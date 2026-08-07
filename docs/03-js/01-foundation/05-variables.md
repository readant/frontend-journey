---
title: 01.5 变量声明
---

# 变量声明：let / const / var

## 它是什么

变量就是**给数据起名字的容器**。你可以在里面放数字、字符串、对象……任何东西，之后用名字来读写它。

```javascript
let age = 18;          // 声明一个变量 age，放进 18
age = 19;              // 修改：换成 19
console.log(age);      // 19（用名字读取）
```

JavaScript 有**三种声明关键字**：`var`（老古董）、`let`（现代，可改）、`const`（现代，不可改）。

::: tip 一句话记住
**写新代码永远用 `const`，确实要改的值才用 `let`，永远不用 `var`。**
:::

## 三者对比

| 对比项 | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 作用域 | 函数级 | **块级** | **块级** |
| 提升 | 提升并初始化为 `undefined` | 提升但在**暂时性死区（TDZ）** | 提升但在 TDZ |
| 可否重新赋值 | 可 | 可 | **不可** |
| 可否重复声明 | 可（不推荐） | 不可 | 不可 |
| 挂到 window | 是（全局下） | 否 | 否 |

```javascript
// 现代规范示范
const PI = 3.14;       // 常量：永远不会变
let count = 0;         // 需要变化的值
count++;               // let 可重新赋值

const obj = { a: 1 };
obj.a = 2;             // ✅ 允许：const 限制的是"重新赋值"，不是"修改内容"
// obj = { b: 1 };     // ❌ TypeError：不能给 const 重新赋值
```

## 核心机制

### 1. 为什么 `var` 是"老古董"（避坑）

`var` 有三个历史缺陷，就是它们催生了 `let`/`const`：

**① 没有块级作用域**——`if` / `for` 里声明的变量会"漏"到外面：

```javascript
if (true) {
  var leak = "漏出去了";
}
console.log(leak);     // "漏出去了"（var 没有块级边界）

if (true) {
  let stay = "被锁在块里";
}
// console.log(stay);  // ❌ ReferenceError：块外访问不到
```

**② 可以重复声明**——容易在不知不觉中覆盖同名变量：

```javascript
var name = "Alice";
var name = "Bob";      // 静默覆盖，不报错！(let 会直接报错)
```

**③ 全局下会挂到 window**——污染全局对象：

```javascript
var secret = 1;
window.secret;         // 1（var 全局变量成为 window 的属性）
```

### 2. 暂时性死区（TDZ）——let/const 的保护机制

`let`/`const` 也会"提升"到块顶部，但在**声明语句执行之前**，变量处于一个"存在但不可访问"的灰色地带，称为**暂时性死区（Temporal Dead Zone）**。在死区内访问会直接报错：

```javascript
console.log(l);        // ❌ ReferenceError: Cannot access 'l' before initialization
let l = 2;
```

对比 `var`（提升且初始化为 `undefined`，所以能访问但不报错）：

```javascript
console.log(v);        // undefined（var 提升 + 初始化，但不报错）
var v = 1;
```

::: tip TDZ 的价值
TDZ 让"先使用后声明"的错误**尽早暴露**，而不是悄悄得到 `undefined` 继续往下跑。这是 `let`/`const` 优于 `var` 的关键原因——**越早报错，越容易修**。
:::

### 3. 块级作用域的妙用

块级作用域解决了一个经典陷阱——循环里的闭包：

```javascript
// var：三次迭代共享同一个 i，循环结束后 i = 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));   // 3 3 3
}

// let：每次迭代创建独立的块级作用域，各自捕获自己的 i
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j));   // 0 1 2
}
```

## 命名规则

在`JavaScript`中，变量名（也叫标识符）必须遵守以下规则：

- 只能包含**字母**、**数字**、**下划线 `_` 和美元符号 `$`**
- 不能以数字开头
- 不能使用保留字（关键字）作为变量名
- 严格区分大小写
:::tip 提醒
  - `Unicode` 字符（如中文、日文、emoji）语法上合法，但强烈不推荐，容易引起乱码且团队协作困难：let 姓名 = "张三"; ✅ 合法，但千万别这么写！

  - `_` 常用于标记“私有/内部”变量；`$` 常用于 DOM 操作库（如 jQuery），普通命名建议少用。
:::

## 命名规范

好的命名让代码"自解释"，新人也能秒懂：

- **变量**：小驼峰 `userName`、`totalCount`
- **常量**：全大写加下划线 `MAX_SIZE`、`API_URL`
- **布尔**：用 `is` / `has` 开头，如 `isActive`、`hasPermission`
- **语义化**：`userList` 比 `arr1` 好一万倍

```javascript
const MAX_RETRY = 3;            // 常量全大写
let userName = "Alice";         // 变量小驼峰
let isLoggedIn = true;          // 布尔用 is 开头
```

## 常见坑点

- `const` 只是不能**重新赋值**，对象/数组的**内容照样能改**（需要冻结才用 `Object.freeze`）
- 忘了声明直接用：`x = 1` 会创建**全局变量**（严格模式下报错）——永远要 `let`/`const`
- 一个作用域内 `let` 和 `const` **不能重名**，也不能和 `var` 重名
- 解构赋值里也推荐用 `const`：`const { name } = user`

## 小结

- `const` 优先，需要变则 `let`，**永远不用 `var`**
- `let`/`const` 是块级作用域，且用 TDZ 防止"先使用后声明"
- 命名要语义化：小驼峰变量、全大写常量、`is` 开头的布尔

::: tip 速查卡片
变量声明完整速查，见 [变量与数据类型速查](/cheatsheet/data/variable-type)。
:::
