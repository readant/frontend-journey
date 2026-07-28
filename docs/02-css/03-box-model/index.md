## 3.1 标准盒模型

### 特点
- `width` 只包含 **content** 区域
- 盒子总宽度 = `width + padding + border + margin`
- `box-sizing: content-box`（默认值）

```
┌─────────────────── margin (外边距) ───────────────────┐
│  ┌──────────── border (边框) ──────────────────────┐  │
│  │  ┌───── padding (内边距) ──────────────────┐    │  │
│  │  │  ┌──── content (内容) ─────────────┐   │    │  │
│  │  │  │                                │   │    │  │
│  │  │  └─────────────────────────────────┘   │    │  │
│  │  └─────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 示例
```css
.box {
    width: 200px;
    padding: 20px;
    border: 2px solid #ccc;
    margin: 10px;
    /* 实际宽度 = 200 + 20*2 + 2*2 + 10*2 = 264px */
    box-sizing: content-box;
}
```

---

## 3.2 怪异盒模型

### 特点
- `width` 包含 **content + padding + border**
- 盒子总宽度 = `width + margin`
- `box-sizing: border-box`

### 示例
```css
.box {
    width: 200px;
    padding: 20px;
    border: 2px solid #ccc;
    margin: 10px;
    /* 实际宽度 = 200 + 10*2 = 220px */
    box-sizing: border-box;
}
```

### 两种盒模型对比
| 盒模型 | box-sizing | width 包含 | 计算难度 |
|-------|-----------|-----------|---------|
| 标准 | `content-box` | 仅 content | 需手动计算 |
| 怪异 | `border-box` | content + padding + border | **直观推荐** |

::: tip 最佳实践
全局设置 `box-sizing: border-box`，简化尺寸计算
```css
*, *::before, *::after {
    box-sizing: border-box;
}
```
:::
---

## 3.3 组成部分

### content（内容）
- 属性: `width`, `height`
- 盒子的核心内容区域
- 文本、图像、子元素等在此区域内

### padding（内边距）
- 属性: `padding-top/right/bottom/left`
- 内容与边框之间的空间
- 背景色会延伸到 padding 区域
- 不可以为负值

```css
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;

/* 简写 */
padding: 10px 20px 10px 20px;  /* 上 右 下 左 */
padding: 10px 20px;            /* 上下 左右 */
padding: 10px;                 /* 四边相同 */
```

### border（边框）
- 属性: `border-width`, `border-style`, `border-color`
- 盒子的边界线
- 不可以为负值

```css
border: 1px solid #ccc;
border-radius: 8px;           /* 圆角 */
border-radius: 50%;           /* 圆形 */
border-top: 1px solid red;    /* 单边 */
```

### margin（外边距）
- 属性: `margin-top/right/bottom/left`
- 盒子与盒子之间的空间
- 背景色不会延伸到 margin 区域
- **可以为负值**

```css
margin: 10px 20px;            /* 上下 左右 */
margin: 0 auto;               /* 水平居中（需要固定宽度） */
```

### 四部分总结
| 部分 | 属性 | 可否为负 | 背景填充 |
|-----|------|---------|---------|
| content | `width`, `height` | 否 | 是 |
| padding | `padding` | 否 | 是 |
| border | `border` | 否 | 是 |
| margin | `margin` | **是** | 否 |

---

## 3.4 外边距合并（塌陷）

### 什么是外边距合并
两个垂直相邻的块级元素，它们的外边距会**合并成一个**较大的外边距。

### 合并规则
- **都是正值**: 取较大值
- **一正一负**: 正值减去负值
- **都是负值**: 取绝对值较大的负值

### 合并场景
1. **相邻兄弟元素**
```
元素A margin-bottom: 30px
元素B margin-top: 50px
→ 实际间距 = 50px（取较大值）
```

2. **父子元素**（第一个/最后一个子元素的 margin 与父元素合并）
```css
.parent { background: #eee; }
.child { margin-top: 50px; }  /* 会与 parent 的 margin 合并 */
```

3. **空元素**（没有内容的元素上下 margin 合并）

### 解决方案
| 方案 | 代码 | 说明 |
|-----|------|------|
| padding 代替 margin | 父元素用 `padding-top` | 最推荐 |
| border 阻隔 | 父元素加 `border: 1px solid transparent` | 简单有效 |
| overflow: hidden | 父元素设 `overflow: hidden` | 副作用：裁剪溢出 |
| flex/grid 布局 | 使用 flex 布局 | 现代布局方案 |
| display: flow-root | 父元素设 `display: flow-root` | 创建新的格式化上下文 |

::: tip 实际建议
- 尽量避免 margin 合并（使用 padding 或 border 阻隔）
- 兄弟元素间的间距用 `margin` 是合理的
- 父子元素间距优先用 `padding`
:::
---

## 速查语法

### 盒模型公式
- 标准(content-box): width = content, 总宽 = width + padding*2 + border*2 + margin*2
- 怪异(border-box): width = content + padding + border, 总宽 = width + margin*2

### 核心属性
| 属性 | 可否负 | 背景填充 |
|-----|-------|---------|
| content | 否 | 是 |
| padding | 否 | 是 |
| border | 否 | 是 |
| margin | 是 | 否 |

### margin 合并
- 规则: 正值取大，一正一负相减，负取绝对大
- 场景: 相邻兄弟/父子/空元素
- 解决: padding替代 / border阻隔 / overflow:hidden / flex布局

### 最佳实践
```css
*, *::before, *::after { box-sizing: border-box; }
```

---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 盒子模型 演示](/demos/02-css/03-box-model.html)
:::
