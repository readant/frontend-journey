---
title: 布局场景速查
---

# 布局场景速查

## 一句话定位

「我想把东西摆成这样」—— 所有布局类需求从这里出发，找到对应方案，再回手册读完整原理。

## 核心解法

布局方案与手场景对照如下，完整原理见 📖 [CSS 布局完整手册](/3-reference/1-handbook/css/layout)。

## 速查摘要

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **水平垂直居中** | Flex | `display: flex; justify-content: center; align-items: center;` |
| **一排等分**（导航/标签栏） | Flex | `display: flex` + 子项 `flex: 1` |
| **左右分栏，一边固定一边自适应** | Flex / Grid | `flex: 0 0 200px` + `flex: 1`，或 `grid-template-columns: 200px 1fr` |
| **卡片墙（自动换行自适应列数）** | Grid | `repeat(auto-fit, minmax(200px, 1fr))` |
| **页面骨架（头/侧栏/主/底）** | Grid | `grid-template-areas` 区域命名 |
| **粘性页脚（内容不足时贴底）** | Flex | 容器 `min-height: 100vh` + 内容区 `flex: 1` |
| **弹窗/悬浮角标** | 定位 | 父级 `position: relative` + 子级 `position: absolute` |
| **吸顶导航/表头** | 定位 | `position: sticky; top: 0` |
| **返回顶部按钮钉角落** | 定位 | `position: fixed; right/bottom` |
| **文字环绕图片** | 浮动 | `float: left/right` + 父级清除浮动 |
| **两行对齐（如价格/单位基线）** | Flex | `align-items: baseline` |
| **间距统一** | gap | 容器 `gap: 12px`（flex/grid 通用） |

## 完整阅读

📖 手册章节：

- [CSS 布局（float / position / flex / grid）](/3-reference/1-handbook/css/layout)
- [盒模型（border-box 与 margin 合并）](/3-reference/1-handbook/css/box-model)
- [响应式设计（媒体查询与容器查询）](/3-reference/1-handbook/css/responsive)

## 相关代码

📦 代码骨架（建设中）：等分布导航、粘性页脚、响应式卡片墙等完整片段将收录于 [代码骨架](/3-reference/) 区。

## 选型口诀

> **一维用 flex，二维用 grid，钉住用 position，环绕用 float。**

遇到新场景先套口诀，再回 [CSS 布局手册](/3-reference/1-handbook/css/layout) 读透原理。
