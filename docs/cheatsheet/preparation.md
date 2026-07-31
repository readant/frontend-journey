---
title: 准备阶段速查
---

# 准备阶段速查

## 环境搭建

### 必装清单

| 工具 | 下载地址 | 验证命令 |
| ------ | --------- | --------- |
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
| ------ | ------ |
| 初始化项目 | `npm init -y` |
| 安装依赖 | `npm install <pkg>` |
| 安装开发依赖 | `npm install -D <pkg>` |
| 运行脚本 | `npm run <script>` |

## 逻辑思维

### 逻辑运算对照

| 运算 | JS 运算符 | 要点 |
| ------ | ---------- | ------ |
| 与 AND | `&&` | 全真才真 |
| 或 OR | `\|\|` | 一真即真 |
| 非 NOT | `!` | 真假互换 |
| 异或 XOR | `^` | 相同为假，不同为真 |

### 复杂度速记

| 复杂度 | 名称 | 典型算法 |
| ------- | ------ | --------- |
| O(1) | 常数 | 数组取下标 |
| O(log n) | 对数 | 二分查找 |
| O(n) | 线性 | 单层循环 |
| O(n log n) | 线性对数 | 快排、归并 |
| O(n²) | 平方 | 冒泡、选择 |

### 调试三板斧

1. `console.log` 打印中间值
2. 浏览器 DevTools 断点（Sources 面板）
3. 橡皮鸭调试法：逐行讲解代码逻辑

## 常用工具

### 常用命令行（PowerShell）

| 操作 | 命令 | 简写 |
| ------ | ------ | ------ |
| 查看目录 | `Get-ChildItem` | `ls` |
| 切换目录 | `Set-Location` | `cd` |
| 新建目录 | `New-Item -ItemType Directory` | `mkdir` |
| 删除 | `Remove-Item` | `del` |
| 清屏 | `Clear-Host` | `cls` |
| 查看文件 | `Get-Content` | `cat` |

### 前端工具速查

| 类别 | 工具 | 用途 |
| ------ | ------ | ------ |
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
