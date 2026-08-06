---
title: JS 事件系统完整手册
---

# JS 事件系统

## 核心概念

事件 = 用户与页面的每一次交互 —— 监听、冒泡、委托三件套是事件编程的全部心法。

## 完整内容

### 是什么 / 为什么

点击、键盘、滚动、拖拽……浏览器把用户动作封装成**事件对象**派发出去，JS 用「监听 → 回调」响应。事件在 DOM 树上有传播路径（捕获 → 目标 → 冒泡），理解它才能解释「为什么点子元素触发了父元素」并驾驭事件委托。

### 一、监听事件

```javascript
// 推荐：addEventListener（可加多个，可移除）
el.addEventListener("click", handler);
el.addEventListener("click", handler, { once: true });  // 只执行一次

// 移除（必须引用同一个函数，匿名函数无法移除）
el.removeEventListener("click", handler);

// 旧写法（只能挂一个，别用）
el.onclick = handler;
```

### 二、事件对象

```javascript
el.addEventListener("click", (e) => {
  e.target;           // 实际点中的元素（可能被子元素）
  e.currentTarget;    // 绑定监听的元素
  e.preventDefault(); // 阻止默认行为（如 a 跳转、表单提交）
  e.stopPropagation();// 阻止冒泡（向上传播）
});
```

| 常用属性 | 含义 |
| :--- | :--- |
| `e.target` | 真正触发事件的元素 |
| `e.currentTarget` | 绑定监听的元素 |
| `e.type` | 事件类型（"click" 等） |
| `e.key` | 键盘事件按键（"Enter"） |
| `e.code` | 按键物理位置（"KeyA"） |

### 三、事件流：捕获 → 目标 → 冒泡

```
捕获阶段（父 → 子）→ 目标阶段 → 冒泡阶段（子 → 父）
```

```html
<div id="parent">
  <button id="child">点我</button>
</div>
```

```javascript
parent.addEventListener("click", () => console.log("父（冒泡）"));
parent.addEventListener("click", () => console.log("父（捕获）"), true);
// 点按钮输出：父（捕获）→（目标监听）→ 父（冒泡）
```

**stopPropagation 的两种姿势**：

```javascript
e.stopPropagation();    // 阻止继续冒泡（常用：点击子元素别触发父级）
e.stopImmediatePropagation(); // 还阻止同元素上后续监听器
```

### 四、事件委托（性能核心）

**原理**：利用冒泡，把监听器挂在**父元素**上，用 `e.target` 判断具体子元素 —— 动态列表零成本加监听。

```javascript
list.addEventListener("click", (e) => {
  const item = e.target.closest(".item");   // 向上找真正的条目
  if (!item) return;                        // 点到了空白处
  handleItem(item.dataset.id);
});
```

**为什么重要**：新插入的子元素**不需要**重新绑定事件；1000 个列表项只挂 1 个监听器，而不是 1000 个。

### 五、常用事件类型

| 类别 | 事件 | 触发 |
| :--- | :--- | :--- |
| 鼠标 | `click` `dblclick` `mouseenter` `mouseleave` `mousemove` | 点击 / 悬停（mouseenter 不冒泡，更友好） |
| 键盘 | `keydown` `keyup` | 按下 / 抬起（用 e.key 判断） |
| 表单 | `input` `change` `submit` `focus` `blur` | 输入中 / 失焦后变化 / 提交 |
| 滚动 | `scroll` | 滚动（节流！） |
| 拖拽 | `dragstart` `dragover` `drop` | HTML5 拖拽 |
| 触摸 | `touchstart` `touchmove` `touchend` | 移动端 |

```javascript
// 表单输入实时反馈
input.addEventListener("input", (e) => {
  console.log(e.target.value);   // 每敲一个字符触发
});

// 表单提交阻止刷新
form.addEventListener("submit", (e) => {
  e.preventDefault();            // 阻止页面刷新
  console.log(new FormData(form));
});
```

### 语法速查

| 意图 | 写法 |
| :--- | :--- |
| 监听 | `el.addEventListener(type, fn, options?)` |
| 移除 | `el.removeEventListener(type, fn)` |
| 阻止默认 | `e.preventDefault()` |
| 阻止冒泡 | `e.stopPropagation()` |
| 拿触发元素 | `e.target`（配合 `closest`） |
| 按键判断 | `e.key === "Enter"` |
| 一次性 | `{ once: true }` |
| 委托 | 父级监听 + `e.target.closest(sel)` |
| 冒泡阶段 | 默认第三个参数 false |

### 常见用法

**防抖滚动监听**：

```javascript
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    // 实际逻辑（每帧最多一次）
    ticking = false;
  });
});
```

**键盘快捷键（Esc 关闭弹窗）**：

```javascript
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
```

### 注意事项

- ⚠️ 动态插入的元素用**事件委托**挂父级，别逐个绑定；否则新元素没有监听器。
- ⚠️ 不需要冒泡就 `stopPropagation()`，防止父级误触发；但要先想清楚父级是否也在用它。
- ⚠️ 表单提交不 `preventDefault()` 页面会刷新，开发时最先排查它。
- ⚠️ 监听器绑定后要记得移除（单页应用切页面/组件销毁时），否则内存泄漏。
- ⚠️ `mouseenter`/`mouseleave` 不冒泡、不会因子元素进出反复触发，比 `mouseover`/`mouseout` 好用。
- ⚠️ 高频事件（scroll/resize/mousemove）一定要节流或防抖，否则卡顿。

## 相关

- 🔍 场景索引：[事件场景](/3-reference/2-scenarios/event)
- 📖 相邻手册：[DOM 操作](/3-reference/1-handbook/js/dom)、[闭包](/3-reference/1-handbook/js/closure)（防抖节流实现）
