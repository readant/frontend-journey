---
title: 02.8 阶梯练习
---

# 阶梯练习：从"会写函数"到"能交付小项目"

## 使用说明

本章练习题按**四层阶梯**递进，对应"会写 → 会用 → 会拆解 → 能交付"四个阶段：

| 层级 | 题数 | 难度 | 目标 | 用时建议 |
| :--- | :---: | :--- | :--- | :--- |
| 第一层：基础语法 | 10 | ★☆☆ | 单个语法点，练"写得对" | 30 分钟 |
| 第二层：功能实现 | 8 | ★★☆ | 组合 2-3 个知识点，练"用得上" | 40 分钟 |
| 第三层：综合应用 | 5 | ★★★ | 跨知识点真实小功能，练"拆得开" | 1 小时 |
| 第四层：项目实战 | 3 | ★★★ | 可运行小项目，练"交得出" | 2 小时 |

**做题纪律**：

1. 先**独立思考 5 分钟**（想思路、写伪代码），再看「思路引导」
2. 实在卡住，看思路引导的第一条提示，**不要直接抄参考实现**
3. 写完**亲手跑一遍**，再看「易错点」对照检查
4. 全部代码在浏览器控制台（F12 → Console）里运行

---

## 第一层：基础语法练习（10 题）

> 每题只考察一个语法点。目标：**写得对、说得出为什么。**

### 1. 打招呼函数 ★☆☆

**题目**：写一个 `greet` 函数，接收一个名字，返回 `"你好，XXX"`。

::: details 思路引导
- 需要 `function` 关键字 + 一个参数 + `return`
- 字符串拼接用模板字符串：`` `你好，${name}` ``
- 先写"输入口"（参数），再写"出货口"（return）
:::

::: details 参考实现
```javascript
function greet(name) {
  return `你好，${name}`;
}
greet("小明");   // "你好，小明"
```
:::

::: details 易错点
忘记 `return` → 调用结果是 `undefined`；用了 `console.log` 而不是 `return` → 调用者拿不到值。
:::

### 2. 求两数较大值 ★☆☆

**题目**：写 `max(a, b)` 返回较大的那个数。

::: details 思路引导
- 用 `if (a > b) return a;` 提前返回，另一分支自动 `return b`
- 想想能不能用三元表达式写得更短
:::

::: details 参考实现
```javascript
function max(a, b) {
  if (a > b) return a;
  return b;
}
// 或：const max = (a, b) => (a > b ? a : b);
max(3, 7);   // 7
```
:::

::: details 易错点
写了 `else return b` 也可以，但提前 return 更简洁；别在 `if` 里忘记 return 导致"没返回值"。
:::

### 3. 判断偶数 ★☆☆

**题目**：写 `isEven(n)`，偶数返回 `true`，奇数返回 `false`。

::: details 思路引导
- 用取余运算符：`n % 2 === 0` 就是偶数
- 返回布尔值，不要写 `return true` / `return false` 两个分支
:::

::: details 参考实现
```javascript
function isEven(n) {
  return n % 2 === 0;   // 比较表达式本身就是布尔值，直接返回
}
isEven(4);   // true
isEven(3);   // false
```
:::

::: details 易错点
写了 `if (n % 2 === 0) { return true; } else { return false; }`——功能对，但绕了弯路。直接返回表达式。
:::

### 4. 函数表达式写平方 ★☆☆

**题目**：用**函数表达式**（不是声明）定义 `square`，返回参数的平方。

::: details 思路引导
- `const square = function (x) { ... };`——注意末尾分号
- 平方 = `x * x`
:::

::: details 参考实现
```javascript
const square = function (x) {
  return x * x;
};
square(5);   // 25
```
:::

::: details 易错点
函数表达式是"赋值语句"，末尾要有分号；不要写成 `function square(x){}`（那是声明，此题考表达式写法）。
:::

### 5. 默认参数 ★☆☆

**题目**：写 `greet2(name = "访客")`，不传参时返回 `"你好，访客"`。

::: details 思路引导
- 默认值写在形参后面：`name = "访客"`
- 只有传 `undefined`（或不传）才触发默认值
:::

::: details 参考实现
```javascript
function greet2(name = "访客") {
  return `你好，${name}`;
}
greet2();          // "你好，访客"
greet2("小红");     // "你好，小红"
greet2(null);      // "你好，null" —— null 不触发默认值！
```
:::

::: details 易错点
`greet2(null)` 结果是 `"你好，null"`——默认值只对 `undefined` 生效。另外别写 `name = name || "访客"` 的旧式写法（空字符串也会被替换）。
:::

### 6. rest 参数求和 ★☆☆

**题目**：写 `sumAll(...nums)`，返回所有传入数字的和（数量不定）。

::: details 思路引导
- `...nums` 收集所有参数为数组
- 用 `for...of` 或 `reduce` 累加
:::

::: details 参考实现
```javascript
function sumAll(...nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
sumAll(1, 2);        // 3
sumAll(1, 2, 3, 4);  // 10
```
:::

::: details 易错点
`...nums` 必须放在参数列表**最后**；`nums` 是真数组，可以直接用数组方法。
:::

### 7. 箭头函数单参写法 ★☆☆

**题目**：用箭头函数写 `double`，参数一个，返回两倍。

::: details 思路引导
- 单参数可以省略括号：`x => x * 2`
- 单表达式自动 return，不用写 `{}` 和 `return`
:::

::: details 参考实现
```javascript
const double = x => x * 2;
double(21);   // 42
```
:::

::: details 易错点
多参数时括号不能省：`(a, b) => a + b`；想写多个语句要加 `{}` 和 `return`。
:::

### 8. 箭头函数返回对象 ★☆☆

**题目**：用箭头函数写 `getUser()`，返回 `{ name: "小明", age: 18 }`。

::: details 思路引导
- 返回对象字面量必须用**括号包住**：`() => ({ ... })`
- 直接 `() => { ... }` 会被当成函数体
:::

::: details 参考实现
```javascript
const getUser = () => ({ name: "小明", age: 18 });
getUser();   // { name: "小明", age: 18 }
```
:::

::: details 易错点
写成 `() => { name: "小明" }` 返回 `undefined`——这是本章最经典的坑之一。
:::

### 9. 提前 return 判断成绩 ★☆☆

**题目**：写 `checkScore(score)`，≥90 返回 `"优秀"`，≥60 返回 `"及格"`，否则 `"不及格"`。

::: details 思路引导
- 从上到下三个 `if`，命中就 return，最后一个无条件 return
- 不需要 `else` 嵌套
:::

::: details 参考实现
```javascript
function checkScore(score) {
  if (score >= 90) return "优秀";
  if (score >= 60) return "及格";
  return "不及格";
}
checkScore(95);   // "优秀"
checkScore(70);   // "及格"
checkScore(30);   // "不及格"
```
:::

::: details 易错点
顺序很重要：如果先判断 `>=60` 再判断 `>=90`，90 分会先命中"及格"。**范围判断从大到小**。
:::

### 10. 无 return 的返回值 ★☆☆

**题目**：写一个什么都不返回的函数 `noop()`，预测 `console.log(noop())` 的输出。

::: details 思路引导
- 函数体为空，没有 return
- 记住规则：不写 return → 返回 `undefined`
:::

::: details 参考实现
```javascript
function noop() {}
console.log(noop());   // undefined
```
:::

::: details 易错点
打印结果是 `undefined` 不是 `null`；"没有返回值"和"返回 null"是两码事。
:::

---

## 第二层：功能实现练习（8 题）

> 每题组合 2-3 个知识点。目标：**把学过的语法用在真实的小功能上。**

### 1. 数组最大最小 ★★☆

**题目**：写 `getMinMax(nums)`，返回 `{ min, max }` 对象。

::: details 思路引导
- 内置 `Math.min(...nums)` / `Math.max(...nums)`——注意要展开
- 返回对象，调用方解构接收
:::

::: details 参考实现
```javascript
function getMinMax(nums) {
  return { min: Math.min(...nums), max: Math.max(...nums) };
}
const { min, max } = getMinMax([3, 1, 4, 2]);
console.log(min, max);   // 1 4
```
:::

::: details 易错点
`Math.min(nums)` 传数组不会生效，必须 `Math.min(...nums)` 展开；空数组返回 `Infinity` / `-Infinity`，可加防御。
:::

### 2. 首字母大写 ★★☆

**题目**：写 `capitalize(str)`，把字符串首字母大写，其余小写。如 `"hELLO"` → `"Hello"`。

::: details 思路引导
- 取首字母 `str[0].toUpperCase()`
- 取其余 `str.slice(1).toLowerCase()`，拼接
:::

::: details 参考实现
```javascript
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
capitalize("hELLO");   // "Hello"
```
:::

::: details 易错点
空字符串 `""` 会报错（`str[0]` 是 undefined，`.toUpperCase()` 报错）——可先 `if (!str) return str;`。
:::

### 3. 带初始值的累加器 ★★☆

**题目**：写 `sumWith(list, initial = 0)`，返回 `initial + 数组所有元素和`。

::: details 思路引导
- `reduce((acc, n) => acc + n, initial)` 一行搞定
- 第二个参数是初始值
:::

::: details 参考实现
```javascript
function sumWith(list, initial = 0) {
  return list.reduce((acc, n) => acc + n, initial);
}
sumWith([1, 2, 3]);          // 6
sumWith([1, 2, 3], 100);     // 106
```
:::

::: details 易错点
`reduce` 忘记给初始值 0：空数组会报错；有初始值时第一个元素不用当初始值。
:::

### 4. 计算器 ★★☆

**题目**：写 `calc(a, op, b)`，支持 `+ - * /`，非法运算符返回 `"未知运算符"`。

::: details 思路引导
- 用 `if/else if` 或 `switch` 或对象映射分派
- 除法注意除零
:::

::: details 参考实现
```javascript
function calc(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "不能除以 0" : a / b;
  return "未知运算符";
}
calc(10, "+", 5);   // 15
calc(10, "/", 0);   // "不能除以 0"
```
:::

::: details 易错点
每个分支都要 return，否则落到最后的 `"未知运算符"`；先判断除零再除法。
:::

### 5. 计数器（闭包）★★☆

**题目**：写 `createCounter()`，返回 `{ inc, dec, get }` 三个函数，操作私有计数 `n`。

::: details 思路引导
- `n` 定义在外层函数里，内层三个箭头函数通过闭包访问它
- 外部无法直接读写 `n`
:::

::: details 参考实现
```javascript
function createCounter() {
  let n = 0;
  return {
    inc: () => ++n,
    dec: () => --n,
    get: () => n,
  };
}
const c = createCounter();
c.inc(); c.inc(); c.dec();
c.get();   // 1
// c.n;    // undefined —— 私有
```
:::

::: details 易错点
闭包捕获的是 `n` 变量本身，三个方法共享同一个 `n`；`++n` 先加再返回，`n++` 相反，别用错。
:::

### 6. 私有银行账户（闭包）★★☆

**题目**：写 `createAccount(initial)`，支持 `deposit` / `withdraw` / `getBalance`，余额不能为负。

::: details 思路引导
- `balance` 是闭包里的私有变量
- `withdraw` 里先判断余额够不够
:::

::: details 参考实现
```javascript
function createAccount(initial) {
  let balance = initial;
  return {
    deposit(amount) {
      if (amount <= 0) return "金额必须大于 0";
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) return "余额不足";
      balance -= amount;
      return balance;
    },
    getBalance: () => balance,
  };
}
const acct = createAccount(100);
acct.withdraw(150);   // "余额不足"
acct.deposit(50);     // 150
acct.getBalance();    // 150
```
:::

::: details 易错点
负余额与非法金额都要拦截；返回字符串错误会让调用方难以判断类型，项目里常用返回对象 `{ ok, data }` 模式。
:::

### 7. 防抖（闭包）★★☆

**题目**：实现 `debounce(fn, delay)`，返回的函数在停手 `delay` 毫秒后才执行 `fn`。

::: details 思路引导
- `timer` 放外层，被返回函数闭包捕获
- 每次调用先 `clearTimeout` 再 `setTimeout`
:::

::: details 参考实现
```javascript
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// 测试：3 次快速调用，只执行最后一次
const say = debounce((msg) => console.log(msg), 100);
say("a"); say("b"); say("c");   // 100ms 后只打印 "c"
```
:::

::: details 易错点
忘记 `clearTimeout` 就变成"延迟 3 次都执行"（节流效果）；`fn.apply(this, args)` 保留调用方的 this 更严谨。
:::

### 8. 柯里化累加 ★★☆

**题目**：写 `add(a)` 返回一个函数，`add(1)(2)` 得到 3。

::: details 思路引导
- 外层函数返回内层箭头函数：`a => b => a + b`
- 内层箭头函数通过闭包拿到 `a`
:::

::: details 参考实现
```javascript
const add = (a) => (b) => a + b;
add(1)(2);   // 3
const add5 = add(5);   // 先锁定 5
add5(10);    // 15
```
:::

::: details 易错点
写法是 `(a) => (b) => a + b`，两层箭头；`add(1)(2)` 是两个括号连写，别写成 `add(1, 2)`。
:::

---

## 第三层：综合应用练习（5 题）

> 每题跨越多个知识点。目标：**把大问题拆成小函数。**

### 1. 数组去重 ★★★

**题目**：写 `unique(arr)`，去掉重复元素并保持原顺序。如 `[1, 2, 1, 3, 2]` → `[1, 2, 3]`。

::: details 思路引导
- `Set` 天然去重：`new Set(arr)`
- 保持顺序：`[...new Set(arr)]`；或手写 `filter((v, i) => arr.indexOf(v) === i)`
:::

::: details 参考实现
```javascript
function unique(arr) {
  return [...new Set(arr)];
}
unique([1, 2, 1, 3, 2]);   // [1, 2, 3]
```
:::

::: details 易错点
`new Set(arr)` 是 Set 对象，记得展开成数组；`indexOf` 方案对 `NaN` 不生效，Set 方案更稳。
:::

### 2. 只执行一次（once）★★★

**题目**：实现 `once(fn)`，返回的新函数只能执行一次，之后调用直接返回第一次的结果。

::: details 思路引导
- 用闭包存一个 `called` 标志和第一次的 `result`
- 第一次执行后置 `called = true`
:::

::: details 参考实现
```javascript
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (called) return result;
    called = true;
    result = fn.apply(this, args);
    return result;
  };
}
const pay = once((price) => `支付 ${price} 元`);
pay(100);   // "支付 100 元"
pay(200);   // "支付 100 元" —— 第二次不执行，返回缓存结果
```
:::

::: details 易错点
`called` 和 `result` 都在闭包里；第二次调用不能重新执行 `fn`，要返回缓存。
:::

### 3. 记忆化（memoize）★★★

**题目**：实现 `memoize(fn)`，用参数作 key 缓存结果，重复参数直接返回缓存。

::: details 思路引导
- 闭包里存一个 `cache` 对象（或 Map）
- key 用参数拼接；命中缓存直接返回
:::

::: details 参考实现
```javascript
function memoize(fn) {
  const cache = new Map();
  return function (key) {
    if (cache.has(key)) return cache.get(key);
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}
let count = 0;
const heavy = memoize((n) => { count++; return n * n; });
heavy(4); heavy(4); heavy(4);
console.log(count);   // 1 —— 只有第一次真正计算
```
:::

::: details 易错点
缓存 key 用对象时要小心（对象转字符串都是 `"[object Object]"`）；本题用简单值参数即可。
:::

### 4. 递归阶乘 ★★★

**题目**：写 `factorial(n)` 计算 `n!`（`n * (n-1) * ... * 1`），要求用递归。

::: details 思路引导
- 递归 = 函数调用自己
- **必须有一个"出口"**：`n <= 1` 时返回 1
:::

::: details 参考实现
```javascript
function factorial(n) {
  if (n <= 1) return 1;          // 出口：防止无限递归
  return n * factorial(n - 1);   // 递推：n! = n * (n-1)!
}
factorial(5);   // 120
```
:::

::: details 易错点
忘记出口会栈溢出（`Maximum call stack size exceeded`）；负数的出口条件也要覆盖（`n <= 1`）。
:::

### 5. 迷你发布订阅 ★★★

**题目**：实现 `createBus()`，支持 `on(event, fn)` 订阅与 `emit(event, ...args)` 发布。

::: details 思路引导
- 闭包里存一个 `Map<事件名, 回调数组>`
- `emit` 时取出数组逐个调用
:::

::: details 参考实现
```javascript
function createBus() {
  const handlers = new Map();
  return {
    on(event, fn) {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event).push(fn);
    },
    emit(event, ...args) {
      (handlers.get(event) || []).forEach((fn) => fn(...args));
    },
  };
}
const bus = createBus();
bus.on("login", (user) => console.log(`${user} 登录了`));
bus.emit("login", "小明");   // "小明 登录了"
```
:::

::: details 易错点
先订阅后发布（顺序）；`emit` 一个没人订阅的事件不要报错（`|| []` 兜底）。
:::

---

## 第四层：项目实战练习（3 题）

> 每题都是一个可运行的小项目。目标：**独立完成"需求 → 拆解 → 实现 → 验收"。** 项目建议建一个 HTML 文件，在浏览器里打开验证。

### 项目 1：任务管理器 ★★★

**需求**：做一个任务管理器，支持：添加任务、删除任务、完成任务、统计（总数 / 已完成 / 未完成）。状态用一个闭包管理，界面用 `console.table` 展示。

**功能拆解**：

```
createTodoStore()           —— 闭包管理 tasks 数组，返回 add/remove/toggle/stat 四个方法
add(title)                  —— 添加 { id, title, done: false }
remove(id)                  —— 按 id 删除
toggle(id)                  —— 切换 done 状态
stat()                      —— 返回 { total, done, pending }
```

::: details 思路引导
- 先写 `createTodoStore()`：`tasks` 放外层函数，四个方法通过闭包访问
- `id` 用递增计数器（`let id = 0`，`++id`）保证唯一
- 最后写一个 `render` 函数用 `console.table` 打印
:::

::: details 参考实现
```javascript
function createTodoStore() {
  let tasks = [];
  let nextId = 0;
  return {
    add(title) {
      tasks.push({ id: ++nextId, title, done: false });
      return tasks;
    },
    remove(id) {
      tasks = tasks.filter((t) => t.id !== id);
      return tasks;
    },
    toggle(id) {
      const t = tasks.find((t) => t.id === id);
      if (t) t.done = !t.done;
      return tasks;
    },
    stat() {
      return {
        total: tasks.length,
        done: tasks.filter((t) => t.done).length,
        pending: tasks.filter((t) => !t.done).length,
      };
    },
  };
}

// 使用
const todo = createTodoStore();
todo.add("学函数");
todo.add("写练习");
todo.toggle(1);
console.table(todo.stat());   // { total: 2, done: 1, pending: 1 }
```
:::

::: details 验收标准与易错点
- ✅ 能增删改查 + 统计正确；✅ `tasks` 外部不可直接访问（是闭包私有变量）
- ❌ `remove` 用了 `filter` 重新赋值才生效——直接 `tasks.remove` 不行
- ❌ 删除后 `toggle` 找不到任务要兜底（`if (t)`）
:::

### 项目 2：防抖搜索框 ★★★

**需求**：做一个搜索框：输入停止 500ms 后，模拟请求并打印"搜索：关键字"。需要用到 DOM、事件、防抖、闭包。

**功能拆解**：

```
debounce(fn, delay)          —— 复用本章的防抖实现
<input id="search">          —— 输入框
input 事件 → debounce 包装后的回调 → 打印结果
```

::: details 思路引导
- 先写 `debounce`（第二层第 7 题已实现过，直接复用）
- `document.getElementById("search").addEventListener("input", handler)`
- `handler` 用 debounce 包裹：`debounce((e) => console.log("搜索：" + e.target.value), 500)`
:::

::: details 参考实现
```html
<input id="search" placeholder="输入关键字搜索" />
<script>
  function debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const input = document.getElementById("search");
  const search = debounce((e) => {
    console.log("搜索：" + e.target.value);
  }, 500);

  input.addEventListener("input", search);
</script>
```
:::

::: details 验收标准与易错点
- ✅ 连续快速输入只触发一次搜索（停止 500ms 后）
- ✅ 事件回调里的 `e.target.value` 能拿到当前输入值
- ❌ 用箭头函数直接作回调且不用 debounce → 每敲一个字都"搜索"
- ❌ `e` 参数没传到 `fn.apply(this, args)` → 拿不到输入值
:::

### 项目 3：购物车计算器 ★★★

**需求**：做一个购物车，商品有单价与数量，支持加/减数量，实时计算总价。用函数式思路拆解：数据转换用纯函数，状态用闭包。

**功能拆解**：

```
createCart()                 —— 闭包管理 items，返回 add/changeQty/remove/subtotal
add(item)                    —— 添加商品（同 id 合并数量）
changeQty(id, delta)         —— 调整数量（不小于 1）
subtotal()                   —— 计算总价 = Σ(单价 × 数量)
format(total)                —— 纯函数：保留两位小数
```

::: details 思路引导
- 把"算总价"写成**纯函数**：`calcTotal(items)` 只依赖入参，不碰外部状态，方便测试
- `changeQty` 用 `map` 返回新数组（不直接改原对象），保持不可变
- 纯函数与闭包分工：**状态变化用闭包，计算逻辑用纯函数**
:::

::: details 参考实现
```javascript
// 纯函数：计算总价（不修改任何外部状态）
function calcTotal(items) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function createCart() {
  let items = [];
  return {
    add({ id, name, price, qty = 1 }) {
      const exist = items.find((it) => it.id === id);
      if (exist) exist.qty += qty;
      else items.push({ id, name, price, qty });
      return items;
    },
    changeQty(id, delta) {
      items = items.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      );
      return items;
    },
    subtotal() {
      return calcTotal(items).toFixed(2);
    },
  };
}

const cart = createCart();
cart.add({ id: 1, name: "键盘", price: 199, qty: 1 });
cart.add({ id: 2, name: "鼠标", price: 99 });
cart.add({ id: 1, name: "键盘", price: 199 });   // 同 id 合并 → qty 2
console.log(cart.subtotal());   // "497.00"（199×2 + 99）
```
:::

::: details 验收标准与易错点
- ✅ 同 id 商品合并数量；✅ 总价实时正确；✅ 数量最小为 1
- ✅ 把 `calcTotal` 提成纯函数：不加任何参数也测不了它的地方，输入输出一一对应
- ❌ `changeQty` 直接改原对象（`it.qty += delta`）→ 用 `map` + `{ ...it }` 返回新对象
- ❌ 浮点精度：`199 * 2 + 99 = 497` 没问题，但遇到 `0.1 + 0.2` 要用 `toFixed` 处理展示
:::

---

## 做完之后

- **回头自评**：每一层都能独立完成吗？卡住的题回到对应页面重看
- **继续挑战**：把项目 2 和项目 3 组合——"搜索商品 → 加入购物车 → 计算总价"，就是一个真实的小型前端功能
- **参考速查**：练习中忘记的语法，随时查 [JS 函数手册](/3-reference/1-handbook/js/functions) 与 [JS 闭包手册](/3-reference/1-handbook/js/closure)

::: tip 速查卡片
练习涉及的全部术语（形参/实参/默认值/rest/闭包/this 绑定），见 [JS 函数手册](/3-reference/1-handbook/js/functions)。
:::
