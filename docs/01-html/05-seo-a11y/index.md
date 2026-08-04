---
title: 05. SEO 与可访问性
---

# SEO 与可访问性

## 它是什么

本章是 HTML 的"机器与人"两个维度的收尾：

- **SEO（Search Engine Optimization）**：让**搜索引擎**能正确理解、抓取、索引你的页面
- **A11y（Accessibility，可访问性）**：让**所有用户**——包括视障、听障、运动障碍等残障人群——都能使用你的页面

两者都建立在同一个基础之上：**语义化 HTML**。语义标签是 SEO 与可访问性的共同地基（上一章已讲），本章讨论地基之上的专门技术。

> 一个经常被忽略的事实：**SEO 与可访问性高度同向**——搜索引擎爬虫和屏幕阅读器都无法"看"页面，都依赖机器可读的文本与结构。优化一个往往同时优化另一个。

## 核心机制

### 1. 爬虫如何工作

搜索引擎工作流（以 Google 为例）：

```
抓取(Crawl) → 渲染(Render) → 索引(Index) → 排名(Rank)
```

1. **抓取**：爬虫沿链接发现页面，按 `robots.txt` 与 meta robots 决定是否进入
2. **渲染**：现代爬虫会执行 JS 再渲染页面（但成本高、有时延，SSR/静态页更占优）
3. **索引**：分析内容与结构化数据，存入索引库
4. **排名**：按相关性、权威性、体验（Core Web Vitals）等排序

对 HTML 学习层，重点在 1~2 步：**确保可抓取、可渲染**。

### 2. 屏幕阅读器如何工作

屏幕阅读器（NVDA / VoiceOver / TalkBack）解析 DOM 后，按**语义结构**向用户播报：

- 朗读文本内容
- 通过 **landmark（header/nav/main/aside/footer）** 快速跳转
- 通过 **heading 大纲** 跳转章节
- 通过 **label/alt** 描述控件与图片
- 通过 **ARIA** 理解自定义组件（如"菜单已展开"）

### 3. ARIA 的定位

ARIA（Accessible Rich Internet Applications）是给**无法用原生语义表达的复杂组件**（手风琴、标签页、弹窗、自定义开关）补充语义的规范：

```
role（角色）         aria-*（属性/状态）
<div role="tablist">  aria-expanded="true"
```

::: warning ARIA 铁律
**一不要、二必要**：尽可能用原生 HTML 元素（能原生就不 ARIA）；只有在"原生元素无法表达"时才加 ARIA。ARIA 改的是辅助技术读到的"语义"，不改任何视觉表现。
:::

## 标准语法

### SEO：head 中的关键 meta

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO 基础三件套 -->
  <title>前端学习笔记 | Frontend Journey</title>
  <meta name="description" content="从零开始的前端学习旅程：HTML、CSS、JavaScript 系统化笔记。">

  <!-- 社交分享（Open Graph） -->
  <meta property="og:title" content="Frontend Journey">
  <meta property="og:description" content="前端学习笔记">
  <meta property="og:image" content="https://example.com/cover.png">

  <!-- 规范链接：声明本页唯一权威地址（防重复内容） -->
  <link rel="canonical" href="https://example.com/">

  <!-- 控制爬虫 -->
  <meta name="robots" content="index, follow">
</head>
```

| meta | 作用 | 关键点 |
| --- | --- | --- |
| `<title>` | 页面标题 | SEO 最重要信号，唯一 + 准确 + 含关键词 |
| `description` | 搜索结果摘要 | 建议 50~160 字符，写清楚"这页是什么" |
| `og:*` | 社交分享卡片 | 微信/微博/社交平台抓取用 |
| `canonical` | 规范链接 | 同一内容多 URL 时指定权威版 |
| `robots` | 抓取指令 | `index/follow`（默认）/ `noindex`（禁止收录） |

### SEO：结构化数据（JSON-LD）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "HTML SEO 与可访问性",
  "datePublished": "2026-08-04",
  "author": { "@type": "Person", "name": "作者名" }
}
</script>
```

结构化数据让爬虫把内容**理解成实体**（文章、商品、教程），有机会获得**富媒体搜索结果**（评分星星、面包屑等）。

### 可访问性：图片与文本

```html
<!-- 信息性图片：必须 alt 描述 -->
<img src="chart.png" alt="2026 年 8 月各品类销量柱状图">

<!-- 装饰性图片：alt 留空（读屏跳过） -->
<img src="divider.png" alt="">

<!-- 图标按钮：用 aria-label 说明 -->
<button aria-label="关闭"><span class="icon-x"></span></button>
```

::: warning alt 的两大误区
- 信息图不写 alt（或写"图片"）→ 读屏用户完全丢失信息
- 装饰图写长描述 → 读屏用户被无意义内容打断
- 判断标准：**删掉这张图，用户会失去信息吗？** 会 → 写描述；不会 → `alt=""`
:::

### 可访问性：表单关联

```html
<!-- label 必填（for + id） -->
<label for="email">邮箱</label>
<input type="email" id="email" required>

<!-- 输入错误提示：用 aria-describedby 关联 -->
<input id="pwd" type="password" aria-describedby="pwd-hint">
<p id="pwd-hint">至少 6 位，含字母和数字</p>

<!-- 出错时通知读屏：aria-invalid + aria-live -->
<input id="user" aria-invalid="true">
```

### 可访问性：键盘导航

```html
<!-- 1. 跳转链接：键盘用户跳过导航直达内容 -->
<a class="skip-link" href="#main">跳到主要内容</a>
<main id="main">...</main>

<!-- 2. tabindex：慎用，仅需要时 -->
<div tabindex="0">可聚焦的非交互元素</div>
```

| tabindex 值 | 含义 |
| --- | --- |
| `0` | 加入 Tab 顺序（自然顺序） |
| `-1` | 可通过 JS 聚焦，但不进 Tab 顺序 |
| `>0` | **不推荐**，会打乱自然 Tab 顺序 |

### 语言与焦点

```html
<!-- 根元素声明语言：读屏发音 + 翻译建议 -->
<html lang="zh-CN">

<!-- 动态内容（如保存成功提示）播报给读屏 -->
<div aria-live="polite">保存成功</div>
```

## 深入理解

### 1. ARIA 的三种角色

| 类型 | 例子 | 作用 |
| --- | --- | --- |
| **结构角色** | `role="navigation"` `role="tablist"` | 描述容器结构 |
| **控件角色** | `role="button"` `role="switch"` | 描述可交互控件 |
| **属性/状态** | `aria-expanded` `aria-hidden` `aria-current` | 描述状态 |

```html
<!-- 典型场景：折叠面板 -->
<button aria-expanded="false" aria-controls="panel">展开详情</button>
<div id="panel" hidden>详情内容</div>
```

### 2. 语义优先于 ARIA（何时可以省掉 ARIA）

能原生解决的问题，ARIA 是多余的，甚至有害（读屏可能重复播报）：

| 需求 | 原生方案（优先） | ARIA 方案（除非万不得已） |
| --- | --- | --- |
| 导航 | `<nav>` | `role="navigation"` |
| 按钮 | `<button>` | `role="button"` + 手写键盘事件 |
| 标题 | `<h1>`~`<h6>` | `role="heading" aria-level="2"` |
| 主内容 | `<main>` | `role="main"` |
| 警告 | `<strong>` / `<em>` | `role="strong"` |

::: danger ARIA 的隐藏风险
ARIA 只改"读屏语义"，**不改键盘行为**。比如 `div role="button"` 不会自动支持 Enter/Space 触发——手写 ARIA 的组件必须同时手写键盘事件，否则比不用还糟。
:::

### 3. SEO 与 A11y 的共同清单

一份同时服务两个目标的检查表：

| 检查项 | 服务 SEO | 服务 A11y |
| --- | --- | --- |
| 语义化标签（header/nav/main/article） | ✅ 结构识别 | ✅ landmark 导航 |
| 正确 heading 层级 | ✅ 主题理解 | ✅ 大纲跳转 |
| `alt` 文本 | ✅ 图片被索引 | ✅ 图片可读 |
| `lang` 属性 | ✅ 语言识别 | ✅ 发音正确 |
| 可抓取的文本内容 | ✅ 索引基础 | ✅ 读屏基础 |
| 移动端可用（可点击区域够大） | ✅ 移动排名 | ✅ 触控障碍用户 |
| 加载性能（CLS/LCP） | ✅ Core Web Vitals | ✅ 低性能设备可用 |

### 4. 常见误区

- ❌ 关键字堆砌（keywords meta / 隐形文字）→ 搜索引擎惩罚
- ❌ `alt` 写成 "图片" 或塞关键词 → 读屏噪声 + 谷歌视为垃圾文本
- ❌ 到处加 `tabindex="1"` 手动控制顺序 → 键盘顺序错乱
- ❌ 用 `div` 模拟按钮 → 丢失 Enter/Space 触发，键盘用户无法操作
- ❌ 只看视觉测试，不看读屏/键盘测试 → 无障碍问题只能在读屏里发现

### 5. 快速自测方法

- **键盘测试**：只靠 Tab + Enter/Space 走完整个页面流程
- **读屏测试**：用 NVDA/VoiceOver 浏览一遍，听"读出来的东西"是否完整
- **对比度测试**：文本与背景对比度 ≥ 4.5:1（大字号可 3:1）
- **SEO 测试**：Google 搜索结果里 `<title>` 与 `description` 是否正确展示

## 关联速查

::: tip 速查卡片
SEO 与可访问性的核心属性速查，见 [HTML SEO 与可访问性速查](/cheatsheet/html/seo-a11y)。
:::

::: info 延伸阅读
语义化是 SEO 与 A11y 的共同地基，可回看 [语义化标签](/01-html/02-semantic-tags/) 一章。
:::
