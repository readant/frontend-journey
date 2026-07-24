# 基础表单详解

> 对应 HTML 文件：`../01-basic-form.html`

## 本案例学习目标

- 掌握 form 标签的 action 和 method 属性
- 理解 label 的 for 绑定机制
- 掌握 fieldset 和 legend 的表单分组
- 理解 radio 的 name 互斥和 checkbox 的多选
- 了解 datalist 预定义选项

## 知识点详解

### 1. form 标签

**语法：**
```html
<form action="/submit" method="post">
  <!-- 表单内容 -->
</form>
```

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `action` | 表单提交的目标 URL | `/api/register` |
| `method` | HTTP 请求方法 | `get`（查询）/ `post`（提交） |
| `enctype` | 编码类型 | `multipart/form-data`（文件上传时必须） |
| `novalidate` | 禁用浏览器验证 | 布尔属性，用于测试 |

**get vs post：**
- `get`：数据附加在 URL 后面（?key=value），适合搜索、筛选
- `post`：数据放在请求体中，适合注册、登录、上传

### 2. label 的 for 绑定

```html
<!-- 正确：for="id" 与 input 的 id 匹配 -->
<label for="username">用户名：</label>
<input type="text" id="username" name="username">

<!-- 错误：没有 for 属性 -->
<label>用户名：</label>
<input type="text" id="username" name="username">
```

**绑定的好处：**
1. 点击 label 可聚焦输入框（提升用户体验）
2. 屏幕阅读器能正确朗读标签（提升无障碍）

### 3. fieldset 和 legend（表单分组）

```html
<fieldset>
  <legend>个人信息</legend>
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name">
</fieldset>

<fieldset>
  <legend>联系方式</legend>
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email">
</fieldset>
```

**作用：**
- `<fieldset>` 将相关表单控件分组，有视觉边框
- `<legend>` 为分组提供标题（屏幕阅读器会朗读）
- 对无障碍访问非常重要

### 4. radio 单选按钮

```html
<label>性别：</label>
<input type="radio" id="male" name="gender" value="male" checked>
<label for="male">男</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">女</label>
```

**关键规则：**
- 同一组 radio 必须 `name` 相同，否则可以多选
- `value` 是提交到服务器的值
- `checked` 表示默认选中

### 5. checkbox 复选框

```html
<input type="checkbox" id="hobby1" name="hobby" value="coding">
<label for="hobby1">编程</label>
<input type="checkbox" id="hobby2" name="hobby" value="music">
<label for="hobby2">音乐</label>
```

**注意：** checkbox 的 name 可以相同，提交时会发送所有选中的值。

### 6. select 下拉选择

```html
<select id="city" name="city">
  <option value="">请选择</option>
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

**属性：**
- `selected`：默认选中
- `disabled`：禁用选项
- `value`：提交到服务器的值（不写则用文本内容）

### 7. datalist 预定义选项

```html
<input type="text" id="tech" name="tech" list="tech-list">
<datalist id="tech-list">
  <option value="HTML">
  <option value="CSS">
  <option value="JavaScript">
</datalist>
```

**与 select 的区别：**
- select：只能从选项中选择，不能自定义
- datalist：提供选项建议，但仍可自由输入

### 8. textarea 文本域

```html
<textarea id="bio" name="bio" rows="4" cols="30"
          placeholder="介绍一下你自己..."></textarea>
```

**注意：** rows 和 cols 只是初始大小，用户可以拖拽调整。用 CSS 控制尺寸更可靠。

### 9. button 类型

| type | 作用 | 说明 |
|------|------|------|
| `submit` | 提交表单 | 默认类型 |
| `reset` | 重置表单 | 清空所有输入 |
| `button` | 普通按钮 | 需配合 JS 使用 |

**注意：** 按钮在 form 内部时，不要用 `<input type="submit">`，用 `<button>` 更灵活。

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 点击 label 无反应 | 没有 for 属性 | 给 label 加 for="id" |
| radio 可以多选 | name 不同 | 同组 radio 必须 name 相同 |
| 表单提交后数据为空 | 没有 name 属性 | 给每个 input 加 name |
| select 提交的是文本而非 value | option 没写 value | 给 option 加 value 属性 |

## 拓展练习

1. **练习 1**：制作一个注册表单，包含 fieldset 分组
   - 提示：个人信息、兴趣爱好、提交三个分组
2. **练习 2**：用 datalist 实现一个技术栈搜索框
   - 提示：预定义 10 个常用技术
3. **练习 3**：测试 form 的 get 和 post 提交，观察 URL 变化
   - 提示：分别用 get 和 post 提交，看浏览器地址栏

## 本案例知识速查表

| 标签/属性 | 作用 | 示例 |
|-----------|------|------|
| `<form action>` | 表单容器 | `<form action="/api">` |
| `<label for>` | 关联输入框 | `<label for="id">` |
| `<fieldset>` | 表单分组 | `<fieldset>...</fieldset>` |
| `<legend>` | 分组标题 | `<legend>个人信息</legend>` |
| `<input type="radio">` | 单选按钮 | 同组 name 必须相同 |
| `<input type="checkbox">` | 复选框 | 可多选 |
| `<select>` | 下拉选择 | `<option value="val">` |
| `<datalist>` | 预定义选项 | 用户仍可自定义输入 |
| `<textarea>` | 文本域 | 多行输入 |
| `<button type>` | 按钮 | submit/reset/button |
