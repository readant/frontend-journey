---
title: JS 函数完整手册
---

# JS 函数

## 核心概念

函数 = 把逻辑打包成「可重复调用」的单元 —— 声明、参数、返回值三件套。

## 完整内容

### 是什么 / 为什么

函数是 JS 的**一等公民**：可以赋值给变量、作为参数传递、作为返回值。理解函数声明与表达式的区别、箭头函数与 `this` 的关系，是进阶的基础。

### 一、五种定义方式

```javascript
// 1. 函数声明（会提升，可先调用后声明）
function add(a, b) {
  return a + b;
}

// 2. 函数表达式（不提升，必须先赋值后调用）
const sub = function (a, b) {
  return a - b;
};

// 3. 箭头函数（简洁 + 无自己的 this）
const mul = (a, b) => a * b;

// 4. 匿名函数（回调常用）
setTimeout(() => {}, 1000);

// 5. 立即执行函数 IIFE（旧时代封装作用域）
(function () {
  const secret = 1;
})();
```

### 二、参数

```javascript
// 默认参数
function greet(name = "匿名") {}

// 剩余参数（收集所有多余参数为数组）
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

// 解构参数（对象参数拆开用）
function show({ id, title }) {
  console.log(id, title);
}
```

**arguments 对象**（旧式，箭头函数没有）：

```javascript
function log() {
  console.log(arguments.length, arguments[0]);  // 类数组，尽量用 ...args
}
```

### 三、返回值

```javascript
function f() {
  return 1;      // 返回 1
  // return;     // 返回 undefined
}
const r = f();   // 不写 return 的调用结果是 undefined
```

### 四、箭头函数与 this（核心难点）

**普通函数的 this 是「调用时」决定的**：

```javascript
const obj = {
  name: "张三",
  show() {
    console.log(this.name);   // "张三"（obj.show() 调用）
  },
};
```

**箭头函数没有自己的 this，用的是「定义时」外层作用域的 this**：

```javascript
const obj = {
  name: "张三",
  wait() {
    setTimeout(function () {
      console.log(this.name);   // undefined（this 是 window/undefined）
    }, 100);
    setTimeout(() => {
      console.log(this.name);   // "张三"（箭头函数继承 wait 的 this）
    }, 100);
  },
};
```

**this 绑定四规则（普通函数）**：

| 调用方式 | this 指向 |
| :--- | :--- |
| `obj.method()` | obj（点前面的对象） |
| `fn()` 直接调用 | 全局（严格模式 undefined） |
| `new Fn()` | 新创建的实例 |
| `fn.call(obj)` / `apply` / `bind` | 手动指定的对象 |

```javascript
function greet() {
  console.log(this.name);
}
greet.call({ name: "张三" });    // "张三"
const bound = greet.bind({ name: "李四" });  // 永久绑定
```

### 语法速查

| 语法 | 写法 | 说明 |
| :--- | :--- | :--- |
| 声明 | `function f() {}` | 有提升 |
| 表达式 | `const f = function () {}` | 无提升 |
| 箭头 | `const f = (a) => a * 2` | 简洁、无 this |
| 默认值 | `function f(a = 1) {}` | 参数缺省 |
| 剩余 | `function f(...rest) {}` | 收集剩余参数 |
| 解构 | `function f({ a, b }) {}` | 对象参数解构 |
| 立即执行 | `(function(){})()` | IIFE 封装作用域 |

### 常见用法

**回调函数（把逻辑交给别人调用）**：

```javascript
function process(list, callback) {
  const result = list.map(callback);  // 对每一项执行回调
  return result;
}
const doubled = process([1, 2, 3], (n) => n * 2);
```

**柯里化（函数返回函数，逐步给参数）**：

```javascript
const add = (a) => (b) => a + b;
add(1)(2);   // 3
```

### 注意事项

- ⚠️ 函数声明会提升，表达式不会 —— 表达式的坑：在赋值前调用会报「未初始化」。
- ⚠️ 箭头函数不能用 `new`、没有 `arguments`、不能作方法（会丢 this）。
- ⚠️ 别在对象方法里用箭头函数拿 this（`obj.show = () => this` 会拿到外层）。
- ⚠️ 回调里想固定 this：用箭头函数或 `bind`，别用中间变量 hack。
- ⚠️ 返回多个值：返回对象 `{ a, b }` 或数组 `[a, b]`，配合解构接收。

## 相关

- 🔍 场景索引：[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[闭包](/3-reference/1-handbook/js/closure)、[数组](/3-reference/1-handbook/js/array)（高阶函数）
