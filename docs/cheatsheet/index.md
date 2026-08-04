---
title: 速查手册
---

# 速查手册

集中收录所有模块的核心语法、常用属性和关键概念。每张卡片统一采用 **「何时用 → 核心代码 → 踩坑记录」** 三段式结构，核心代码均完整可运行（保存为 `.html` 即可在浏览器打开）。

## 高频三连

> 复习最高频的 3 个主题，其他按分类查阅。

| 高频主题 | 一句话要点 |
| --- | --- |
| [Flex 布局](/cheatsheet/layout/flex) | 一维布局首选；`flex: 1` 是 grow/shrink/basis 简写；间距用 `gap` |
| [水平垂直居中](/cheatsheet/layout/centering) | 首选 Flex / Grid；绝对定位用 `translate(-50%,-50%)`；`margin:auto` 需已知宽高 |
| [盒模型](/cheatsheet/style/box-model) | 统一 `box-sizing: border-box`；垂直 margin 会合并取最大值 |

## 分类速查

### 布局 layout
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [Flex 布局](/cheatsheet/layout/flex) | 容器/项目属性、弹性伸缩、三栏布局 | 完整 |
| [Grid 布局](/cheatsheet/layout/grid) | 行列控制、区域命名、自适应卡片墙、隐式网格 | 完整 |
| [定位与层级](/cheatsheet/layout/position) | position 五值、z-index、层叠上下文 | 完整 |
| [浮动与清除](/cheatsheet/layout/float) | 图文环绕、clearfix 塌陷修复、BFC 触发与作用 | 完整 |
| [水平垂直居中](/cheatsheet/layout/centering) | 5 种方案对比与选型 | 完整 |

### 样式 style
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [选择器与权重](/cheatsheet/style/selector) | 选择器类型、权重计算、伪类/伪元素 | 完整 |
| [盒模型](/cheatsheet/style/box-model) | 两种盒模型、margin 合并 | 完整 |
| [字体与单位](/cheatsheet/style/typography) | 字体属性、rem/em/vw、可继承属性 | 完整 |
| [背景与视觉美化](/cheatsheet/style/visual) | 背景图、渐变、圆角阴影、滤镜、毛玻璃、文字渐变 | 完整 |
| [响应式设计](/cheatsheet/style/responsive) | 媒体查询、断点策略、容器查询 | 完整 |
| [CSS 工程化](/cheatsheet/style/engineering) | CSS 变量、预处理器、BEM、性能优化 | 完整 |

### 动效 effect
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [过渡 transition](/cheatsheet/effect/transition) | 状态切换平滑过渡 | 完整 |
| [关键帧动画](/cheatsheet/effect/animation) | @keyframes、循环/入场动画、steps() 逐帧 | 完整 |
| [变换 transform](/cheatsheet/effect/transform) | 2D/3D 变换、GPU 性能 | 完整 |

### HTML
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [文档结构](/cheatsheet/html/document) | 骨架模板、meta 家族、加载阻塞 | 完整 |
| [语义化标签](/cheatsheet/html/semantic) | 语义标签表、骨架模板、article vs section | 完整 |
| [表单与交互](/cheatsheet/html/forms) | input 类型、验证属性、radio/label 易错点 | 完整 |
| [多媒体与 Canvas](/cheatsheet/html/media) | video/audio、Canvas 绘制、新交互标签 | 完整 |
| [SEO 与可访问性](/cheatsheet/html/seo-a11y) | meta 三件套、结构化数据、ARIA、键盘导航 | 完整 |

### 工具 tools
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [Git](/cheatsheet/tools/git) | 初始配置、常用命令、分支与提交 | 完整 |
| [npm](/cheatsheet/tools/npm) | 初始化、依赖安装、镜像配置 | 完整 |
| [命令行与调试](/cheatsheet/tools/cli) | PowerShell、DevTools、调试三板斧 | 完整 |

### 数据与 JS data
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [变量与类型](/cheatsheet/data/variable-type) | 声明、typeof 表、强制转换规则 | 完整 |
| [函数与闭包](/cheatsheet/data/function-closure) | 定义方式、闭包模板、this 绑定 | 完整 |
| [对象与原型](/cheatsheet/data/object-prototype) | 对象操作、class、深浅拷贝 | 完整 |
| [数组方法](/cheatsheet/data/array-unique) | map/filter/reduce、去重、类数组 | 完整 |
| [异步与 Promise](/cheatsheet/data/promise) | Promise 静态方法、async/await、fetch | 完整 |
| [ES 模块](/cheatsheet/data/module) | export/import、动态导入、ESM vs CJS | 完整 |
| [错误与调试](/cheatsheet/data/error-debug) | try/catch、console 家族、断点流程 | 完整 |

### DOM
| 卡片 | 内容 | 状态 |
| --- | --- | --- |
| [DOM 操作](/cheatsheet/dom/dom-api) | 查询增删改、事件流、事件委托 | 完整 |

### 预留 snippets
| 目录 | 说明 | 状态 |
| --- | --- | --- |
| [代码片段库](/cheatsheet/snippets/) | 复制即用的完整片段 | 规划中 |

## 使用建议

- **学习时**：先看章节笔记理解原理，再查速查巩固记忆
- **开发时**：直接查速查手册，快速找到需要的语法和属性
- **复习时**：通读"高频三连"检测掌握度，再按分类逐个过
