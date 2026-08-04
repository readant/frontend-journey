---
title: 背景与视觉美化速查
---

# 背景与视觉美化速查

## 何时用

| 场景 | 用到的属性 |
| --- | --- |
| 背景图平铺/拉伸/覆盖 | `background-size: cover/contain` |
| 渐变色（线性/径向/锥形） | `linear-gradient` / `radial-gradient` / `conic-gradient` |
| 卡片/按钮圆角 | `border-radius`（px 或 %） |
| 卡片投影/悬浮光晕 | `box-shadow` |
| 图片特效（灰度/模糊/提亮） | `filter` |
| 毛玻璃（导航栏/弹窗背景） | `backdrop-filter: blur()` |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>背景与视觉美化演示</title>
<style>
  .bg {
    width: 100%; height: 120px; margin-bottom: 10px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }

  /* 背景图：cover 铺满裁切 */
  .cover {
    background-image: url("https://dummyimage.com/400x120/9b59b6/fff");
    background-size: cover;          /* 铺满，可能裁切 */
    background-position: center;     /* 定位 */
  }
  /* 渐变 */
  .linear { background: linear-gradient(135deg, #3498db, #2ecc71); }
  .radial { background: radial-gradient(circle, #f1c40f, #e74c3c); }

  /* 圆角 + 阴影 */
  .shadow {
    background: #fff; color: #333; width: 200px; height: 60px;
    border-radius: 12px; box-shadow: 4px 4px 12px rgba(0,0,0,.15);
  }

  /* 滤镜：灰度 + 悬停恢复彩色 */
  .filter { filter: grayscale(100%); transition: filter .3s; }
  .filter:hover { filter: grayscale(0); }

  /* 毛玻璃：背景模糊透出下层 */
  .glass-demo { position: relative; width: 100%; height: 120px; background: url("https://dummyimage.com/400x120/2c3e50/fff"); }
  .glass {
    position: absolute; inset: 30px; border-radius: 8px; color: #fff;
    background: rgba(255,255,255,.15); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
  }
</style>
</head>
<body>
  <div class="bg cover">background-size: cover</div>
  <div class="bg linear">linear-gradient 135deg</div>
  <div class="bg radial">radial-gradient circle</div>

  <div class="bg shadow">圆角 12px + 投影</div>

  <div class="bg filter" style="background:#e67e22;">悬停恢复彩色（filter）</div>

  <div class="glass-demo">
    <div class="glass">backdrop-filter 毛玻璃</div>
  </div>
</body>
</html>
```

## 踩坑记录

- **`background-size: cover` 会裁切**，`contain` 会留白：用 cover 时记得配合 `background-position` 控制保留区域
- **渐变的 `135deg` 是从左下到右上的角度**，不是日常直觉的 45°；多色渐变逗号分隔，方向写在最前
- **`box-shadow` 参数顺序固定**：`x 偏移 y 偏移 模糊 扩散 颜色`，顺序写错看不出效果；`inset` 是内阴影
- **`filter` 会创建层叠上下文**，且会让 `position: fixed` 的后代变成相对该元素定位（弹窗乱跑的坑）
- **`backdrop-filter` 模糊的是"背后"内容，`filter: blur()` 模糊的是"自身"**，两者别混；毛玻璃要两个一起用（半透明背景 + backdrop-filter）
- **多背景图**用逗号叠加：`background: url(a.jpg), linear-gradient(...)`，第一张在最上层
