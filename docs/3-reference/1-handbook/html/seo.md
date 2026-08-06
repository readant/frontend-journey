---
title: HTML SEO 与可访问性完整手册
---

# SEO 与可访问性

## 核心概念

SEO 让**搜索引擎**读懂页面，可访问性（A11y）让**所有人**（含残障用户、读屏工具）都能用。两者共享同一套底层：语义化 + 元信息 + 键盘可用。

## 完整内容

### 是什么 / 为什么

一个页面写完「能看」只是起点：SEO 决定能不能被搜到，无障碍决定能不能被用上。二者做在前端而非事后补救，成本最低。

### 一、SEO 元信息

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>页面标题 - 品牌名</title>
  <meta name="description" content="120 字以内的页面描述，出现在搜索结果摘要" />
  <link rel="canonical" href="https://example.com/this-page/" />
  <!-- Open Graph：社交分享卡片 -->
  <meta property="og:title" content="页面标题" />
  <meta property="og:description" content="分享时的描述" />
  <meta property="og:image" content="https://example.com/cover.jpg" />
</head>
```

| 标签 | 作用 |
| :--- | :--- |
| `<title>` | 搜索标题（≈50 字符内最佳） |
| `meta description` | 搜索摘要，**影响点击率** |
| `link rel="canonical"` | 声明权威地址，防重复内容被降权 |
| `og:*` | 社交平台分享卡片 |
| `meta robots` | 爬虫指令（`noindex`/`nofollow`） |

### 二、结构化数据（JSON-LD）

让搜索结果出现富摘要（面包屑、评分、FAQ），用 JSON-LD 脚本注入：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "author": { "@type": "Person", "name": "作者名" },
  "datePublished": "2026-08-06"
}
</script>
```

### 三、ARIA：补充无障碍信息

原则：**优先原生语义，ARIA 只做补充**——原生 `<button>` 自带键盘与语义，不必再造轮子。

| ARIA 用法 | 场景 |
| :--- | :--- |
| `aria-label="关闭"` | 无文字图标按钮的补充名 |
| `aria-labelledby="title-id"` | 用页面元素作为标签 |
| `role="alert"` | 即时重要提示（读屏立即播报） |
| `aria-expanded="false"` | 可展开区域的折叠状态 |
| `aria-live="polite"` | 动态区域内容变化时温和播报 |
| `aria-describedby` | 关联说明文字（如错误提示） |

### 四、键盘导航

```html
<!-- 合理 tabindex：只有"需要额外干预顺序"时才显式设置 -->
<div tabindex="0" role="button" aria-label="打开菜单">菜单</div>

<!-- 焦点可见性：不要移除 outline，或用 :focus-visible 美化 -->
<style>
  :focus-visible {
    outline: 3px solid #6ea8ff;
    outline-offset: 2px;
  }
</style>
```

| 规则 | 说明 |
| :--- | :--- |
| 所有交互元素可 Tab 到达 | 原生按钮/链接天然满足 |
| 可见焦点 | 不要 `outline: none` 而不给替代 |
| 跳过导航 | 提供「跳到主内容」的锚点链接 |
| 标签页顺序合理 | 源码顺序即 Tab 顺序，别乱用 `tabindex>0` |

### 五、基础可访问性清单

| 项 | 做法 |
| :--- | :--- |
| 图片 | 都有 `alt`（装饰图 `alt=""`） |
| 表单 | 每个控件有 `<label>` 关联 |
| 对比度 | 正文文字与背景对比 ≥ 4.5:1 |
| 标题层级 | 不跳级（h1→h2→h3） |
| 媒体 | 视频有字幕/文字稿 |
| 动态内容 | `aria-live` 通知 |
| 颜色 | 不单靠颜色传达信息（配图标/文字） |
| 触控 | 可点击区域 ≥ 44×44px |

### 六、站外协作：robots.txt 与 sitemap

页面之外的「搜索引擎沟通文件」：

```text
# robots.txt（站点根目录）：允许/禁止抓取
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
```

```xml
<!-- sitemap.xml：告诉搜索引擎所有页面地址与更新频率 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-08-06</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

| 文件 | 职责 | 注意 |
| :--- | :--- | :--- |
| `robots.txt` | 抓取规则声明 | 放站点根目录，配合 `meta robots` 页面级控制 |
| `sitemap.xml` | 页面清单 | 帮助新页面更快被收录，更新后重新提交 |

### 七、性能即 SEO（Core Web Vitals）

搜索引擎把**用户体验指标**计入排名，三巨头：

| 指标 | 含义 | 达标线 | 前端手段 |
| :--- | :--- | :--- | :--- |
| **LCP** | 首屏最大内容加载时间 | ≤ 2.5s | 首屏图 preload + 优化图片体积 |
| **INP** | 交互响应延迟（2024 取代 FID） | ≤ 200ms | 长任务拆分、减少主线程阻塞 |
| **CLS** | 布局偏移累计 | ≤ 0.1 | 图片/广告预留尺寸、字体 `font-display` |

排查入口：DevTools → Performance / Lighthouse；线上用 PageSpeed Insights 或 CrUX 数据。

### 语法速查

| 需求 | 写法 |
| :--- | :--- |
| 搜索标题/摘要 | `<title>` + `meta description` |
| 社交卡片 | `og:title/description/image` |
| 富摘要 | `application/ld+json` |
| 读屏名称 | `aria-label` / `aria-labelledby` |
| 状态播报 | `role="alert"` / `aria-live` |
| 键盘焦点 | `tabindex="0"` + `role` + `aria-*` |
| 焦点样式 | `:focus-visible` |

### 常见用法

**可访问的「关闭」按钮**：

```html
<button type="button" aria-label="关闭弹窗" class="close-btn">×</button>
```

### 注意事项

- ⚠️ ARIA 是**补充不是替代**：能用原生标签就用原生标签（`<nav>` 优于 `role="navigation"`）。
- ⚠️ 移除 `outline` 而不提供替代焦点样式，键盘用户会「迷路」。
- ⚠️ `tabindex` 只写 `0`（可达）或 `-1`（脚本聚焦），慎用正数破坏自然顺序。
- ⚠️ 对比度不足在弱光/户外场景直接不可读，属无障碍硬伤。
- ⚠️ 单靠颜色区分状态（红=错误、绿=成功），色弱用户无法分辨。

## 相关

- 📖 相邻手册：[HTML 文档结构](/3-reference/1-handbook/html/)、[语义化标签](/3-reference/1-handbook/html/semantic)、[表单与验证](/3-reference/1-handbook/html/forms)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
