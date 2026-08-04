---
title: 03. 表单与验证
---

# 表单与验证

## 它是什么

表单（`<form>`）是 HTML 中**收集用户输入并提交给服务器**的唯一原生通道。它由三部分组成：

```
<form> 表单容器
  ├── 输入控件（input / select / textarea / button）
  ├── 分组与说明（fieldset / legend / label）
  └── 验证机制（required / pattern / minlength ...）
</form>
```

表单的价值不仅是"输入框集合"：它自带**数据编码、提交行为、浏览器原生验证**三层机制，理解这三层，才能写出可靠的表单。

## 核心机制

### 1. 表单提交机制

```html
<form action="/api/register" method="post">
```

| 属性 | 作用 | 说明 |
| --- | --- | --- |
| `action` | 提交目标 URL | 不写则提交到当前页面 |
| `method` | HTTP 方法 | `get`：拼到 URL 查询串（适合搜索）；`post`：放请求体（适合提交数据） |
| `enctype` | 编码方式 | `application/x-www-form-urlencoded`（默认）/ `multipart/form-data`（**文件上传必须**）/ `text/plain` |

提交时浏览器做两件事：

1. **收集数据**：把表单内所有带 `name` 属性的控件组成 `name=value` 键值对
2. **编码发送**：按 `enctype` 编码后按 `method` 发送

::: warning 没有 name 的控件不会被提交
`<input type="text">` 不写 `name` 属性，它的值不会出现在提交数据里。`name` 才是"数据的键名"。
:::

### 2. 约束验证（Constraint Validation）

HTML5 内置了一套**浏览器端的验证引擎**，无需 JS：

```
用户提交
  └→ 浏览器检查约束（required/pattern/minlength/min/max/type=email...）
       ├→ 通过 → 触发 submit 事件
       └→ 不通过 → 阻止提交，显示错误气泡，聚焦到错误控件
```

验证失败时，浏览器自动标记控件为 `:invalid`，成功为 `:valid`，可通过 CSS 定制样式：

```css
input:invalid { border-color: #e74c3c; }
input:valid   { border-color: #2ecc71; }
```

### 3. 验证是"前端体验"，不是"安全防线"

::: danger 服务端必须再次验证
浏览器验证可被绕过（禁用 JS、直接构造请求）。**前端验证只负责用户体验，服务端验证才是数据安全的唯一保证**。文件类型、长度、内容合法性都必须在服务端复验。
:::

## 标准语法

### 表单基础结构

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>账户信息</legend>

    <label for="user">用户名：</label>
    <input type="text" id="user" name="user" required
           minlength="2" maxlength="20" placeholder="2-20 个字符">

    <label for="email">邮箱：</label>
    <input type="email" id="email" name="email" required>

    <label for="pwd">密码：</label>
    <input type="password" id="pwd" name="pwd" required minlength="6">
  </fieldset>

  <button type="submit">提交</button>
</form>
```

**无障碍三件套**：每个控件都必须有 `<label>`（用 `for` 关联 `id`）、分组用 `<fieldset>`+`<legend>`、必填加 `required`。

### input 类型全景

| type | 用途 | 关键属性 | 移动端键盘 |
| --- | --- | --- | --- |
| `text` | 单行文本 | placeholder, maxlength | 全键盘 |
| `password` | 密码 | minlength | 全键盘 |
| `email` | 邮箱 | 内置格式验证 | @ 键盘 |
| `url` | 网址 | 内置格式验证 | .com 键盘 |
| `number` | 数字 | min, max, step | 数字键盘 |
| `tel` | 电话 | pattern | 拨号键盘 |
| `range` | 滑块 | min, max, value | - |
| `color` | 颜色 | value（hex） | 取色器 |
| `date` / `time` | 日期 / 时间 | min, max | 选择器 |
| `file` | 文件上传 | accept, multiple | 文件选择器 |
| `checkbox` / `radio` | 复选 / 单选 | checked（radio 靠 name 互斥） | - |
| `hidden` | 隐藏字段 | value | - |

### 验证属性

| 属性 | 作用 | 示例 |
| --- | --- | --- |
| `required` | 必填 | `<input required>` |
| `minlength` / `maxlength` | 字符长度 | `minlength="6"` |
| `min` / `max` / `step` | 数值范围与步进 | `min="0" max="100" step="0.1"` |
| `pattern` | 正则验证 | `pattern="[0-9]{6}"`（**不用写 `/` 定界符**） |
| `novalidate` | 关闭浏览器验证（form 上） | 留给 JS 校验时用 |

::: warning placeholder 不是 label 的替代品
placeholder 在输入后消失，且屏幕阅读器不朗读。**label 负责描述，placeholder 负责示例**，两者不能互相替代。
:::

### 下拉选择与文本域

```html
<select name="city">
  <optgroup label="浙江省">
    <option value="hz">杭州</option>
    <option value="nb" selected>宁波</option>
  </optgroup>
</select>

<textarea name="bio" rows="4" maxlength="200" placeholder="自我介绍"></textarea>
```

- `<select multiple>` 可多选（Ctrl/Cmd 点击）
- `<optgroup label>` 选项分组
- textarea 用 `rows`/`cols` 定尺寸，CSS `resize` 控缩放

### 按钮与补全列表

```html
<button type="submit">提交</button>   <!-- 提交（默认） -->
<button type="reset">重置</button>    <!-- 重置为初始值 -->
<button type="button">普通</button>   <!-- 无默认行为，需 JS -->

<input list="browsers" name="browser">
<datalist id="browsers">
  <option value="Chrome"><option value="Firefox">
</datalist>
```

::: tip button 优于 input type="submit"
`<button>` 内部可放图标/HTML 结构，`<input type="submit">` 只能用 value 写字。优先用 `<button>`。
:::

## 深入理解

### 1. 约束验证 API（JS 接管验证）

内置验证可以完全由 JS 接管，核心是 `validity` 对象：

```javascript
const input = document.getElementById('user');

input.addEventListener('input', () => {
  if (input.validity.tooShort) {        // 违反 minlength
    input.setCustomValidity('用户名至少 2 个字符');
  } else if (input.validity.valueMissing) {  // 违反 required
    input.setCustomValidity('用户名不能为空');
  } else {
    input.setCustomValidity('');        // 清空自定义错误
  }
});

// 手动触发验证
form.checkValidity();     // 返回 boolean，不显示 UI
form.reportValidity();    // 返回 boolean，并显示错误气泡
```

`validity` 的常用标志：`valueMissing`（必填为空）、`typeMismatch`（格式不符）、`tooShort/tooLong`、`rangeUnderflow/rangeOverflow`、`patternMismatch`、`stepMismatch`。

### 2. disabled vs readonly（提交差异）

| 对比 | `disabled` | `readonly` |
| --- | --- | --- |
| 值是否提交 | **不提交** | **提交** |
| 可聚焦 | 否 | 可聚焦可复制 |
| 触发事件 | 否 | 是 |
| 视觉 | 置灰 | 无变化 |

```html
<input value="不可提交" disabled>
<input value="只读但会提交" readonly>
```

::: danger disabled 是隐藏数据的常见坑
把"不想让用户改但需要提交"的字段写成 `disabled`，提交后服务端就收不到这个值了——这种情况应该用 `readonly` 或 `hidden`。
:::

### 3. label 的关联机制

```html
<!-- 方式一：for + id（推荐） -->
<label for="name">姓名</label>
<input id="name">

<!-- 方式二：包裹式（隐式关联） -->
<label>姓名 <input></label>
```

`for` 指向的是控件的 **`id`**（不是 `name`）。关联后：点击 label 文字 = 点击输入框；屏幕阅读器朗读 label 文本 = 输入框的"名字"。

### 4. 文件上传的编码

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*">
</form>
```

- **必须** `enctype="multipart/form-data"`，否则文件名以纯文本提交，文件本体不传输
- `accept` 只做选择器过滤，**不保证安全**，服务端必须校验真实类型
- GET 不适合传文件（URL 长度限制且不宜放二进制）

### 5. radio 互斥靠 name

```html
<input type="radio" name="gender" value="male"> 男
<input type="radio" name="gender" value="female"> 女
```

同组单选必须 `name` 相同，否则各自独立、可以多选。提交时取选中项的值。

### 6. 错误场景：`:invalid` 初次触发

页面加载时，所有带 `required` 的空输入框都是 `:invalid` 状态——直接写 `input:invalid { 红框 }` 会导致页面一打开就一片红。常规解法：先用 CSS 标记"已交互"，再应用错误样式，或交由 JS 在提交后统一加类。

## 关联速查

::: tip 速查卡片
表单控件与验证属性的完整速查，见 [HTML 表单与交互速查](/cheatsheet/html/forms)。
:::

::: info 互动演示
基础表单 / HTML5 类型 / 验证实战三个案例：[表单演示](/examples/01-html/03-forms-validation/01-basic-form.html)
:::
