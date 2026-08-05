---
title: 06.1 查询与遍历
---

# 查询与遍历：找到页面上的元素

## 它是什么

把 HTML 想象成一颗**家族树**：`document` 是根，`html` 是主干，`body`、`header`、`main` 是枝干，`h1`、`p`、`button` 是树叶。DOM 查询就是"在这颗树上按名字或特征**找到某片叶子**"，遍历则是"从一片叶子走到它的**父/子/兄弟**"。这一页你只需记住两条主线：**怎么找到元素（查询）**，**找到之后怎么在节点之间走动（遍历）**。

## 认识 DOM 树与节点关系

一颗极简的 DOM 树长这样：

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── header
        ├── main
        │   ├── h1
        │   └── ul
        │       ├── li
        │       ├── li
        │       └── li
        └── footer
```

每个元素都有三种"亲戚关系"：**父节点（parent）**、**子节点（children）**、**兄弟节点（sibling）**。API 按这套关系提供，命名非常有规律：

```javascript
const main = document.querySelector("main");

main.parentElement;          // 父元素 → body
main.children;               // 子元素集合（HTMLCollection）→ [h1, ul]
main.firstElementChild;      // 第一个子元素 → h1
main.lastElementChild;       // 最后一个子元素 → ul
main.previousElementSibling; // 上一个兄弟 → header
main.nextElementSibling;     // 下一个兄弟 → footer
```

::: tip 为什么叫 ElementChild 而不是 Child？
`children` / `firstElementChild` 等 API **只返回元素节点**（跳过文本、注释）。而 `childNodes` / `firstChild` 会把空格、换行也当成文本节点返回，容易踩坑。**日常操作永远优先用 Element 系列。**
:::

## 现代查询：querySelector / querySelectorAll

最推荐的查询方式，因为它们接收的就是**CSS 选择器字符串**——你写 CSS 怎么选，这里就怎么写，零学习成本：

```javascript
document.querySelector(".card");              // 第一个类为 card 的元素
document.querySelector("#app");               // id 为 app 的元素
document.querySelector('input[name="q"]');    // 属性选择器
document.querySelector("ul li:first-child");  // 后代 + 伪类组合
document.querySelector("div > p");            // 直接子元素

// querySelectorAll：返回所有匹配，得到 NodeList
document.querySelectorAll(".card");           // 页面上所有 .card
document.querySelectorAll("li");              // 所有 li
```

::: warning 两个 API 的返回值不同
`querySelector` 只返回**第一个**匹配的元素（没有则返回 `null`）；`querySelectorAll` 返回**全部**匹配（是一个 NodeList，见下节）。匹配不到元素时，`querySelector` 会得到 `null`——用之前要判空，否则调用它的属性会直接报错。
:::

```javascript
const el = document.querySelector(".not-exist");
// el.textContent = "x";   // ❌ 报错：Cannot read properties of null
if (el) {                   // ✅ 先判空
  el.textContent = "x";
}
```

## 旧式 API：getElementById 家族

在 `querySelector` 出现之前，大家用这套"老 API"。它们**依然能用**，在面试题和旧项目里常见：

```javascript
document.getElementById("app");              // 按 id，性能最快
document.getElementsByClassName("card");      // 按类名，返回集合
document.getElementsByTagName("div");         // 按标签名，返回集合
```

::: danger 动态集合（live collection）的坑
`getElementsByClassName` / `getElementsByTagName` 返回的是**动态集合**：DOM 一变化它就自动更新。遍历删除时它会实时变短，容易"越删越乱"（索引错位）。而 `querySelectorAll` 返回的是**静态快照**，DOM 变了它也不变。**推荐统一用 `querySelectorAll`**，行为可预期。
:::

## NodeList 与数组的差异

`querySelectorAll` 返回的 NodeList **长得像数组但不是数组**：

```javascript
const cards = document.querySelectorAll(".card");

cards.length;              // ✅ 有 length
cards[0];                  // ✅ 按下标访问
cards.forEach(c => {});    // ✅ 有 forEach

// cards.map(...)           // ❌ 没有 map / filter / reduce！
// cards.push(...)          // ❌ 没有 push，是只读集合
```

需要数组方法时先转换：

```javascript
const arr = Array.from(cards);        // 推荐：一次性转换
const arr2 = [...cards];              // 或用展开运算符
arr.map(c => c.textContent);          // 现在可以了
```

::: tip 快速判断
看到"类数组"（有 `length` 和下标、但没有 `map` 等数组方法）的东西，先 `Array.from` 转成真数组再操作，这是处理 NodeList 的标准姿势。
:::

## 类名操作：classList

改样式最常见的方式是**切换类名**，`classList` 提供了四个基本方法：

```javascript
el.classList.add("active");          // 加一个类
el.classList.remove("active");       // 删一个类
el.classList.toggle("active");       // 有则删、无则加（开关）
el.classList.contains("active");     // 判断是否存在 → true/false
```

对比旧写法 `el.className = "a b c"`：`className` 是**整串覆盖**，很容易把其他类弄丢；`classList` 是**单项增删**，安全得多。配合 `toggle` 写"开关"交互（暗黑模式、选中态）非常顺手——一个 `toggle` 就完成"有则删、无则加"。

## 属性操作：getAttribute 家族

HTML 标签上的 `id`、`href`、`data-xxx` 都是属性，DOM API 提供四个方法：

```javascript
el.getAttribute("data-id");       // 读：没有该属性返回 null
el.setAttribute("data-id", "5");  // 写：不存在则新增
el.hasAttribute("disabled");      // 判断：true / false
el.removeAttribute("disabled");   // 删：移除整个属性
```

最常用的是 **`data-*` 自定义属性**——用来在元素上"挂数据"：

```html
<button data-id="42" data-role="admin">删除</button>
```

```javascript
const btn = document.querySelector("button");
btn.dataset.id;        // "42"（data-id → dataset.id）
btn.dataset.role;      // "admin"（data-role → dataset.role）
btn.dataset.status = "loading";   // 会变成 data-status="loading"
```

::: tip dataset 命名规则
`data-` 后面的部分自动变成驼峰：`data-user-name` → `dataset.userName`。反过来，赋值驼峰也会自动转成 `data-xxx` 形式。
:::

## 常见坑点

- **`querySelector` 可能返回 `null`**：匹配不到时是 `null`，不判空直接操作会抛错
- **NodeList 不是数组**：有 `forEach` 没有 `map`，先 `Array.from` 再操作
- **`children` 和 `childNodes` 不一样**：后者把空白文本也当节点，遍历结果"多出一堆空项"，优先用 Element 系列
- **旧式集合是动态的**：`getElementsByClassName` 等会随 DOM 变化自动更新，遍历删除时小心
- **`className` 是整体覆盖**：给元素加类请用 `classList.add`，别用 `el.className = ...`
- **`style` 只能读写行内样式**：想读 CSS 计算值要用 `getComputedStyle(el)`

## 小结

- 查询优先用 `querySelector` / `querySelectorAll`（CSS 选择器语法，静态返回）
- 节点间走动用 `parentElement` / `children` / `firstElementChild` / `nextElementSibling` 这一套 Element API
- NodeList 是"类数组"，需要数组方法时 `Array.from` 转一下
- 类名用 `classList` 四件套，属性用 `getAttribute` 家族，自定义数据用 `data-*` + `dataset`

::: tip 速查卡片
查询、遍历、classList 与属性操作的完整模板，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::
