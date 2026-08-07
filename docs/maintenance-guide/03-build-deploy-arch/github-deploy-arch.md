---
title: GitHub 部署架构
---

# GitHub 部署架构：Actions 工作流设计

> 部署链路：推送到 `main` → GitHub Actions 自动构建 → 发布到 GitHub Pages。本节讲**架构与工程决策**，不展开操作步骤。

## 架构图

```
git push origin main
        │
        ▼
GitHub Actions（.github/workflows/deploy.yml）
        │  build 任务
        ├─ checkout@v5 → setup-node@v6(Node 24) → cache@v4 → configure-pages@v6
        │  → npm ci → npm run build → upload-pages-artifact@v5
        ▼
        │  deploy 任务（needs: build）
        ├─ deploy-pages@v5
        ▼
GitHub Pages → https://readant.github.io/frontend-journey/
```

## 关键设计决策

| 决策 | 理由 |
| :--- | :--- |
| `permissions: pages: write / id-token: write`（最小授权） | 工作流只拿到发布 Pages 所需权限，不做多余授权 |
| 触发：`push` 到 `main` + `workflow_dispatch` | 自动发布 + 保留手动重发入口，两者兼得 |
| `concurrency: group: pages` | 连续推送时只保留最新一次部署，避免任务互相抢占 |
| `actions/checkout@v5` + `fetch-depth: 0` | 完整历史，供页面 `lastUpdated` 时间戳使用 |
| `actions/cache@v4` 缓存 `docs/.vitepress/cache` | 显著加速本地搜索索引等中间产物，key 含内容路径与 lockfile hash，内容变更自动失效 |
| `npm ci` 而非 `npm install` | 按 lockfile 精确复现，杜绝 CI 与本地依赖漂移 |
| actions 版本锁定为官方最新 | 升级前必须核实官方 GitHub 官方 releases 页；本项目已锁定 checkout@v5 / setup-node@v6 / configure-pages@v6 / upload-pages-artifact@v5 / deploy-pages@v5，**勿回退旧版本** |

## base 前缀的架构约束

- `base = /frontend-journey/` 必须与仓库名一致，否则全站静态资源 404
- **两级链接处理**：Markdown 链接由 VitePress 构建时自动加 base；raw HTML `<a href>` 与 Vue 组件内硬编码链接不会，必须用 `import.meta.env.BASE_URL` 拼接——这是一个"配置层必须记住，否则渲染层静默出错"的约束点

## 发布确认与回滚思路

1. 判定成功：Actions 页 `Deploy to GitHub Pages` 的 build、deploy 两个任务均绿
2. 失败定位：红色任务日志 → `Build with VitePress` 步骤报错行；本地 `npm run build` 复现
3. 手动重发：Actions 页 Re-run 或 `workflow_dispatch`
4. 构建可靠性约定：本地构建以输出中的 `build complete` 为准（沙箱环境可能使退出码误报 1）

## 相关

- 依赖安装策略：[npm 与依赖策略](./dependency-policy.md)
- 链接 base 规则：[渲染铁律](../01-content-rules/render-rules.md)
