## 2.1 基础选择器

### 通配选择器 `*`
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 标签选择器
```css
p { color: #333; }
h1 { font-size: 24px; }
```

### 类选择器 `.`
```css
.highlight { background: yellow; }
.text-bold { font-weight: bold; }

<!-- 多类名叠加 -->
<p class="highlight text-bold">文字</p>
```

### ID 选择器 `#`
```css
#main-title { font-size: 32px; color: blue; }
```

### 四种基础选择器对比
| 选择器 | 语法 | 权重 | 唯一性 | 使用频率 |
|-------|------|-----|--------|---------|
| 通配 `*` | `*` | 0,0,0,0 | 否 | 低 |
| 标签 | `p` | 0,0,0,1 | 否 | 中 |
| 类 `.` | `.active` | 0,0,1,0 | 否 | **高** |
| ID `#` | `#header` | 0,1,0,0 | 是 | 低 |

::: warning 注意
- ID 在页面中必须唯一
- 权重过高，不推荐滥用
- 推荐使用类选择器替代
:::
---

## 2.2 组合选择器

### 后代选择器（空格）
- 语法: `祖先 后代 { }`
- 选中**所有**后代元素（不限层级）
```css
div p { color: red; }
.container .item { ... }
```

### 子代选择器 `>`
- 语法: `父元素 > 子元素 { }`
- 仅选中**直接子元素**
```css
div > p { color: blue; }
```

### 相邻兄弟选择器 `+`
- 语法: `元素1 + 元素2 { }`
- 选中紧邻的**下一个**兄弟元素
```css
h1 + p { margin-top: 10px; }
```

### 通用兄弟选择器 `~`
- 语法: `元素1 ~ 元素2 { }`
- 选中后面**所有**兄弟元素
```css
h1 ~ p { color: gray; }
```

### 四种关系对比
| 选择器 | 符号 | 选择范围 | 方向 |
|-------|------|---------|------|
| 后代 | `空格` | 所有后代 | 向下不限层级 |
| 子代 | `>` | 直接子元素 | 向下仅一级 |
| 相邻兄弟 | `+` | 紧邻的下一个 | 向下紧邻一个 |
| 通用兄弟 | `~` | 后面所有兄弟 | 向下所有 |

---

## 2.3 属性选择器

### 存在性选择
```css
input[disabled] { opacity: 0.5; }
```

### 精确匹配 `=`
```css
input[type="email"] { border-color: blue; }
```

### 开头匹配 `^=`
```css
a[href^="https"] { padding-right: 20px; }
```

### 结尾匹配 `$=`
```css
a[href$=".pdf"] { color: red; }
```

### 包含匹配 `*=`
```css
img[src*="logo"] { width: 100px; }
```

### 五种属性选择器对比
| 选择器 | 语法 | 含义 |
|-------|------|------|
| 存在性 | `[attr]` | 具有某属性 |
| 精确匹配 | `[attr=val]` | 属性值完全等于 |
| 开头匹配 | `[attr^=val]` | 属性值以 val 开头 |
| 结尾匹配 | `[attr$=val]` | 属性值以 val 结尾 |
| 包含匹配 | `[attr*=val]` | 属性值包含 val |

---

## 2.4 伪类

### 动态伪类（用户交互）
```css
a:link { color: blue; }        /* 未访问 */
a:visited { color: purple; }   /* 已访问 */
a:hover { color: red; }        /* 鼠标悬停 */
a:active { color: orange; }    /* 激活中 */
```

::: warning LVHA 顺序
必须按 `:link` → `:visited` → `:hover` → `:active` 顺序书写
:::
### 结构伪类
```css
li:first-child { color: red; }        /* 第一个子元素 */
li:last-child { color: blue; }        /* 最后一个子元素 */
li:nth-child(n) { ... }               /* 第 n 个子元素 */
li:nth-child(odd) { ... }             /* 奇数 */
li:nth-child(even) { ... }            /* 偶数 */
li:nth-child(3n+1) { ... }            /* 3n+1 位置 */
li:only-child { ... }                 /* 独生子元素 */
:not(:first-child) { ... }            /* 非第一个 */
```

### 目标伪类
```css
#section:target { background: yellow; }  /* URL 锚点指向的元素 */
```

---

## 2.5 伪元素

### 常用伪元素
```css
::before { content: "→"; }
::after { content: "←"; }
::first-line { font-size: 18px; }
::selection { background: blue; color: white; }
```

### ::before / ::after 核心用法
```css
.element {
    position: relative;
}
.element::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 20px; height: 20px;
    background: red;
}
```

::: danger content 属性
- 必填属性，可为空字符串 `""`
- 支持字符串、URL、计数器等
- 常用于：装饰元素、三角形、清除浮动、图标
:::
### 伪元素与伪类的区别
| 伪类 | 伪元素 |
|-----|--------|
| 用 `:` 开头 | 用 `::` 开头 |
| 选择已存在的元素状态 | 创建新的虚拟元素 |
| 如 `:hover`, `:first-child` | 如 `::before`, `::first-line` |

---

## 速查语法

### 选择器速查
| 类型 | 语法 | 权重 |
|-----|------|-----|
| 通配 | `*` | 0 |
| 标签 | `p` | 1 |
| 类 | `.class` | 10 |
| ID | `#id` | 100 |
| 后代 | `div p` | 1+1 |
| 子代 | `div > p` | 1+1 |
| 相邻兄弟 | `h1 + p` | 1+1 |
| 通用兄弟 | `h1 ~ p` | 1+1 |
| 属性 | `[attr=val]` | 10 |
| 伪类 | `:hover` `:nth-child(n)` | 10 |
| 伪元素 | `::before` `::after` | 1 |

### 伪类要点
- LVHA 顺序: link→visited→hover→active
- nth-child: n/odd/even/3n+1
- 结构: first-child/last-child/only-child
- 目标: :target (URL锚点)

### 伪元素要点
- ::before/::after 需 content 属性
- 应用场景: 装饰/三角形/清除浮动/图标


---

::: info 互动演示
本章配套了交互式演示文件，可直观体验所学概念：

[🎮 打开 选择器 演示](/demos/02-css/02-selectors.html)
:::
