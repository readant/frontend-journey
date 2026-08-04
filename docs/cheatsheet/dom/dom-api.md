---
title: DOM 操作速查
---

# DOM 操作速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 找元素 | `querySelector` / `querySelectorAll`（CSS 选择器） |
| 改文本 | `textContent`（安全，推荐） |
| 改 HTML | `innerHTML`（有 XSS 风险，慎用） |
| 增删节点 | `createElement` + `append` / `remove` |
| 动态元素事件 | **事件委托**（绑父元素） |
| 批量插入 | `DocumentFragment` |

## 核心代码

```javascript
// 查询
document.querySelector(".card");             // 第一个
document.querySelectorAll(".card");          // NodeList
document.getElementById("app");

// 增删改
const div = document.createElement("div");
div.textContent = "内容";
parent.append(div);                          // 末尾追加
parent.prepend(div);                         // 开头插入
div.before(span); div.after(span);           // 前后插入
div.remove();                                // 移除自己

// 属性/类/样式
el.setAttribute("data-id", "5");
el.getAttribute("data-id");
el.classList.add("active");
el.classList.toggle("active");
el.style.color = "red";

// 事件
el.addEventListener("click", handler, { once: true });
el.removeEventListener("click", handler);    // 需同一函数引用

// 事件委托（动态元素）
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");       // 向上找 li
  if (!item) return;
  console.log(item.textContent);
});

// 批量插入
const frag = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = i;
  frag.append(li);
}
list.append(frag);   // 一次插入，只重排一次
```

## 踩坑记录

- **`innerHTML` 拼接用户输入 = XSS**：展示文本用 `textContent`（自动转义）
- **`querySelectorAll` 返回 NodeList**：有 `forEach` 但没 `map`，要 `Array.from()` 转数组
- **`getElementsByClassName` 是动态集合**：DOM 变化会自动更新，遍历时删除元素容易乱
- **`addEventListener` 默认冒泡阶段**：要捕获阶段监听传第三个参数 `true`
- **事件委托判断用 `e.target`**：不是 `this`（this 是绑定的父元素）；配合 `closest()` 向上查找
- **`style.xxx` 只读写行内样式**：读 CSS 计算值用 `getComputedStyle(el)`
- **`stopPropagation` 会破坏事件委托**：一般不需要，慎用
- **异步回调里用事件对象**：先 `const t = e.target` 存下（事件对象会复用）
