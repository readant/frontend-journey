---
title: 浮动与清除速查
---

# 浮动与清除速查

## 何时用

- **图文环绕**：文字环绕图片（float 唯一不可替代的场景）
- **旧版多列布局**：维护老代码时理解（新代码一律用 Flex / Grid）
- **inline-block 代替**：左右并排但不需要环绕时，优先 `display: inline-block` 或 Flex

> 注意：现代布局（导航、多栏、卡片）**不再用 float**，float 只保留给图文环绕和兼容旧代码。

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>浮动演示</title>
<style>
  /* 图文环绕 */
  .article { background: #f0f4f8; padding: 10px; }
  .article img { float: left; margin-right: 12px; width: 120px; }

  /* Clearfix：解决父容器高度塌陷 */
  .clearfix::after {
    content: "";
    display: block;
    clear: both;
  }
  .float-box { width: 100px; height: 60px; float: left; margin-right: 10px; color: #fff; text-align: center; line-height: 60px; }
</style>
</head>
<body>
  <h3>图文环绕（float 经典场景）</h3>
  <div class="article">
    <img src="https://dummyimage.com/120x90/3498db/fff" alt="示例图">
    这是一段被图片环绕的文字。float: left 后文字会绕着图片右侧流动，
    直到图片右侧空间不足才换行。这是 float 在现代 CSS 中仅存的不可替代用途。
  </div>

  <h3>父容器塌陷问题</h3>
  <div class="clearfix" style="background: #f0f4f8; padding: 10px;">
    <div class="float-box" style="background:#e74c3c;">A</div>
    <div class="float-box" style="background:#e67e22;">B</div>
    <!-- 没有 clearfix 时，父容器高度会塌陷为 0 -->
  </div>
  <p>上面的两个方块已经 clearfix，父容器正常撑开。</p>
</body>
</html>
```

## 踩坑记录

- **父容器高度塌陷**：子元素 float 后脱离文档流，父元素高度塌为 0，必须用 clearfix（`::after { clear: both }`）或 `overflow: hidden` 修复
- **`clear: both` 加错位置**：要加在"浮动元素之后的兄弟元素"或 clearfix 的 `::after` 上，而不是浮动元素本身
- **浮动元素会脱离文档流但不脱离文本流**：所以文字会环绕它，这是图文环绕的原理
- **`float` 会让元素变成块级盒子**：原本是 inline 的元素（如 `span`）也会支持设置宽高
- **别用 float 做导航/布局**：对齐、间距、换行都不受控，请用 Flex / Grid
