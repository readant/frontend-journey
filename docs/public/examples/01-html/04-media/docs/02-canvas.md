# Canvas 绘图详解

> 对应 HTML 文件：`../02-canvas.html`

## 本案例学习目标

- 理解 Canvas 的工作原理
- 掌握 2D 绘图上下文的基本 API
- 掌握渐变绘制、图片导出、动画帧基础
- 了解 Canvas 的使用场景和限制

## 知识点详解

### 1. Canvas 基础

Canvas 本身只是画布，所有绘制都通过 JavaScript 完成：

```html
<canvas id="myCanvas" width="400" height="200"></canvas>
<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');  // 获取 2D 绘图上下文
</script>
```

**注意：**
- width/height 是画布的**像素尺寸**，不是 CSS 尺寸
- CSS 设置的 width/height 只影响显示大小，不影响绘图分辨率
- 不设置 width/height 时默认 300x150

### 2. 基本图形绘制

#### 矩形
```javascript
// 填充矩形
ctx.fillStyle = '#ff0000';     // 设置填充颜色
ctx.fillRect(10, 10, 100, 80); // x, y, width, height

// 描边矩形
ctx.strokeStyle = '#0000ff';   // 设置描边颜色
ctx.lineWidth = 3;             // 线宽
ctx.strokeRect(130, 10, 100, 80);

// 清除矩形
ctx.clearRect(0, 0, 400, 200);
```

#### 圆形
```javascript
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);  // x, y, 半径, 起始角, 结束角
ctx.fillStyle = '#00ff00';
ctx.fill();
```

**参数说明：**
- 起始角：0（3点钟方向）
- Math.PI * 2 = 完整圆
- Math.PI = 半圆
- 角度顺时针增加（与数学坐标相反）

#### 文字
```javascript
ctx.font = '20px Arial';      // 字体大小和样式
ctx.fillStyle = '#333';       // 文字颜色
ctx.fillText('Hello', 10, 50);  // 绘制填充文字
ctx.strokeText('World', 10, 80); // 绘制描边文字
```

### 3. 路径绘制

```javascript
ctx.beginPath();           // 开始新路径
ctx.moveTo(50, 150);      // 移动画笔到起点
ctx.lineTo(150, 50);      // 画直线到
ctx.lineTo(250, 150);     // 画直线到
ctx.closePath();           // 闭合路径（回到起点）

ctx.strokeStyle = '#9400d3';
ctx.lineWidth = 5;
ctx.stroke();              // 描边

ctx.fillStyle = '#dda0dd';
ctx.fill();                // 填充
```

**关键方法：**

| 方法 | 作用 |
|------|------|
| `beginPath()` | 开始新路径（必须调用，否则会和之前的路径连在一起） |
| `moveTo(x, y)` | 移动画笔（不画线） |
| `lineTo(x, y)` | 画直线到目标点 |
| `closePath()` | 闭合路径（回到起点） |
| `stroke()` | 描边 |
| `fill()` | 填充 |

### 4. 渐变绘制

#### 线性渐变
```javascript
const linearGrad = ctx.createLinearGradient(0, 0, 400, 0);  // 起点(x1,y1) 到 终点(x2,y2)
linearGrad.addColorStop(0, '#ff0000');    // 0% 处的颜色
linearGrad.addColorStop(0.5, '#ffff00');  // 50% 处的颜色
linearGrad.addColorStop(1, '#00ff00');    // 100% 处的颜色

ctx.fillStyle = linearGrad;
ctx.fillRect(10, 10, 380, 50);
```

#### 径向渐变
```javascript
const radialGrad = ctx.createRadialGradient(200, 120, 10, 200, 120, 80);
// 内圆(x1,y1,r1) 到 外圆(x2,y2,r2)
radialGrad.addColorStop(0, '#00ffff');
radialGrad.addColorStop(1, '#0000ff');

ctx.fillStyle = radialGrad;
ctx.beginPath();
ctx.arc(200, 120, 50, 0, Math.PI * 2);
ctx.fill();
```

### 5. 导出图片 toDataURL()

```javascript
const dataURL = canvas.toDataURL('image/png');  // 导出为 PNG
document.getElementById('img').src = dataURL;

// 其他格式
canvas.toDataURL('image/jpeg', 0.8);  // JPEG，质量 0.8
```

**用途：**
- 保存 Canvas 绘制的内容为图片
- 上传到服务器
- 生成缩略图

### 6. 动画帧 requestAnimationFrame

```javascript
let x = 0;
let animId = null;

function drawFrame() {
  ctx.clearRect(0, 0, 400, 200);  // 清除画布
  
  // 绘制
  ctx.fillStyle = '#667eea';
  ctx.beginPath();
  ctx.arc(x, 75, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // 更新状态
  x += 2;
  if (x > 420) x = 0;
  
  // 请求下一帧
  animId = requestAnimationFrame(drawFrame);
}

// 开始动画
drawFrame();

// 停止动画
cancelAnimationFrame(animId);
```

**为什么用 requestAnimationFrame 而不是 setInterval？**
- requestAnimationFrame 会自动匹配屏幕刷新率（通常 60fps）
- 页面不可见时自动暂停，节省资源
- 浏览器可以优化动画性能

### 7. Canvas 使用场景

| 场景 | 说明 |
|------|------|
| 游戏 | 2D 游戏开发 |
| 数据可视化 | 图表、仪表盘 |
| 图片处理 | 滤镜、裁剪、合成 |
| 动画 | 粒子效果、过渡动画 |
| 实时视频 | 视频处理、特效 |

**不适合的场景：**
- 需要 DOM 交互的 UI（按钮、表单）
- 需要搜索引擎索引的内容
- 需要无障碍访问的内容

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图形模糊 | CSS 尺寸 ≠ Canvas 像素尺寸 | 用 width/height 属性设置，不用 CSS |
| 路径连在一起 | 没调用 beginPath() | 每个独立图形前调用 beginPath() |
| 动画卡顿 | 每帧都设置 fillStyle | 把不变的设置提到循环外面 |
| 导出图片为空 | Canvas 尺寸为 0 | 确保 width/height > 0 |

## 拓展练习

1. **练习 1**：绘制一个时钟（表盘 + 时针 + 分针 + 秒针）
   - 提示：用 arc 画表盘，用 lineTo 画指针
2. **练习 2**：制作一个简单的粒子动画
   - 提示：创建粒子对象数组，每帧更新位置并绘制
3. **练习 3**：实现一个简单的画板应用（鼠标绘制）
   - 提示：监听 mousedown、mousemove、mouseup 事件

## 本案例知识速查表

| API | 作用 | 示例 |
|-----|------|------|
| `getContext('2d')` | 获取 2D 上下文 | `canvas.getContext('2d')` |
| `fillStyle` | 填充颜色 | `ctx.fillStyle = '#ff0000'` |
| `strokeStyle` | 描边颜色 | `ctx.strokeStyle = '#0000ff'` |
| `fillRect()` | 填充矩形 | `ctx.fillRect(x, y, w, h)` |
| `strokeRect()` | 描边矩形 | `ctx.strokeRect(x, y, w, h)` |
| `beginPath()` | 开始新路径 | 每个图形前调用 |
| `moveTo()` | 移动画笔 | `ctx.moveTo(x, y)` |
| `lineTo()` | 画直线 | `ctx.lineTo(x, y)` |
| `arc()` | 画圆弧 | `ctx.arc(x, y, r, start, end)` |
| `fill()` | 填充路径 | 配合 beginPath 使用 |
| `stroke()` | 描边路径 | 配合 beginPath 使用 |
| `fillText()` | 绘制文字 | `ctx.fillText(text, x, y)` |
| `createLinearGradient()` | 线性渐变 | 两个点定义方向 |
| `createRadialGradient()` | 径向渐变 | 两个圆定义范围 |
| `toDataURL()` | 导出图片 | 返回 base64 URL |
| `requestAnimationFrame()` | 动画帧 | 递归调用实现动画 |
| `cancelAnimationFrame()` | 取消动画 | 停止动画循环 |
