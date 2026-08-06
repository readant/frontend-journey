---
title: JS DOM 操作完整手册
---

# JS DOM 操作

## 核心概念

DOM = 把 HTML 变成 JS 能操作的对象树 —— 查询节点、增删改节点、改属性与样式。

## 完整内容

### 是什么 / 为什么

浏览器把页面解析成 DOM（文档对象模型），JS 通过 DOM API 让页面「动起来」。核心心智模型：**先找到节点，再改它**。性能铁律：**减少直接操作 DOM**，批量修改、批量插入。

### 一、查询节点

```javascript
// 单个（找不到返回 null）
document.querySelector(".card");       // 第一个匹配，CSS 选择器语法
document.getElementById("app");        // 按 id

// 多个（返回 NodeList，可用 forEach / 转数组）
document.querySelectorAll(".item");    // 所有匹配
document.querySelectorAll(".item")[0]; // 取第一个
document.getElementsByClassName("item"); // 旧 API，返回动态集合
```

```javascript
// 相对查询
el.querySelector(".title");     // 在 el 内查
el.closest(".card");            // 向上找最近的祖先匹配
el.matches(".active");          // 判断是否匹配选择器
```

### 二、创建与插入节点

```javascript
// 创建
const div = document.createElement("div");
div.textContent = "新内容";        // 纯文本（安全）
div.innerHTML = "<b>富文本</b>";   // 解析 HTML（有 XSS 风险）

// 插入
parent.appendChild(div);        // 尾部追加
parent.insertBefore(div, ref);  // 插到 ref 前
parent.prepend(div);            // 头部插入（现代）
parent.append(div);             // 尾部插入（现代，可多参数）

// 高效批量：先拼好再一次性插入
const frag = document.createDocumentFragment();
list.forEach((item) => frag.append(createEl(item)));
parent.appendChild(frag);       // 只触发一次重排
```

### 三、删除与替换

```javascript
el.remove();                    // 直接移除自己（现代）
parent.removeChild(el);         // 旧 API
parent.replaceChild(newEl, oldEl);
el.innerHTML = "";              // 清空子元素（大列表慎用，逐个 remove 更稳）
```

### 四、属性与样式

```javascript
// 标准属性
el.id = "main";
el.href = "/about";
el.classList.add("active");     // 加类
el.classList.remove("active");  // 删类
el.classList.toggle("active");  // 切换
el.classList.contains("active"); // 判断

// data 属性
el.dataset.id = "42";           // <div data-id="42">

// 行内样式
el.style.color = "red";
el.style.transform = "translateX(10px)";  // 驼峰命名

// 自定义属性
el.setAttribute("role", "button");
el.getAttribute("role");
```

**class 操作是高频**：能加类就别逐个改 style，配合 CSS 过渡更流畅。

### 五、内容与尺寸

```javascript
el.textContent;     // 纯文本内容（读 + 写）
el.innerHTML;       // HTML 内容（解析渲染）

el.textContent = "新的文字";    // 设置文本（比 innerHTML 安全）

// 尺寸与位置
el.clientWidth;     // 含 padding，不含 border
el.offsetWidth;     // 含 border
el.getBoundingClientRect();  // 元素相对视口的位置与尺寸
window.scrollY;     // 滚动距离
```

### 六、遍历

```javascript
el.parentElement;       // 父元素
el.children;            // 子元素集合（不含文本节点）
el.firstElementChild;   // 第一个子元素
el.nextElementSibling;  // 下一个兄弟元素
```

### 语法速查

| 意图 | 写法 |
| :--- | :--- |
| 查询单个 | `document.querySelector(sel)` |
| 查询多个 | `document.querySelectorAll(sel)` |
| 创建 | `document.createElement("div")` |
| 插入 | `parent.append(el)` / `prepend` / `insertBefore` |
| 删除 | `el.remove()` |
| 改文本 | `el.textContent = "..."` |
| 改 HTML | `el.innerHTML = "..."`（慎用，XSS） |
| 加类 | `el.classList.add("x")` |
| 改样式 | `el.style.color = "red"` |
| data 属性 | `el.dataset.key = value` |
| 自定义属性 | `el.setAttribute(name, value)` |

### 常见用法

**渲染列表（高效批量）**：

```javascript
function renderList(container, items) {
  const frag = document.createDocumentFragment();
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item.name;
    frag.append(li);
  }
  container.replaceChildren(frag);   // 一次替换
}
```

**DOMContentLoaded（页面结构就绪再操作）**：

```javascript
document.addEventListener("DOMContentLoaded", () => {
  // 此时 DOM 已解析完，可安全查询
});
```

### 注意事项

- ⚠️ `innerHTML` 插入用户输入有 **XSS 风险**，用户内容一律用 `textContent` 或 `createElement`。
- ⚠️ 每改一次 DOM 都可能触发重排，循环里别逐个插入，用 `DocumentFragment` 或一次 `replaceChildren`。
- ⚠️ `querySelectorAll` 返回的是**静态** NodeList，新增节点后不会自动包含。
- ⚠️ `style` 设的是**行内样式**，优先级高于 CSS 文件，临时覆盖用它可以，持久样式交给 class。
- ⚠️ 事件监听要在元素存在后绑定（动态列表用事件委托，见[事件系统](/3-reference/1-handbook/js/event)）。

## 相关

- 🔍 场景索引：[事件场景](/3-reference/2-scenarios/event)
- 📖 相邻手册：[事件系统](/3-reference/1-handbook/js/event)、[异步](/3-reference/1-handbook/js/async)（请求后渲染）
