# CSS 核心知识体系

系统化、可扩展的 CSS 学习笔记 · 9 大章节 · 50+ 知识点 · 速查语法

::: tip 知识地图
学习前先看 [CSS 思维导图](./mindmap/) —— 以四大分支把握整个 CSS 知识脉络，学习中沿节点逐个攻破，复习时对着地图快速定位盲区。
:::

<div class="chapter-grid">
<a href="./01-basics/" class="chapter-card">
  <div class="chapter-num">01</div>
  <div class="chapter-info">
    <h3>基础语法与机制</h3>
    <p>语法结构、引入方式、层叠优先级、继承性、单位体系</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./02-selectors/" class="chapter-card">
  <div class="chapter-num">02</div>
  <div class="chapter-info">
    <h3>选择器</h3>
    <p>基础/组合/属性/伪类/伪元素选择器</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./03-box-model/" class="chapter-card">
  <div class="chapter-num">03</div>
  <div class="chapter-info">
    <h3>盒子模型</h3>
    <p>标准/怪异盒模型、margin/padding/border、外边距合并</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./04-layout-positioning/" class="chapter-card">
  <div class="chapter-num">04</div>
  <div class="chapter-info">
    <h3>布局与定位</h3>
    <p>文档流、浮动、定位、Flexbox、Grid</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./05-visual-styling/" class="chapter-card">
  <div class="chapter-num">05</div>
  <div class="chapter-info">
    <h3>视觉样式与美化</h3>
    <p>文本字体、颜色背景、边框圆角、滤镜混合模式</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./06-transform-animation/" class="chapter-card">
  <div class="chapter-num">06</div>
  <div class="chapter-info">
    <h3>变换与动画</h3>
    <p>2D/3D 变换、过渡、关键帧动画</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./07-responsive/" class="chapter-card">
  <div class="chapter-num">07</div>
  <div class="chapter-info">
    <h3>响应式设计</h3>
    <p>视口、媒体查询、断点策略、容器查询</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./08-modern-css/" class="chapter-card">
  <div class="chapter-num">08</div>
  <div class="chapter-info">
    <h3>工程化与现代 CSS</h3>
    <p>CSS 变量、预处理器、方法论、性能优化</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
<a href="./09-design-patterns/" class="chapter-card">
  <div class="chapter-num">09</div>
  <div class="chapter-info">
    <h3>设计模式与实战</h3>
    <p>居中方案、圣杯布局、Clearfix、自定义形状</p>
  </div>
  <div class="chapter-arrow">→</div>
</a>
</div>

<style>
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.chapter-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 12px;
  transition: all 0.2s;
  background: var(--vp-c-bg-soft, #f6f6f7);
  text-decoration: none !important;
  color: inherit !important;
}
.chapter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--vp-c-brand-1, #3451b2);
}
.chapter-num {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft, rgba(100, 108, 255, 0.14));
  color: var(--vp-c-brand-1, #3451b2);
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chapter-info { flex: 1; min-width: 0; }
.chapter-info h3 { margin: 0; font-size: 15px; color: inherit; }
.chapter-info p { margin: 4px 0 0; font-size: 13px; color: var(--vp-c-text-2, #606266); line-height: 1.4; }
.chapter-arrow {
  color: var(--vp-c-text-2, #606266);
  font-size: 18px;
  transition: transform 0.2s;
}
.chapter-card:hover .chapter-arrow {
  transform: translateX(4px);
  color: var(--vp-c-brand-1, #3451b2);
}
</style>

## 章节速览

| # | 章节 | 核心内容 |
|---|------|---------|
| 1 | [基础语法与机制](/02-css/01-basics/) | 语法结构、引入方式、层叠优先级、继承性、单位体系 |
| 2 | [选择器](/02-css/02-selectors/) | 基础/组合/属性/伪类/伪元素选择器 |
| 3 | [盒子模型](/02-css/03-box-model/) | 标准/怪异盒模型、margin/padding/border、外边距合并 |
| 4 | [布局与定位](/02-css/04-layout-positioning/) | 文档流、浮动、定位、Flexbox、Grid |
| 5 | [视觉样式与美化](/02-css/05-visual-styling/) | 文本字体、颜色背景、边框圆角、滤镜混合模式 |
| 6 | [变换与动画](/02-css/06-transform-animation/) | 2D/3D 变换、过渡、关键帧动画 |
| 7 | [响应式设计](/02-css/07-responsive/) | 视口、媒体查询、断点策略、容器查询 |
| 8 | [工程化与现代 CSS](/02-css/08-modern-css/) | CSS 变量、预处理器、方法论、性能优化 |
| 9 | [设计模式与实战](/02-css/09-design-patterns/) | 居中方案、圣杯布局、Clearfix、自定义形状 |

## 学习路线

> 从零到实战的 7 阶段路线，沿此路径配合上方**章节**与[思维导图](./mindmap/)逐步推进。

| 阶段 | 主题 | 对应章节 | 建议目标 |
| --- | --- | --- | --- |
| 一 | CSS 基础入门 | [01 基础语法与机制](/02-css/01-basics/) | 掌握语法结构与三种引入方式 |
| 二 | 选择器与属性 | [02 选择器](/02-css/02-selectors/) | 熟练基础/复合选择器，吃透三大特性 |
| 三 | 盒子模型与布局 | [03 盒子模型](/02-css/03-box-model/) · [04 布局与定位](/02-css/04-layout-positioning/) | 吃透盒模型，掌握浮动/定位/Flex/Grid |
| 四 | 视觉样式与进阶技巧 | [05 视觉样式与美化](/02-css/05-visual-styling/) | 背景、渐变、精灵图、文字溢出处理 |
| 五 | CSS3 新特性 | [06 变换与动画](/02-css/06-transform-animation/) · [08 现代 CSS](/02-css/08-modern-css/) | 圆角阴影、变换过渡、变量与滤镜 |
| 六 | 响应式与移动端 | [07 响应式设计](/02-css/07-responsive/) | 视口、媒体查询、rem/vw 适配 |
| 七 | 实战项目 | [09 设计模式与实战](/02-css/09-design-patterns/) | 独立完成 2+ 实战项目巩固所学 |

### 自测清单

- [ ] 理解三种引入方式及优先级
- [ ] 熟练使用基础选择器和复合选择器
- [ ] 掌握字体、文本、背景属性
- [ ] 深刻理解盒子模型
- [ ] 能使用浮动和定位实现常见布局
- [ ] 掌握 Flex 布局
- [ ] 了解 Grid 布局
- [ ] 能使用 CSS3 实现过渡和动画
- [ ] 了解移动端适配方案
- [ ] 独立完成 2 个以上实战项目

### 推荐资源

- [MDN CSS 教程](https://developer.mozilla.org/zh-CN/docs/Learn/CSS)
- [CSS-Tricks](https://css-tricks.com/)
- [Learn CSS](https://web.dev/learn/css)
- [Flexbox Froggy](https://flexboxfroggy.com/)（Flex 小游戏练习）
- [Grid Garden](https://cssgridgarden.com/)（Grid 小游戏练习）

## 笔记规范

- 每章末尾含 **速查语法** 小节，方便快速查阅
- 提示框类型：```warning``` 注意、```tip``` 技巧、```danger``` 重点
- 配套 **互动演示** 文件，点击章节末尾链接即可打开
