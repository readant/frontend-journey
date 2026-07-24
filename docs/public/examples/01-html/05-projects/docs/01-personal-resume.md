# 个人简历项目详解

> 对应 HTML 文件：`../01-personal-resume.html`

## 本案例学习目标

- 综合运用语义标签构建完整页面
- 掌握简历页面的结构设计思路
- 了解打印样式的编写
- 理解无障碍属性在实际项目中的应用

## 项目结构分析

### 整体布局

```
resume（卡片容器）
├── header（头部：姓名 + 联系方式）
├── section（个人简介）
├── section（教育背景 → table）
├── section（专业技能 → flex + tag）
├── section（项目经验 → article）
├── section（工作经历 → ul）
└── footer（页脚）
```

### 设计思路

1. **卡片布局**：居中卡片（max-width + margin auto），白色背景 + 阴影
2. **语义分组**：每个区域用 section + aria-label 标识
3. **技能展示**：用 flex + tag 样式，比列表更现代
4. **打印适配**：@media print 隐藏非必要元素

## 知识点详解

### 1. 语义标签的使用

```html
<div class="resume" role="document" aria-label="个人简历">
  <header>...</header>
  <section aria-label="个人简介">...</section>
  <section aria-label="教育背景">...</section>
  <section aria-label="专业技能">...</section>
  <section aria-label="项目经验">...</section>
  <section aria-label="工作经历">...</section>
  <footer>...</footer>
</div>
```

**为什么用 role="document"？**
- 简历是一个完整的文档，不是网页的一部分
- 屏幕阅读器会以文档模式朗读

**为什么用 aria-label？**
- section 没有标题时，屏幕阅读器不知道这个区域是什么
- aria-label 提供了区域的名称

### 2. 表格用于教育背景

```html
<table>
  <tr>
    <th>时间</th>
    <th>学校</th>
    <th>专业</th>
    <th>学历</th>
  </tr>
  <tr>
    <td>2017-2021</td>
    <td>某某大学</td>
    <td>计算机科学与技术</td>
    <td>本科</td>
  </tr>
</table>
```

**为什么用表格？**
- 教育背景是结构化数据，表格最合适
- 搜索引擎能更好理解数据关系
- 屏幕阅读器能按行列读取

### 3. 技能标签样式

```css
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.skill-tag {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}
```

**设计要点：**
- flex 实现自动换行
- 圆角标签视觉效果好
- 统一的颜色方案

### 4. 打印样式

```css
@media print {
  body {
    background: white;
    padding: 0;
  }
  .resume {
    box-shadow: none;
    padding: 20px;
  }
  nav, .no-print {
    display: none;
  }
}
```

**打印优化：**
- 移除背景色和阴影
- 简化内边距
- 隐藏导航等非必要元素

### 5. 无障碍属性

```html
<div class="resume" role="document" aria-label="个人简历">
<div class="contact-info" aria-label="联系方式">
<section aria-label="个人简介">
<section aria-label="教育背景">
<section aria-label="专业技能">
<section aria-label="项目经验">
<section aria-label="工作经历">
```

**作用：** 帮助屏幕阅读器理解每个区域的含义。

## 扩展建议

### 1. 添加头像

```html
<header>
  <img src="avatar.jpg" alt="张三的照片" class="avatar">
  <h1>张三</h1>
</header>
```

### 2. 添加技能进度条

```html
<div class="skill">
  <span>HTML</span>
  <progress value="90" max="100"></progress>
</div>
```

### 3. 添加下载按钮

```html
<a href="resume.pdf" download class="no-print">下载 PDF 版本</a>
```

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 打印时背景色消失 | 浏览器默认不打印背景 | 加 `-webkit-print-color-adjust: exact` |
| 表格在手机上溢出 | 表格宽度固定 | 用 CSS `overflow-x: auto` 包裹 |
| 屏幕阅读器读不出区域 | section 没有标题或 aria-label | 加 aria-label |

## 拓展练习

1. **练习 1**：为简历添加技能进度条（progress 标签）
   - 提示：每个技能一个 progress，value 表示熟练度
2. **练习 2**：为简历添加下载 PDF 按钮
   - 提示：用 `<a download>` 链接到 PDF 文件
3. **练习 3**：将简历改为响应式布局，手机端单列显示
   - 提示：用媒体查询调整布局

## 本案例知识速查表

| 知识点 | 作用 | 示例 |
|--------|------|------|
| `role="document"` | 文档级语义 | 屏幕阅读器以文档模式朗读 |
| `aria-label` | 区域标签 | 帮助屏幕阅读器识别区域 |
| `@media print` | 打印样式 | 优化打印效果 |
| `max-width + margin auto` | 居中布局 | 卡片式设计 |
| `flex + gap` | 技能标签布局 | 自动换行 + 间距 |
| `<table>` | 结构化数据 | 教育背景展示 |
