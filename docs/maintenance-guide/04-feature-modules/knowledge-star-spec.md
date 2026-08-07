---
title: 知识星盘模块
---

# 知识星盘模块：双轨数据与字段定义

> 本仓库核心差异化功能之二：把知识地图可视化为一幅"星盘"。设计上的关键决策是**双轨数据制**——展示层与导航层分离，两套数据各有职责。

## 入口与结构

- 页面入口：`/3-reference/` → `docs/3-reference/index.md`（`layout: false`，嵌入 `<StarMap fullscreen />`）
- 参考层目录：`1-handbook/`（速查手册）+ `2-scenarios/`（场景索引）+ `3-patterns/`（代码骨架）

## 双轨数据制（核心设计）

| 文件 | 内容 | 职责 |
| :--- | :--- | :--- |
| `docs/.vitepress/theme/components/star-map-data.ts` | 52 节点完整展示数据 | `StarMap.vue` 渲染（**展示层**） |
| `docs/3-reference/graph-data.json` | 21 个核心节点精简导航数据，带 `link` 指向 1-handbook | 未来导航跳转（**链接层**） |

**设计动机**：
- 展示层追求**视觉完整**（大中小三星级、坐标、谐音助记），数据量大且带 UI 属性
- 链接层追求**导航直达**（每个核心节点对应手册章节），数据精简、可被未来功能消费
- 两套数据**必须同步维护**——这是内容强一致性的又一个体现（影响面见[改动影响面](../01-content-rules/change-impact.md)）

## 展示层数据结构（star-map-data.ts）

### 四大星座（constellations）

星盘按"星座"组织四个知识域：

| 星座 | 域名 | 领域 |
| :--- | :--- | :--- |
| morning（晨岛） | HTML | 语义化标签 |
| cloud（云野） | CSS | 布局与样式 |
| rain（雨林） | JavaScript | 语言核心 |
| dusk（暮土） | 工程化 | 工具链与规范 |

每星座含 `color` / `glow` / `icon`（视觉属性）。

### StarNode 字段定义

```ts
interface StarNode {
  id: string;             // 节点唯一 id（星轨流向引用）
  name: string;           // 中文显示名（节点上只显示中文）
  en: string;             // 英文拼写（Tooltip / 详情面板）
  level: 1 | 2 | 3;       // 1 大星（核心模块）/ 2 中星（关键概念）/ 3 小星（具体属性/坑点）
  x: number;              // 相对坐标 X（0-100，组件内换算像素）
  y: number;              // 相对坐标 Y（0-100）
  desc: string;           // 一句话中文解释
  tags: string[];         // 中文口语化标签（搜索联想，如「横着排」）
  links: string[];        // 星轨流向（子节点 id 数组）
  phonetic?: string;      // 音节拆分（助记）
  mnemonic?: string;      // 中文谐音助记
}
```

**字段设计意图**：
- `level` 三档 → 星的大小分级，一眼看出知识层级
- `x/y` 用 **0-100 相对坐标**而非像素：组件内部做换算，保证不同屏幕分辨率下布局稳定
- `tags` 用**中文口语化**表达（如「横着排」→ flex），服务记忆检索，与官方术语错开
- `phonetic` / `mnemonic` 是本仓库的记忆法特色：音节拆分 + 谐音，面向学习者而非程序

## 链接层数据结构（graph-data.json）

```json
{
  "nodes": [
    {
      "id": "html-semantic",
      "name": "语义化标签",
      "level": 1,
      "link": "/3-reference/1-handbook/html/semantic"
    }
  ]
}
```

- 结构同型（复用 `name` / `level`），**额外携带 `link` 字段**指向 `1-handbook` 对应章节
- `link` 用站点相对路径，构建时自动拼 base

## 维护契约

1. **新增核心术语/章节**：双数据源都加节点（展示 + 导航链接），二者缺一会导致"看得见点不动"或"能跳转却看不见"
2. **坐标**：`x/y` 控制 0-100 且节点间留间隔，避免星星重叠
3. **命名**：`name` 中文、`en` 英文、`tags` 中文口语化；与手册/场景索引/思维导图**用词一致**
4. **渲染组件与数据解耦**：改 `StarMap.vue` 不动数据；组件内链接必须用 `import.meta.env.BASE_URL` 拼 base（见[渲染铁律](../01-content-rules/render-rules.md)第 4 条）
5. **新增手册章节后**：检查 `graph-data.json` 对应节点 `link` 是否仍有效（手册文件移动/重命名会使导航失效）

## 相关

- 组件注册：[主题与组件](../02-config-spec/theme-component.md)
- 术语一致性：[页面结构标准](../01-content-rules/page-standard.md)
