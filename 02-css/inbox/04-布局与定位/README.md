# 04. 布局与定位

## 4.1 文档流

### 块级元素
- 独占一行，从上向下排列
- 常见: `div`, `h1`-`h6`, `p`, `ul`, `li`, `form`, `table`
- 默认 `display: block`

### 行内元素
- 不独占一行，从左向右排列
- 常见: `span`, `a`, `strong`, `em`, `img`, `input`
- 默认 `display: inline`

### 行内块元素
- 行内排列，但可设置宽高
- 常见: `img`, `input`
- 默认 `display: inline-block`

### display 属性
| 值 | 说明 |
|---|------|
| `block` | 块级显示 |
| `inline` | 行内显示 |
| `inline-block` | 行内块显示 |
| `none` | 不渲染（占据空间） |
| `flex` | 弹性容器 |
| `grid` | 网格容器 |

---

## 4.2 浮动布局

### float 属性
```css
.float-left { float: left; }
.float-right { float: right; }
.float-none { float: none; }    /* 默认值 */
```

### 特点
- 元素脱离文档流
- 浮动元素会向左/右移动直到边缘
- 其他元素会环绕在浮动元素周围

### 浮动带来的问题
- **父元素高度坍塌**：浮动元素不占据文档流空间
- **后续元素布局混乱**

### 清除浮动
#### 方案一：给父元素设置高度
```css
.parent { height: 200px; }  /* 不推荐，固定高度不灵活 */
```

#### 方案二：overflow: hidden
```css
.parent { overflow: hidden; }
```

#### 方案三：添加空元素清除
```html
<div class="parent">
    <div class="float-child"></div>
    <div style="clear: both;"></div>
</div>
```

#### 方案四：伪元素清除（推荐）
```css
.clearfix::after {
    content: "";
    display: block;
    clear: both;
}
```

### clear 属性
| 值 | 说明 |
|---|------|
| `none` | 不清除（默认） |
| `left` | 清除左浮动 |
| `right` | 清除右浮动 |
| `both` | 清除所有浮动 |

---

## 4.3 定位

### position 取值
| 值 | 是否脱离文档流 | 定位参考 | 说明 |
|---|--------------|---------|------|
| `static` | 否 | — | 默认值，正常文档流 |
| `relative` | 否 | 自身位置 | 相对自身偏移 |
| `absolute` | 是 | 最近的定位祖先 | 绝对定位 |
| `fixed` | 是 | 视口 | 固定在视口位置 |
| `sticky` | 否 | 视口滚动 + 父容器 | 粘性定位 |

### relative 相对定位
```css
.box {
    position: relative;
    top: 20px;       /* 向下偏移 20px */
    left: -10px;     /* 向左偏移 10px */
}
```
- 不脱离文档流，占位保留
- 相对于**自身原始位置**偏移
- 常用于：微调位置、作为绝对定位的父容器

### absolute 绝对定位
```css
.parent {
    position: relative;    /* 父元素需定位 */
}
.child {
    position: absolute;
    top: 0;
    right: 0;
}
```
- 完全脱离文档流，不占位
- 相对于**最近的已定位祖先元素**
- 若无定位祖先，则相对于 `<html>`
- 常用于：弹出框、下拉菜单、角标

### fixed 固定定位
```css
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}
```
- 脱离文档流
- 相对于**视口**
- 页面滚动时位置不变
- 常用于：固定导航栏、返回顶部按钮

### sticky 粘性定位
```css
.sidebar {
    position: sticky;
    top: 20px;           /* 距离视口顶部 20px 时开始粘性 */
}
```
- 文档流内 + 偏移
- 滚动到阈值时"粘"在视口指定位置
- 仍受父容器约束
- 常用于：吸顶导航、目录跟随

### 四个偏移属性
```css
top: 0;
right: 0;
bottom: 0;
left: 0;
```

### z-index 与层叠上下文

#### z-index
```css
.box1 { z-index: 1; }
.box2 { z-index: 10; }   /* 显示在 box1 上面 */
.box3 { z-index: -1; }  /* 显示在普通元素下面 */
```

#### 层叠规则
1. 同级元素：z-index 大的在上
2. 不同父级：层叠上下文决定
3. 无 z-index：后写的在上

#### 层叠上下文 (Stacking Context)
创建层叠上下文的条件：
- 设置 `position` 为非 static + `z-index`
- `opacity` < 1
- `transform`, `filter`, `perspective`
- `will-change: transform`
- `mix-blend-mode`

> [!warning] 注意
> - 父元素创建层叠上下文后，子元素的 z-index 只在父级内部有效
> - 子元素无法突破父级层叠上下文限制

---

## 4.4 Flexbox 弹性布局

### 容器属性
| 属性 | 值 | 说明 |
|-----|---|------|
| `display` | `flex`, `inline-flex` | 创建弹性容器 |
| `flex-direction` | `row`, `row-reverse`, `column`, `column-reverse` | 主轴方向 |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` | 换行方式 |
| `flex-flow` | `row wrap` | 方向+换行简写 |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` | 主轴对齐 |
| `align-items` | `flex-start`, `flex-end`, `center`, `stretch`, `baseline` | 交叉轴对齐 |
| `align-content` | 同上 | 多行交叉轴对齐 |
| `gap` | `10px`, `1rem` | 间距 |

### 项目属性
| 属性 | 值 | 说明 |
|-----|---|------|
| `flex-grow` | 数字（默认0） | 放大比例 |
| `flex-shrink` | 数字（默认1） | 缩小比例 |
| `flex-basis` | 长度（默认auto） | 初始尺寸 |
| `flex` | `1 1 0` | grow shrink basis 简写 |
| `order` | 数字（默认0） | 排列顺序 |
| `align-self` | auto/flex-start/flex-end/center/stretch | 单独对齐 |

---

## 4.5 Grid 网格布局

### 容器属性
| 属性 | 值 | 说明 |
|-----|---|------|
| `display` | `grid`, `inline-grid` | 创建网格容器 |
| `grid-template-columns` | `1fr 2fr 1fr` | 列宽 |
| `grid-template-rows` | `100px auto 200px` | 行高 |
| `gap` / `grid-gap` | `10px` | 网格间距 |
| `grid-template-areas` | `"header header" "sidebar main"` | 区域命名 |
| `justify-items` | `start`, `end`, `center`, `stretch` | 单元格内容对齐 |
| `align-items` | 同上 | 垂直对齐 |
| `justify-content` | 主轴对齐 | 整个网格对齐 |
| `align-content` | 同上 | 垂直对齐 |

### 项目属性
| 属性 | 值 | 说明 |
|-----|---|------|
| `grid-column` | `1 / 3`, `span 2` | 占据的列 |
| `grid-row` | `1 / 3`, `span 2` | 占据的行 |
| `grid-area` | `header`, `1 / 2 / 3 / 4` | 区域名称或起始/终止线 |
| `justify-self` | 单元格内对齐 | 单独对齐 |
| `align-self` | 同上 | 垂直对齐 |

### 合并单元格
```css
.item-wide {
    grid-column: span 2;
    grid-row: span 2;
}

/* 网格线命名 */
.container {
    grid-template-columns: [start] 1fr [middle] 2fr [end];
}
.item {
    grid-column: start / middle;
}
```

---

## 速查语法

### 文档流
- 块级: div/h1/p/ul, 独占一行, display:block
- 行内: span/a/strong, 不独占一行, display:inline
- 行内块: img/input, 可设宽高, display:inline-block

### float 属性
float: left/right/none; 清除: clear: both;
经典Clearfix:
```css
.clearfix::after { content:""; display:block; clear:both; }
```

### position 属性
| 值 | 脱流 | 参考 | 场景 |
|---|-----|------|-----|
| static | 否 | — | 默认 |
| relative | 否 | 自身 | 微调/父容器 |
| absolute | 是 | 最近定位祖先 | 弹窗/下拉/角标 |
| fixed | 是 | 视口 | 固定导航/返回顶部 |
| sticky | 否 | 视口+父容器 | 吸顶/目录跟随 |

### z-index 规则
同级z-index大者在上; 父级创建层叠上下文后子级无法突破

### Flexbox 容器属性
flex-direction | justify-content | align-items | flex-wrap | gap

### Flexbox 项目属性
flex-grow | flex-shrink | flex-basis | flex | order

### Grid 核心
grid-template-columns | grid-template-rows | gap | grid-area | grid-column | grid-row
fr 比例单位, repeat() 重复, auto-fit/minmax 自适应