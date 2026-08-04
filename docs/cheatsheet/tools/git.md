---
title: Git 速查
---

# Git 速查

## 何时用

- 首次使用：初始化全局配置（用户名/邮箱/默认分支）
- 版本管理：提交、撤销、查看历史
- 协作：分支、合并、推送拉取

## 核心代码

```bash
# ---- 首次配置（只需一次） ----
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global init.defaultBranch main

# ---- 常用命令 ----
git init                          # 初始化仓库
git status                        # 查看工作区状态（改动/暂存）
git add <file>                    # 暂存文件（. 表示全部）
git commit -m "提交说明"           # 提交
git log --oneline                 # 查看提交历史（一行一个）
git diff                          # 查看未暂存的改动

# ---- 分支 ----
git branch                        # 查看分支
git branch <name>                 # 新建分支
git checkout <name>               # 切换分支
git checkout -b <name>            # 新建并切换
git merge <name>                  # 合并分支到当前分支

# ---- 远程 ----
git remote add origin <url>       # 关联远程仓库
git push -u origin main           # 首次推送并建立跟踪
git pull                          # 拉取远程更新
```

## 踩坑记录

- **忘记配置用户名/邮箱就提交**：commit 会失败或提交者信息错误，先执行 `git config --global` 两条配置
- **`git add .` 会把敏感文件一起提交**（.env、node_modules）：先写 `.gitignore`，再 `git status` 确认后再 add
- **`git commit` 没写 `-m` 会打开编辑器**（Vim），新手容易卡住：**先按 `i` 输入，再按 `Esc` 后输入 `:wq` 回车保存退出**；习惯性用 `git commit -m "..."` 更省事
- **提交信息用祈使句、一句话说清"为什么"**：如 `fix: 修复登录页在 iOS 上溢出`，别写 "update"
- **`git pull` 前先 `git status` 确认工作区干净**，有未提交改动会冲突或覆盖；冲突时别慌，看冲突标记 `<<<<<<<` / `=======` / `>>>>>>>`
- **不要往 main 分支直接开发**：功能都放 feature 分支，合并后再删；`git push --force` 会覆盖远程历史，除非明确需要否则别用
