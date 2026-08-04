# 交互式演示示例

本页面演示如何使用 `vitepress-demo-plugin` 插件在 Markdown 中嵌入**代码展示 + 实时预览**的交互式 Demo。

## 基本用法

通过 `<demo html="路径" />` 标签即可渲染一个 HTML Demo，上方为实时预览，下方为可折叠的源代码。

路径相对于 `config.ts` 中配置的 `demoDir`（本项目为 `docs/public/demos`）。

### 示例 1：盒子模型演示

```markdown
<demo html="02-css/03-box-model.html" />
```

效果如下：

<demo html="02-css/03-box-model.html" />

---

### 示例 2：CSS 基础语法演示

<demo html="02-css/01-basics.html" />

---

## 高级选项

插件支持以下属性来控制 Demo 的展示效果：

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `html` / `vue` / `react` | 指定 demo 文件路径（相对 demoDir） | - |
| `title` | 设置 demo 标题 | 无 |

### 带标题的 Demo

<demo html="02-css/04-layout-positioning.html" title="布局与定位交互演示" />

---

## 在其他 Markdown 中使用

在任何 `.md` 文件中，只需添加以下代码即可嵌入交互式 Demo：

```vue
<!-- 嵌入 HTML Demo -->
<demo html="02-css/05-visual-styling.html" />

<!-- 嵌入 Vue 组件 Demo -->
<!-- <demo vue="path/to/demo.vue" /> -->

<!-- 嵌入 React 组件 Demo -->
<!-- <demo react="path/to/demo.tsx" /> -->
```

::: tip 提示

1. `demoDir` 已配置为 `docs/public/demos`，路径相对于该目录
2. HTML Demo 会在 iframe 中实时预览，支持完整交互
3. Vue/React Demo 会直接在页面中渲染组件
:::

## 更多演示

<demo html="02-css/06-transform-animation.html" />
