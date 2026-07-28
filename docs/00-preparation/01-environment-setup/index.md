# 开发环境搭建

本目录记录了前端开发环境的配置和工具使用指南。

## 目录结构

```
01-environment-setup/
├── 01-code-editors/          # 主流编辑器配置
├── 02-browsers/             # 浏览器与开发者工具
├── 03-version-control/      # Git 与代码托管
├── 04-package-managers/     # Node.js 与包管理
├── 05-build-tools/          # 构建工具
├── 06-terminals/            # 终端工具
└── 07-shortcuts/            # 快捷键速查
```

## 学习目标

- 掌握常用代码编辑器的配置和使用
- 熟练使用浏览器开发者工具进行调试
- 掌握 Git 版本控制与 GitHub 协作
- 熟悉 npm/yarn/pnpm 包管理器
- 了解主流构建工具的基本使用

## 学习顺序

1. **第一步**：安装代码编辑器（推荐 VS Code）
2. **第二步**：安装浏览器（推荐 Chrome）并熟悉开发者工具
3. **第三步**：安装 Git 并配置 GitHub
4. **第四步**：安装 Node.js 和包管理器
5. **第五步**：了解构建工具（Webpack/Vite）

## 速查语法

### 必装清单

| 工具 | 下载地址 | 验证命令 |
|------|---------|---------|
| VS Code | code.visualstudio.com | `code -v` |
| Chrome | google.com/chrome | 访问 chrome://version |
| Git | git-scm.com | `git --version` |
| Node.js LTS | nodejs.org | `node -v` / `npm -v` |

### Git 初始配置

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global init.defaultBranch main
```

### npm 国内镜像

```bash
npm config set registry https://registry.npmmirror.com
```

### 常用命令

| 操作 | 命令 |
|------|------|
| 初始化项目 | `npm init -y` |
| 安装依赖 | `npm install <pkg>` |
| 安装开发依赖 | `npm install -D <pkg>` |
| 运行脚本 | `npm run <script>` |
