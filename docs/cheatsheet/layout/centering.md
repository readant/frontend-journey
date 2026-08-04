---
title: 水平垂直居中速查
---

# 水平垂直居中速查

## 何时用

| 场景 | 推荐方案 |
| --- | --- |
| 普通块级容器内居中（绝大多数情况） | Flex 或 Grid |
| 弹窗 / 遮罩层（覆盖全屏） | `fixed` + 绝对定位方案 |
| 不知道子元素宽高的绝对定位元素 | `translate(-50%, -50%)` |
| 已知宽高、纯 CSS 兼容老环境 | `absolute` + `margin: auto` |
| 单行文字垂直居中 | `line-height` 等于容器高度 |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>水平垂直居中演示</title>
<style>
  body { margin: 0; padding: 20px; }
  .box {
    width: 46%; height: 180px; margin: 10px 2% 10px 0; float: left;
    background: #f0f4f8; position: relative; box-sizing: border-box; padding: 10px;
  }
  .box .label { font-size: 12px; color: #888; margin-bottom: 8px; }
  .child { background: #3498db; color: #fff; border-radius: 4px; padding: 8px 14px; }

  /* 方案 1：Flex（首选） */
  .flex { display: flex; justify-content: center; align-items: center; }
  /* 方案 2：Grid */
  .grid { display: grid; place-items: center; }
  /* 方案 3：绝对定位 + translate（无需知道宽高） */
  .translate .child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  /* 方案 4：绝对定位 + margin auto（需知道宽高） */
  .margin-auto .child { position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; width: 120px; height: 40px; text-align: center; line-height: 40px; }
  /* 方案 5：table-cell（老浏览器兼容） */
  .table { display: table; }
  .table .cell { display: table-cell; vertical-align: middle; text-align: center; }
</style>
</head>
<body>
  <div class="box flex"><div><div class="label">方案1 Flex</div><div class="child">居中</div></div></div>
  <div class="box grid"><div><div class="label">方案2 Grid</div><div class="child">居中</div></div></div>
  <div class="box translate"><div><div class="label">方案3 translate</div><div class="child">居中</div></div></div>
  <div class="box margin-auto"><div><div class="label">方案4 margin auto</div><div class="child">居中</div></div></div>
  <div class="box table"><div class="cell"><div class="label">方案5 table-cell</div><div class="child">居中</div></div></div>
</body>
</html>
```

## 踩坑记录

- **Flex / Grid 是首选**：`display: flex + align-items/justify-content` 或 `display: grid + place-items: center`，两行搞定，无副作用
- **`translate(-50%, -50%)` 会改变元素的实际渲染位置**：后续再加 `translate` 做动画会叠加；且父容器 `position: relative` 必须存在，否则参考视口
- **`margin: auto` 方案必须同时设置四个方向（top/left/right/bottom）为 0，且子元素要有明确宽高**，缺一不可
- **Flex 内多个子元素时**：`justify-content: center` 是整体居中，想让单个子元素居中用 `margin: auto`
- **`line-height` 居中只对单行文本有效**，多行文本会溢出
- **table-cell 方案的父容器**必须是 `display: table`（宽度会被内容撑开，需给父级 `width: 100%`）
