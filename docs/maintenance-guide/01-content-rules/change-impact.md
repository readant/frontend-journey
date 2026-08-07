---
title: 改动影响面
---

# 改动影响面：改一件事要同步哪些文件

> 知识库强一致性的来源之一：**同一概念会在多个数据源出现**（学习页、速查手册、场景索引、星盘、思维导图）。本表把常见改动的完整影响面固化成清单，避免"只改了一处、别处已过期"。

## 新增 / 修改学习章节或页面

| # | 要动的地方 | 文件路径 |
| :--- | :--- | :--- |
| 1 | 页面本体 | `docs/<模块>/<章节>/index.md` |
| 2 | 章节总览（若有子页） | 对应章节 `index.md` 的路线表 |
| 3 | 侧边栏 / 导航 | `docs/.vitepress/config.ts`（sidebar items + nav） |
| 4 | 思维导图 | `docs/<模块>/mindmap/mindmap-data.yml` → 跑 `npm run gen:mindmap` |
| 5 | 知识星盘 | `theme/components/star-map-data.ts`（展示）+ `docs/3-reference/graph-data.json`（导航） |
| 6 | 参考层速查 | `docs/3-reference/1-handbook/<域>/<页>.md`（四要素：定义/语法/场景/注意） |
| 7 | 场景索引 | `docs/3-reference/2-scenarios/`（按需） |
| 8 | 学习进度 / 章节目录 | `README.md` |

## 新增一个术语 / 知识点

1. 参考层手册对应页（四要素）
2. 场景索引 `2-scenarios/`
3. 星盘双数据源（`star-map-data.ts` + `graph-data.json`）
4. 思维导图 YAML（如该概念属于导图节点）
5. 学习层页面内 `::: tip 速查卡片` 链接

## 修改站点主题 / 组件样式

- 组件：`docs/.vitepress/theme/components/`（Mindmap.vue / StarMap.vue 等）
- 全局样式：`docs/.vitepress/theme/custom.css`
- 主题入口（注册组件 / 钩子）：`docs/.vitepress/theme/index.ts`
- 布局 / 导航配置：`docs/.vitepress/config.ts`

## 修改部署 / 域名

1. `docs/.vitepress/config.ts` 的 `base`
2. `.github/workflows/deploy.yml`（触发/版本/缓存）
3. 组件内硬编码链接（BASE_URL 拼接处）
4. README 线上地址

## 添加 / 升级 npm 依赖

1. `npm i -D <pkg>`（同时改 package.json + package-lock.json）
2. 如为 CJS / 预构建依赖：`config.ts` 的 `optimizeDeps.include`
3. README「开发环境」表（如涉及工具链）

## 新增 HTML 互动演示

- demo 文件放 `docs/public/demos/<模块>/`（可部署）
- 纯本地练习放 `practices/`（规划中，不入库部署）
- 演示页通过 `vitepress-demo-plugin` 的 `<demo>` 引用（`demoDir` 指向 `docs/public/demos`）
- 注意 `*.min.js` 全局忽略规则：放第三方压缩库需局部 `!` 白名单（见 [gitignore 策略](../02-config-spec/gitignore-spec.md)）

## 排查渲染问题

1. [渲染铁律](./render-rules.md)：容器三行 / 裸 `**` / 交叉嵌套
2. [决策记录：渲染问题修复](../decision-records.md)：三步验证法
