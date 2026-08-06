<div align="center">

# Frontend Journey

### 前方的道路并不孤单，一起学习前端吧

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![VitePress](https://img.shields.io/badge/VitePress-1.6-646CFF?style=flat-square&logo=vitepress&logoColor=white) ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![MIT License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

一个正在学习前端的初学者整理的学习笔记，记录从零开始的学习过程。

如果你也在学前端，希望这些笔记能对你有所帮助。欢迎一起交流、一起进步。

</div>

---

## 关于这个仓库

这是一个边学边整理的学习笔记，基于 **VitePress** 构建为静态站点，内容以 Markdown 为唯一数据源，配套 HTML 互动演示文件，实现"内容 + 展示"的有机结合。

| 内容 | 说明 |
| :----- | :----- |
| **学习路线** | 从基础到进阶，一步步整理的学习路径 |
| **笔记体系** | Markdown 笔记 + HTML 互动演示，每章含速查语法 |
| **代码示例** | 每个知识点都有可运行的示例，边学边练 |
| **目录结构** | 以 `docs/` 为唯一数据源，结构清晰可扩展 |

---

## 仓库结构

```
frontend-journey/
├── docs/                       # VitePress 工作目录（唯一数据源）
│   ├── .vitepress/
│   │   ├── config.ts           # 站点配置（导航/侧边栏/主题）
│   │   └── theme/              # 自定义主题（Mindmap / StarMap 组件）
│   ├── 00-preparation/         # 基础准备（3 个章节）
│   ├── 01-html/                # HTML 学习（5 个章节 + 思维导图）
│   ├── 02-css/                 # CSS 核心知识体系（9 个章节 + 思维导图）
│   ├── 03-js/                  # JavaScript 学习（8 个章节 30 个子页 + 思维导图）
│   ├── 3-reference/            # 📚 参考层：手册优先（知识手册 + 场景索引 + 知识星盘导航）
│   ├── public/
│   │   ├── assets/             # 图片等静态资源
│   │   ├── demos/02-css/       # CSS 章节互动演示（9 个 HTML）
│   │   └── examples/01-html/   # HTML 案例文件
│   └── index.md                # 站点首页
├── .github/workflows/deploy.yml # GitHub Actions 部署工作流
├── scripts/gen-mindmap.mjs     # 思维导图数据生成脚本（npm run gen:mindmap）
├── package.json                # 项目依赖（VitePress）
└── README.md                   # 项目说明
```

---

## 快速开始

### 克隆仓库

```bash
git clone https://github.com/readant/frontend-journey.git
cd frontend-journey
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 docs/.vitepress/dist）
npm run build

# 本地预览构建产物
npm run preview
```

### 线上访问

站点通过 GitHub Pages 自动部署：[https://readant.github.io/frontend-journey/](https://readant.github.io/frontend-journey/)

---

## 章节目录

| 模块 | 章节 | 内容 |
| :----- | :----- | :----- |
| **准备阶段** | [环境搭建](https://readant.github.io/frontend-journey/00-preparation/01-environment-setup/) | 编辑器、浏览器、Git、Node.js |
| | [逻辑思维](https://readant.github.io/frontend-journey/00-preparation/02-logic-thinking/) | 逻辑基础、算法入门、编程思维 |
| | [通用工具](https://readant.github.io/frontend-journey/00-preparation/03-common-tools/) | 命令行、开发辅助、效率工具 |
| **HTML** | [文档结构](https://readant.github.io/frontend-journey/01-html/01-document-structure/) | DOCTYPE、head 元数据、加载阻塞、渲染管线 |
| | [语义化标签](https://readant.github.io/frontend-journey/01-html/02-semantic-tags/) | 布局语义、文本语义、列表、表格、文档大纲 |
| | [表单与验证](https://readant.github.io/frontend-journey/01-html/03-forms-validation/) | 表单结构、input 类型、约束验证、label 关联 |
| | [音视频与图片](https://readant.github.io/frontend-journey/01-html/04-media-assets/) | 图片响应式、视频音频、Canvas、SVG、iframe |
| | [SEO 与可访问性](https://readant.github.io/frontend-journey/01-html/05-seo-a11y/) | SEO meta、JSON-LD、ARIA、键盘导航 |
| | [🧠 思维导图](https://readant.github.io/frontend-journey/01-html/mindmap/) | HTML 知识体系全景导图（交互式） |
| **CSS** | [基础语法与机制](https://readant.github.io/frontend-journey/02-css/01-basics/) | 语法结构、引入方式、层叠优先级、继承性、单位 |
| | [选择器](https://readant.github.io/frontend-journey/02-css/02-selectors/) | 基础/组合/属性/伪类/伪元素选择器 |
| | [盒子模型](https://readant.github.io/frontend-journey/02-css/03-box-model/) | 标准/怪异盒模型、外边距合并 |
| | [布局与定位](https://readant.github.io/frontend-journey/02-css/04-layout-positioning/) | 文档流、浮动、定位、Flexbox、Grid |
| | [视觉样式与美化](https://readant.github.io/frontend-journey/02-css/05-visual-styling/) | 文本字体、颜色背景、边框圆角、滤镜 |
| | [变换与动画](https://readant.github.io/frontend-journey/02-css/06-transform-animation/) | 2D/3D 变换、过渡、关键帧动画 |
| | [响应式设计](https://readant.github.io/frontend-journey/02-css/07-responsive/) | 视口、媒体查询、断点策略、容器查询 |
| | [工程化与现代 CSS](https://readant.github.io/frontend-journey/02-css/08-modern-css/) | CSS 变量、预处理器、方法论、性能优化 |
| | [设计模式与实战](https://readant.github.io/frontend-journey/02-css/09-design-patterns/) | 居中方案、圣杯布局、Clearfix、自定义形状 |
| | [🧠 思维导图](https://readant.github.io/frontend-journey/02-css/mindmap/) | CSS 知识体系全景导图（交互式） |
| **JavaScript** | [变量与基础](https://readant.github.io/frontend-journey/03-js/01-foundation/) | 变量声明、数据类型、类型转换、运算符 |
| | [函数与闭包](https://readant.github.io/frontend-journey/03-js/02-functions/) | 函数定义、箭头函数、作用域链、this 绑定 |
| | [对象与原型](https://readant.github.io/frontend-journey/03-js/03-objects/) | 对象创建、原型链、class 语法、深浅拷贝 |
| | [数组与方法](https://readant.github.io/frontend-journey/03-js/04-arrays/) | 增删改查、map/filter/reduce、遍历与迭代 |
| | [异步编程](https://readant.github.io/frontend-journey/03-js/05-async/) | 事件循环、Promise、async/await、fetch 并发 |
| | [DOM 操作与事件](https://readant.github.io/frontend-journey/03-js/06-dom-api/) | 查询遍历、修改节点、事件机制、事件委托 |
| | [ES 模块](https://readant.github.io/frontend-journey/03-js/07-es-modules/) | export/import、模块机制、ESM vs CommonJS |
| | [错误处理与调试](https://readant.github.io/frontend-journey/03-js/08-error-debug/) | 错误基础、错误处理、调试方法论 |
| | [🧠 思维导图](https://readant.github.io/frontend-journey/03-js/mindmap/) | JavaScript 知识体系全景导图（交互式） |

---

## 推荐学习顺序

```
1. 基础准备 → 环境搭建、逻辑思维、常用工具
2. HTML 基础 → 文档结构、标签、语义化
3. HTML 进阶 → 表单验证、多媒体资源、SEO 与无障碍
4. CSS 基础 → 基础语法、选择器、盒模型、布局定位
5. CSS 进阶 → 视觉样式、变换动画、响应式设计
6. CSS 工程化 → 现代 CSS、设计模式与实战
7. JavaScript → 变量、函数、对象、数组、异步、DOM、ES 模块、错误调试
8. 实战项目 → 综合应用、项目部署（待建设）
```

---

## 学习进度

| 模块 | 状态 | 进度 | 最后更新 |
| :----- | :----: | :----: | :--------- |
| 00-preparation | 已完成 | 80% | 2026-07-23 |
| 01-html | 已完成 | 100% | 2026-08-05 |
| 02-css | 已完成 | 100% | 2026-08-05 |
| 03-javascript | 已完成 | 100% | 2026-08-05 |
| 04-projects | 未开始 | 0% | - |
| 05-reviews | 未开始 | 0% | - |

---

## 开发环境

| 工具 | 用途 | 推荐配置 |
| :----- | :----- | :--------- |
| 浏览器 | 开发调试 | Chrome / Edge（开发者工具） |
| 编辑器 | 代码编写 | VS Code + VitePress 插件 |
| 格式化 | 代码规范 | Prettier + EditorConfig |
| 文档框架 | 笔记构建 | VitePress 1.6 |
| 兼容性 | 浏览器支持 | [Can I Use](https://caniuse.com/) |

---

## 学习资源

| 类别 | 资源 | 说明 |
| :----- | :----- | :----- |
| 官方文档 | [MDN Web Docs](https://developer.mozilla.org/zh-CN/) | 最权威的前端文档 |
| 官方文档 | [VitePress](https://vitepress.dev/zh/) | 本站点构建框架 |
| 官方文档 | [W3School](https://www.w3school.com.cn/) | 在线教程和参考手册 |
| 实践平台 | [freeCodeCamp](https://www.freecodecamp.org/) | 交互式编程学习 |
| 实践平台 | [CodePen](https://codepen.io/) | 在线代码编辑器 |
| 社区论坛 | [掘金](https://juejin.cn/) | 技术分享社区 |
| 社区论坛 | [Stack Overflow](https://stackoverflow.com/) | 问答社区 |

---

## 一起学习

一个人学习容易坚持不下去，如果你也在学前端，欢迎：

- 提 Issue 分享你的学习心得或建议
- 提 PR 帮忙改进笔记内容
- 在 Discussion 里交流学习中遇到的问题

一个人走得快，一群人走得远。一起加油！

---

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

<div align="center">

---

学无止境，一起努力。如果觉得有帮助，点个 Star 鼓励一下吧 :)

*Last updated: 2026-08-05*

</div>
