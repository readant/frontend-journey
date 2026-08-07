---
title: gitignore 策略
---

# gitignore 策略与设计考量

> `.gitignore` 是知识库仓库的"内容边界"：它决定哪些文件属于内容（入库），哪些属于环境（不入库）。策略围绕**个人知识库的两个核心诉求**设计：内容纯净、私人笔记与公开内容隔离。

## 规则分区设计

```gitignore
# Dependencies
node_modules/

# 锁文件策略（本项目用 npm，仅保留 package-lock.json）
pnpm-lock.yaml
yarn.lock
yarn.lock.*

# Editor directories and files
.vscode/                  # 但保留 .vscode/settings.json（白名单）
!.vscode/settings.json
.idea/
*.swp

# OS generated files
.DS_Store
Thumbs.db

# Logs
*.log

# Build outputs
dist/
build/
*.min.js
*.min.css

# VitePress / Vite
docs/.vitepress/dist/
docs/.vitepress/cache/
node_modules/.vite/

# TypeScript 构建信息
*.tsbuildinfo

# Temporary files
*.tmp *.temp *.bak *.orig

# Environment variables
.env .env.local .env.*.local

# 本机 AI IDE 目录
.trae/ .deepseek/ .mimocode/

# 私人文档（不入库）
LEARNING-REVIEW.md
CHANGELOG.md
维护笔记/
drafts/
```

## 设计决策要点

| 决策 | 理由 |
| :--- | :--- |
| 忽略 `pnpm-lock.yaml` / `yarn.lock.*`，保留 `package-lock.json` | 锁文件按包管理器隔离：混用会导致 `node_modules` 与 lockfile 不一致；本项目锁定 npm |
| `!.vscode/settings.json` 白名单 | 目录整体忽略但保留团队（单人）格式化设置，让 IDE 行为一致 |
| 忽略 `*.min.js` / `*.min.css` | 压缩产物视为构建输出；副作用是 `docs/public` 放第三方压缩库会被误拦，需局部 `!` 白名单（见[改动影响面](../01-content-rules/change-impact.md)） |
| 忽略本机 AI IDE 目录（`.trae/` 等） | 个人知识库常配 AI 编辑器，这些目录含个人状态，不应入库 |
| 私人维护笔记整体忽略（`维护笔记/`） | **公开仓库与私人笔记的隔离**：维护素材不直接提交，通过"迁移筛选"再输出到 `docs/` |

## 语法与验证契约

- 模式语法：`xxx/` = 忽略整个目录；`*.ext` = 忽略所有该扩展名；`!` = 取反例外
- **验证必须用命令确认**，不能"以为忽略了"：

```powershell
git check-ignore -v <文件>    # 输出命中规则行号 = 已忽略
```

- 已跟踪文件不受 `.gitignore` 影响，需先 `git rm --cached <文件>` 再登记规则

## 相关

- 依赖与锁文件策略：[npm 与依赖策略](../03-build-deploy-arch/dependency-policy.md)
