# Git 常用命令速查

## 基础配置

```bash
# 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list
git config user.name

# 配置别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

## 仓库操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone <url>
git clone <url> <directory>

# 添加远程仓库
git remote add origin <url>
git remote -v

# 移除远程仓库
git remote remove origin
```

## 日常操作

```bash
# 查看状态
git status

# 添加文件
git add .                      # 添加所有文件
git add <file>                 # 添加指定文件
git add -p <file>              # 交互式添加

# 提交
git commit -m "commit message"
git commit -am "commit message" # 添加并提交
git commit --amend             # 修改最后一次提交

# 查看日志
git log
git log --oneline              # 简洁格式
git log --graph                # 图形化
git log -p <file>              # 查看文件修改历史

# 查看差异
git diff
git diff <file>
git diff <commit1> <commit2>
```

## 分支操作

```bash
# 查看分支
git branch
git branch -a                  # 包含远程分支

# 创建分支
git branch <branch-name>
git checkout -b <branch-name>  # 创建并切换

# 切换分支
git checkout <branch-name>
git switch <branch-name>       # 新版命令

# 合并分支
git checkout main
git merge <branch-name>

# 删除分支
git branch -d <branch-name>    # 删除已合并分支
git branch -D <branch-name>    # 强制删除

# 推送到远程分支
git push origin <branch-name>
git push -u origin <branch-name> # 设置上游
```

## 远程操作

```bash
# 拉取更新
git pull
git pull origin main

# 推送更新
git push
git push origin main

# 查看远程信息
git remote show origin

# 同步远程分支
git fetch
git fetch origin
```

## 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file>

# 撤销暂存区
git reset HEAD <file>

# 回退到指定版本
git reset <commit>             # 保留修改
git reset --hard <commit>      # 丢弃修改

# 恢复已删除的提交
git reflog
git cherry-pick <commit>
```

## 标签操作

```bash
# 创建标签
git tag <tag-name>
git tag -a <tag-name> -m "message"

# 查看标签
git tag

# 推送标签
git push origin <tag-name>
git push origin --tags

# 删除标签
git tag -d <tag-name>
git push origin :<tag-name>
```

## 高级命令

```bash
# 交互式变基（整理提交）
git rebase -i <commit>

# 挑选提交
git cherry-pick <commit>

# 查看文件历史
git blame <file>

# 清理未跟踪文件
git clean -n                   # 预览
git clean -f                   # 强制删除

# 查看仓库大小
git count-objects -v

# 压缩历史
git gc
```

## 工作流示例

### 功能分支工作流

```bash
# 创建功能分支
git checkout -b feature/login

# 开发并提交
git add .
git commit -m "Implement login feature"

# 切换主分支并合并
git checkout main
git merge feature/login

# 删除分支
git branch -d feature/login
```

### 修复Bug

```bash
# 从主分支创建修复分支
git checkout -b bugfix/issue-123

# 修复并提交
git add .
git commit -m "Fix issue #123"

# 合并到主分支
git checkout main
git merge bugfix/issue-123
```

## 配置文件

### .gitignore 常用规则

```gitignore
# 依赖目录
node_modules/
vendor/

# 日志文件
*.log
npm-debug.log*

# 编辑器配置
.vscode/
.idea/
*.swp
*.swo

# 构建输出
dist/
build/

# 系统文件
.DS_Store
Thumbs.db
```

### .gitconfig 示例

```ini
[user]
    name = Your Name
    email = your@email.com

[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    lg = log --oneline --graph --all

[core]
    editor = code --wait
```