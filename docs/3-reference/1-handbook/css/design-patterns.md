---
title: CSS 设计模式与实战完整手册
---

# CSS 设计模式与实战

## 核心概念

高频布局难题的**标准答案集**：居中、圣杯/双飞翼、粘性页脚、清除浮动、自定义形状。每个问题给出「首选方案 + 备选方案 + 为什么」。

## 完整内容

### 是什么 / 为什么

这些模式都是「看起来简单、写起来踩坑」的经典题。把答案背下来，省去每次查资料、每次重新踩坑的成本。核心原则：**能用 Flex/Grid 解决的，不要回到绝对定位硬凑**。

### 一、水平垂直居中（6 方案对比）

| 方案 | 写法 | 适用场景 | 缺点 |
| :--- | :--- | :--- | :--- |
| **Flexbox** | `display:flex; justify-content:center; align-items:center` | 90% 的场景 | 高度撑满父容器 |
| **Grid** | `display:grid; place-items:center` | 同样万能 | 同上 |
| 绝对定位 + translate | `absolute; left:50%; top:50%; transform:translate(-50%,-50%)` | 已知父容器、要脱离文档流 | 需父 `relative` |
| 绝对定位 + margin auto | `absolute; inset:0; margin:auto;` 且子有宽高 | 子元素有确定尺寸 | 需子元素宽高 |
| table-cell | 父 `display:table-cell` + `vertical-align:middle` | 老浏览器兜底 | 语义怪异 |
| calc 计算 | `absolute; left:calc(50% - 宽/2)` | 尺寸确定 | 手动算，笨重 |

```css
/* 首选：Flexbox */
.center-flex {
  display: flex;
  justify-content: center;  /* 水平 */
  align-items: center;      /* 垂直 */
}

/* Grid 一行式 */
.center-grid {
  display: grid;
  place-items: center;
}

/* 脱离文档流式 */
.center-abs {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

**经验**：容器内就一个居中元素 → Flex；需要同时铺多个 → Grid；要脱流悬浮 → absolute+translate。

### 二、圣杯布局（三栏：中间自适应，左右固定）

```css
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 左右固定，中间自适应 */
  grid-template-areas: "header header header"
                       "left  main  right"
                       "footer footer footer";
  min-height: 100vh;
}
```

经典 float 实现的圣杯/双飞翼如今统一用 **Grid/Flex 一行搞定**，双飞翼的「padding 挤出」思想已被 `grid-template-columns` 取代，了解历史即可。

### 三、Sticky Footer（内容不足时页脚贴底）

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;   /* 至少占满一屏 */
}
.content {
  flex: 1;             /* 内容区吃掉剩余空间，页脚自然贴底 */
}
```

### 四、清除浮动（Clearfix）

历史遗留：float 元素不参与父容器高度计算 → 父容器塌陷。清除方案：

```css
/* 现代首选：flow-root，一行解决 */
.clearfix {
  display: flow-root;
}

/* 经典 clearfix：::after 方案 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* 备选：overflow 触发 BFC */
.clearfix { overflow: hidden; }
```

> 现代布局用 Flex/Grid 后基本不用 float 清浮动；**遇到老代码再回来查这里**。

### 五、等高布局

```css
.row {
  display: flex;
  align-items: stretch;  /* 默认即可：Flex 子项等高 */
}
/* 每个子项 min-height 由最高者决定，卡片内容不同也能等高 */
```

### 六、自定义形状

**三角形（border 技巧）**：

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 30px solid #2d8cf0;  /* 朝上的三角形 */
}
```

**clip-path 任意多边形**（气泡、标签、头像裁剪）：

```css
.arrow {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%);
}
```

**border-radius 组合**（圆环、胶囊、对话气泡）：

```css
.pill { border-radius: 999px; }              /* 胶囊 */
.ring { border: 4px solid #2d8cf0; border-radius: 50%; }  /* 圆环 */
.bubble::after {
  content: "";
  width: 0; height: 0;
  border: 10px solid transparent;
  border-top-color: #fff;                    /* 气泡小尾巴 */
  position: absolute; bottom: -20px; left: 30px;
}
```

### 语法速查

| 需求 | 首选写法 |
| :--- | :--- |
| 居中 | Flex：`justify-content + align-items` |
| 三栏自适应 | Grid：`grid-template-columns: 200px 1fr 200px` |
| 页脚贴底 | Flex 列 + `flex: 1` 内容区 |
| 清浮动 | `display: flow-root` |
| 等高卡片 | Flex `align-items: stretch`（默认） |
| 三角形 | `border` 透明 + 实色组合 |
| 任意形状 | `clip-path: polygon(...)` |
| 圆角胶囊 | `border-radius: 999px` |

### 常见用法

**首页布局全家桶**（合体示例）：

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main { flex: 1; display: flex; }
.sidebar { width: 240px; }
.content { flex: 1; display: grid; place-items: center; }
```

### 注意事项

- ⚠️ 绝对定位居中**需要父容器 `position: relative`**，否则参照视口，位置全乱。
- ⚠️ `translate(-50%,-50%)` 的百分比是相对**元素自身**（不是父级），`left:50%` 才是相对父级——两个 50% 含义不同。
- ⚠️ 负 margin 居中/等高是旧时代 hack，遇到先想「能不能用 Flex/Grid 重写」。
- ⚠️ `border` 画三角形依赖边框直角相交，改大小要四边一起调，别只改一边。
- ⚠️ `clip-path` 会让元素**脱离盒阴影/点击区域的形状感知**，装饰可用、交互容器慎用。

## 相关

- 🔍 场景索引：[布局场景](/3-reference/2-scenarios/layout)、[对齐场景](/3-reference/2-scenarios/align)
- 📖 相邻手册：[布局](/3-reference/1-handbook/css/layout)（flex/grid 全体系）、[盒模型](/3-reference/1-handbook/css/box-model)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
