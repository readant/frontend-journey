---
title: 响应式设计速查
---

# 响应式设计速查

## 何时用

- 一套代码适配手机 / 平板 / 桌面（断点切换布局）
- 字体、栅格随屏幕尺寸弹性变化
- 组件级响应（容器查询，不依赖全局视口）

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果，拖动窗口宽度观察变化）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- 移动端必须 -->
<title>响应式设计演示</title>
<style>
  /* Mobile First：默认移动端样式，min-width 向上增强 */
  body { font-size: 16px; margin: 0; padding: 16px; }
  .card {
    padding: 16px; border-radius: 8px; background: #3498db; color: #fff;
  }

  /* 断点 768px：平板及以上改为横向布局 */
  @media screen and (min-width: 768px) {
    body { padding: 24px; }
    .card { display: flex; justify-content: space-between; align-items: center; }
  }

  /* 断点 1024px：桌面加更大字号与宽度限制 */
  @media screen and (min-width: 1024px) {
    body { max-width: 1000px; margin: 0 auto; }
    .card { font-size: 1.25rem; }
  }

  /* 容器查询：组件根据自身宽度响应（与视口无关） */
  .container { container-type: inline-size; }
  .box { background: #e67e22; color: #fff; padding: 12px; }
  @container (min-width: 400px) {
    .box { background: #2ecc71; } /* 容器宽度 ≥ 400px 时变绿 */
  }
</style>
</head>
<body>
  <div class="card">
    <div>Mobile First 卡片</div>
    <div>&gt;768px 变横排，&gt;1024px 变 1.25rem</div>
  </div>

  <div class="container" style="width: 60%;">
    <div class="box">容器查询：≥400px 变绿（拖动窗口试试）</div>
  </div>
</body>
</html>
```

## 踩坑记录

- **移动端必须写 viewport 标签**：`<meta name="viewport" content="width=device-width, initial-scale=1.0">`，不写会在手机上渲染成桌面宽度（980px）再缩小
- **Mobile First（`min-width` 向上） vs Desktop First（`max-width` 向下）**：二选一不要混用，否则断点交叉时样式难以预测；推荐 Mobile First
- **`@media screen and (min-width: 768px)` 的 `and` 不能省**；用逗号 `,` 表示"或"
- **媒体查询写样式会覆盖同名选择器**：优先级相同，靠"后写的胜出"，所以 Mobile First 要把 min-width 从小到大排列
- **容器查询兼容性**：`container-type` 需要较新浏览器；`clamp(16px, 3vw, 24px)`、`repeat(auto-fit, minmax())`、`srcset` 是响应式的进阶替代方案
- **断点按"内容"定，不按"设备"定**：常用 768px / 1024px / 1440px 只是经验值
