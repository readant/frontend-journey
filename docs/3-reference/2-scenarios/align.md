---
title: 对齐场景速查
---

# 对齐场景速查

## 一句话定位

「让元素/文字对齐、居中」—— 所有对齐类需求从这里出发。

## 核心解法

对齐方案速查如下，完整原理见 📖 [盒模型](/3-reference/1-handbook/css/box-model) 与 [布局手册](/3-reference/1-handbook/css/layout)。

## 速查摘要

| 中文意图 | 首选方案 | 核心代码 |
| :--- | :--- | :--- |
| **块级元素水平居中** | margin auto | 定宽 + `margin: 0 auto` |
| **任意元素水平垂直居中** | Flex | 容器 `display: flex; justify-content: center; align-items: center;` |
| **文字水平居中** | text-align | `text-align: center`（text 系列直接设父级） |
| **文字垂直居中** | line-height / flex | 单行：`line-height` 等于容器高；多行：flex `align-items: center` |
| **绝对定位元素居中** | 定位 + transform | `position: absolute; top/left: 50%; transform: translate(-50%, -50%);` |
| **多列底部对齐** | Flex | 容器 `align-items: flex-end` |
| **基线对齐**（价格与单位） | Flex | 容器 `align-items: baseline` |
| **表格单元格居中** | Grid | 容器 `display: grid; place-items: center;` |
| **间距统一、不合并** | gap | 容器 `gap: 12px`（避免 margin 垂直合并坑） |

## 完整阅读

📖 手册章节：

- [盒模型（margin 合并与居中原理）](/3-reference/1-handbook/css/box-model)
- [CSS 布局（flex/grid/position 三套居中方案）](/3-reference/1-handbook/css/layout)

## 相关代码

📦 代码骨架（建设中）：居中工具类、Flex 对齐工具类将收录于 [代码骨架](/3-reference/) 区。

## 选型口诀

> **flex 居中最省心，定位 + translate 最稳，margin auto 只能水平，line-height 只管单行。**
