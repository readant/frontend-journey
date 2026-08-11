---
title: 仓库架构
---

# 仓库架构：三层架构与目录地图

> 本仓库的核心设计决策：**把"学习内容"与"速查内容"与"项目实战"分三层存放**，避免单个目录膨胀、职责不清。

## 三层架构

| 层     | 目录                                        | 职责                                     | 定位               |
| :----- | :------------------------------------------ | :--------------------------------------- | :----------------- |
| 学习层 | `docs/01-html`、`docs/02-css`、`docs/03-js` | 深度教学：原理、类比、符号课堂、阶梯练习 | 写"为什么会这样"   |
| 参考层 | `docs/3-reference/`                         | 速查手册、场景索引、代码骨架、知识星盘   | 写"是什么、怎么查" |
| 实战层 | `practices/`（4 个独立前端项目） | Vue 3 + Vite + TypeScript 全栈前端实战 | 写"怎么用起来" |

**分层动机**：学习层的每一页都在做教学推导（类比 → 示例 → 测验），篇幅长、上下文依赖强；速查内容需要"一句话直达"，两者混在一处会让学习者既要读长文又要找答案。分层后：

- 学习层页面只写深度原理 + 教学结构，**速查内容统一收进参考层**
- 学习层通过 `::: tip 速查卡片` 提示框**链接**到参考层对应章节，不复制内容（内容单一来源，避免双处维护）
- 参考层按"业务域"组织：`1-handbook/`（知识手册，按技术域系统整理）+ `2-scenarios/`（场景索引，引用手册）+
  `3-patterns/`（代码骨架）

## 目录地图

```
docs/
├── .vitepress/
│   ├── config.ts             # 站点配置：nav / sidebar / base / demo 插件
│   └── theme/                # 自定义主题：Mindmap.vue / StarMap.vue / star-map-data.ts
├── 00-preparation/           # 准备阶段（3 章）
├── 01-html/                  # HTML 学习层（5 章 + mindmap/）
├── 02-css/                   # CSS 学习层（9 章 + mindmap/）
├── 03-js/                    # JS 学习层（8 章 + mindmap/）
├── 3-reference/              # 参考层（1-handbook + 2-scenarios + 3-patterns + 星盘）
├── public/
│   ├── demos/02-css/         # CSS 互动演示 HTML（随站部署）
│   └── examples/             # HTML 案例（随站部署）
├── cheatsheet/               # 旧速查区（已并入 3-reference，不再新增）
├── maintenance-guide/        # 本实践案例章节
└── index.md                  # 首页

practices/
├── pj-01-cms-frontend/       # 项目一：CMS 管理后台（Vue 3 + Vite + TS）
├── pj-02-ecommerce-frontend/ # 项目二：电商前端（Vue 3 + Vite + TS）
├── pj-03-community-frontend/ # 项目三：社区前端（Vue 3 + Vite + TS）
└── pj-04-saas-frontend/      # 项目四：SaaS 工作台（Vue 3 + Vite + TS）
```

## 关键约束

1. **Markdown 是唯一数据源**：站点内容全部来自 `docs/` 的 Markdown；`config.ts` 只做导航与渲染组织
2. **侧边栏分区结构**：顶部「📚 学习之路」+ 中部「⚡ 速查补给站」+「🕊️ 参考层」+ 底部「🚀 实战项目」与「🛠️ 仓库工程实践」，让使用者随时知道自己在哪一层
3. **GitHub Pages 部署**：`base = /frontend-journey/`，构建产物在 `docs/.vitepress/dist/`
4. **速查集中**：所有速查内容集中在参考层手册，章节内不保留速查部分

## 延伸

- 各层的编写契约：[页面结构标准](../01-content-rules/page-standard.md)
- 改一处要同步哪些文件：[改动影响面](../01-content-rules/change-impact.md)
