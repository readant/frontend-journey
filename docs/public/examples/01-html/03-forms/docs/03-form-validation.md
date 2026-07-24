# 表单验证详解

> 对应 HTML 文件：`../03-form-validation.html`

## 本案例学习目标

- 掌握所有 HTML5 表单验证属性
- 理解 :invalid 和 :valid 伪类的行为
- 了解 novalidate 禁用验证的场景
- 掌握 output 标签显示计算结果
- 理解 :invalid 伪类的初次加载问题

## 知识点详解

### 1. 验证属性速查

| 属性 | 作用 | 示例 | 适用类型 |
|------|------|------|----------|
| `required` | 必填 | `<input required>` | 所有类型 |
| `minlength` | 最小长度 | `minlength="3"` | text, password, search, url, tel, email |
| `maxlength` | 最大长度 | `maxlength="10"` | 同上 |
| `min` | 最小值 | `min="0"` | number, range, date, time, month, week |
| `max` | 最大值 | `max="100"` | 同上 |
| `pattern` | 正则验证 | `pattern="[0-9]{6}"` | text, password, email, tel, url |

### 2. 各属性详解

#### required 必填
```html
<input type="text" name="username" required>
```
- 提交时如果为空，浏览器会阻止提交并显示错误提示
- 所有需要填写的字段都应该加 required

#### minlength / maxlength 长度限制
```html
<input type="text" name="username" minlength="3" maxlength="10">
```
- minlength：最少输入 3 个字符
- maxlength：最多输入 10 个字符
- 也限制粘贴的内容

#### min / max 数值范围
```html
<input type="number" name="age" min="1" max="120">
<input type="date" name="birthday" min="1900-01-01" max="2026-12-31">
```
- number：限制数值范围
- date：限制日期范围
- time：限制时间范围

#### pattern 正则验证
```html
<input type="text" name="zipcode" pattern="[0-9]{6}" placeholder="6位数字">
```

**常用正则表达式：**

| 验证内容 | 正则 | 说明 |
|----------|------|------|
| 中国手机号 | `1[3-9]\d{9}` | 11 位数字，以 1 开头 |
| 中国邮编 | `[0-9]{6}` | 6 位数字 |
| 身份证号 | `[0-9]{17}[0-9X]` | 18 位，最后一位可以是 X |
| 密码（字母+数字） | `[A-Za-z0-9]+` | 至少一个字母或数字 |

**注意：** pattern 只在表单提交时验证，不在输入时实时验证。

### 3. CSS 伪类验证样式

```css
/* 验证通过 */
input:valid {
  border: 2px solid green;
}

/* 验证失败 */
input:invalid {
  border: 2px solid red;
}

/* 必填但为空 */
input:required:invalid {
  border: 2px solid orange;
}
```

### 4. :invalid 伪类的初次加载问题

**问题：** 页面加载时，所有带 required 的输入框都是空的，会立即触发 :invalid 样式（红色边框）。

**原因：** 空值不满足 required 要求，所以一开始就是 invalid 状态。

**解决方案：**

```html
<input type="email" name="email" required
       style="border: 2px solid #ccc;"
       onblur="this.style.borderColor = this.validity.valid ? 'green' : 'red'"
       oninput="this.style.borderColor = '#ccc'">
```

**思路：**
- 初始状态用灰色边框
- 用户输入时（oninput）恢复灰色
- 失去焦点时（onblur）才根据 validity 设置颜色

### 5. novalidate 禁用验证

```html
<form novalidate>
  <!-- 表单内容 -->
</form>
```

**使用场景：**
- 测试时跳过验证
- 用 JS 自定义验证逻辑
- 用后端验证代替前端验证

### 6. output 标签

```html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="number" id="a" value="10">
  <input type="number" id="b" value="20">
  <output name="result" for="a b">30</output>
</form>
```

**作用：** 显示计算结果，配合 oninput 事件实时更新。

### 7. validity 对象

```javascript
const input = document.getElementById('email');
console.log(input.validity);  // ValidityState 对象

// validity 的属性
input.validity.valueMissing    // required 但值为空
input.validity.typeMismatch    // 类型不匹配（如邮箱格式错误）
input.validity.patternMismatch // 不匹配 pattern
input.validity.tooShort        // 长度小于 minlength
input.validity.rangeUnderflow  // 值小于 min
input.validity.rangeOverflow   // 值大于 max
input.validity.valid           // 完全有效
```

**用途：** 用 JS 自定义验证逻辑。

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| :invalid 初次加载就触发 | 空值不满足 required | 用 JS 在 blur 时才显示样式 |
| pattern 不生效 | 正则写错 | 用在线正则工具测试 |
| 验证通过但提交失败 | 后端没接收或验证 | 检查后端代码 |
| 禁用验证后数据不安全 | 完全依赖前端验证 | 后端必须再次验证 |

## 拓展练习

1. **练习 1**：制作一个注册表单，用 pattern 验证手机号和身份证号
   - 提示：手机号 `1[3-9]\d{9}`，身份证 `[0-9]{17}[0-9X]`
2. **练习 2**：用 validity 对象实现自定义错误提示
   - 提示：检查 input.validity.typeMismatch 等属性
3. **练习 3**：制作一个计算器，用 output 显示结果
   - 提示：oninput="result.value = ..."

## 本案例知识速查表

| 属性/伪类 | 作用 | 示例 |
|-----------|------|------|
| `required` | 必填 | `<input required>` |
| `minlength` | 最小长度 | `minlength="3"` |
| `maxlength` | 最大长度 | `maxlength="10"` |
| `min` | 最小值 | `min="0"` |
| `max` | 最大值 | `max="100"` |
| `pattern` | 正则验证 | `pattern="[0-9]{6}"` |
| `:valid` | 验证通过 | CSS 伪类 |
| `:invalid` | 验证失败 | CSS 伪类 |
| `novalidate` | 禁用验证 | `<form novalidate>` |
| `<output>` | 计算结果 | 配合 oninput 使用 |
| `validity` | 验证状态对象 | JS API |
