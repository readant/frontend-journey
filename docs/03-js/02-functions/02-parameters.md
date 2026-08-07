---
title: 02.2 参数传递
---

# 参数传递：给函数"投币"的规则

## 掌握目标

学完本页，你将能：

- 分清**形参**（接收口）与**实参**（投入的东西）
- 给参数设置默认值，处理"调用者忘了传"的情况
- 用 `...rest` 收集不定数量的参数
- 知道基本类型按值传递、引用类型按引用传递的区别

::: tip 前置要求
需要先掌握上一页 [函数定义与调用](/03-js/02-functions/01-define-functions) 的 `()` 与函数声明。
:::

## 概念引入：参数就是"售货机上的按钮"

回到自动售货机的比喻：一台售货机上有很多按钮（可乐、雪碧、咖啡……），**按钮不同，出的饮料就不同**。函数也一样——**通过参数传入不同的值，同一个函数就能产出不同的结果**。

再换一个类比：**点餐**。你在菜单上选择"加辣/不加辣、加冰/去冰"（这是**实参**），后厨按菜单上的选项位（这是**形参**）来备餐。**选项位是固定的，但每次点的具体选项可以不同**。

```javascript
function makeDrink(flavor, ice) {   // 形参：两个"选项位"
  return flavor + "，" + (ice ? "加冰" : "去冰");
}

makeDrink("可乐", true);     // 实参：可乐，加冰
makeDrink("雪碧", false);    // 实参：雪碧，去冰
```

::: tip 一句话理解
**形参 = 函数定义时的"接收口"；实参 = 调用时的"投入物"。函数内部用形参名操作，实际拿到的值来自实参。**
:::

## 符号课堂：`,` / `=` / `...`

### 符号一：`,` —— "分隔多个输入口"

多个参数之间用逗号 `,` 分隔。**逗号只负责分隔，不负责其他逻辑**——别把参数和"逗号运算符"混淆。

**示例 ① 基础用法**：两个参数，一个逗号：

```javascript
function add(a, b) { return a + b; }
add(1, 2);      // 3
```

**示例 ② 常见错误**：参数之间**用了分号或没写分隔符**：

```javascript
function add(a; b) {}        // ❌ SyntaxError：参数必须用逗号分隔
function add(a b) {}         // ❌ SyntaxError：同样不行
function add(a, b) {}        // ✅ 正确
```

**示例 ③ 参数与调用方数量不匹配**（JS 很宽松，但要知道后果）：

```javascript
function add(a, b) { return a + b; }
add(1);          // ⚠️ 少传：b 是 undefined，结果是 NaN（1 + undefined）
add(1, 2, 3);    // ⚠️ 多传：第三个 3 被忽略（没有对应形参接收）
add(1, 2);       // ✅ 3：数量刚好
```

### 符号二：`=` —— "参数默认值"

在形参后面写 `= 默认值`，表示"调用者没传时，用这个值顶上"。**只有 undefined 会触发默认值**（传 null 不会）。

**示例 ① 基础用法**：

```javascript
function greet(name = "访客") {
  return "你好，" + name;
}
greet("小明");   // "你好，小明" —— 传了就用自己的
greet();         // "你好，访客" —— 没传用默认值
```

**示例 ② 常见错误**：默认值写成 `||` 的旧式写法（用的人少了，但老代码常见）：

```javascript
function greet(name) {
  name = name || "访客";   // ⚠️ 旧式写法：name 为 "" / 0 / false 时也会被替换成"访客"
  return "你好，" + name;
}
function greet(name = "访客") {  // ✅ 现代写法：只对 undefined 生效
  return "你好，" + name;
}
greet("");     // 旧式："你好，访客" ❌；现代："你好，" ✅
```

**示例 ③ 默认值可以使用前面的参数**：

```javascript
function makeBox(width, height = width) {   // 高度默认等于宽度（正方形）
  return { width, height };
}
makeBox(10);          // { width: 10, height: 10 }
makeBox(10, 20);      // { width: 10, height: 20 }
```

### 符号三：`...` —— "把剩余参数收进一个数组"

`...rest` 写在**最后一个形参**前，表示"把调用者传进来的所有多余参数收集成一个**数组**"。

**示例 ① 基础用法**：求和函数，参数数量不定：

```javascript
function sum(...nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
sum(1, 2);        // 3
sum(1, 2, 3, 4);  // 10 —— 传多少都行
```

**示例 ② 常见错误**：`...` 不放在最后一个位置：

```javascript
function f(...nums, last) {}   // ❌ SyntaxError：rest 必须是最后一个参数
function f(last, ...nums) {}   // ✅ 正确
```

**示例 ③ 与普通参数混用 + 对比 arguments**：

```javascript
function log(prefix, ...items) {
  console.log(prefix, items);
}
log("结果：", 1, 2, 3);   // "结果：" [1, 2, 3] —— items 是真数组

// 旧写法 arguments：类数组，不是真数组，没有 map/filter
function oldLog() {
  console.log([...arguments]);   // 需要展开才能用数组方法
}
```

## 深入理解：按值传递 vs 按引用传递

传参时，JS 复制的是**变量的"内容"**。对基本类型（数字、字符串、布尔），复制的是**值本身**；对引用类型（对象、数组），复制的是**地址（引用）**——这决定了"函数内部改参数，会不会影响外部"：

```javascript
// 基本类型：改内部，外部不受影响（按值）
function changeNum(x) { x = 99; }
let n = 1;
changeNum(n);
console.log(n);   // 1 —— n 没变

// 引用类型：改内部，外部跟着变（按引用，改的是同一个对象）
function addItem(arr) { arr.push(4); }
const list = [1, 2, 3];
addItem(list);
console.log(list);   // [1, 2, 3, 4] —— 同一个数组被改了
```

::: tip 记忆口诀
**数字字符串是"复印件"（怎么改都不影响原件）；对象数组是"同一把钥匙"（开门改的都是同一个房间）。**
:::

## 常见坑点

- 调用时**少传参数**得到 `undefined`，参与运算常得到 `NaN`——用默认参数兜底
- `null` 不会触发默认值：`greet(null)` 得到 `"你好，null"`，不是默认值
- rest 参数必须放最后；它收集的是**真数组**，比 `arguments` 更好用
- 函数内部修改引用类型参数会**影响外部**——不想这样就在内部先拷贝（`[...arr]` / `{...obj}`）

## 小结

- 形参 = 接收口（定义时），实参 = 投入物（调用时）
- `,` 分隔参数；`= 默认值` 兜底"没传"；`...rest` 收集剩余参数为数组
- 基本类型按值传（复印件），引用类型按引用传（同一把钥匙）
- 少传参数会得到 `undefined`，用默认参数预防

## 评估小测验（自测后再对答案）

1. 形参和实参的区别是什么？
2. `greet(null)` 会触发 `greet(name = "访客")` 的默认值吗？
3. 下面的 `changeObj` 会改变外部的 `user` 吗？为什么？

```javascript
function changeObj(obj) { obj.age = 30; }
const user = { name: "小明", age: 20 };
changeObj(user);
console.log(user.age);   // ？
```

::: details 点击查看答案
1. 形参是定义时写的"接收口"变量名；实参是调用时实际传入的值。
2. 不会。只有 `undefined` 触发默认值，`null` 会作为正常值传入。
3. 会变成 `30`。对象是引用类型，`obj` 和 `user` 指向同一个对象，改 `obj.age` 就是改 `user.age`。
:::

::: tip 速查卡片
参数传递的全部速查（默认值 / rest / 解构参数），见 [JS 函数手册 · 参数](/3-reference/1-handbook/js/functions)。
:::
