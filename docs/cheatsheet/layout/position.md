---
title: 定位与层级速查
---

# 定位与层级速查

## 何时用

| 定位值 | 脱流 | 参考对象 | 典型场景 |
| --- | --- | --- | --- |
| `static` | 否 | — | 默认值，无需设置 |
| `relative` | 否 | 自身原位置 | 微调位置、作为 absolute 的定位祖先 |
| `absolute` | 是 | 最近定位祖先（否则视口） | 弹窗、下拉菜单、角标、气泡 |
| `fixed` | 是 | 视口 | 固定导航、回到顶部、悬浮按钮 |
| `sticky` | 否 | 视口 + 父容器 | 吸顶表头、目录跟随 |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>定位演示</title>
<style>
  body { margin: 0; padding: 20px; }
  .wrap { position: relative; height: 160px; padding: 10px; background: #f0f4f8; }

  .relative { position: relative; left: 40px; top: 10px; background: #3498db; }
  .absolute { position: absolute; right: 10px; bottom: 10px; background: #e74c3c; }
  .fixed    { position: fixed; top: 20px; right: 20px; background: #9b59b6; z-index: 999; }

  /* sticky：滚动时吸顶 */
  .sticky { position: sticky; top: 0; background: #2ecc71; padding: 10px; }

  /* z-index：同级比较，谁大谁在上 */
  .z-box { position: absolute; width: 80px; height: 80px; color: #fff; text-align: center; line-height: 80px; }
  .z1 { z-index: 1; background: #e67e22; }
  .z2 { z-index: 10; background: #e74c3c; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="relative">relative 微调</div>
    <div class="absolute">absolute 右下角</div>
    <div class="fixed">fixed 固定在视口</div>
    <div class="z-box z1" style="left:20px">z:1</div>
    <div class="z-box z2" style="left:50px">z:10</div>
  </div>
  <div class="sticky">滚动页面时我会吸顶（top:0）</div>
  <p style="height: 800px;">向下滚动测试 sticky 效果……</p>
</body>
</html>
```

## 踩坑记录

- **`absolute` 参考"最近定位祖先"**：祖先中没有 `relative/absolute/fixed/sticky` 时，会一路找到视口，容易定位错位
- **`fixed` 不一定相对视口**：祖先有 `transform`/`perspective`/`filter` 时会成为其包含块，fixed 变成相对该祖先，这是常见"弹窗乱跑"原因
- **`sticky` 三要素**：必须设 `top/left` 等阈值；必须位于可滚动容器内；父元素高度要大于自身，否则贴不到预期位置（父元素底部就是它的极限）
- **z-index 只在同级元素间比较**：父级创建层叠上下文后（如 `opacity < 1`、`transform`、`position + z-index`），子级 z-index 再大也出不了父级
- **`absolute` 脱离文档流**，父容器不设高度会塌陷，需给父级显式高度或用 padding 撑开
