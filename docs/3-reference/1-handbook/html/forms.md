---
title: HTML 表单与验证完整手册
---

# HTML 表单与验证

## 核心概念

表单 = 收集用户输入的「容器」+ 各种 `input` 控件 + 提交行为。原生验证先拦住明显错误，JS 负责业务级校验。

## 完整内容

### 是什么 / 为什么

表单是网页与用户交互的主战场：登录、注册、搜索、支付都靠它。写好语义与验证，用户体验和可维护性直接上一个台阶——错误早发现、少写 JS。

### 一、表单结构

```html
<form action="/api/login" method="post">
  <!-- 控件 + 提交按钮 -->
</form>
```

| 属性 | 作用 |
| :--- | :--- |
| `action` | 提交到的地址（现代多由 JS 接管，可不写） |
| `method` | `get`（查询） / `post`（提交数据） |
| `novalidate` | 关闭原生验证，交给 JS |
| `autocomplete` | 表单级自动填充开关 |

### 二、控件家族

| 控件 | 用途 |
| :--- | :--- |
| `<input type="text">` | 单行文本 |
| `<input type="email">` | 邮箱（自带格式校验） |
| `<input type="password">` | 密码（掩码显示） |
| `<input type="number">` | 数字（上下箭头） |
| `<input type="tel">` | 电话（移动端弹数字键盘） |
| `<input type="url">` | 网址（自带格式校验） |
| `<input type="search">` | 搜索框（可一键清空） |
| `<input type="date/time/datetime-local">` | 日期时间选择器 |
| `<input type="checkbox">` | 多选 |
| `<input type="radio">` | 单选（同 `name` 一组） |
| `<input type="range">` | 滑块 |
| `<input type="color">` | 取色器 |
| `<input type="file">` | 文件上传（`multiple` 多选） |
| `<input type="hidden">` | 隐藏字段（随表单提交） |
| `<textarea>` | 多行文本（`rows`/`cols`） |
| `<select>` + `<option>` | 下拉选择（`multiple` 多选） |
| `<datalist>` | 输入框 + 候选建议 |
| `<button type="submit">` | 提交按钮 |
| `<fieldset>/<legend>` | 控件分组 + 组标题（无障碍友好） |

### 三、label 关联（无障碍地基）

```html
<!-- 方式一：label 包住控件 -->
<label>用户名 <input type="text" /></label>

<!-- 方式二：for + id 关联（推荐，可跨结构） -->
<label for="username">用户名</label>
<input id="username" type="text" />

<!-- 方式三：placeholder 不是 label！它是提示不是名称 -->
```

点击 label 文本可聚焦/勾选对应控件；屏幕阅读器靠它读出字段名称。**`placeholder` 不能替代 `label`**。

### 四、原生约束验证

```html
<input required />                 <!-- 必填 -->
<input minlength="6" maxlength="20" />  <!-- 长度区间 -->
<input min="1" max="100" />        <!-- 数值区间 -->
<input pattern="[0-9]{11}" />      <!-- 正则匹配（手机号示例） -->
<input type="email" />             <!-- 内置格式校验 -->
```

| 验证状态 | CSS 伪类 |
| :--- | :--- |
| 通过校验 | `:valid` |
| 未通过 | `:invalid` |
| 必填但为空 | `:required` |
| 非必填且为空 | `:optional` |
| 聚焦时 | `:focus-visible` |

```css
input:invalid {
  border-color: #e5484d; /* 红框提示 */
}
input:valid {
  border-color: #30a46c; /* 绿框确认 */
}
```

### 五、表单数据序列化（FormData）

用 JS 把表单数据整包取出、提交（告别手动拼字段）：

```javascript
const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();                       // 阻止原生提交
  const data = new FormData(form);          // 收集全部带 name 的字段

  // 方式一：手动取值
  const email = data.get("email");

  // 方式二：整包提交（含文件）
  const res = await fetch("/api/login", {
    method: "POST",
    body: data,                             // 自动带 multipart 编码
  });

  // 方式三：转成普通对象（配合 JSON 接口）
  const obj = Object.fromEntries(data.entries());
  await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
});
```

**文件上传**：

```html
<input type="file" accept="image/*" multiple />
```

```javascript
const file = input.files[0];   // File 对象：有 name / size / type
data.append("avatar", file);   // 直接塞进 FormData 随表单提交
```

**`enctype` 三态**：

| 值 | 场景 |
| :--- | :--- |
| `application/x-www-form-urlencoded` | 默认，纯文本表单 |
| `multipart/form-data` | **有文件时必用**（FormData 自动处理） |
| `text/plain` | 基本不用 |

### 六、移动端键盘优化

```html
<!-- inputmode：告诉浏览器调哪种键盘 -->
<input type="text" inputmode="decimal" />  <!-- 带小数点的数字键盘 -->
<input type="text" inputmode="url" />      <!-- 网址键盘 -->
<input type="text" inputmode="search" />   <!-- 搜索键盘 -->

<!-- enterkeyhint：回车键的文案 -->
<input type="text" enterkeyhint="search" /> <!-- 回车显示「搜索」 -->
<input type="text" enterkeyhint="done" />  <!-- 回车显示「完成」 -->

<!-- autocomplete：浏览器自动填充（登录/地址必备） -->
<input type="email" autocomplete="email" />
<input type="password" autocomplete="current-password" />
```

移动端表单两大坑：`font-size < 16px` 聚焦时 iOS 自动放大页面；`type="number"` 在部分安卓不弹数字键盘——优先 `inputmode="decimal"`。

### 语法速查

| 需求 | 写法 |
| :--- | :--- |
| 必填 | `required` |
| 邮箱/网址 | `type="email"` / `type="url"` |
| 长度限制 | `minlength` / `maxlength` |
| 数值限制 | `min` / `max` / `step` |
| 格式限制 | `pattern="正则"` |
| 默认值 | `value` / `checked` / `selected` |
| 禁用 | `disabled`（不提交） / `readonly`（提交但不可改） |
| 分组 | `fieldset` + `legend` |
| 提交 | `<button type="submit">` |

### 常见用法

**登录表单（完整模板）**：

```html
<form action="/api/login" method="post" novalidate>
  <fieldset>
    <legend>账号登录</legend>

    <label for="email">邮箱</label>
    <input id="email" name="email" type="email" required autocomplete="email" />

    <label for="pwd">密码</label>
    <input id="pwd" name="pwd" type="password" required minlength="6" autocomplete="current-password" />

    <button type="submit">登录</button>
  </fieldset>
</form>
```

### 注意事项

- ⚠️ `placeholder` 不是字段名：必须有 `<label>`，否则读屏用户不知道填什么。
- ⚠️ `radio` 分组靠**相同 `name`**，靠不同 `name` 分不开单选组。
- ⚠️ 原生校验只查格式不查业务规则（如「用户名已存在」），仍需要 JS 二次校验。
- ⚠️ 有 `novalidate` 时表单不触发原生提示，全部交给 JS，别忘了兜底。
- ⚠️ `disabled` 字段不随表单提交；要「只读但提交」用 `readonly`。

## 相关

- 🔍 场景索引：[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[HTML 文档结构](/3-reference/1-handbook/html/)、[SEO 与可访问性](/3-reference/1-handbook/html/seo)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
