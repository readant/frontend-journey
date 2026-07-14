# HTML5 新增表单类型详解

> 对应 HTML 文件：`../02-html5-forms.html`

## 本案例学习目标

- 掌握所有 HTML5 新增的 input 类型
- 理解每种类型的移动端适配
- 掌握 file 文件上传的 accept 和 multiple 属性
- 了解 month 和 week 类型的使用场景

## 知识点详解

### 1. 输入类型全景

| type | 用途 | 关键属性 | 移动端键盘 |
|------|------|----------|------------|
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

### 2. 各类型详解

#### email 邮箱
```html
<input type="email" name="email" placeholder="example@domain.com" required>
```
- 自动验证邮箱格式（必须包含 @）
- 移动端显示 @ 键盘
- 提交时浏览器会自动检查格式

#### url 网址
```html
<input type="url" name="website" placeholder="https://example.com">
```
- 自动验证 URL 格式（必须包含 http:// 或 https://）
- 移动端显示 .com 键盘

#### number 数字
```html
<input type="number" name="age" min="1" max="120" step="1" value="18">
```
- 只能输入数字
- `step` 控制步长：`step="1"` 整数，`step="0.1"` 小数
- 上下箭头可增减

#### range 滑块
```html
<input type="range" name="volume" min="0" max="100" value="50">
<span id="volumeValue">50</span>
<script>
  document.getElementById('volume').addEventListener('input', function() {
    document.getElementById('volumeValue').textContent = this.value;
  });
</script>
```
- 需配合 JS 实时显示值
- 常用于音量、亮度等连续值

#### color 颜色选择器
```html
<input type="color" name="favcolor" value="#ff0000">
```
- 打开系统颜色选择器
- value 为 hex 格式（如 #ff0000）

#### date 日期选择器
```html
<input type="date" name="birthday" min="1900-01-01" max="2026-12-31">
```
- 格式：YYYY-MM-DD
- min/max 限制可选范围

#### time 时间选择器
```html
<input type="time" name="meeting" min="09:00" max="18:00">
```
- 格式：HH:MM

#### month 月份选择器
```html
<input type="month" name="birthday-month">
```
- 格式：YYYY-MM
- 选择年月，不能选具体日期

#### week 周选择器
```html
<input type="week" name="schedule-week">
```
- 格式：YYYY-WXX（如 2026-W28）
- 选择年+第几周

### 3. 文件上传

#### 基础文件上传
```html
<input type="file" name="avatar" accept="image/*">
```

#### 多文件上传
```html
<input type="file" name="photos" accept="image/*" multiple>
```

#### accept 属性详解

| 值 | 说明 |
|----|------|
| `image/*` | 所有图片格式 |
| `video/*` | 所有视频格式 |
| `audio/*` | 所有音频格式 |
| `.jpg,.png` | 特定扩展名 |
| `image/jpeg,image/png` | 特定 MIME 类型 |

**注意：** accept 只是提示，不限制实际上传。后端仍需验证文件类型。

### 4. search 搜索框
```html
<input type="search" name="search" placeholder="搜索内容...">
```
- 外观与 text 类似
- 移动端显示搜索键盘
- 部分浏览器会显示清除按钮（X）

### 5. tel 电话
```html
<input type="tel" name="phone" pattern="[0-9]{11}">
```
- 不自动验证格式（需要 pattern 手动验证）
- 移动端显示拨号键盘

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| email 类型验证太严格 | 输入了不完整的邮箱 | 提示用户完整格式 |
| number 输入小数被截断 | step="1" | 改用 step="0.1" 或 step="any" |
| file 上传了非图片 | accept 不限制实际上传 | 后端验证文件类型 |
| date 格式不对 | 用户手动输入而非选择器 | 用 min/max 限制 |

## 拓展练习

1. **练习 1**：制作一个预约表单，包含 date 和 time 选择器
   - 提示：限制日期范围为未来 7 天
2. **练习 2**：制作一个颜色选择器，实时预览颜色效果
   - 提示：用 JS 监听 input 事件
3. **练习 3**：制作一个文件上传区域，限制只能上传图片
   - 提示：accept="image/*"

## 本案例知识速查表

| type | 用途 | 关键属性 |
|------|------|----------|
| `email` | 邮箱 | 自动验证格式 |
| `url` | 网址 | 自动验证格式 |
| `number` | 数字 | min, max, step |
| `range` | 滑块 | min, max, value |
| `color` | 颜色 | value 为 hex |
| `date` | 日期 | min, max |
| `time` | 时间 | min, max |
| `month` | 月份 | min, max |
| `week` | 周 | min, max |
| `file` | 文件上传 | accept, multiple |
| `search` | 搜索 | placeholder |
| `tel` | 电话 | pattern |
