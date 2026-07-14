# HTML 文档结构详解

> 对应 HTML 文件：`../02-document-structure.html`

## 本案例学习目标

- 理解 HTML 文档的基本骨架
- 掌握 head 区域所有 meta 标签的作用
- 理解 viewport 设置对移动端的重要性
- 知道 link 和 script 标签的正确用法

## 知识点详解

### 1. DOCTYPE 声明

**语法：**
```html
<!DOCTYPE html>
```

**作用：** 告诉浏览器使用 HTML5 标准来解析页面。

**注意事项：**
- HTML5 的 DOCTYPE 非常简洁，只有这一行
- HTML4 需要写很长的 DTD（Document Type Declaration）
- 必须放在第一行，前面不能有任何字符（包括空格和注释）

### 2. html 根元素

**语法：**
```html
<html lang="zh-CN">
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| lang | string | 是 | 文档语言，影响 SEO 和无障碍访问 |
| dir | string | 否 | 文本方向，`ltr`（从左到右）或 `rtl`（从右到左） |

**常见 lang 值：**
- `zh-CN`：简体中文
- `zh-TW`：繁体中文
- `en`：英文
- `ja`：日文

### 3. meta 标签家族

#### 字符编码
```html
<meta charset="UTF-8">
```
- **必须放在 head 的最前面**（在任何其他内容之前）
- UTF-8 支持几乎所有语言的字符
- 不设置或设置错误会导致中文乱码

#### 视口设置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**参数详解：**

| 参数 | 作用 | 说明 |
|------|------|------|
| `width=device-width` | 视口宽度等于设备宽度 | 必须，否则移动端会显示桌面版 |
| `initial-scale=1.0` | 初始缩放比例 | 1.0 = 不缩放 |
| `maximum-scale=1.0` | 最大缩放比例 | 可选，限制用户放大 |
| `user-scalable=no` | 禁止用户缩放 | 可选，影响无障碍，不推荐 |

#### 页面描述
```html
<meta name="description" content="HTML文档结构学习示例">
```
- 搜索引擎结果页（SERP）会显示这段描述
- 建议 150-160 个字符
- 应包含页面核心关键词

#### 爬虫控制
```html
<meta name="robots" content="index,follow">
```

| 值 | 作用 |
|----|------|
| `index` / `noindex` | 是否允许搜索引擎索引此页面 |
| `follow` / `nofollow` | 是否允许搜索引擎跟踪页面上的链接 |

### 4. link 标签

#### 引入 CSS
```html
<link rel="stylesheet" href="style.css">
```

#### 设置 favicon
```html
<link rel="icon" href="favicon.png" type="image/png">
```

**favicon 格式对比：**

| 格式 | 兼容性 | 推荐度 |
|------|--------|--------|
| `.ico` | 所有浏览器 | 兼容最好但文件较大 |
| `.png` | 现代浏览器 | 推荐，平衡兼容性和文件大小 |
| `.svg` | 现代浏览器 | 支持高分辨率，可缩放 |

### 5. script 标签位置

```html
<!-- 不推荐：放在 head 中会阻塞页面渲染 -->
<head>
  <script src="app.js"></script>
</head>

<!-- 推荐：放在 body 底部 -->
<body>
  <!-- 页面内容 -->
  <script src="app.js"></script>
</body>
```

**现代方案：使用 defer 或 async**
```html
<!-- defer：延迟执行，等 HTML 解析完毕后再运行，推荐 -->
<script src="app.js" defer></script>

<!-- async：异步执行，下载完立即运行，不保证顺序 -->
<script src="analytics.js" async></script>
```

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 中文乱码 | 没设置 charset 或设置了错误编码 | 在 head 最前面加 `<meta charset="UTF-8">` |
| 移动端显示桌面版 | 没设置 viewport | 添加 viewport meta 标签 |
| favicon 404 | href 路径错误或文件不存在 | 检查路径，确保文件在正确位置 |
| 页面加载慢 | script 放在 head 且没有 defer/async | 移到 body 底部或加 defer |

## 拓展练习

1. **练习 1**：创建一个完整的 HTML5 文档，包含所有必要的 meta 标签
   - 提示：DOCTYPE、charset、viewport、description、title
2. **练习 2**：尝试删除 charset 声明，用记事本保存为 ANSI 编码，观察乱码现象
   - 理解编码的重要性

## 本案例知识速查表

| 标签/属性 | 作用 | 示例 |
|-----------|------|------|
| `<!DOCTYPE html>` | HTML5 声明 | 放在第一行 |
| `<html lang>` | 根元素+语言 | `lang="zh-CN"` |
| `<meta charset>` | 字符编码 | `charset="UTF-8"` |
| `<meta name="viewport">` | 移动端适配 | `width=device-width, initial-scale=1.0` |
| `<meta name="description">` | SEO 描述 | 150 字符以内 |
| `<meta name="robots">` | 爬虫控制 | `index,follow` |
| `<title>` | 页面标题 | 浏览器标签页显示 |
| `<link rel="icon">` | 网站图标 | 支持 ico/png/svg |
| `<script defer>` | 延迟脚本 | 推荐用法 |
