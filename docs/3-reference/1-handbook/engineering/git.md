---
title: Git 版本控制完整手册
---

# Git 版本控制

## 核心概念

Git 是**快照式**的分布式版本控制：每一次提交都保存一份完整快照。日常高频操作绕不开四块：**本地提交流转、分支合并、历史回滚、远程协作**。

## 完整内容

### 是什么 / 为什么

没有版本控制，改坏一个文件就再也找不回来；多人协作更是灾难。Git 把「每次改动」变成可追溯的节点，随时可以回退、对比、分支并行。

### 一、三个区域与状态流转

```
工作区 ── git add ──▶ 暂存区 ── git commit ──▶ 本地仓库 ── git push ──▶ 远程仓库
   ▲                    │                          │
   └────── git restore <file> ────┘                └── git pull / fetch ◀──┘
```

| 区域 | 作用 |
| :--- | :--- |
| 工作区 | 你正在编辑的文件 |
| 暂存区（index） | 已 `add`、待提交的改动 |
| 本地仓库 | 已提交的历史快照 |
| 远程仓库 | 团队共享的远端副本 |

### 二、本地高频命令

```bash
# 初始化 / 克隆
git init
git clone <仓库地址>

# 查看状态 / 差异
git status                  # 哪个文件改了什么状态
git diff                    # 工作区 vs 暂存区的差异
git diff --staged           # 暂存区 vs 上次提交的差异

# 提交
git add <file>              # 精确暂存文件（避免误提交）
git add -A                  # 暂存全部改动
git commit -m "feat: 新增登录页"   # 提交，消息说明「为什么」改

# 回退工作区（丢弃未暂存改动）
git restore <file>
# 取消暂存（保留改动）
git restore --staged <file>
```

### 三、分支与合并

分支是「可并行的工作线」，合并是「把两条线接起来」。

```bash
git branch                # 列出分支（* 为当前分支）
git branch <name>         # 新建分支
git switch <name>         # 切换分支
git switch -c <name>      # 新建并切换
git merge <branch>        # 把指定分支合入当前分支
git branch -d <name>      # 删除已合并分支
```

| 合并方式 | 说明 | 场景 |
| :--- | :--- | :--- |
| `merge` | 保留两条分支的合并提交 | 常规协作，历史真实 |
| `rebase` | 把当前分支「重放」到目标分支顶部，历史呈线性 | 提交历史要干净时 |
| `cherry-pick` | 挑某一个提交应用到当前分支 | 只想要某次改动 |

**冲突处理**：合并时同一文件同一位置被两边都改了 → 出现冲突标记。编辑解决后 `git add` + `git commit` 即可。

```text
<<<<<<< HEAD
我是当前分支的版本
=======
我是被合并分支的版本
>>>>>>> feature/login
```

### 四、历史与回滚

```bash
git log --oneline          # 简洁历史（一行一个提交）
git log --oneline -n 5     # 最近 5 条
git show <commit>          # 查看某次提交的内容

git revert <commit>        # 生成一个「反向提交」来撤销（安全，推荐）
git reset --soft <commit>  # 撤销提交，改动留到暂存区
git reset --hard <commit>  # 丢弃提交及其改动（危险！不要对已推送历史用）
git stash                  # 临时藏起未提交改动
git stash pop              # 恢复
```

**原则**：已推送的远程历史用 `revert`，绝不用 `reset --hard` 重写。

### 五、远程协作

```bash
git remote -v              # 查看远程仓库
git push                   # 本地提交推送到远程
git pull                   # 拉取远程并合并（= fetch + merge）
git fetch                  # 只拉取不合并，先看看再决定
git push -u origin <branch> # 首次推送并建立跟踪
```

协作节奏：**先 pull（或 fetch）→ 解决冲突 → 再 push**，避免覆盖他人改动。

### 语法速查

| 需求 | 命令 |
| :--- | :--- |
| 保存当前改动 | `git add` + `git commit -m "消息"` |
| 查看改了啥 | `git status` / `git diff` |
| 开并行线 | `git switch -c <name>` |
| 合回主线 | `git merge <name>` |
| 撤销某次提交 | `git revert <commit>`（安全） |
| 临时藏改动 | `git stash` / `git stash pop` |
| 同步远程 | `git pull` / `git push` |
| 挑一个提交 | `git cherry-pick <commit>` |

### 常见用法

**完整发布流程**：

```bash
git switch main            # 回到主分支
git pull                   # 同步最新
git switch -c feature/pay  # 开功能分支
# ……开发、提交若干次……
git switch main            # 回主线
git merge feature/pay      # 合并功能
git push                   # 推送到远程
```

### 注意事项

- ⚠️ 提交信息写「为什么改」而不是「改了啥」（`fix: 修复支付回调重复扣款` 优于 `update`）。
- ⚠️ `git add .` 可能带入密钥与临时文件，习惯用精确文件名或配置 `.gitignore`。
- ⚠️ 不要对**已推送**的分支用 `reset --hard`，会破坏他人本地历史。
- ⚠️ 冲突不可怕，先读冲突标记、再小步验证，比盲目重来可靠。
- ⚠️ 提交前跑一遍 `git status` + `git diff`，确认没有漏掉或误加文件。

## 相关

- 📖 相邻手册：[npm 包管理](/3-reference/1-handbook/engineering/npm)、[构建工具](/3-reference/1-handbook/engineering/build-tools)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
