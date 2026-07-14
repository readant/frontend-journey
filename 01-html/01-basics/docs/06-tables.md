# 表格结构与合并详解

> 对应 HTML 文件：`../06-tables.html`

## 本案例学习目标

- 掌握表格的完整结构（thead/tbody/tfoot）
- 理解 colspan 和 rowspan 的计算方法
- 了解 scope 属性提升表格无障碍
- 避免常见的表格布局错误

## 知识点详解

### 1. 表格基础结构

```html
<table>
  <caption>表格标题</caption>
  <thead>
    <tr>
      <th scope="col">列头1</th>
      <th scope="col">列头2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>数据1</td>
      <td>数据2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">汇总信息</td>
    </tr>
  </tfoot>
</table>
```

**标签说明：**

| 标签 | 作用 | 必填 |
|------|------|------|
| `<table>` | 表格容器 | 是 |
| `<caption>` | 表格标题（可选但推荐） | 否 |
| `<thead>` | 表头区域 | 否 |
| `<tbody>` | 表体区域 | 否（浏览器会自动添加） |
| `<tfoot>` | 表脚区域 | 否 |
| `<tr>` | 表格行 | 是 |
| `<th>` | 表头单元格（默认加粗居中） | - |
| `<td>` | 数据单元格 | - |

**注意事项：**
- `<caption>` 必须是 `<table>` 的第一个子元素
- 不写 `<thead>`/`<tbody>`/`<tfoot>` 也没关系，浏览器会自动处理
- 但写上能让表格结构更清晰，也有利于 CSS 样式控制

### 2. scope 属性（无障碍）

```html
<thead>
  <tr>
    <th scope="col">姓名</th>  <!-- 列头 -->
    <th scope="col">年龄</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">张三</th>  <!-- 行头 -->
    <td>25</td>
  </tr>
</tbody>
```

**作用：** 帮助屏幕阅读器理解 th 属于哪一行/列。

| 值 | 含义 | 使用场景 |
|----|------|----------|
| `col` | 列头 | thead 中的 th |
| `row` | 行头 | 每行第一个 th |
| `colgroup` | 列组头 | 复杂表格 |
| `rowgroup` | 行组头 | 复杂表格 |

### 3. colspan 跨列合并

**原理：** 一个单元格横跨多列。

```html
<!-- 正常表格（4列） -->
<table>
  <tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
    <td>D</td>
  </tr>
</table>

<!-- 跨列合并（第2行前两列合并） -->
<table>
  <tr>
    <td>A</td>
    <td>B</td>
    <td>C</td>
    <td>D</td>
  </tr>
  <tr>
    <td colspan="2">AB 合并</td>
    <td>C</td>
    <td>D</td>
  </tr>
</table>
```

**关键规则：** 合并后该行的总列数必须等于表格的列数。

### 4. rowspan 跨行合并

**原理：** 一个单元格纵跨多行。

```html
<!-- rowspan="2" 表示这个单元格占2行 -->
<table>
  <tr>
    <td rowspan="2">上下合并</td>
    <td>B</td>
  </tr>
  <tr>
    <!-- 注意：这里不需要再写被合并的单元格 -->
    <td>D</td>
  </tr>
</table>
```

**关键规则：**
1. `rowspan="2"` 表示这个单元格占 2 行
2. 被合并的行中，**不要再写**被占据的位置
3. 每行的总列数仍需等于表格列数

### 5. 合并计算示例

以课程表为例：

```html
<!-- 4列表格 -->
<tr>
  <td>时间</td>    <!-- 列1 -->
  <td>星期一</td>  <!-- 列2 -->
  <td>星期二</td>  <!-- 列3 -->
  <td>星期三</td>  <!-- 列4 -->
</tr>
<tr>
  <td>下午</td>              <!-- 列1 -->
  <td colspan="2">体育课</td> <!-- 列2+3 合并 -->
  <td>音乐</td>              <!-- 列4 -->
</tr>
```

**检查方法：** 每行写完后数一下，确保总列数 = 表格列数。

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 表格错位 | colspan/rowspan 计算错误 | 每行检查总列数是否正确 |
| 多出空白行 | 被合并的行多写了 td | rowspan 后不要写被占据的位置 |
| 屏幕阅读器乱读 | 没加 scope 属性 | 给所有 th 加 scope |
| 表格在手机上溢出 | 没做响应式处理 | 用 CSS `overflow-x: auto` 或改为卡片布局 |

## 拓展练习

1. **练习 1**：制作一个课程表，包含 colspan 和 rowspan 合并
   - 提示：先画出表格结构，计算每行的列数
2. **练习 2**：制作一个成绩单表格，包含 scope 属性
   - 提示：姓名列用 scope="row"，标题行用 scope="col"
3. **练习 3**：为表格添加 CSS 样式，实现斑马纹效果
   - 提示：用 `tr:nth-child(even)` 选择偶数行

## 本案例知识速查表

| 标签/属性 | 作用 | 示例 |
|-----------|------|------|
| `<table>` | 表格容器 | `<table>...</table>` |
| `<caption>` | 表格标题 | `<caption>成绩表</caption>` |
| `<thead>` | 表头区域 | 包含 th |
| `<tbody>` | 表体区域 | 包含 td |
| `<tfoot>` | 表脚区域 | 汇总信息 |
| `<th scope="col">` | 列头 | 垂直方向表头 |
| `<th scope="row">` | 行头 | 水平方向表头 |
| `colspan="n"` | 跨 n 列 | 横向合并 |
| `rowspan="n"` | 跨 n 行 | 纵向合并 |
