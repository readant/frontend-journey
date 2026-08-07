---
title: 思维导图模块
---

# 思维导图模块：YAML schema 与脚本契约

> 本仓库核心差异化功能之一：**数据驱动生成**。维护者只编辑 YAML，脚本生成渲染用 Markdown，组件只负责渲染——三层解耦。

## 架构分层

```
docs/<模块>/mindmap/
├── index.md            # 页面入口（嵌入 <Mindmap /> 组件）
├── mindmap-data.yml    # ① 数据源（维护者唯一编辑的文件）
└── mindmap-content.md  # ② 生成产物（markmap 格式，脚本覆盖，勿手改）
        ▲
        │ npm run gen:mindmap（scripts/gen-mindmap.mjs）
        │
    mindmap-data.yml ──── ③ 渲染组件 Mindmap.vue（docs/.vitepress/theme/components/）
```

**设计原则**：
- **单一编辑点**：内容只改 YAML，生成产物被视为"缓存"
- **单一来源**：`mindmap-content.md` 每次生成被覆盖，手改即失效
- **渲染无关数据**：`Mindmap.vue` 读生成产物渲染，不感知 YAML 结构

## 完整 schema（mindmap-data.yml）

```yaml
title: HTML 知识体系          # 导图标题（页面标题）

branches:                    # 分支数组（导图一级展开线）
  - name: 文档结构           # 分支名（二级标题）
    children:                # 该分支下的节点
      - num: 01             # 节点编号（排序/展示）
        name: 文档骨架       # 节点显示名
        link: /01-html/01-document-structure/   # 跳转链接（站点相对路径）
        keys: DOCTYPE, head, 渲染管线           # 子关键词（小节点，逗号分隔）
      - num: 02
        name: 元信息
        link: /01-html/01-document-structure/meta
        keys: charset, viewport, title
```

**字段契约**：

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `title` | string | ✅ | 导图标题 |
| `branches[]` | array | ✅ | 分支列表 |
| `branches[].name` | string | ✅ | 分支显示名 |
| `branches[].children[]` | array | ✅ | 节点列表 |
| `children[].num` | string/number | ✅ | 节点编号 |
| `children[].name` | string | ✅ | 节点显示名 |
| `children[].link` | string | ✅ | 站点相对路径，**不带 `https://`**（`/` 开头，构建时自动拼 base） |
| `children[].keys` | string | ❌ | 逗号分隔的子关键词 |

**命名契约**：中文为主、英文为辅；与参考层手册、场景索引、知识星盘**用词一致**（术语一致性是全站硬约束，见[页面结构标准](../01-content-rules/page-standard.md)）。

## 脚本契约（scripts/gen-mindmap.mjs）

`npm run gen:mindmap` 的行为：

1. 扫描 `docs/` 下所有含 `mindmap-data.yml` 的模块目录
2. 用 `yaml` 包解析每个 YAML
3. 按统一模板生成 markmap 格式 Markdown（`# title` + `## 分支` + `### 节点` + `#### keys`）
4. 写入各模块的 `mindmap-content.md`
5. 控制台打印各模块「分支数 / 节点数」汇总，便于核对

**契约约束**：
- 输出文件必须是**确定的**（相同输入 → 相同输出），保证可重复构建
- 依赖 `yaml`（dependencies）与 markmap 的 Markdown 约定；`config.ts` 已把 markmap/d3 加入 `optimizeDeps.include`（见[依赖策略](../03-build-deploy-arch/dependency-policy.md)）

## 最小可运行样例

```yaml
title: 示例导图

branches:
  - name: 基础
    children:
      - num: 01
        name: 概念
        link: /example/concept
        keys: 定义, 场景
```

生成产物形态：

```markdown
# 示例导图

## 基础

### 01 概念

#### 定义, 场景
```

## 维护契约

1. 只改 `mindmap-data.yml`，改后必须重跑 `npm run gen:mindmap`
2. 新增章节/子页时同步加 YAML 节点，否则导图缺入口（影响面见[改动影响面](../01-content-rules/change-impact.md)）
3. 每个模块 YAML 结构必须一致：`title` + `branches[].name` + `children[].{num,name,link,keys}`
4. 渲染组件 `Mindmap.vue` 与数据解耦，改样式不动数据

## 相关

- 组件注册：[主题与组件](../02-config-spec/theme-component.md)
- 预构建依赖：[npm 与依赖策略](../03-build-deploy-arch/dependency-policy.md)
