---
title: HTML SEO 与可访问性速查
---

# HTML SEO 与可访问性速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 设置搜索标题 / 摘要 / 收录控制 | `<title>`、`<meta name="description">`、`<meta name="robots">` |
| 社交平台分享卡片 | `og:title` / `og:description` / `og:image` |
| 同一内容多个 URL 去重 | `<link rel="canonical">` |
| 让爬虫理解内容为实体（评分/面包屑等富结果） | JSON-LD 结构化数据 |
| 图片信息传达（信息图/装饰图） | `alt`（信息图描述 / 装饰图空） |
| 表单控件说明与错误提示 | `<label for>` + `aria-describedby` |
| 图标按钮语义化 | `aria-label` |
| 键盘用户跳过导航 | 跳转链接（skip link） |

## 核心代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 | 站点名</title>
  <meta name="description" content="50-160 字符的页面摘要">
  <link rel="canonical" href="https://example.com/page">

  <!-- 社交分享卡片 -->
  <meta property="og:title" content="页面标题">
  <meta property="og:description" content="摘要">
  <meta property="og:image" content="https://example.com/cover.png">

  <!-- 结构化数据：文章 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "页面标题",
    "datePublished": "2026-08-04"
  }
  </script>
</head>
<body>
  <!-- 跳转链接：键盘用户直达内容 -->
  <a class="skip-link" href="#main">跳到主要内容</a>

  <!-- 信息图：必须描述 -->
  <img src="chart.png" alt="2026 年 8 月销量柱状图">
  <!-- 装饰图：alt 留空 -->
  <img src="divider.png" alt="">

  <main id="main">
    <!-- 表单：label 关联 + 错误提示关联 -->
    <label for="pwd">密码</label>
    <input type="password" id="pwd" aria-describedby="hint" aria-invalid="true">
    <p id="hint">至少 6 位</p>

    <!-- 图标按钮 -->
    <button aria-label="关闭"><span class="icon-x"></span></button>
  </main>
</body>
</html>
```

## 踩坑记录

- **`alt` 不是"图片两个字"**：信息图必须描述内容；装饰图写 `alt=""`（空）让读屏跳过。判断标准：删掉这张图会丢信息吗？
- **`div` 模拟按钮是坑**：ARIA 只改读屏语义不改键盘行为，`role="button"` 的 div 不会自动响应 Enter/Space，必须手写键盘事件；能用 `<button>` 就用 `<button>`
- **ARIA 铁律"一不要、二必要"**：能原生表达就不加 ARIA（`<nav>` 不要 `role="navigation"`），加了反而可能重复播报
- **不要手动设 `tabindex="1"` 等正数**：会打乱自然 Tab 顺序，用 `0`（可聚焦）或 `-1`（JS 聚焦）
- **`keywords` meta 无效**：主流搜索引擎已忽略；别做关键字堆砌，会被惩罚
- **动态提示（如"保存成功"）读屏读不到**：需 `aria-live="polite"` 声明"实时区域"才会播报
- **标题层级不要跳级**：`h1` 直接 `h3` 破坏大纲；`h1` 一页一个
- **错误提示只靠颜色不行**：红框对色盲无效，需文字提示 + `aria-describedby`/`aria-invalid`
