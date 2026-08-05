---
title: 06.2 修改节点
---

# 修改节点：创建、插入、删除与内容

## 它是什么

把页面想象成一套**乐高积木**：查询是"找到哪块积木"，修改则是"**拼一块新的、把它插到某个位置、或者拆掉一块**"。JS 提供的 API 正好覆盖这三件事：`createElement` 造积木、`append`/`before` 等拼积木、`remove` 拆积木。

```javascript
const li = document.createElement("li");  // 造一块
li.textContent = "新项";                  // 写上字
list.append(li);                          // 拼到 list 里
```

## 创建元素：createElement

创建元素本身**不会出现在页面上**，它只是"在内存里捏好的一个空壳"，必须插入到某个已存在的元素中才会被看见：

```javascript
const div = document.createElement("div");      // 空 div
div.className = "card";                          // 设置类
div.textContent = "内容";                        // 设置文本
div.dataset.id = 1;                              // 挂数据
document.body.append(div);                       // 这才上屏！
```

::: tip 三步走习惯
创建元素的固定套路：**`createElement` 创建 → 设置内容/属性/类 → 插入到父元素**。第三步漏掉，前两步等于白做。
:::

## 插入节点：append / prepend / appendChild / before / after

插入 API 有好几个，区别在"插到哪"和"能否插多个"：

| API | 插入位置 | 特点 |
| --- | --- | --- |
| `parent.append(node)` | 末尾 | 可一次插多个/插文本，现代推荐 |
| `parent.prepend(node)` | 开头 | 可一次插多个/插文本 |
| `parent.appendChild(node)` | 末尾 | 只能插一个元素（旧式，兼容老浏览器） |
| `node.before(x)` | node 前面 | 以"被参照的元素"为基准 |
| `node.after(x)` | node 后面 | 以"被参照的元素"为基准 |
| `node.replaceWith(x)` | 原地 | 用新节点替换自己 |

```javascript
const p = document.createElement("p");
p.textContent = "段落";

container.append(p);              // 追加到末尾
container.prepend(p);             // 插入到开头（注意：同一个节点移动了）
container.appendChild(p);         // 追加到末尾（单个）

p.before(span);                   // 在 p 前面插 span
p.after(span);                    // 在 p 后面插 span
p.replaceWith(strong);            // 用 strong 换掉 p

// append 支持多个参数
container.append(p, span, "一段纯文本");   // 元素和文本都行
```

::: warning 同一个节点只能出现在一个位置
把已存在的节点插入别处，等于**移动**它——原位置会消失。想复制一份要用 `node.cloneNode(true)`（`true` 表示连子节点一起复制）。
:::

## 删除节点：remove / removeChild

```javascript
el.remove();                    // 现代：把自己从 DOM 移除（最常用）
parent.removeChild(child);      // 旧式：让父元素移除指定子节点

// 一次清空某容器
while (list.firstChild) {       // 逐个删，直到删光
  list.removeChild(list.firstChild);
}
list.innerHTML = "";            // 更简单的清空写法
```

::: tip remove 后节点还活着
`remove()` 只是把元素**移出页面**，变量仍引用着它。想要"后悔药"就直接再 `append` 回去——这也常用来做"暂存再还原"。
:::

## 文本与 HTML：textContent / innerHTML / outerHTML

三者都能"塞内容"，但语义完全不同：

| 属性 | 行为 | 安全 | 典型场景 |
| --- | --- | --- | --- |
| `textContent` | 把内容当**纯文本**（自动转义 `<` `>`） | ✅ 安全 | 展示用户输入、动态文本 |
| `innerHTML` | 把字符串**当 HTML 解析** | ⚠️ 有风险 | 渲染已知的固定 HTML 片段 |
| `outerHTML` | 读/写**包含自身标签**的整段 HTML | ⚠️ 有风险 | 极少用，替换整个元素 |

```javascript
el.textContent = "<b>加粗</b>";
// 页面显示字面文本：<b>加粗</b>（尖括号被转义，不会加粗）

el.innerHTML = "<b>加粗</b>";
// 页面显示加粗：加粗（字符串被解析成真实标签）

el.outerHTML = "<section>新元素</section>";
// 整个 el 被替换成 section
```

::: tip 读内容也有讲究
读取时，`textContent` 拿到的永远是**纯文本**（含隐藏元素的文本，性能好）；`innerText` 受排版影响且忽略隐藏元素，性能差。**读取/写入都优先 `textContent`**。
:::

## XSS 安全：为什么用户输入必须用 textContent

如果你把用户输入直接塞进 `innerHTML`，等于把**执行代码的权限**交给了用户：

```javascript
// ❌ 危险：用户输入被当成 HTML 执行
const userInput = '<img src=x onerror="alert(1)">';
el.innerHTML = `<p>${userInput}</p>`;   // 图片加载失败 → 触发 onerror → 弹窗！

// ✅ 安全：用户输入永远只是文本
const p = document.createElement("p");
p.textContent = userInput;
el.append(p);
```

::: danger 永远不要信任用户输入
任何**来自用户**的内容（表单、URL 参数、接口返回的文本）在插入页面时都默认用 `textContent`。除非你能 100% 确认内容是安全的固定 HTML，否则不要碰 `innerHTML`。`<img onerror>`、`<a href="javascript:...">` 都是经典攻击载荷。
:::

## 性能优化：DocumentFragment 批量插入

每次"插入节点"都可能触发浏览器的**重排（reflow）**——重新计算页面布局，频繁操作会明显卡顿。批量插入时用 `DocumentFragment`（一个**内存里的虚拟容器**）先攒着，最后一次性上屏：

```javascript
// ❌ 低效：循环里 1000 次插入 = 1000 次重排
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = i;
  list.append(li);
}

// ✅ 高效：先在片段里拼好，最后只插一次
const frag = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = i;
  frag.append(li);
}
list.append(frag);            // 一次插入，浏览器只重排一次
```

::: tip DocumentFragment 是什么
它就像"**临时托盘**"：插入它内部的节点不会上屏、也不会触发重排，把托盘整个 `append` 到页面时，托盘里的节点会"倒出来"并留在目标位置，托盘本身消失。是批量渲染列表的标配写法。
:::

## 常见坑点

- **创建了元素忘了插入**：`createElement` 后不插入，页面永远看不到
- **重复插入同一节点 = 移动**：想复制用 `cloneNode(true)`
- **`innerHTML` 会重建所有子元素**：大容器频繁改 `innerHTML` 性能差，还丢事件监听（重建后原监听失效）
- **`textContent` 设成数字/布尔会变字符串**：`el.textContent = 0` 显示 "0"，判断空要用 `el.textContent === ""`
- **`outerHTML` 替换后原引用失效**：`el.outerHTML = ...` 后 `el` 变量还指向旧节点（已脱离 DOM）

## 小结

- 创建：`createElement` 造壳，插入才算上屏
- 插入：现代 API 用 `append` / `prepend` / `before` / `after`，注意"同一节点只能有一处"
- 删除：`remove()` 最省事，被删的节点还能再插回去
- 内容：纯文本用 `textContent`，用户输入**禁止** `innerHTML`（XSS）
- 性能：批量插入先攒进 `DocumentFragment`，一次上屏

::: tip 速查卡片
创建、插入、删除与内容安全的完整模板，见 [DOM 操作速查](/cheatsheet/dom/dom-api)。
:::
