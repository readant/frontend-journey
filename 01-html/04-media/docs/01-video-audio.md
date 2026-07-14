# 视频与音频详解

> 对应 HTML 文件：`../01-video-audio.html`

## 本案例学习目标

- 掌握 video 和 audio 标签的所有属性
- 理解多格式回退机制
- 掌握 autoplay + muted 的配合使用
- 了解 preload 和 playsinline 的使用场景

## 知识点详解

### 1. video 标签

**语法：**
```html
<video controls autoplay muted loop poster="cover.jpg" width="600">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持 video 标签。
</video>
```

**属性说明：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `controls` | 布尔 | 显示播放控件（播放、暂停、音量、进度条） |
| `autoplay` | 布尔 | 自动播放（现代浏览器要求同时 muted） |
| `muted` | 布尔 | 静音（autoplay 必备搭档） |
| `loop` | 布尔 | 循环播放 |
| `poster` | string | 视频封面图（加载前显示） |
| `width` | number | 视频宽度（像素） |
| `height` | number | 视频高度（像素） |
| `preload` | string | 预加载策略 |
| `playsinline` | 布尔 | iOS 内联播放（不全屏） |

#### autoplay 为什么必须 muted？

现代浏览器（Chrome 66+、Safari 11+）禁止有声自动播放，这是用户体验策略：
- 用户打开网页突然听到声音会感到困扰
- 所以 autoplay 必须配合 muted
- 如果需要有声播放，先静音自动播放，用户交互后再取消静音

#### preload 预加载策略

| 值 | 说明 | 使用场景 |
|----|------|----------|
| `none` | 不预加载 | 首屏不需要的视频 |
| `metadata` | 只加载元数据（时长、尺寸） | 了解视频基本信息 |
| `auto` | 浏览器自行决定 | 首屏需要的视频 |

#### playsinline（iOS 必加）

iOS Safari 默认会将视频全屏播放，加上 `playsinline` 可以让视频在页面内播放：
```html
<video playsinline>...</video>
```

### 2. audio 标签

**语法：**
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持 audio 标签。
</audio>
```

**属性与 video 类似：**

| 属性 | 说明 |
|------|------|
| `controls` | 显示播放控件 |
| `autoplay` | 自动播放 |
| `loop` | 循环播放 |
| `muted` | 静音 |
| `preload` | 预加载策略 |

**audio 没有的属性：** poster、width、height（因为没有画面）

### 3. 多格式回退机制

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogv" type="video/ogg">
  您的浏览器不支持 video 标签。
</video>
```

**工作原理：**
1. 浏览器从上到下读取 `<source>` 标签
2. 加载第一个支持的格式
3. 如果都不支持，显示兜底文本

**常见格式对比：**

| 格式 | 兼容性 | 体积 | 推荐度 |
|------|--------|------|--------|
| mp4 (H.264) | 所有浏览器 | 较大 | 兼容性最好 |
| webm (VP8/VP9) | 现代浏览器 | 较小 | 开源，推荐 |
| ogg (Theora) | 现代浏览器 | 较小 | 开源 |

**建议：** 至少提供 mp4 + webm 两种格式。

### 4. 实际应用：自动播放背景视频

```html
<video autoplay muted loop playsinline
       style="position: absolute; width: 100%; height: 100%; object-fit: cover;">
  <source src="bg.mp4" type="video/mp4">
</video>
<div style="position: relative; z-index: 1; color: white;">
  <h1>覆盖在视频上的文字</h1>
</div>
```

**注意：** 背景视频必须 muted + autoplay + loop。

### 5. JavaScript 控制播放

```javascript
const video = document.getElementById('myVideo');

// 播放
video.play();

// 暂停
video.pause();

// 静音
video.muted = true;

// 跳转到指定时间（秒）
video.currentTime = 30;

// 监听播放结束
video.addEventListener('ended', function() {
  console.log('视频播放完毕');
});
```

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| autoplay 不生效 | 没有 muted 属性 | 加上 muted |
| iOS 视频全屏播放 | 没有 playsinline | 加上 playsinline |
| 视频加载慢 | preload 策略不对 | 首屏用 auto，非首屏用 none |
| 格式不支持 | 只提供了一种格式 | 提供 mp4 + webm 两种格式 |
| 控件不显示 | 没有 controls 属性 | 加上 controls |

## 拓展练习

1. **练习 1**：制作一个视频播放器，支持播放、暂停、音量控制
   - 提示：用 JS 操控 video 元素的 play()、pause()、muted 属性
2. **练习 2**：制作一个自动播放的背景视频页面
   - 提示：autoplay + muted + loop + playsinline + object-fit: cover
3. **练习 3**：用 audio 标签制作一个简单的音乐播放器
   - 提示：可以用 progress 标签显示播放进度

## 本案例知识速查表

| 标签/属性 | 作用 | 示例 |
|-----------|------|------|
| `<video controls>` | 视频播放器 | 显示控件 |
| `<video autoplay muted>` | 自动播放 | 必须同时 muted |
| `<video loop>` | 循环播放 | 背景视频常用 |
| `<video poster>` | 视频封面 | 加载前显示 |
| `<video playsinline>` | iOS 内联播放 | 移动端必加 |
| `<video preload>` | 预加载策略 | none / metadata / auto |
| `<audio controls>` | 音频播放器 | 显示控件 |
| `<source src type>` | 多格式回退 | 浏览器选择支持的格式 |
