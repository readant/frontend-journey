---
title: CSS 布局完整手册
---

# CSS 布局（float / position / flex / grid）

## 核心概念

布局 = 用一套定位规则，把盒子摆到页面该去的位置。本章拆成四个子主题，按需直达：

| 子主题 | 解决什么问题 |
| :--- | :--- |
| [文档流与定位](/3-reference/1-handbook/css/layout/position) | 盒子怎么参与排布（display）、怎么「钉」在指定位置（position） |
| [浮动布局 float](/3-reference/1-handbook/css/layout/float) | 文字环绕图片、清除浮动 |
| [弹性布局 Flexbox](/3-reference/1-handbook/css/layout/flex) | 一维「一排/一列」的排列、对齐、空间分配 |
| [网格布局 Grid](/3-reference/1-handbook/css/layout/grid) | 二维「一张网」的行列同时控制 |

## 布局演进：从文档流到网格

CSS 的布局方式不是凭空出现的，而是围绕「怎么把盒子摆好」一步步演进的：

| 阶段 | 布局方式 | 解决什么问题 | 如今定位 |
| :--- | :--- | :--- | :--- |
| 起点 | 文档流 + display | 块级元素垂直堆叠、行内元素水平排列 | 一切布局的默认底座 |
| 第一代 | float 浮动 | 图文混排、文字环绕图片 | 仅保留图文混排场景 |
| 第二代 | position 定位 | 元素精确定位、悬浮层、吸顶 | 弹窗、悬浮、吸顶仍依赖它 |
| 第三代 | flex 弹性布局 | 一维方向的排列、对齐、空间分配 | 一维布局首选 |
| 第四代 | grid 网格布局 | 二维方向同时控制行列 | 二维布局首选 |

**一句话选型**：先问自己 —— 要排的是「一排/一列」（flex），还是「一张表/一面墙」（grid），还是要「钉在某个位置」（position），还是「文字绕着图走」（float）。绝大多数现代页面用 flex + grid 就能完成。

## 布局选型总览

| 需求 | 首选方案 | 一句话理由 |
| :--- | :--- | :--- |
| 一排/一列排列、等分、居中 | Flex | 一维问题最顺手的工具 |
| 卡片墙、页面骨架、二维对齐 | Grid | 行列同时控制，天然二维 |
| 弹窗、悬浮角标、吸顶/吸底 | position（absolute/fixed/sticky） | 需要「钉住」就交给定位 |
| 文字环绕图片 | float | 唯一不可替代的浮动员场景 |
| 水平垂直居中 | Flex（`justify-content: center` + `align-items: center`） | 一行代码，最不易错 |

## 注意事项（全局）

- ⚠️ **百分比参照物不同**：width 百分比参照父容器宽度，而 height 百分比需要父容器有确定高度，否则不生效（常见「高度百分比失效」）。
- ⚠️ **margin 垂直合并**：相邻块级元素的垂直 margin 取较大值，不是相加。flex/grid 容器内不会合并。
- ⚠️ **统一盒模型**：写布局前先加 `* { box-sizing: border-box }`，让 width 包含 padding 和 border，避免「宽度算不对」。
- ⚠️ **gap 只对 flex/grid 容器有效**：普通块级布局用 margin 控制间距。
- ⚠️ **真·居中别用 margin: 0 auto 实现垂直居中**：`margin: 0 auto` 只能水平居中块级元素（需已知宽度），垂直居中交给 flex/grid。

## 相关

- 🔍 场景索引：[布局场景速查](/3-reference/2-scenarios/layout) —— 遇到「我要 X 布局」时先查这里
- 📖 相邻手册：[盒模型](/3-reference/1-handbook/css/box-model)（border-box、margin 合并）、[响应式](/3-reference/1-handbook/css/responsive)（媒体查询与容器查询）、[设计模式与实战](/3-reference/1-handbook/css/design-patterns)（居中方案对比）
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念位置时点一颗星
