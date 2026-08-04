---
title: HTML 表单与交互速查
---

# HTML 表单与交互速查

## 何时用

- 用户输入收集（注册/登录/搜索/反馈）
- 各类控件选型：文本 `text`、密码 `password`、邮箱 `email`（自动验证）、文件 `file`、单/复选 `radio/checkbox`、下拉 `select`、多行 `textarea`

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>表单演示</title>
<style>
  form { max-width: 420px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
  fieldset { border: 1px solid #ccc; border-radius: 6px; margin-bottom: 12px; }
  label { display: block; margin-top: 8px; }
  input[type="text"], input[type="email"], input[type="password"], select, textarea {
    width: 100%; padding: 6px; margin-top: 4px; box-sizing: border-box;
  }
  button { margin-top: 12px; padding: 8px 20px; background: #3498db; color: #fff; border: none; border-radius: 4px; }
</style>
</head>
<body>
  <!-- 文件上传必须 enctype="multipart/form-data" -->
  <form action="/api/register" method="post" enctype="multipart/form-data" novalidate>
    <fieldset>
      <legend>账户信息</legend>
      <label for="user">用户名：</label>
      <input type="text" id="user" name="user" required minlength="2" maxlength="20" placeholder="2-20 个字符">

      <label for="email">邮箱：</label>
      <input type="email" id="email" name="email" required>

      <label for="pwd">密码：</label>
      <input type="password" id="pwd" name="pwd" required minlength="6">
    </fieldset>

    <fieldset>
      <legend>其他信息</legend>
      <!-- radio 同组必须 name 相同才互斥 -->
      <label><input type="radio" name="gender" value="male"> 男</label>
      <label><input type="radio" name="gender" value="female"> 女</label>

      <label for="city">城市：</label>
      <select id="city" name="city">
        <option value="bj">北京</option>
        <option value="sh">上海</option>
        <option value="gz">广州</option>
      </select>

      <label for="bio">简介：</label>
      <textarea id="bio" name="bio" rows="3" maxlength="200"></textarea>

      <label for="avatar">头像：</label>
      <input type="file" id="avatar" name="avatar">
    </fieldset>

    <button type="submit">提交</button>
    <button type="reset">重置</button>
  </form>
</body>
</html>
```

## 踩坑记录

- **radio 同组互斥靠 `name` 相同**：name 不同就是两组，可同时选
- **label 的 `for` 必须等于 input 的 `id`**（不是 name），否则点击标签不聚焦
- **`disabled` 与 `readonly` 不同**：`disabled` 不提交值且变灰，`readonly` 可提交值但不能改
- **文件上传必须 `enctype="multipart/form-data"`**，否则文件不传；GET 请求不适合传文件
- **验证属性**：`required` 必填、`minlength/maxlength` 长度、`min/max/step` 数值范围、`pattern` 正则（直接写规则不用加 `/.../`）；`novalidate` 加在 form 上可整体关闭浏览器验证（留给 JS 校验时用）
- **`type="email"` 等有内置验证**：输入不合法提交时浏览器会拦截；移动端会自动弹出对应键盘（email 带 @ 键、number 出数字键盘）
- **提交按钮必须 `type="submit"`**：按钮默认 type 就是 submit，但如果是 `button` 标签且写 `type="button"` 就不会提交（表单里写按钮时最容易犯的错）
