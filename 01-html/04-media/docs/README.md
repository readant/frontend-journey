# 模块 4：多媒体与 HTML5 新特性

> 掌握音视频嵌入、Canvas 绘图基础、HTML5 新增交互标签，理解多媒体标签的属性组合。

## 学习路线

1. **视频与音频**（预计 15 分钟）→ `01-video-audio.html` + [详细文档](01-video-audio.md)
   - video/audio 标签、source 多格式回退、属性组合
2. **Canvas 绘图**（预计 20 分钟）→ `02-canvas.html` + [详细文档](02-canvas.md)
   - 2D 绘图上下文、基本图形、路径绘制、动画基础
3. **HTML5 新标签**（预计 15 分钟）→ `03-new-tags.html` + [详细文档](03-new-tags.md)
   - details/summary、meter、progress、dialog、template

## 知识点大纲

### 视频与音频

**video 标签：**
```html
<video controls autoplay muted loop poster="cover.jpg" width="600">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持 video 标签。
</video>
```

**audio 标签：**
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持 audio 标签。
</audio>
```

| 属性 | 作用 | 注意事项 |
|------|------|----------|
| `controls` | 显示播放控件 | 不加则无播放界面 |
| `autoplay` | 自动播放 | 现代浏览器要求同时 muted |
| `muted` | 静音 | autoplay 必备搭档 |
| `loop` | 循环播放 | 背景视频常用 |
| `poster` | 封面图 | 仅 video 有效 |
| `preload` | 预加载策略 | `none` / `metadata` / `auto` |
| `playsinline` | iOS 内联播放 | 移动端必须加 |
| `width` / `height` | 尺寸 | 建议用 CSS 控制 |

**多格式回退原理：** 浏览器从上到下读取 `<source>`，加载第一个支持的格式。常见格式：
- video：mp4（H.264，兼容最好）、webm（开源，体积小）
- audio：mp3（兼容最好）、ogg（开源）

### Canvas 绘图

Canvas 本身只是画布，所有绘制都通过 JavaScript 完成：

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');  // 获取 2D 绘图上下文
```

**基本绘制 API：**

| 方法 | 作用 | 示例 |
|------|------|------|
| `fillRect(x, y, w, h)` | 填充矩形 | `ctx.fillRect(10, 10, 100, 50)` |
| `strokeRect(x, y, w, h)` | 描边矩形 | `ctx.strokeRect(10, 10, 100, 50)` |
| `beginPath()` | 开始新路径 | 每个独立图形前调用 |
| `moveTo(x, y)` | 移动画笔 | 路径起点 |
| `lineTo(x, y)` | 画直线 | 从当前点到目标点 |
| `arc(x, y, r, start, end)` | 画圆弧 | `Math.PI * 2` 为完整圆 |
| `fill()` | 填充路径 | 配合 beginPath 使用 |
| `stroke()` | 描边路径 | 配合 beginPath 使用 |
| `fillText(text, x, y)` | 绘制文字 | 需先设置 font 和 fillStyle |
| `requestAnimationFrame()` | 动画帧 | 递归调用实现动画 |

### HTML5 新标签

| 标签 | 作用 | 交互方式 |
|------|------|----------|
| `<details>` + `<summary>` | 可折叠内容 | 点击 summary 切换展开/收起 |
| `<meter>` | 度量条 | 静态显示，适合磁盘使用率等 |
| `<progress>` | 进度条 | 可通过 JS 动态更新 value |
| `<dialog>` | 原生对话框 | `showModal()` 打开，`close()` 关闭 |
| `<template>` | HTML 模板 | 不渲染，JS 克隆后插入 DOM |
| `<mark>` | 高亮文本 | 静态高亮显示 |

## 重难点总结

| 难点 | 说明 | 对应案例 |
|------|------|----------|
| autoplay 必须 muted | 现代浏览器禁止有声自动播放，这是用户体验策略 | `01-video-audio.html` |
| Canvas 坐标系 | 左上角为 (0,0)，x 向右增大，y 向下增大 | `02-canvas.html` |
| Canvas 需要设置 width/height 属性 | CSS 设置的尺寸只影响显示，不影响绘图分辨率 | `02-canvas.html` |
| dialog 的 showModal vs show | showModal 有遮罩层且可 ESC 关闭，show 无遮罩 | `03-new-tags.html` |
| template 内容不生效 | template 内的 script、img 不会加载，直到被克隆插入 DOM | `03-new-tags.html` |

## 案例索引

| 案例文件 | 配套文档 | 说明 |
|----------|----------|------|
| `01-video-audio.html` | [01-video-audio.md](01-video-audio.md) | 视频音频标签详解 |
| `02-canvas.html` | [02-canvas.md](02-canvas.md) | Canvas 绘图 API 详解 |
| `03-new-tags.html` | [03-new-tags.md](03-new-tags.md) | HTML5 新交互标签详解 |

## 参考资源

- [MDN - HTML5 视频](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
- [MDN - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [MDN - Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)
- [W3School - HTML5 多媒体](https://www.w3school.com.cn/html/html5_video.asp)
