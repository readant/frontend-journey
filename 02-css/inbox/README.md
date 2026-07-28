# CSS 核心知识体系

> 系统化、可扩展的 CSS 学习笔记 · 9 大章节 · 50+ 知识点 · 速查语法

## 📁 目录结构

```
inbox/
├── README.md                  ← 本文件（全局导航）
├── build.js                   ← MD → HTML 构建脚本
├── package.json               ← 项目配置
├── assets/                    ← 共享资源
│   ├── css/theme.css         ← 主题样式
│   ├── js/main.js            ← 交互脚本
│   └── images/               ← 图片资源
│
├── 01-基础语法与机制/
│   ├── README.md             ← 章节主笔记（含速查语法）
│   └── assets/               ← 本章资源
├── 02-选择器/
│   └── README.md
├── 03-盒子模型/
│   └── README.md
├── 04-布局与定位/
│   └── README.md
├── 05-视觉样式与美化/
│   └── README.md
├── 06-变换与动画/
│   └── README.md
├── 07-响应式设计/
│   └── README.md
├── 08-工程化与现代CSS/
│   └── README.md
└── 09-设计模式与实战/
    └── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18
- npm

### 安装依赖 & 构建

```bash
# 进入目录
cd 02-css/inbox

# 安装依赖
npm install

# 构建 HTML 展示页
npm run build

# 构建后本地预览
npm run serve
```

构建完成后，`dist/` 目录会生成完整的 HTML 展示系统，可直接用浏览器打开 `dist/index.html` 查看。

## 📚 章节导航

| # | 章节 | 核心内容 |
|---|------|---------|
| 01 | [基础语法与机制](./01-基础语法与机制/README.md) | 语法结构、引入方式、层叠优先级、继承性、单位体系 |
| 02 | [选择器](./02-选择器/README.md) | 基础/组合/属性/伪类/伪元素选择器 |
| 03 | [盒子模型](./03-盒子模型/README.md) | 标准/怪异盒模型、margin/padding/border、外边距合并 |
| 04 | [布局与定位](./04-布局与定位/README.md) | 文档流、浮动、定位、Flexbox、Grid |
| 05 | [视觉样式与美化](./05-视觉样式与美化/README.md) | 文本字体、颜色背景、边框圆角、滤镜混合模式 |
| 06 | [变换与动画](./06-变换与动画/README.md) | 2D/3D 变换、过渡、关键帧动画 |
| 07 | [响应式设计](./07-响应式设计/README.md) | 视口、媒体查询、断点策略、容器查询 |
| 08 | [工程化与现代CSS](./08-工程化与现代CSS/README.md) | CSS 变量、预处理器、方法论、性能优化 |
| 09 | [设计模式与实战](./09-设计模式与实战/README.md) | 居中方案、圣杯布局、Clearfix、自定义形状 |

## 📝 笔记写作规范

### 文件组织
- 每个章节 = 一个独立文件夹
- 章节主笔记 = `README.md`
- 章节资源 = `assets/` 子目录

### 命名约定
- 章节文件夹：`{序号}-{主题名}`（如 `01-基础语法与机制`）
- 资源文件：`{描述}_{类型}.{后缀}`（如 `diagram_box-model.svg`、`demo_flex-center.html`）
- 图片：`png` / `jpg` / `svg`（推荐 SVG 可缩放图形）

### Markdown 规范
- 使用 `# 章节标题` 作为一级标题
- 使用 `## 小节` 作为二级标题
- 使用 `### 知识点` 作为三级标题
- 代码块标注语言：```css / ```html / ```js
- 表格用于对比展示
- `> [!tip]` / `> [!warning]` 用于提示
- 每章末尾追加 `## 速查语法` 小节

### 速查语法格式
每章末尾必须包含速查语法小节，结构为：

```markdown
---

## 速查语法

### {主题}
- 核心语法点 1
- 核心语法点 2

### {对比表格}
| 类型 | 语法 | 说明 |
|-----|------|------|
| ... | ... | ... |
```

## 🔄 MD 与 HTML 协同

```
编辑层 (Markdown)          构建层 (Node.js)           展示层 (HTML)
─────────────────          ─────────────────           ─────────────
01-xxx/README.md ──────────→ build.js ──────────→ dist/01-xxx/index.html
02-xxx/README.md ──────────→   (marked库)  ─────→ dist/02-xxx/index.html
...                                              dist/index.html (首页)
```

**工作流：**
1. 编辑对应章节的 `README.md`
2. 运行 `npm run build` 重新生成 HTML
3. 刷新浏览器查看更新
4. Markdown 为唯一数据源，HTML 为构建产物

## 🎨 自定义主题

编辑 `assets/css/theme.css` 中的 CSS 变量：

```css
:root {
  --primary: #2563eb;        /* 主色调 */
  --bg: #ffffff;              /* 背景色 */
  --text: #1f2937;            /* 文字颜色 */
  --radius: 8px;             /* 圆角大小 */
  --sidebar-width: 280px;    /* 侧边栏宽度 */
}
```

## 📱 响应式设计

- 桌面端：左侧固定侧边栏 + 右侧内容区 + 右侧目录
- 平板端：隐藏右侧目录
- 移动端：侧边栏抽屉式展开 + 顶部菜单按钮

## 🛠️ 技术栈

- **构建**: Node.js + [marked](https://marked.js.org/) (MD→HTML)
- **样式**: 原生 CSS 变量 + Flexbox/Grid
- **交互**: 原生 JavaScript（无框架依赖）
- **兼容**: 所有现代浏览器（Chrome/Firefox/Safari/Edge）

## 📖 使用指南

### 添加新章节
1. 创建文件夹：`mkdir 10-新章节`
2. 创建主笔记：`10-新章节/README.md`
3. 追加速查语法小节
4. 更新 `build.js` 中的 `CHAPTERS` 数组
5. 更新本 README.md 的章节导航表
6. 运行 `npm run build` 验证

### 添加新资源
1. 将资源放入对应章节的 `assets/` 目录
2. 在 README.md 中使用相对路径引用：`![描述](assets/image.png)`
3. 引用时始终使用相对路径，构建脚本会自动处理

### 本地预览
```bash
# 方式一：使用 serve 包
npx serve dist/ -l 3000

# 方式二：使用 Python
python -m http.server 3000 --directory dist

# 方式三：直接打开
双击 dist/index.html
```

## 📄 许可证

MIT License