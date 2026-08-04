---
title: CSS 工程化速查
---

# CSS 工程化速查

## 何时用

| 场景 | 手段 |
| --- | --- |
| 主题色 / 全局令牌统一管理 | CSS 变量 `:root { --color: ... }` |
| 写大规模样式需要复用与组织 | Sass / Less 预处理器 |
| 团队协作命名不打架 | BEM / OOCSS / SMACSS 方法论 |
| 性能优化（首屏、动画流畅） | 压缩、关键 CSS、减少重排、content-visibility |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSS 变量与 BEM 演示</title>
<style>
  /* CSS 变量：定义在 :root，全站可用，JS 可动态修改 */
  :root {
    --primary: #3498db;
    --radius: 8px;
    --space: 12px;
  }
  .btn {
    background: var(--primary, #333); /* 带默认值兜底 */
    color: #fff;
    border-radius: var(--radius);
    padding: var(--space) calc(var(--space) * 2);
    border: none;
  }
  .btn--danger { background: #e74c3c; }  /* BEM 修饰符 */

  /* BEM 命名：block__element--modifier */
  .card { border: 1px solid #e0e0e0; border-radius: var(--radius); overflow: hidden; }
  .card__title { margin: 0; padding: var(--space); font-size: 18px; }
  .card__body  { padding: var(--space); color: #555; }
  .card__body--highlight { background: #f0f4f8; } /* 修饰符 */

  /* 性能优化：动画只动 transform/opacity */
  .move { transition: transform .2s; }
  .move:hover { transform: translateY(-4px); }
</style>
</head>
<body>
  <button class="btn">主按钮（变量控制）</button>
  <button class="btn btn--danger">危险按钮（BEM 修饰符）</button>

  <div class="card">
    <h3 class="card__title">BEM 卡片</h3>
    <div class="card__body">block__element 命名，互不污染。</div>
    <div class="card__body card__body--highlight">修饰符叠加状态。</div>
  </div>

  <p style="margin-top:16px"><span class="btn move">悬停上移（transform 动画）</span></p>
</body>
</html>
```

## 踩坑记录

- **CSS 变量可继承且有作用域**：定义在 `:root` 全站生效，定义在某元素上则只在该子树生效；JS 改主题色用 `element.style.setProperty('--primary', '#fff')`
- **预处理器语法差异**：Sass 用 `$var` / `@mixin` / `@extend`；Less 用 `@var` / `.mix()` / `&:extend`；Stylus 用 `var = `。项目统一一种，别混用
- **BEM 命名别过度嵌套**：`block__element__sub--modifier` 三层以上可读性崩坏；修饰符只表示"变体"，状态（如 is-active）用另一套 class
- **OOCSS 是"结构 + 皮肤分离"、SMACSS 是 Base/Layout/Module/State/Theme 五层**：小项目不必强上，重在约定一致
- **动画性能**：优先 `transform`/`opacity`（GPU 加速），改 `width/top/left` 触发重排会掉帧；`will-change: transform` 提前提示浏览器
- **性能优化清单**：cssnano/clean-css 压缩 → 关键 CSS 内联（约 14KB）→ `content-visibility: auto` 跳过屏外渲染 → 选择器深度不超过 3 层 → 避免通配 `*` 深层匹配
