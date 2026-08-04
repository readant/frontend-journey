---
title: 过渡动画速查
---

# 过渡动画速查

## 何时用

- **悬停/点击等状态切换**的平滑变化（按钮变色、卡片上浮、菜单展开）
- 属性从 A 值变到 B 值时的**中间过程动画**
- 只做"一次性变化"，不需要循环或关键帧时

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>transition 演示</title>
<style>
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    background: #3498db;
    color: #fff;
    cursor: pointer;
    /* transition: 属性名 时长 缓动函数 延迟; */
    transition: background .3s ease, transform .2s ease-out;
  }
  .btn:hover {
    background: #2ecc71;
    transform: translateY(-3px);
  }

  /* 全属性简写 + 贝塞尔曲线 */
  .card {
    width: 120px; height: 120px;
    background: #e67e22;
    transition: all .5s cubic-bezier(.17,.67,.83,.67);
  }
  .card:hover { width: 160px; height: 160px; border-radius: 50%; }

  /* 延迟触发：先放大再变色 */
  .delayed { transition: background .4s .2s, transform .3s; }
  .delayed:hover { background: #e74c3c; transform: scale(1.1); }
</style>
</head>
<body>
  <button class="btn">悬停变色 + 上移</button>
  <div class="card" style="margin:20px 0">悬停：宽高 + 圆形</div>
  <div class="delayed" style="width:100px;height:50px;background:#9b59b6;">延迟变色</div>
</body>
</html>
```

## 踩坑记录

- **transition 只对"数值型/可插值"属性生效**：颜色、transform、宽高、透明度可以；`display: none → block` 不行（会直接跳变，要配合 `visibility`/`opacity`）
- **写法顺序**：`transition: 属性 时长 缓动 延迟`；`transition: all .3s` 能跑但性能差，尽量**只写要动的属性**
- **`:hover` 上的 transition 与元素本身的 transition 方向不同**：写在元素上（非 hover）悬停和移开都有过渡，写在 hover 里只有悬停有
- **缓动函数**：`ease`/`linear`/`ease-in-out` 是内置的；`cubic-bezier(x1,y1,x2,y2)` 自定义，参数范围 0~1
- **延迟参数是第 4 个时间值**：`transition: all .3s ease .2s`（前一个是时长，后一个是延迟），写错会变成 0.2s 时长
- **性能**：过渡 `transform`/`opacity` 走 GPU 不掉帧，过渡 `width/height/top/left` 会触发重排
