---
title: 格式化与 TS 配置
---

# 格式化与 TS 配置：.prettierrc / .editorconfig / tsconfig

> 三个"底层约定"文件构成代码风格的契约层。它们不直接参与内容生产，但决定了协作（哪怕只有一个人）时代码风格是否一致、IDE 是否报错。

## 分工总览

| 文件 | 管什么 | 设计点 |
| :--- | :--- | :--- |
| `.prettierrc.cjs` | 代码排版（引号/分号/行宽/尾逗号） | Markdown 单独放宽行宽 |
| `.editorconfig` | 编辑器底层（缩进/换行/编码/行尾空格） | Markdown 保留行尾空格 |
| `tsconfig.json` | TypeScript 编译与类型检查 | `types` 白名单机制 |

## .prettierrc.cjs

```js
module.exports = {
  useTabs: false,          // 空格缩进
  tabWidth: 2,             // 2 空格
  semi: true,              // 加分号
  singleQuote: false,      // 双引号
  trailingComma: "all",    // 允许的地方加尾逗号
  printWidth: 100,         // 行宽 100
  overrides: [
    { files: "*.md", options: { printWidth: 120, proseWrap: "always" } },  // Markdown 放宽，防长链接折行
    { files: "*.json", options: { trailingComma: "none" } },               // JSON 语法不允许尾逗号
  ],
};
```

**设计思路**：`overrides` 是关键——`.md` 放宽到 120 且自动折行，因为 Markdown 里长链接被 `printWidth 100` 强制折行会破坏表格对齐与链接可读性；`.json` 关闭尾逗号是因为 JSON 规范不允许。

## .editorconfig

```ini
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false   # ⚠️ Markdown 保留行尾空格
```

**设计思路**：`.md` 段单独关闭行尾空格清理——Markdown 里**行尾两个空格是"强制换行"语法**，若被编辑器清理会静默破坏排版。这是"编辑器配置服务内容语法"的典型案例。

**两者协同**：EditorConfig 管编辑器底层行为，Prettier 管代码排版；缩进（2 空格）、引号（双）、行宽必须一致，否则格式化结果冲突（历史教训：从 tab 统一迁移到 2 空格是一次全站格式化决策）。

## tsconfig.json

```jsonc
{
  "compilerOptions": {
    "target": "ESNext",
    "moduleResolution": "Bundler",   // 与 Vite 的模块解析一致
    "strict": true,
    "types": ["vitepress/client", "node"]   // ⚠️ 类型包白名单
  },
  "include": ["docs/.vitepress/**/*.ts", ...]
}
```

**设计思路与坑**：
- `types` 数组是**白名单**——没列出的类型包会被忽略。项目曾出现 IDE 报 `__dirname` / `path` 找不到类型：根因是 `types` 只有 `["vitepress/client"]`，而 Node 内置 API 的类型在 `@types/node`（需安装 + 在 `types` 登记 `"node"`）
- 这类"编辑器级报错"不影响构建（VitePress 加载配置时自行注入运行环境），但会污染 IDE 诊断，务必消除
