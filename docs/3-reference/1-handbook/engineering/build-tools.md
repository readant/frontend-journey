---
title: 构建工具完整手册
---

# 构建工具

## 核心概念

构建工具把「开发者友好」的源码变成「浏览器友好」的产物：**开发阶段**提供本地服务器与热更新，**生产阶段**负责打包、压缩、分割。主流代表：Vite（新生代）与 webpack（经典）——**原理相通，姿势不同**。

## 完整内容

### 是什么 / 为什么

现代前端源码不再是一个 HTML 拖一堆文件：有模块化、有框架语法、有预处理器、有静态资源优化。构建工具在中间当「翻译 + 优化器」：开发时让你秒级看到效果，上线时吐出小而稳的产物。

### 一、开发服务器与热更新

```bash
# Vite 示例：一行命令启动开发服务器
npm run dev   # 内部执行 vite
```

| 能力 | 作用 |
| :--- | :--- |
| 开发服务器 | 本地起一个服务，源码改完刷新即见 |
| 模块热替换（HMR） | **只更新改动的那一块**，不整页刷新，状态不丢 |
| 依赖预构建 | 把大型依赖提前编译缓存，冷启动更快 |
| 源码编译 | TS → JS、SCSS → CSS、SFC → JS 的即时转换 |

### 二、生产构建产物

```bash
npm run build  # 内部执行 vite build，输出到 dist/
```

构建产出物核心组成：

| 产物 | 说明 |
| :--- | :--- |
| `index.html` | 入口 HTML，引用打包后的资源 |
| `assets/*.js` | 合并压缩后的 JS 文件 |
| `assets/*.css` | 合并压缩后的样式文件 |
| 静态资源 | 图片、字体等按引用拷贝并可能哈希命名 |

| 优化手段 | 作用 |
| :--- | :--- |
| 代码压缩（minify） | 去注释、缩短变量名，体积骤减 |
| Tree Shaking | 只打包**被用到**的导出，摇掉没用到的代码 |
| 代码分割 | 按路由/依赖拆成多块，按需加载 |
| 资源哈希 | 文件名带内容哈希，内容变了文件名就变，破除缓存 |
| 预渲染/SSG | 提前生成静态 HTML，首屏更快、利于 SEO |

### 三、环境变量

开发与生产需要不同配置（接口地址、开关位），通过环境变量注入：

```bash
# .env 文件按环境区分
VITE_API_BASE=https://api.example.com
```

```js
// 源码中读取（Vite 约定 VITE_ 前缀才会暴露给前端）
const base = import.meta.env.VITE_API_BASE;
```

| 变量 | 含义（Vite 中） |
| :--- | :--- |
| `import.meta.env.MODE` | 当前环境（development / production） |
| `import.meta.env.BASE_URL` | 部署的基础路径（GitHub Pages 部署时很关键） |
| `import.meta.env.DEV` | 是否开发环境 |
| `import.meta.env.PROD` | 是否生产环境 |

### 四、Vite vs webpack 选型

| 维度 | Vite | webpack |
| :--- | :--- | :--- |
| 定位 | 新生代、极速体验 | 经典、生态庞大 |
| 开发原理 | 原生 ESM 按需编译 | 全部打包后再启动 |
| 冷启动 | 秒级 | 慢（依赖越多越慢） |
| 配置 | 开箱即用、零配置起步 | 配置项多、灵活可控 |
| 适用 | 新项目、Vue/React 脚手架 | 老项目、复杂定制场景 |

**结论**：新项目默认 Vite；接手老项目才需要掌握 webpack 配置。

### 语法速查

| 需求 | 做法 |
| :--- | :--- |
| 本地开发 | `npm run dev`（热更新） |
| 生产构建 | `npm run build`（产物在 dist） |
| 本地预览产物 | `npm run preview` |
| 区分环境 | 根目录 `.env` / `.env.production` |
| 读取变量 | `import.meta.env.VITE_XXX` |
| 适配部署路径 | 构建配置里设置 `base` |

### 常见用法

**GitHub Pages 静态部署的最小链路**：

```text
源码 → npm run build（生成 dist）→ 把 dist 发布到 Pages → 线上可访问
```

部署子路径时（如 `https://user.github.io/repo/`），构建配置的 `base` 要设置为 `/repo/`，否则资源路径全错。

### 注意事项

- ⚠️ 构建产物目录（dist）通常被 `.gitignore` 忽略，不提交进版本库。
- ⚠️ 改完源码必须重新构建，旧产物不会自动更新（本地预览同理）。
- ⚠️ 环境变量带 `VITE_` 前缀才会暴露给前端，其余仅供构建期使用。
- ⚠️ 部署到子路径时 `base` 配置与 `import.meta.env.BASE_URL` 必须匹配。
- ⚠️ 新构建后若本地预览还是旧内容，先重启预览服务并清缓存。

## 相关

- 📖 相邻手册：[Git 版本控制](/3-reference/1-handbook/engineering/git)、[npm 包管理](/3-reference/1-handbook/engineering/npm)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
