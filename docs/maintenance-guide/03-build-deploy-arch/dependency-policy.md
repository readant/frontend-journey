---
title: npm 与依赖策略
---

# npm 与依赖策略

> 知识库依赖极少，但依赖策略仍然重要：**锁文件、预构建、类型声明**三者决定了"clone 后能否开箱即跑"。

## 依赖分层

| 类型 | 包 | 用途 |
| :--- | :--- | :--- |
| devDependencies | vitepress | 文档站框架 |
| devDependencies | vitepress-demo-plugin | 互动 demo（`md.use` 注入，见[站点配置](../02-config-spec/site-config.md)） |
| devDependencies | @types/node | Node 类型声明（消除 IDE 类型报错） |
| dependencies | markmap-lib / markmap-view | 思维导图渲染（运行时依赖） |
| dependencies | yaml | 思维导图数据解析（生成脚本用） |

**设计思路**：
- 框架与构建期工具进 `devDependencies`，站点运行时组件进 `dependencies`——语义清晰，也符合 VitePress 的约定
- `@types/node` 是**编辑器体验**而非运行必需：VitePress 加载配置时自行注入 `__dirname` 运行环境，但 TS 需要类型声明才能通过 IDE 检查（见[格式化与 TS 配置](../02-config-spec/format-ts.md)）

## 锁文件策略

- 只用 **npm**，保留 `package-lock.json`
- `.gitignore` 忽略 pnpm/yarn 锁文件，防止混用（见 [gitignore 策略](../02-config-spec/gitignore-spec.md)）
- **CI 用 `npm ci`**：按 lockfile 精确复现，杜绝依赖漂移（见[GitHub 部署架构](./github-deploy-arch.md)）

## 预构建契约（optimizeDeps）

```ts
vite: { optimizeDeps: { include: ["markmap-lib", "markmap-view", "d3"] } }
```

markmap 依赖链是 **CJS 模块**，浏览器端 ESM 需要 Vite 预构建。新增 CJS 依赖时必须同步登记，否则 dev/build 会报 "optimized dependencies changed" 或运行时报错。

## 新增依赖的标准流程

1. `npm i -D <pkg>`（或 `npm i <pkg>` 运行时依赖）
2. 确认 `package.json` 与 `package-lock.json` 都被修改（两者必须一起入库）
3. 新包若是 CJS / 需预构建，检查 `config.ts` 的 `optimizeDeps.include`
4. `npm run build` 验证

## 已知环境约束

- 部分受限环境（沙箱）会拦截 npm 写全局缓存，可用 `--cache .npm-cache-tmp` 项目内临时缓存绕过；构建退出码报 1 但输出含 `build complete` 时以输出为准
