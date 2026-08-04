---
title: 盒模型与 margin 合并速查
---

# 盒模型与 margin 合并速查

## 何时用

- 计算元素实际占地尺寸（width 与总宽的关系）
- 排查"宽度超出容器"、"间距比预期大"等布局问题
- 全局统一盒模型（`border-box`）

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>盒模型演示</title>
<style>
  /* 全局最佳实践：统一怪异盒模型 */
  *, *::before, *::after { box-sizing: border-box; }

  .box {
    width: 200px;
    height: 80px;
    padding: 20px;          /* 内边距（内容与边框之间） */
    border: 5px solid #3498db;
    margin: 20px;           /* 外边距（与其他元素的距离） */
    background: #ecf5ff;
    color: #333;
  }

  /* 两种盒模型对比 */
  .content-box { box-sizing: content-box; }  /* 标准：width 只算内容 */
  .border-box  { box-sizing: border-box; }   /* 怪异：width 含 padding+border */

  .note { background: #f0f4f8; padding: 10px; border-left: 4px solid #e67e22; }
</style>
</head>
<body>
  <h3>border-box：宽度 200px 包含 padding + border</h3>
  <div class="box border-box">总宽 = 200px（内容被压缩）</div>

  <h3>content-box：宽度 200px 只算内容</h3>
  <div class="box content-box">总宽 = 200 + 40 + 10 = 250px（实际占地更宽）</div>

  <div class="note">
    相邻两个元素的 margin 会合并（垂直方向取较大值）：上方盒子的
    margin-bottom 与下方盒子的 margin-top 不会相加，而是取最大者。
  </div>
</body>
</html>
```

## 踩坑记录

- **两种盒模型**：标准 `content-box` 的 `width` 只含内容，总宽 = width + padding×2 + border×2 + margin×2；怪异 `border-box` 的 `width` 含 padding 和 border，总宽 = width + margin×2。**布局崩宽 90% 是忘了 `box-sizing: border-box`**
- **margin 合并（塌陷）规则**：垂直方向相邻兄弟取**最大值**（不是相加）；一正一负则相加；父子 margin 也会合并（子 margin-top 可能顶出去，而不是撑开父容器）
- **margin 合并解决**：父容器加 `padding`/`border`/`overflow: hidden`，或改用 flex/grid（flex 子项不合并）
- **`padding` 百分比是按"父容器宽度"算的**，不是元素自身高度；`margin` 可以用负值，`padding`/`border` 不能为负
- **内联元素设置宽高不生效**（`display: inline`），需转 `inline-block`/`block`
