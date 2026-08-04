---
title: 变换 transform 速查
---

# 变换 transform 速查

## 何时用

| 变换 | 场景 |
| --- | --- |
| `translate` | 位移微调、居中（-50%）、入场动画 |
| `rotate` | 旋转图标/加载动画、装饰元素 |
| `scale` | 悬停放大、按钮按下缩小 |
| `skew` | 斜切、标签页平行四边形 |
| 3D 系列 | 卡片翻转、3D 轮播、视差层次 |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>transform 演示</title>
<style>
  .box {
    width: 100px; height: 60px;
    background: #3498db; color: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    margin: 10px; border-radius: 6px;
    transition: transform .3s ease;
  }

  .translate:hover { transform: translate(20px, -10px); } /* 位移 */
  .rotate:hover    { transform: rotate(45deg); }          /* 旋转 */
  .scale:hover     { transform: scale(1.2); }             /* 放大 */
  .skew:hover      { transform: skewX(-15deg); }          /* 斜切 */

  /* 3D 卡片翻转：需要父容器 perspective */
  .scene { perspective: 600px; display: inline-block; }
  .flip {
    width: 120px; height: 80px; background: #e74c3c; color: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: transform .6s;
    transform-style: preserve-3d;
  }
  .scene:hover .flip { transform: rotateY(180deg); }
  .flip .face { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .flip .back { transform: rotateY(180deg); background: #2ecc71; }

  /* 性能：动画优先 transform/opacity（GPU 合成） */
  .gpu { transition: transform .2s; }
  .gpu:hover { transform: translateZ(0) scale(1.05); }
</style>
</head>
<body>
  <div class="box translate">translate</div>
  <div class="box rotate">rotate</div>
  <div class="box scale">scale</div>
  <div class="box skew">skewX</div>

  <div class="scene">
    <div class="flip">
      <div class="face">正面</div>
      <div class="face back">背面</div>
    </div>
  </div>

  <p style="margin-top:20px"><div class="box gpu">transform 动画（GPU 加速）</div></p>
</body>
</html>
```

## 踩坑记录

- **transform 会创建层叠上下文**：元素带 transform 后，`position: fixed` 的子元素会相对它定位（弹窗/吸顶乱跑最常见原因）
- **3D 必须配 `perspective`**：只有 `rotateY/rotateX` 没有透视看不出立体；`perspective` 写在父级，`transform-style: preserve-3d` 写在翻转元素上
- **多个变换写在一个 transform 里**：`transform: translate(10px, 10px) rotate(45deg) scale(1.1)`，执行顺序**从右往左**（先 scale 再 rotate 再 translate），顺序不同结果不同
- **transform 不脱离文档流**：位移后元素占位不变，只是视觉移动，与 `position` 不同
- **`translateZ(0)` / `will-change: transform` 可以强制 GPU 加速**，但滥用会占用大量显存（几十个层就会卡），只加给正在动画的元素
- **百分比位移是相对元素自身尺寸**：`translate(-50%, -50%)` 才能配合 `top:50%` 实现居中
