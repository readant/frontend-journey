---
title: HTML 文档结构速查
---

# HTML 文档结构速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 新建任何 HTML 页面 | `<!DOCTYPE html>` + `<html lang>` + `<head>` + `<body>` 骨架 |
| 声明字符编码（防乱码） | `<meta charset="UTF-8">`（必须放 head 最前） |
| 移动端适配 | `<meta name="viewport">` |
| 设置浏览器标签页标题 | `<title>`（也是最重要 SEO 信号） |
| 引入外部 CSS | `<link rel="stylesheet" href="style.css">`（放 head） |
| 引入外部 JS | `<script src="app.js" defer></script>`（不阻塞解析） |

## 核心代码

完整可运行示例（复制保存为 `.html` 双击打开即可看到效果）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <meta name="description" content="页面描述，用于搜索结果摘要">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="favicon.png" type="image/png">
  <script src="app.js" defer></script>
</head>
<body>
  <header>
    <h1>页面头部</h1>
  </header>
  <main>
    <p>页面主要内容</p>
  </main>
  <footer>页脚</footer>
</body>
</html>
```

## 踩坑记录

- **`<meta charset>` 必须放 head 第一行**：规范要求在前 1024 字节内，否则解码出错中文乱码
- **不写 `<!DOCTYPE html>` 会进入怪异模式**：`width` 盒模型计算规则完全不同，页面表现错乱
- **`<html lang="zh-CN">` 必须写**：影响屏幕阅读器发音、翻译建议、SEO 语言识别
- **无属性 `<script>` 阻塞 HTML 解析**：页面会等 JS 下载执行完才继续渲染；加 `defer`（推荐）或 `async`（独立脚本）解决
- **CSS 必须放 head**：放 body 会先显示无样式内容（FOUC 白屏闪烁）
- **viewport 写法固定**：`width=device-width, initial-scale=1.0`，属性逗号分隔、小写，写错移动端缩放异常
- **`keywords` meta 已无效**：主流搜索引擎忽略，不用写
- **控件没 `name` 不提交**：表单数据以 `name=value` 键值对提交（表单章节细节，但根因在数据模型）
