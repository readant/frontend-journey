---
title: 命令行与调试工具速查
---

# 命令行与调试工具速查

## 何时用

- 终端操作文件/目录（Windows 默认 PowerShell）
- 调试前端代码：日志、断点、逐行讲解
- 接口调试与性能分析工具选型

## 核心代码

```bash
# ---- PowerShell 常用命令 ----
Get-ChildItem          # 查看目录（简写 ls）
Set-Location <路径>     # 切换目录（简写 cd）
New-Item -ItemType Directory <名称>   # 新建目录（简写 mkdir）
Remove-Item <路径>      # 删除（简写 del / rm）
Clear-Host             # 清屏（简写 cls）
Get-Content <文件>      # 查看文件内容（简写 cat）

# ---- 调试三板斧 ----
# 1. console.log 打印中间值
# 2. 浏览器 DevTools 断点：Sources 面板 → 点击行号打断点 → 刷新触发
# 3. 橡皮鸭调试法：把代码逐行讲给"橡皮鸭"听，讲着讲着就发现 bug
```

## 前端工具速查

| 类别 | 工具 | 用途 |
| --- | --- | --- |
| 包管理 | npm / pnpm | 安装第三方库 |
| 格式化 | Prettier | 保存时自动格式化（统一代码风格） |
| 检查 | ESLint | 代码规范检查（自动修：`eslint --fix`） |
| 接口测试 | Postman / Apifox | 调试 HTTP 接口 |
| 浏览器扩展 | DevTools、Lighthouse | 调试与性能分析（Lighthouse 出报告） |

## 踩坑记录

- **PowerShell 与 CMD 命令不同**：`dir` 在 PowerShell 也兼容，但 `Get-Content`/`cat` 查看文件才对；别用 Linux 的 `ls -la` 期望格式一致
- **路径含空格必须加引号**：`cd "C:\Program Files\nodejs"`，否则报"不是内部或外部命令"
- **`console.log` 打印对象是"引用"**：展开时看到的可能是最终值（被后续代码改过），要调试中间态用 `console.log(JSON.stringify(obj))` 或直接打断点
- **断点调试优于 console.log**：不用改代码、能看作用域内所有变量；`debugger` 语句可以代码里临时打断点
- **Prettier 与 ESLint 职责分开**：Prettier 管格式（缩进/引号/分号），ESLint 管规范（未使用变量/语法错误），别指望 Prettier 查 bug
- **接口测试先确认方法（GET/POST）和 Content-Type**：POST 传 JSON 要设 `Content-Type: application/json`，否则后端拿不到 body
