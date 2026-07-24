# 模块 5：实战项目

通过两个完整项目（个人简历 + 简易博客）将前四个模块的知识融会贯通，建立实际开发思维。

## 学习路线

1. **个人简历** → `01-personal-resume.html`
   - 综合运用语义标签 + 表格 + 表单 + CSS，制作一份完整简历
2. **简易博客** → `02-simple-blog.html`
   - 综合运用布局 + 语义 + 导航 + 侧边栏，制作博客首页

## 知识点大纲

### 项目 1：个人简历

**综合运用的知识点：**

| 模块 | 用到的知识 | 文件中的体现 |
|------|-----------|-------------|
| 语义标签 | header、section、article、footer | 简历各区域用语义标签分隔 |
| 表格 | table、thead、tbody、th、td | 教育背景用表格展示 |
| 文本标签 | h1-h2、p、strong、ul | 标题层级 + 内容排版 |
| 图片 | 无（预留头像位置） | 可扩展添加个人照片 |
| CSS | 布局、flex、卡片阴影、响应式 | 居中布局 + 卡片样式 |

**设计思路：**
1. 页面用居中卡片布局（max-width + margin auto）
2. 用语义标签划分：头部（个人信息）、各 section（经历/技能/项目）
3. 技能用 flex + tag 样式展示，比列表更现代
4. 教育背景用表格，结构化呈现

### 项目 2：简易博客

**综合运用的知识点：**

| 模块 | 用到的知识 | 文件中的体现 |
|------|-----------|-------------|
| 语义标签 | header、nav、main、article、aside、footer | 完整页面结构 |
| 列表 | ul + li | 导航链接、分类列表、评论列表 |
| 链接 | a + href | 导航跳转、文章链接、友情链接 |
| 表格 | 无 | - |
| CSS | flex 布局、渐变、卡片、阴影 | 主内容 + 侧边栏双栏布局 |

**设计思路：**
1. 顶部 header + nav 导航栏
2. 主体用 flex 双栏：main（文章列表）+ aside（侧边栏）
3. 每篇文章用 article 包裹，含标题、元信息、摘要、阅读全文链接
4. 侧边栏用 widget 分块：分类、评论、友链

## 重难点总结

| 难点 | 说明 | 对应案例 |
|------|------|----------|
| 语义标签选择困难 | 不确定用 section 还是 article 时：能独立分发的用 article，只是分区的用 section | 两个项目 |
| CSS 与 HTML 配合 | 语义标签本身无样式，需要 CSS 定义视觉效果 | 两个项目 |
| 响应式适配 | 简历用 max-width 居中，博客用 flex 自适应，都是基础响应式方案 | 两个项目 |
| 可扩展性设计 | 简历预留头像位置，博客预留更多文章，考虑后续添加内容的便利性 | 两个项目 |

## 案例索引

| 案例文件 | 配套文档 | 说明 |
|----------|----------|------|
| `01-personal-resume.html` | `01-personal-resume.md` | 个人简历完整项目 |
| `02-simple-blog.html` | `02-simple-blog.md` | 简易博客首页完整项目 |

## 参考资源

- [MDN - CSS 布局](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout)
- [MDN - Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout)
- [Google - 简历设计指南](https://developers.google.com/tech-writing)

## 在线演示

查看本模块的 HTML 案例文件：[案例演示](/frontend-journey/examples/01-html/05-projects/)
