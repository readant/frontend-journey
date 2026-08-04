---
title: 06. DOM 操作与事件
---

# DOM 操作与事件

## 它是什么

DOM（Document Object Model）是浏览器把 HTML 解析后生成的**内存对象树**，JavaScript 通过它读写页面。每"操作页面"其实就是三步：**找到元素 → 改它的内容/样式/结构 → 绑定事件**。

```javascript
const title = document.querySelector("h1");  // 找到
title.textContent = "新标题";                  // 改内容
title.addEventListener("click", () => {});    // 绑定事件
```

## 核心机制

### 1. DOM 树与节点关系

```
document
└── html
    ├── head
    └── body
        ├── header
        ├── main
        │   ├── h1
        │   └── p
        └── footer
```

节点之间的关系：**父节点 / 子节点 / 兄弟节点**。API 也按这层关系提供：

```javascript
el.parentElement       // 父元素
el.children            // 子元素集合
el.firstElementChild   // 第一个子元素
el.nextElementSibling  // 下一个兄弟元素
```

### 2. 事件流（Event Flow）——捕获 → 目标 → 冒泡

当元素触发事件，事件会经历三个阶段：

```
捕获阶段（Capture）：window → ... → 目标元素的祖先
目标阶段（Target）： 到达目标元素
冒泡阶段（Bubble）： 目标 → 祖先 → window
```

```html
<div id="outer">
  <button id="inner">点我</button>
</div>
```

```javascript
// 默认 addEventListener 第三阶段是"冒泡"（addEventListener(..., false)）
outer.addEventListener("click", () => console.log("outer 冒泡"));
inner.addEventListener("click", () => console.log("inner 目标"));

// 点击按钮输出：inner 目标 → outer 冒泡
// （冒泡：事件从 inner 一路上浮到 outer）

// 捕获阶段监听：第三个参数传 true
outer.addEventListener("click", () => console.log("outer 捕获"), true);
// 点击按钮输出：outer 捕获 → inner 目标 → outer 冒泡
```

### 3. 事件委托（Event Delegation）

利用**冒泡机制**，把子元素的事件统一挂到父元素上——动态元素也能响应，且只绑定一个监听器：

```javascript
// ❌ 每个 li 都绑定（新增 li 后还得重新绑）
document.querySelectorAll("li").forEach(li =>
  li.addEventListener("click", handler)
);

// ✅ 委托到 ul：一次绑定，动态新增的 li 也能触发
ul.addEventListener("click", (event) => {
  const li = event.target.closest("li");   // 向上找最近的 li
  if (!li) return;                          // 点的是 ul 空白处就忽略
  console.log("点了", li.textContent);
});
```

::: tip 委托的判断
事件委托里判断"点在谁身上"用 `event.target`（真正触发的元素），配合 `closest()` 向上查找；不要用 `this`（它指向绑定的父元素）。
:::

## 标准语法

### 查询元素

```javascript
// 返回第一个匹配（推荐，用法与 CSS 选择器一致）
document.querySelector(".card");        // 类
document.querySelector("#app");         // id
document.querySelector('input[name="q"]'); // 属性

// 返回集合
document.querySelectorAll(".card");     // NodeList（可用 for...of / Array.from）

// 旧式 API（仍有使用）
document.getElementById("app");
document.getElementsByClassName("card");
document.getElementsByTagName("div");
```

### 增删改节点

```javascript
// 创建
const div = document.createElement("div");
div.textContent = "内容";

// 插入
parent.append(div);        // 末尾追加（可同时追加多个/文本）
parent.prepend(div);       // 开头插入
parent.appendChild(div);   // 末尾追加（单个）
before / after / replaceWith / remove
div.before(span);          // 在 div 前插入
div.after(span);           // 在 div 后插入
div.remove();              // 从 DOM 移除自己

// 删除
parent.removeChild(child); // 移除子节点
```

### 内容与属性

```javascript
el.textContent = "文本";            // 纯文本（推荐，安全）
el.innerHTML = "<b>HTML</b>";       // HTML 字符串（有 XSS 风险，见深入理解）
el.outerHTML;                       // 包含元素自身的 HTML

// 属性
el.getAttribute("data-id");        // 读
el.setAttribute("data-id", "5");   // 写
el.hasAttribute("disabled");       // 判断
el.removeAttribute("disabled");    // 删

// 类名与样式
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");     // 切换
el.classList.contains("active");   // 判断
el.style.color = "red";            // 行内样式
```

### 事件监听

```javascript
// 绑定（推荐：可叠加多个监听器、可移除）
el.addEventListener("click", handler, { once: true });  // once: 只触发一次
el.removeEventListener("click", handler);               // 移除（必须同一个函数引用）

// 事件对象
el.addEventListener("click", (e) => {
  e.target;        // 真正触发事件的元素
  e.currentTarget; // 绑定监听的元素
  e.preventDefault();  // 阻止默认行为（如链接跳转、表单提交）
  e.stopPropagation(); // 阻止冒泡（一般用事件委托时不需要）
  e.stopImmediatePropagation(); // 连同级监听器也阻止
});
```

## 深入理解

### 1. innerHTML 与 XSS

```javascript
// ❌ 危险：用户输入直接插入
el.innerHTML = `<p>${userInput}</p>`;   // 用户输入 <img src=x onerror=alert(1)>
```

- 展示**纯文本**用 `textContent`（自动转义，安全）
- 确需 HTML 时，先对用户输入转义，或使用 `createElement` + `textContent` 组合

```javascript
// ✅ 安全写法
const p = document.createElement("p");
p.textContent = userInput;   // 任何输入都只是文本
el.append(p);
```

### 2. 事件流与委托的完整模型

| 问题 | 答案 |
| --- | --- |
| 点击事件的默认顺序 | 捕获（window→...）→ 目标 → 冒泡（...→window） |
| addEventListener 第三参 | `false`（默认）冒泡；`true` 捕获；`{once:true}` 只触发一次 |
| 动态元素绑事件 | 事件委托到静态父元素 |
| 阻止冒泡 | `stopPropagation()`（会破坏委托，慎用） |

### 3. DOM 性能：批量更新

频繁操作 DOM 会触发重排（reflow），性能差。批量插入用 `DocumentFragment`：

```javascript
const frag = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = i;
  frag.append(li);            // 先攒到内存里的片段
}
list.append(frag);            // 一次插入，只触发一次重排
```

### 4. 常见坑点

- **`querySelectorAll` 返回的是 NodeList 不是数组**：`forEach` 可用，`map` 不可用（先 `Array.from`）
- **`nodeList` 是静态快照，`getElementsByClassName` 是动态集合**：后者在 DOM 变化时自动更新，遍历时容易"越删越乱"
- **`style.xxx` 只能读写行内样式**：读 CSS 计算值用 `getComputedStyle(el)`
- **`textContent` vs `innerText`**：前者包含隐藏元素、性能好，推荐前者
- **事件对象是复用的**：异步回调里使用 `e.target` 前先存下来（`const t = e.target`）

## 关联速查

::: tip 速查卡片
DOM 查询、增删改、事件流与委托模板，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::

::: info 延伸阅读
事件规范细节，见 [MDN - 事件参考](https://developer.mozilla.org/zh-CN/docs/Web/Events)。
:::
