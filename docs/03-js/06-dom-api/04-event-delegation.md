---
title: 06.4 事件委托
---

# 事件委托：一个监听器管所有子元素

## 它是什么

事件委托（Event Delegation）的核心思想：**把子元素的事件监听器，统一挂到父元素上**，利用"事件会冒泡"的特性，让父元素替所有子元素"收单"。

生活化比喻：与其给小区每一户装门铃（给每个 `li` 绑监听），不如在大门口设一个物业前台（在父元素绑一个监听）——谁来了，物业看一下"你是谁、要去哪家"（`event.target` + `closest`），再分诊处理。**新住户搬进来也自动被物业覆盖**，这就是委托最大的价值。

```javascript
// 委托：只在 ul 上绑一次，所有 li（含以后新增的）都能响应
ul.addEventListener("click", (event) => {
  const li = event.target.closest("li");   // 向上找最近的 li
  if (!li) return;                          // 点的是空白处，忽略
  console.log("点了", li.textContent);
});
```

## 逐 li 绑定 vs 委托：对比

| 对比项 | 逐 li 绑定 | 委托到父元素 |
| --- | --- | --- |
| 监听器数量 | 每项一个，N 项 N 个 | **永远 1 个** |
| 动态新增元素 | ❌ 新元素没监听，要重新绑 | ✅ 自动生效 |
| 内存占用 | 高（项多时明显） | 低 |
| 代码维护 | 增删时容易漏 | 集中一处，好维护 |
| 适用场景 | 少量、静态、独立逻辑 | 列表、动态内容、大量同类元素 |

```javascript
// ❌ 逐 li 绑定：新增的 li 没有监听，而且每个 li 一个函数
document.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", (e) => {
    console.log("点了", e.target.textContent);
  });
});

// ✅ 委托：绑在 ul 上一次，什么都不用重新绑定
list.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  console.log("点了", li.textContent);
});
```

::: tip 什么时候该用委托
**列表渲染（todo、菜单、聊天记录）必用**。凡是"元素会动态增删"或"同类元素很多"的场景，委托几乎总是更好的选择。
:::

## 判断"点的是谁"：event.target + closest

委托的关键问题是：**冒泡上来的事件，到底该算谁的？** 答案靠两样东西：

- `event.target`：真正被点中的元素（可能是 `li` 里的 `<span>`、`<b>`）
- `closest(selector)`：从 `event.target` **向上找**第一个匹配选择器的祖先（含自身）

```javascript
ul.addEventListener("click", (event) => {
  // 必须用 closest 而不是直接判断 target
  const li = event.target.closest("li");
  if (!li) return;

  // 进一步区分：点到了 li 里的删除按钮？
  if (event.target.closest(".delete-btn")) {
    li.remove();
    return;
  }
  console.log("选中", li.textContent);
});
```

::: warning 不要用 this 判断
委托回调里的 `this` 指向**绑定的父元素**（`ul`），不是被点的 `li`。判断"点的是谁"**永远用 `event.target` + `closest`**，这是委托的标准写法。
:::

## 动态新增元素也能响应：委托的核心价值

```javascript
// 不管之后往列表里 append 多少个 li，都不需要再绑任何事件
const btn = document.querySelector("#add");
btn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = "新项 " + Date.now();
  ul.append(li);            // 新 li 的点击，同样会被 ul 的委托接住
});
```

这正是"**绑定一次，终身有效**"的含义：委托的对象是**静态的父容器**（它始终存在），子元素随意增删都不影响。对比逐 li 绑定——新元素没有监听，点它毫无反应，还容易写出"忘了重绑"的 bug。

## stopPropagation 会破坏委托（慎用）

委托依赖事件**一路冒泡到父元素**。如果某个子元素内部调用了 `stopPropagation()`，事件中途就被"掐断"，根本到不了委托的父元素：

```javascript
ul.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) console.log("委托生效：", li.textContent);
});

li.addEventListener("click", (e) => {
  e.stopPropagation();      // ❌ 掐断冒泡 → ul 永远收不到 → 委托失效
});
```

::: danger stopPropagation 是委托的天敌
在委托体系里**不要轻易调用 `stopPropagation()`**——它会让整个委托链条失效。真想阻止冒泡，优先考虑：换个结构、用 `preventDefault` 拦默认行为、或者在委托回调里用标志位区分。**只有明确了"这里必须独立处理且不想让祖先知道"，才用 `stopPropagation`。**
:::

## 常见坑点

- **`target` 可能是内层元素**：`li` 里包着 `<span>`，`target` 是 `span`——必须 `closest("li")` 向上找，不能直接比较 `target === li`
- **`closest` 找不到返回 `null`**：先判空再操作，否则 `li.textContent` 直接报错
- **点的是父容器空白处**：`closest` 返回 `null`，记得 `return` 忽略
- **委托范围太宽**：把监听挂到 `document` 上会影响所有点击，尽量**委托到最近的公共父元素**
- **`stopPropagation` 混入会悄悄失效**：单个 `li` 上加了它，所有兄弟的委托都受影响，排查起来很隐蔽
- **`e.currentTarget` 在委托回调里是父元素**：想拿被点的项要用 `e.target.closest(...)`，不是 `e.currentTarget`

## 小结

- 事件委托 = 利用冒泡，把监听集中到父元素，一个监听器管全部子元素
- 判断"点的是谁"固定组合：`event.target`（源头）+ `closest(selector)`（向上定位）
- 最大优势：**动态新增元素自动响应**，列表类场景必用
- `stopPropagation` 会切断委托链，非必要不用；委托范围越小越好

::: tip 速查卡片
事件委托模板与冒泡机制速查，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::
