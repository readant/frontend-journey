---
title: 选择器与权重速查
---

# 选择器与权重速查

## 何时用

| 场景 | 用什么选择器 |
| --- | --- |
| 页面元素统一设置 | 标签选择器 `p` |
| 可复用、多元素共享 | 类选择器 `.card` |
| 页面唯一元素 | ID 选择器 `#header`（慎用，权重高难覆盖） |
| 按 DOM 结构关系选 | 后代 `div p`、子代 `div > p`、兄弟 `h1 + p` / `h1 ~ p` |
| 按属性选 | `[type="text"]`、`[disabled]` |
| 按交互/状态选 | 伪类 `:hover` `:nth-child(n)` |
| 插入装饰内容 | 伪元素 `::before` `::after` |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>选择器演示</title>
<style>
  /* 引入方式：外部 / 内部(<style>) / 内联(style="") / @import */
  p { color: #333; }                       /* 标签选择器，权重 1 */
  .list > li { color: #e74c3c; }           /* 子代选择器，权重 1+1 */
  .list li:first-child { font-weight: bold; } /* 结构伪类 */
  input[type="text"] { border: 2px solid #3498db; } /* 属性选择器，权重 10 */
  .btn:hover { background: #2ecc71; }      /* 交互伪类 */

  /* 伪元素：必须写 content */
  .price::after { content: " 元"; color: #888; }
  .dot::before { content: "●"; color: #e67e22; margin-right: 4px; }

  /* 权重对比：ID(100) > 类(10) > 标签(1) */
  #title { color: #9b59b6; }   /* 权重 100 */
  h1 { color: #2c3e50; }       /* 权重 1，被上面覆盖 */

  /* LVHA 顺序：link → visited → hover → active */
  a { color: #3498db; }
  a:visited { color: #8e44ad; }
  a:hover { color: #e74c3c; }
  a:active { color: #000; }
</style>
</head>
<body>
  <h1 id="title">标题（ID 权重覆盖标签选择器）</h1>
  <p>段落文字。</p>

  <ul class="list">
    <li>第一个（first-child 加粗）</li>
    <li>子代选择器命中，红色</li>
    <li>普通列表项</li>
  </ul>

  <input type="text" placeholder="属性选择器">
  <span class="price">99</span>
  <p class="dot">伪元素装饰</p>

  <a href="#">链接：link → hover → active</a>
</body>
</html>
```

## 踩坑记录

- **权重计算**：`!important` > 内联(1000) > ID(100) > 类/伪类/属性(10) > 元素/伪元素(1) > 通配(0)。同级权重后写的胜出
- **LVHA 顺序**：`:link → :visited → :hover → :active` 必须按此顺序写，否则 `:hover` 不生效（:active 常被遗忘）
- **`:nth-child(n)` 从 1 开始计数**：`nth-child(1)` 是第一个子元素，不是第 0 个；`nth-child(2n)` 才是偶数位
- **伪元素必须带 `content`**（哪怕 `content: ""`），否则不渲染；`::before/::after` 默认是行内元素，设宽高要先 `display: block`
- **ID 选择器权重太高**，后期想覆盖很难，能用类就别用 ID
- **`div p`（后代）会命中所有层级**，`div > p`（子代）只命中直接子级，避免意外命中用后者
