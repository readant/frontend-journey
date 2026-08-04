---
title: HTML 多媒体与 Canvas 速查
---

# HTML 多媒体与 Canvas 速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 页面内播放视频 | `<video>` |
| 页面内播放音频 | `<audio>` |
| 绘制图形 / 图表 / 游戏画面 | `<canvas>`（配合 JS 绘图 API） |
| 折叠面板 / 原生对话框 / 进度条 | `<details>` `<dialog>` `<progress>` `<meter>` `<template>` |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>多媒体演示</title>
<style>
  .tag-row { margin: 6px 0; }
  details { border: 1px solid #ddd; border-radius: 6px; padding: 8px; margin-bottom: 10px; }
  summary { cursor: pointer; font-weight: bold; }
  progress { width: 300px; }
</style>
</head>
<body>
  <!-- 视频：autoplay 必须配 muted 浏览器才允许 -->
  <video controls width="480" poster="https://dummyimage.com/480x270/3498db/fff" preload="metadata">
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    浏览器不支持 video 标签
  </video>

  <audio controls preload="metadata">
    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
    浏览器不支持 audio 标签
  </audio>

  <!-- Canvas：用 JS 绘制 -->
  <canvas id="c" width="300" height="120" style="border:1px solid #ccc;display:block;margin-top:10px;"></canvas>
  <script>
    const ctx = document.getElementById('c').getContext('2d');
    ctx.fillStyle = '#3498db';
    ctx.fillRect(10, 10, 100, 50);                    // 矩形
    ctx.beginPath();
    ctx.fillStyle = '#e74c3c';
    ctx.arc(200, 60, 30, 0, Math.PI * 2);             // 圆形
    ctx.fill();
    ctx.strokeStyle = '#2ecc71';
    ctx.strokeRect(10, 80, 280, 30);                  // 描边矩形
  </script>

  <!-- HTML5 新交互标签 -->
  <details>
    <summary>点击展开（details/summary）</summary>
    <p>折叠面板内容。</p>
  </details>
  <progress value="70" max="100">70%</progress>
</body>
</html>
```

## 踩坑记录

- **自动播放限制**：浏览器禁止有声自动播放，`autoplay` 必须同时带 `muted` 才生效；视频要内联播放加 `playsinline`（iOS 关键）
- **`<video>/<audio>` 要提供 fallback**：标签内写"浏览器不支持"文案，老浏览器会显示
- **`preload` 三态**：`none`（不预加载）/ `metadata`（只加载元数据，推荐）/ `auto`（全部预加载）；`poster` 属性仅 video 有（封面图）
- **Canvas 的 2d 上下文坐标从左上角开始**，y 向下为正；绘制前 `beginPath()` 开始新路径，否则多次绘制会互相串
- **Canvas 画完就变成像素图**，无法再通过 CSS 调整内部元素；要交互（点击图形）需自己计算坐标命中检测
- **`<template>` 内容不会渲染**：需 JS 克隆后插入 DOM（`content.cloneNode(true)`）；`<dialog>` 默认隐藏，用 `show()` / `showModal()` 打开
- **`<progress>` 不写 `value` 时是无限进度条**（转圈状态）；`<meter>` 是度量条（如评分），语义与进度条不同
