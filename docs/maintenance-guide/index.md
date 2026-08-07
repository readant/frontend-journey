---
title: 仓库工程实践
---

# 仓库工程实践：搭建 VitePress 结构化知识库的实践参考

> ⚠️ 读者定位：想搭建同类 VitePress 结构化知识库的开发者。
>
> 普通前端学习者可以直接跳过本章节——这里**不是前端业务实战教程**。
>
> 这是**一位个人开发者**的工程实践记录：目录、命名、数据契约都按我自己的习惯编排，带有明显的个人风格，未必是最佳实践，更多是"一种可行的做法"。你可以随意借鉴思路、按需复用代码。
>
> 因为这是我的个人学习与维护项目，精力有限、编排高度个人化，所以**不打算开放大规模外部 PR**；如果有想法，欢迎先在 Issue 里交流，讨论清楚后再动手，小步改进我会很乐意合并。

本仓库（readant/frontend-journey）本质是一个**个人前端学习笔记库**：以 Markdown 为唯一数据源，由 VitePress 渲染成三层结构的知识站。本章节把仓库里"如何组织内容、如何定义数据契约、如何做工程决策"的实践沉淀为可复用的案例参考。

## 仓库概览

- **三层架构**：学习层（深度教学）+ 参考层（速查手册）+ 实战层（项目案例）
- **Markdown 单一数据源**：所有内容产自 `docs/` 下的 Markdown，站点配置只负责组织与渲染
- **两大差异化功能**：思维导图（YAML 驱动生成）、知识星盘（双轨数据驱动的可视化导航）

## 章节导航

### 00 仓库架构总览

- [仓库架构：三层架构与目录地图](./00-overview/project-arch.md)

### 01 内容组织规则

- [渲染铁律：VitePress/markdown-it 陷阱清单](./01-content-rules/render-rules.md)
- [页面结构标准：学习层每页闭环规范](./01-content-rules/page-standard.md)
- [改动影响面：改一件事要同步哪些文件](./01-content-rules/change-impact.md)

### 02 配置规范

- [站点配置：config.ts 设计思路](./02-config-spec/site-config.md)
- [主题与组件：theme/ 目录结构与组件注册](./02-config-spec/theme-component.md)
- [格式化与 TS 配置](./02-config-spec/format-ts.md)
- [gitignore 策略与设计考量](./02-config-spec/gitignore-spec.md)

### 03 构建与部署架构

- [GitHub Actions 部署架构](./03-build-deploy-arch/github-deploy-arch.md)
- [npm 与依赖策略](./03-build-deploy-arch/dependency-policy.md)

### 04 特色功能模块（本仓库核心差异化）

- [思维导图模块：YAML schema 与脚本契约](./04-feature-modules/mindmap-spec.md)
- [知识星盘模块：双轨数据与字段定义](./04-feature-modules/knowledge-star-spec.md)

### 05 Git 策略

- [提交规范的设计思想](./05-git-policy/commit-spec.md)

### 工程决策记录

- [决策记录：现状 → 方案 → 选择 → 理由](./decision-records.md)
