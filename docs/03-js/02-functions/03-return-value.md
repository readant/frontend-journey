---
title: 02.3 返回值
---

# 返回值：把结果"端出厨房"

## 掌握目标

学完本页，你将能：

- 用 `return` 把计算结果交给调用者
- 说出"函数没写 return 时返回 undefined"这一规则
- 用提前 return 简化条件分支
- 一次返回多个值（对象 / 数组 + 解构）

::: tip 前置要求
需要先掌握上一页 [参数传递](/03-js/02-functions/02-parameters) 的形参/实参与默认参数。
:::

## 概念引入：return 就是"厨房的出菜口"

在餐厅里，厨师做完菜**必须把菜端出来**，顾客才能吃到。如果厨师做完菜就下班走了，顾客啥也拿不到。

函数也一样：函数体内的计算结果，**必须用 `return` 交出来**，调用者才能拿到。不写 `return` 的函数，调用后你拿到的是 `undefined`（"空手而归"）。

```javascript
// 有 return：把菜端出来 ✅
function cook() {
  return "红烧肉";
}
console.log(cook());   // "红烧肉"

// 没 return：做完了但没端出来，顾客两手空空 ⚠️
function cookButNoReturn() {
  "红烧肉";            // 这行执行了，但结果被丢弃
}
console.log(cookButNoReturn());   // undefined
```

::: tip 一句话理解
**`return` = "把函数体里计算出的结果交给调用者"；不写 return，函数返回 `undefined`。**
:::

## 符号课堂：`return`

### 符号：`return` —— "端出结果 + 立即下班"

`return` 有两个动作，缺一不可：

1. **把后面表达式的值作为结果返回**给调用者
2. **立即结束函数**——`return` 之后的所有代码都不再执行（"端出菜就下班"）

**示例 ① 基础用法**：返回计算结果：

```javascript
function double(n) {
  return n * 2;
}
console.log(double(4));   // 8 —— 调用表达式整体替换成返回值
```

**示例 ② 常见错误**：`return` 后面**换行**写值（JS 会自动加分号，导致返回 undefined）：

```javascript
function f() {
  return
    42;                    // ❌ 被解析成 return; 42 —— 返回 undefined
}
console.log(f());          // undefined

function g() {
  return 42;               // ✅ 返回值写在同一行
}
console.log(g());          // 42
```

**示例 ③ 提前 return 简化分支**（面试常考）：

```javascript
// ❌ 反面：嵌套 if，缩进深、难读
function checkAge(age) {
  if (age >= 18) {
    return "成年";
  } else {
    return "未成年";
  }
}

// ✅ 正面：提前 return，去掉 else
function checkAge(age) {
  if (age >= 18) return "成年";
  return "未成年";
}
// 更防御的写法：非法输入先"拦截"
function checkAge(age) {
  if (typeof age !== "number") return "参数不合法";   // 前置拦截
  if (age >= 18) return "成年";
  return "未成年";
}
```

## 深入理解：返回值的两种特殊形态

### 形态一：什么都不返回 → `undefined`

所有"没有 return"或"return 后面没值"的函数，返回值都是 `undefined`：

```javascript
function a() {}             // 没写 return → undefined
function b() { return; }    // return 没带值 → undefined
function c() { return undefined; }   // 显式返回 undefined（等价，但多此一举）

console.log(a(), b(), c()); // undefined undefined undefined
```

### 形态二：一次返回多个值 → 包成对象 / 数组

函数只能返回**一个值**。想返回多个结果，就把它们"打包"成对象或数组，外面**解构**接收：

```javascript
// 用对象打包（推荐：字段名自解释）
function getMinMax(nums) {
  return { min: Math.min(...nums), max: Math.max(...nums) };
}
const { min, max } = getMinMax([3, 1, 4, 2]);   // 解构
console.log(min, max);   // 1 4

// 用数组打包
function getCoords() {
  return [10, 20];
}
const [x, y] = getCoords();
console.log(x, y);   // 10 20
```

## 常见坑点

- **`return` 后的代码不会执行**——把"必须执行"的清理逻辑放在 return 之前
- **`return` 换行**会被 ASI 拆成两条语句，悄悄返回 `undefined`
- **`console.log` 不是 return**——打印到控制台 ≠ 把值交给调用者
- 想返回多个值必须打包（对象/数组），不能写 `return a, b`（逗号表达式只会返回 b）

## 小结

- `return` = 端出结果 + 立即结束函数
- 没写 return / return 没带值 → 返回 `undefined`
- 提前 return 可以简化嵌套分支，先拦截非法输入
- 多值返回：打包成对象/数组，外部解构接收

## 评估小测验（自测后再对答案）

1. 下面的函数返回值是什么？

```javascript
function test() {
  return;
}
console.log(test());   // ？
```

2. 下面的代码会打印什么？

```javascript
function foo() {
  console.log("开始");
  return 1;
  console.log("结束");
}
foo();   // ？
```

3. 想返回"和"与"平均值"两个结果，怎么写最清晰？

::: details 点击查看答案
1. `undefined`——`return` 后面没带值。
2. 只打印 `"开始"`——`return 1` 之后函数立即结束，`"结束"` 不会执行。
3. `return { sum, avg }` 用对象打包，外部 `const { sum, avg } = foo(...)` 解构接收。
:::

::: tip 速查卡片
返回值的完整速查（return / undefined / 多值返回），见 [JS 函数手册 · 返回值](/3-reference/1-handbook/js/functions)。
:::
