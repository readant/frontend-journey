---
title: Grid 布局速查
---

# Grid 布局速查

## 何时用

- **二维布局**：需要同时控制行与列（Flex 只解决单轴，Grid 解决双轴）
- **页面级骨架**：header / sidebar / main / footer 整体划分
- **栅格系统**：卡片墙、商品列表、图片画廊等网格平铺
- **区域命名**：用 `grid-template-areas` 直观描述布局结构

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Grid 布局演示</title>
<style>
  /* 页面骨架：区域命名 */
  .page {
    display: grid;
    grid-template-areas:
      "header header"
      "aside  main"
      "footer footer";
    grid-template-columns: 200px 1fr; /* 侧栏 200px + 主区自适应 */
    grid-template-rows: 60px 1fr 40px;
    gap: 10px;
    height: 300px;
  }
  .page > * { padding: 20px; color: #fff; border-radius: 4px; }
  .header { grid-area: header; background: #3498db; }
  .aside  { grid-area: aside;  background: #e67e22; }
  .main   { grid-area: main;   background: #2ecc71; }
  .footer { grid-area: footer; background: #9b59b6; }

  /* 自适应卡片墙：repeat + auto-fit + minmax */
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }
  .card { height: 80px; border-radius: 4px; background: #1abc9c; }

  /* 单元格合并：grid-column / grid-row 跨度 */
  .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .span2 { grid-column: span 2; } /* 跨 2 列 */
</style>
</head>
<body>
  <h3>区域命名骨架（header / aside / main / footer）</h3>
  <div class="page">
    <header class="header">Header</header>
    <aside class="aside">Aside</aside>
    <main class="main">Main</main>
    <footer class="footer">Footer</footer>
  </div>

  <h3>自适应卡片墙（自动换行填充）</h3>
  <div class="cards">
    <div class="card">1</div><div class="card">2</div><div class="card">3</div>
    <div class="card">4</div><div class="card">5</div><div class="card">6</div>
  </div>

  <h3>单元格跨度</h3>
  <div class="board">
    <div class="card span2">跨 2 列</div><div class="card">A</div>
    <div class="card">B</div><div class="card">C</div><div class="card">D</div>
  </div>
</body>
</html>
```

## 踩坑记录

- **`grid-area` 必须在 `grid-template-areas` 里定义过才生效**，否则项目会被自动放置（auto-placement）
- **`fr` 是"剩余空间比例"，不是百分比**：`1fr` 指分完固定列后剩余空间的 1 份；`%` 按整个容器宽度算，混用时先算固定再算 fr
- **`repeat(auto-fit, minmax(120px, 1fr))` 是自适应卡片墙标配**：`auto-fill` 保留空轨道，`auto-fit` 收缩空轨道（一般用 `auto-fit`）
- **`grid-column: span 2` 只是跨列，不指定起始位置**时从当前自动位置开始
- **子项默认 `stretch` 填满单元格**：想按内容高度需 `align-items: start`
- **`grid-template-areas` 里每个区域名必须构成规则矩形**，不能出现 L 形空洞（无法表达时改用 `grid-column`/`grid-row` 手动指定）
