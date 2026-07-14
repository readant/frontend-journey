# 链接与图片详解

> 对应 HTML 文件：`../05-links-and-images.html`

## 本案例学习目标

- 掌握超链接的所有常用属性
- 理解 target="_blank" 的安全问题
- 掌握图片标签的语义化 alt 写法
- 理解懒加载的使用场景
- 了解响应式图片 picture 标签

## 知识点详解

### 1. 超链接 `<a>` 标签

**语法：**
```html
<a href="URL" target="_blank" rel="noopener noreferrer" title="提示文字">链接文本</a>
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| href | string | 是 | 链接地址（URL 或锚点） |
| target | string | 否 | 打开方式：`_self`（当前窗口）/ `_blank`（新窗口） |
| rel | string | 否 | 链接与当前页面的关系 |
| title | string | 否 | 鼠标悬停提示文字 |
| download | string | 否 | 触发下载，值为下载文件名 |

#### href 的多种写法

```html
<!-- 外部链接 -->
<a href="https://www.baidu.com">百度</a>

<!-- 内部链接 -->
<a href="about.html">关于我们</a>

<!-- 锚点链接 -->
<a href="#section3">跳转到第三章</a>

<!-- 邮件链接 -->
<a href="mailto:test@example.com">发送邮件</a>

<!-- 电话链接 -->
<a href="tel:13800138000">拨打电话</a>
```

#### target="_blank" 的安全问题

**风险：** 新打开的页面可以通过 `window.opener` 访问原页面的 `window` 对象，可能被恶意网站利用。

**解决方案：** 始终加上 `rel="noopener noreferrer"`：
```html
<a href="https://evil.com" target="_blank" rel="noopener noreferrer">链接</a>
```

- `noopener`：新页面无法访问 `window.opener`
- `noreferrer`：不发送 Referer 头（不告诉对方你是从哪来的）

#### download 属性

```html
<a href="/files/report.pdf" download="年度报告.pdf">下载报告</a>
```

- 点击后触发浏览器下载，而非跳转
- `download` 的值是建议的文件名（浏览器可能忽略）
- 对跨域链接可能不生效

### 2. 锚点链接

**原理：** 通过 `id` 属性标记目标位置，用 `#id` 跳转。

```html
<!-- 跳转源 -->
<a href="#section3">跳到第三章</a>

<!-- 目标位置 -->
<section id="section3">
  <h2>第三章</h2>
</section>

<!-- 返回顶部 -->
<a href="#">返回顶部</a>
```

**注意事项：**
- `href="#"` 跳转到页面顶部
- id 必须唯一，不能重复
- 锚点跳转是瞬间完成的，不会触发页面刷新

### 3. 图片 `<img>` 标签

**语法：**
```html
<img src="图片地址" alt="替代文本" width="宽" height="高" loading="lazy">
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | string | 是 | 图片来源地址 |
| alt | string | 是 | 替代文本（无障碍必需） |
| width | number | 否 | 图片宽度（像素） |
| height | number | 否 | 图片高度（像素） |
| loading | string | 否 | 加载策略：`lazy`（懒加载）/ `eager`（立即加载） |

#### alt 文本的正确写法

| 图片类型 | alt 写法 | 示例 |
|----------|----------|------|
| 信息性图片 | 描述图片内容 | `alt="公司Logo"` |
| 装饰性图片 | 空值 `alt=""` | `alt=""` |
| 功能性图片 | 描述功能 | `alt="搜索按钮"` |
| 图片链接 | 描述链接目标 | `alt="点击进入首页"` |

**关键原则：**
- 信息性图片**必须**写描述，否则用户不知道图片内容
- 装饰性图片**必须**写空 alt，否则屏幕阅读器会朗读文件名
- 不能用图片代替文字来做 SEO（搜索引擎能识别）

#### 懒加载（lazy loading）

```html
<!-- 立即加载（默认） -->
<img src="hero.jpg" alt="首屏图片" loading="eager">

<!-- 懒加载：接近视口时才加载 -->
<img src="below-fold.jpg" alt="折叠下方图片" loading="lazy">
```

**使用场景：**
- 首屏可见图片：用 `eager`（默认）
- 折叠下方图片：用 `lazy`
- 长列表中的图片：用 `lazy`

**好处：** 减少初始加载时间，节省用户带宽。

### 4. 响应式图片 `<picture>`

**语法：**
```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="响应式图片">
</picture>
```

**工作原理：**
1. 浏览器从上到下读取 `<source>` 标签
2. 找到第一个 `media` 条件匹配的 `<source>`
3. 加载对应的 `srcset` 图片
4. 如果都不匹配，使用 `<img>` 作为兜底

**与 img srcset 的区别：**
- `<picture>`：根据屏幕尺寸/格式选择**不同图片文件**
- `img srcset`：根据屏幕密度（1x/2x）选择**同一图片的不同分辨率**

## 常见报错与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 图片不显示 | src 路径错误 | 检查相对路径，用 `../` 返回上级目录 |
| 图片加载慢 | 没用懒加载 | 对非首屏图片加 `loading="lazy"` |
| alt 显示在页面上 | 浏览器兼容性极老 | 现代浏览器都支持，无需担心 |
| 点击链接无反应 | href 为空或 `#` | 检查 href 值是否正确 |
| 新窗口被拦截 | 没用 `target="_blank"` | 检查 target 属性 |

## 拓展练习

1. **练习 1**：创建一个图片画廊页面，包含 6 张图片，使用懒加载
   - 提示：第一张用 eager，其余用 lazy
2. **练习 2**：使用 `<picture>` 实现不同屏幕宽度显示不同图片
   - 提示：准备大、中、小三张图片
3. **练习 3**：创建一个带锚点导航的长页面，点击导航跳转到对应章节
   - 提示：每个章节用 id 标记

## 本案例知识速查表

| 标签/属性 | 作用 | 示例 |
|-----------|------|------|
| `<a href>` | 超链接 | `<a href="url">文本</a>` |
| `target="_blank"` | 新窗口打开 | 需配合 rel 使用 |
| `rel="noopener"` | 安全属性 | 防止 window.opener 攻击 |
| `download` | 触发下载 | `download="file.pdf"` |
| `<img src>` | 图片 | `<img src="url" alt="描述">` |
| `loading="lazy"` | 懒加载 | 非首屏图片必用 |
| `alt=""` | 装饰性图片 | 空值，屏幕阅读器跳过 |
| `<picture>` | 响应式图片 | 根据条件加载不同图片 |
| `<source media>` | 媒体条件 | `(min-width: 800px)` |
