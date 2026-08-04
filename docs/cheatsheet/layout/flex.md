---
title: Flex 布局速查
---

# Flex 布局速查

## 何时用

- **一维布局**：导航栏、标签栏、按钮组、图标列表等单行/单列排列
- **水平垂直居中**：内容在容器中居中（配合 `align-items` / `justify-content` / `margin: auto`）
- **弹性伸缩**：子元素按比例分配剩余空间（如主内容区自适应）
- **经典三栏布局**：两侧固定宽度 + 中间自适应

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flex 布局演示</title>
<style>
  /* 容器属性 */
  .container {
    display: flex;
    flex-direction: row;          /* 主轴方向: row | column | row-reverse | column-reverse */
    justify-content: space-between; /* 主轴对齐: flex-start | center | space-around | space-evenly */
    align-items: center;          /* 交叉轴对齐: stretch | flex-start | center | baseline */
    flex-wrap: wrap;              /* 换行: nowrap | wrap */
    gap: 10px;                    /* 项目间距（推荐，替代 margin） */
    height: 200px;
    padding: 10px;
    background: #f0f4f8;
  }
  .item { padding: 12px 20px; border-radius: 4px; color: #fff; background: #3498db; }

  /* 项目属性 */
  .grow   { flex-grow: 1; }    /* 放大比例（默认 0） */
  .no-shrink { flex-shrink: 0; } /* 禁止缩小（默认 1） */
  .basis  { flex-basis: 200px; } /* 主轴基础尺寸（默认 auto） */

  /* 经典三栏：侧栏固定 + 主栏自适应 */
  .layout { display: flex; gap: 10px; }
  .aside  { width: 200px; padding: 20px; color: #fff; background: #e74c3c; }
  .main   { flex: 1; padding: 20px; color: #fff; background: #2ecc71; }
</style>
</head>
<body>
  <h3>基础容器：主轴两端对齐、交叉轴居中</h3>
  <div class="container">
    <div class="item">A</div>
    <div class="item grow">B（flex-grow:1）</div>
    <div class="item no-shrink">C</div>
  </div>

  <h3>三栏布局：固定侧栏 + 自适应主栏</h3>
  <div class="layout">
    <div class="aside">侧栏 200px</div>
    <div class="main">主栏 flex:1</div>
    <div class="aside">侧栏 200px</div>
  </div>
</body>
</html>
```

## 踩坑记录

- **子项被压扁**：子元素默认 `flex-shrink: 1`，空间不足会被压缩；不想缩给 `flex-shrink: 0`
- **`flex: 1` 的含义**：它是 `flex-grow:1 flex-shrink:1 flex-basis:0%` 的简写，不是"单纯放大"，效果是均分剩余空间
- **间距用 `gap` 而非 `margin`**：在子项上加 `margin` 会让首尾也产生外边距，容器加 `gap` 最干净
- **`margin: auto` 的妙用**：子项单独设置 `margin-left: auto` 可把它推到右侧（导航栏 logo 左、按钮右的经典做法）
- **`align-items` 默认 `stretch`**：不设高度时子项会被拉满交叉轴，想按内容高度需改 `flex-start`
- **嵌套 flex**：子容器要启用 flex 必须自己加 `display: flex`，flex 属性不会继承
