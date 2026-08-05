---
title: 06.3 事件机制
---

# 事件机制：监听、事件流与事件对象

## 它是什么

事件（Event）就是浏览器告诉你"**用户做了某个动作**"的通知：点击、按下键盘、鼠标移入、表单提交……而 `addEventListener` 就是你**订阅这个通知**的方式——告诉浏览器"当发生某事件时，调用我的函数"。

```javascript
button.addEventListener("click", () => {
  console.log("按钮被点了");
});
```

生活化理解：你把手机号留给快递站（`addEventListener`），快递到了它打电话给你（触发回调）。可以留多个号码（多个监听器），也可以注销（`removeEventListener`）。

## addEventListener 基础与第三参数

```javascript
el.addEventListener("click", handler);        // 默认：冒泡阶段触发
el.addEventListener("click", handler, false); // false = 冒泡阶段（默认值）
el.addEventListener("click", handler, true);  // true  = 捕获阶段触发
el.addEventListener("click", handler, { once: true });  // 只触发一次
```

第三参数三种形态：

- **`false`（默认）**：在**冒泡阶段**触发，绝大多数场景用它
- **`true`**：在**捕获阶段**触发，用于"先于子元素处理"的拦截场景
- **`{ once: true }`**：触发**一次**后自动移除监听，适合一次性初始化（比如只弹一次的引导提示）

::: tip 为什么默认是冒泡
冒泡从"具体的子元素"走向"祖先"，符合直觉：点了一个按钮，按钮先处理，然后它的父容器再处理。配合事件委托（下一页）能写更简洁的代码。
:::

## 事件流三阶段：捕获 → 目标 → 冒泡

点击页面任意元素，事件会走一条**完整路径**，分三个阶段：

```
┌─────────────────────────────────────────────┐
│ ① 捕获阶段：window → document → ... → 目标元素 │
│ ② 目标阶段： 事件到达目标元素                    │
│ ③ 冒泡阶段：目标元素 → ... → document → window  │
└─────────────────────────────────────────────┘
```

```html
<div id="outer">
  <button id="inner">点我</button>
</div>
```

```javascript
const outer = document.getElementById("outer");
const inner = document.getElementById("inner");

outer.addEventListener("click", () => console.log("outer 捕获"), true);   // 捕获
outer.addEventListener("click", () => console.log("outer 冒泡"), false);  // 冒泡
inner.addEventListener("click", () => console.log("inner 目标"), false);  // 目标

// 点击按钮，输出顺序：
// outer 捕获 → inner 目标 → outer 冒泡
```

::: tip 一句话记顺序
**捕获先下山，目标在山脚，冒泡再上山。** 捕获阶段从 window 往下"潜"，到达目标，再往上"浮"回 window——同一个元素的捕获监听总是先于冒泡监听执行。
:::

## 事件对象：target / currentTarget / preventDefault / stopPropagation

监听器的回调会收到一个**事件对象 `e`**，里面装着这次事件的全部信息：

```javascript
el.addEventListener("click", (e) => {
  e.target;            // 真正触发事件的元素（事件源头）
  e.currentTarget;     // 当前正在处理事件的元素（绑定监听的元素）
  e.type;              // 事件类型："click"
  e.preventDefault();  // 阻止默认行为（链接跳转、表单提交等）
  e.stopPropagation(); // 阻止事件继续传播（冒泡/捕获）
  e.stopImmediatePropagation(); // 阻止传播 + 阻止元素上其他监听器
});
```

```javascript
// preventDefault 经典场景：阻止表单刷新
form.addEventListener("submit", (e) => {
  e.preventDefault();   // 不阻止的话页面会跳转/刷新
  // 然后自己用 fetch 提交……
});

// stopPropagation 场景：点击内部按钮不想触发外层容器的点击
inner.addEventListener("click", (e) => {
  e.stopPropagation();  // 事件不再往上冒泡，outer 的监听不会触发
});
```

::: warning target 和 currentTarget 不是一回事
- `e.target`：**点中的最底层元素**，可能是按钮里的 `<span>` 文本节点所在元素
- `e.currentTarget`：**当前正在跑监听器的元素**，即绑定 `addEventListener` 的那个
在冒泡过程中二者通常不同——`e.target` 是固定的，`e.currentTarget` 会随冒泡变化。**异步回调里用 `e.target` 前先存下来**（`const t = e.target`），因为事件对象会被复用。
:::

## 移除监听：removeEventListener 必须同一函数引用

```javascript
function handler() {
  console.log("clicked");
}

el.addEventListener("click", handler);
el.removeEventListener("click", handler);   // ✅ 同一引用，成功移除

// ❌ 无效：匿名函数每次都是"新函数"，删不掉
el.addEventListener("click", () => console.log("hi"));
el.removeEventListener("click", () => console.log("hi"));   // 没删掉！
```

::: danger 匿名函数无法移除
`removeEventListener` 必须传入**与添加时完全相同的函数**。匿名函数每次写都是新对象，永远对不上号。**需要"临时监听、用完就删"时，一定要用命名函数**，或直接使用 `{ once: true }`。
:::

## 常见坑点

- **事件对象会被复用**：异步回调（`setTimeout` / `await` 之后）里读 `e.target` 可能已失效，先存到局部变量
- **`preventDefault` 不会阻止冒泡**：它只拦"默认行为"，事件照样传播；阻止传播是 `stopPropagation`
- **`stopPropagation` 会破坏事件委托**：在委托场景下慎用（详见下一页）
- **页面没反应先查选择器**：`querySelector("btn")` 返回 `null` 时绑定事件会静默失败——先在控制台确认元素存在
- **`onclick` 属性 vs `addEventListener`**：`el.onclick = fn` 会**覆盖**之前的赋值，`addEventListener` 可以叠加多个；统一用后者

## 小结

- `addEventListener` 订阅事件，第三参数：`false` 冒泡（默认）/ `true` 捕获 / `{ once: true }` 一次性
- 事件流三阶段：捕获 → 目标 → 冒泡，捕获先执行、冒泡后执行
- `e.target` 是源头、`e.currentTarget` 是监听者；`preventDefault` 拦默认行为、`stopPropagation` 拦传播
- 移除监听必须用同一个命名函数，匿名函数删不掉

::: tip 速查卡片
事件绑定、事件流与事件对象速查，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::
