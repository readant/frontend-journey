# 通用工具

本目录整理了开发过程中常用的辅助工具和效率工具。

## 目录结构

```
03-common-tools/
├── 01-cli-tools/        # 命令行工具
├── 02-dev-helpers/      # 开发辅助工具
└── 03-productivity/     # 效率工具
```

## 学习目标

### 命令行工具

- 掌握常用命令行操作
- 学习 Shell 脚本编写
- 了解自动化脚本

### 开发辅助

- 代码格式化工具
- 代码审查工具
- 性能分析工具

### 效率工具

- 文本处理工具
- 文件管理工具
- 时间管理工具

## 常用工具清单

| 类别 | 工具 | 用途 |
| :--- | :--- | :--- |
| 命令行 | git | 版本控制 |
| 命令行 | npm/yarn/pnpm | 包管理 |
| 格式化 | Prettier | 代码格式化 |
| 检查 | ESLint | 代码规范检查 |
| 搜索 | fzf | 模糊搜索 |
| 搜索 | ripgrep | 快速全文搜索 |

## 速查语法

### 常用命令行（PowerShell）

| 操作 | 命令 | 简写 |
|------|------|------|
| 查看目录 | `Get-ChildItem` | `ls` |
| 切换目录 | `Set-Location` | `cd` |
| 新建目录 | `New-Item -ItemType Directory` | `mkdir` |
| 删除 | `Remove-Item` | `del` |
| 清屏 | `Clear-Host` | `cls` |
| 查看文件 | `Get-Content` | `cat` |

### 前端工具速查

| 类别 | 工具 | 用途 |
|------|------|------|
| 包管理 | npm / pnpm | 安装第三方库 |
| 格式化 | Prettier | 保存时自动格式化 |
| 检查 | ESLint | 代码规范检查 |
| 接口测试 | Postman / Apifox | 调试 HTTP 接口 |
| 浏览器扩展 | DevTools、Lighthouse | 调试与性能分析 |

### npm 常用命令

```bash
npm install          # 安装项目依赖
npm install <pkg>    # 添加依赖
npm install -D <pkg> # 添加开发依赖
npm run dev          # 运行 dev 脚本
```
