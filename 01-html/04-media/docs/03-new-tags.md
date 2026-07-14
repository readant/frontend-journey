# HTML5 新交互标签详解

> 对应 HTML 文件：`../03-new-tags.html`

## 本案例学习目标

- 掌握 details/summary 可折叠内容
- 掌握 meter 和 progress 的区别和使用
- 掌握 dialog 原生对话框的打开/关闭
- 了解 template 和 slot 的概念

## 知识点详解

### 1. details + summary（可折叠内容）

**语法：**
```html
<details>
  <summary>点击展开/收起</summary>
  <p>这里是隐藏的内容，点击 summary 后显示。</p>
</details>

<!-- 默认展开 -->
<details open>
  <summary>默认展开</summary>
  <p>这个 details 带有 open 属性，默认是展开的。</p>
</details>
```

**属性：**

| 属性 | 作用 |
|------|------|
| `open` | 布尔属性，设置后默认展开 |

**使用场景：**
- FAQ 折叠面板
- 代码块展开/收起
- 详细信息的隐藏/显示

**注意事项：**
- summary 是 details 的唯一可见部分（折叠时）
- 点击 summary 切换展开/收起
- 可以用 CSS 自定义折叠图标

### 2. meter（度量条）

**语法：**
```html
<meter value="0.7" min="0" max="1" low="0.3" high="0.8" optimum="0.5">
  70%
</meter>
```

**属性：**

| 属性 | 作用 | 说明 |
|------|------|------|
| `value` | 当前值 | 必填 |
| `min` | 最小值 | 默认 0 |
| `max` | 最大值 | 默认 1 |
| `low` | 低阈值 | 低于此值显示黄色 |
| `high` | 高阈值 | 高于此值显示红色 |
| `optimum` | 最佳值 | 配合 low/high 判断好坏 |

**适用场景：**
- 磁盘使用率
- 电池电量
- 考试成绩
- 评分系统

**与 progress 的区别：**
- meter：表示**已知范围内的标量值**（如 70% 磁盘使用率）
- progress：表示**任务完成进度**（如上传进度 30%）

### 3. progress（进度条）

**语法：**
```html
<progress value="30" max="100"></progress>
```

**属性：**

| 属性 | 作用 |
|------|------|
| `value` | 当前进度（0 到 max） |
| `max` | 最大值（默认 1） |

**不确定进度：**
```html
<progress></progress>  <!-- 不设 value，显示为不确定状态（滚动条） -->
```

**适用场景：**
- 文件上传进度
- 页面加载进度
- 步骤完成进度

### 4. dialog（原生对话框）

**语法：**
```html
<dialog id="myDialog">
  <h3>这是一个对话框</h3>
  <p>内容...</p>
  <button onclick="this.closest('dialog').close()">关闭</button>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">打开</button>
```

**方法：**

| 方法 | 作用 | 说明 |
|------|------|------|
| `showModal()` | 打开模态对话框 | 有遮罩层，可 ESC 关闭 |
| `show()` | 打开非模态对话框 | 无遮罩层 |
| `close()` | 关闭对话框 | 可传参设置 returnValue |

**属性：**

| 属性 | 作用 |
|------|------|
| `open` | 布尔属性，表示对话框打开 |
| `returnValue` | 关闭时返回的值 |

**CSS 样式：**
```css
dialog {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  padding: 20px;
}

/* 遮罩层 */
dialog::backdrop {
  background: rgba(0,0,0,0.5);
}
```

### 5. template（HTML 模板）

**语法：**
```html
<template id="myTemplate">
  <div class="card">
    <h3>卡片标题</h3>
    <p>卡片内容</p>
  </div>
</template>

<script>
  const template = document.getElementById('myTemplate');
  const clone = template.content.cloneNode(true);  // 克隆
  document.body.appendChild(clone);  // 插入 DOM
</script>
```

**特点：**
- template 内的内容**不会渲染**
- template 内的 script、img **不会加载**
- 只有通过 JS 克隆并插入 DOM 后才会生效

**使用场景：**
- 动态生成重复的 HTML 结构
- Web Components 的基础
- 模板引擎的替代方案

### 6. slot（Web Components 占位符）

slot 是 Web Components 的一部分，用于定义组件的占位内容：

```html
<!-- 组件定义（简化示例） -->
<template id="widgetTemplate">
  <div class="widget">
    <div class="header">
      <slot name="header">默认标题</slot>
    </div>
    <div class="body">
      <slot>默认内容</slot>
    </div>
  </div>
</template>

<!-- 使用组件 -->
<div class="widget">
  <div class="header">
    <span slot="header">自定义标题</span>
  </div>
  <div class="body">
    <p>自定义内容</p>
  </div>
</div>
```

**slot 类型：**
- 具名 slot：`<slot name="xxx">`，通过 `slot="xxx"` 指定
- 默认 slot：没有 name 属性，放默认内容

### 7. mark 高亮文本

```html
<p>这是一段包含 <mark>重要内容</mark> 的文字。</p>
```

**与 span + CSS 的区别：**
- mark 有语义：表示"高亮、参考、搜索关键词"
- span 无语义：只是视觉样式
- 搜索引擎可能利用 mark 的语义

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| dialog 无法 ESC 关闭 | 用 show() 而非 showModal() | 改用 showModal() |
| template 内容不显示 | 没有克隆插入 DOM | 用 template.content.cloneNode() |
| meter 颜色不对 | low/high/optimum 设置不合理 | 检查阈值关系 |
| progress 不动 | 没有用 JS 更新 value | 用 JS 动态设置 value |

## 拓展练习

1. **练习 1**：用 details/summary 制作一个 FAQ 折叠面板
   - 提示：每个问题一个 details，内容用 p 标签
2. **练习 2**：用 dialog 制作一个确认删除对话框
   - 提示：showModal() 打开，close() 关闭
3. **练习 3**：用 template 动态生成用户卡片列表
   - 提示：用 JS 创建数据数组，循环克隆 template

## 本案例知识速查表

| 标签/属性 | 作用 | 关键点 |
|-----------|------|--------|
| `<details>` | 可折叠容器 | `open` 属性默认展开 |
| `<summary>` | 折叠标题 | 点击切换展开/收起 |
| `<meter>` | 度量条 | 已知范围的标量值 |
| `<progress>` | 进度条 | 任务完成进度 |
| `<dialog>` | 原生对话框 | showModal() 有遮罩 |
| `<template>` | HTML 模板 | 不渲染，JS 克隆后插入 |
| `<slot>` | Web Components 占位 | 组件内容自定义 |
| `<mark>` | 高亮文本 | 有语义，不只是样式 |
