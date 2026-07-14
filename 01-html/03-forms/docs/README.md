# 模块 3：表单与交互元素

> 掌握表单标签体系，能制作用户输入界面，理解 HTML5 新增表单类型和验证机制。

## 学习路线

1. **基础表单**（预计 20 分钟）→ `01-basic-form.html` + [详细文档](01-basic-form.md)
   - form、input、select、textarea、button 的使用
2. **HTML5 新增表单类型**（预计 15 分钟）→ `02-html5-forms.html` + [详细文档](02-html5-forms.md)
   - email、url、number、date、color 等新 input 类型
3. **表单验证**（预计 15 分钟）→ `03-form-validation.html` + [详细文档](03-form-validation.md)
   - required、pattern、minlength 等验证属性

## 知识点大纲

### 表单基础结构

```html
<form action="/submit" method="post">
  <!-- 表单内容 -->
</form>
```

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `action` | 表单提交的目标 URL | `/api/register` |
| `method` | HTTP 请求方法 | `get`（查询）/ `post`（提交） |
| `enctype` | 编码类型 | `application/x-www-form-urlencoded`（默认）/ `multipart/form-data`（文件上传） |
| `novalidate` | 禁用浏览器验证 | 布尔属性，用于测试 |

### input 类型全景

| type | 用途 | 关键属性 | 移动端键盘 |
|------|------|----------|------------|
| `text` | 单行文本 | placeholder, maxlength | 全键盘 |
| `password` | 密码 | minlength | 全键盘 |
| `email` | 邮箱 | 自动验证格式 | @键盘 |
| `url` | 网址 | 自动验证格式 | .com 键盘 |
| `number` | 数字 | min, max, step | 数字键盘 |
| `tel` | 电话 | pattern | 拨号键盘 |
| `search` | 搜索 | placeholder | 搜索键盘 |
| `range` | 滑块 | min, max, value | - |
| `color` | 颜色选择 | value（hex） | - |
| `date` | 日期 | min, max | 日期选择器 |
| `time` | 时间 | min, max | 时间选择器 |
| `datetime-local` | 日期时间 | min, max | 日期+时间选择器 |
| `month` | 月份 | min, max | 月份选择器 |
| `week` | 周 | min, max | 周选择器 |
| `file` | 文件上传 | accept, multiple | 文件选择器 |
| `hidden` | 隐藏字段 | value | - |
| `checkbox` | 复选框 | checked, value | - |
| `radio` | 单选按钮 | name（同组互斥）, checked | - |

### 表单分组与无障碍

```html
<fieldset>
  <legend>个人信息</legend>
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name">
</fieldset>
```

- `<fieldset>` 将相关表单控件分组
- `<legend>` 为分组提供标题（屏幕阅读器会朗读）
- `<label for="id">` 关联输入框，点击 label 可聚焦输入框

### 验证属性

| 属性 | 作用 | 示例 |
|------|------|------|
| `required` | 必填 | `<input required>` |
| `minlength` / `maxlength` | 字符长度限制 | `minlength="3"` |
| `min` / `max` | 数值范围 | `min="0" max="100"` |
| `pattern` | 正则表达式验证 | `pattern="[0-9]{6}"` |
| `placeholder` | 输入提示（非验证） | `placeholder="请输入"` |

**注意：** placeholder 不是 label 的替代品！它在输入后消失，且屏幕阅读器不会优先朗读。

## 重难点总结

| 难点 | 说明 | 对应案例 |
|------|------|----------|
| label 的 for 必须等于 input 的 id | 不绑定则点击 label 无法聚焦输入框，且无障碍失效 | `01-basic-form.html` |
| radio 的 name 互斥 | 同一组单选按钮必须 name 相同，否则可以多选 | `01-basic-form.html` |
| :invalid 伪类初次触发 | 页面加载时所有带 required 的输入框都是空的，会立即显示红色边框 | `03-form-validation.html` |
| number 类型的 step | step="0.1" 允许小数，step="1" 只允许整数 | `02-html5-forms.html` |
| 文件上传的 accept | `accept="image/*"` 限制文件类型，但不保证安全，后端仍需验证 | `02-html5-forms.html` |

## 案例索引

| 案例文件 | 配套文档 | 说明 |
|----------|----------|------|
| `01-basic-form.html` | [01-basic-form.md](01-basic-form.md) | 基础表单 + 分组 + 无障碍 |
| `02-html5-forms.html` | [02-html5-forms.md](02-html5-forms.md) | HTML5 新 input 类型全景 |
| `03-form-validation.html` | [03-form-validation.md](03-form-validation.md) | 验证属性 + 正则 + 实战 |

## 参考资源

- [MDN - 表单指南](https://developer.mozilla.org/zh-CN/docs/Learn/Forms)
- [MDN - input 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)
- [W3School - HTML 表单](https://www.w3school.com.cn/html/html_forms.asp)
