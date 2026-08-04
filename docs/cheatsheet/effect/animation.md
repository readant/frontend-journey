---
title: 关键帧动画速查
---

# 关键帧动画速查

## 何时用

- **循环动画**：loading 转圈、呼吸灯、跑马灯
- **多阶段动画**：需要 0%→50%→100% 多个关键状态
- **入场动画**：元素加载时的淡入上移
- 页面加载 / 状态变化时的自动动画（不需要用户交互触发）

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@keyframes 演示</title>
<style>
  /* 定义关键帧 */
  @keyframes bounce {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-30px); }
    100% { transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); } /* 只有终态时可用 from/to 或 to */
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* 应用动画：animation: 名称 时长 缓动 延迟 次数 方向 填充 播放状态; */
  .ball {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: #3498db;
    animation: bounce 1s ease-in-out infinite; /* infinite 无限循环 */
  }
  .spinner {
    width: 40px; height: 40px;
    border: 4px solid #ddd;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  .enter {
    animation: fade-in .6s ease-out both; /* both: 动画前后都应用关键帧 */
  }
</style>
</head>
<body>
  <h3>无限弹跳（bounce）</h3>
  <div class="ball"></div>

  <h3>loading 转圈（border 上色 + rotate）</h3>
  <div class="spinner"></div>

  <h3>入场淡入上移（fade-in，both 保持结束态）</h3>
  <div class="enter" style="background:#2ecc71;padding:12px;border-radius:6px;color:#fff;">页面加载即播放一次</div>
</body>
</html>
```

## 踩坑记录

- **animation 属性全展开**：`animation-name / duration / timing-function / delay / iteration-count / direction / fill-mode / play-state`，简写顺序易混，时长在第 2 位、延迟在第 4 位
- **`animation-fill-mode` 的作用**：`none`（默认）播放完回初始；`forwards` 保持结束帧；`backwards` 延迟期先应用开始帧；`both` 前后都应用。**入场动画不写 both，元素会在动画前闪现**
- **`infinite` 循环**：循环动画最好把首尾帧设计成一致（如 bounce 0% 与 100% 相同），否则有跳变
- **`@keyframes` 里只能写可插值属性**：写 `display` 等离散属性会跳变；百分比顺序不必严格 0→100，但必须含 0% 和 100%（或用 `from`/`to`）
- **transform 在关键帧中要写全**：`transform: translateY(-30px)` 会覆盖其他变换，关键帧之间别混用 `rotate` 和 `translate` 简写，否则会互相覆盖
- **动画与 transition 冲突**：同一属性同时设置 animation 和 transition，animation 优先；暂停用 `animation-play-state: paused`（配合 JS 控制）
