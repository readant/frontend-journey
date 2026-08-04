---
title: npm 速查
---

# npm 速查

## 何时用

- 创建 Node 项目（`package.json`）
- 安装 / 卸载第三方依赖
- 区分生产依赖与开发依赖（构建工具、Lint 等只在开发用）

## 核心代码

```bash
# ---- 项目初始化 ----
npm init -y                        # 快速生成 package.json（-y 跳过问答）

# ---- 安装依赖 ----
npm install <pkg>                  # 安装为生产依赖（dependencies）
npm install -D <pkg>               # 安装为开发依赖（devDependencies）
npm install                        # 按 package.json 安装全部依赖
npm uninstall <pkg>                # 卸载

# ---- 运行脚本 ----
npm run dev                        # 运行 package.json scripts 里的 dev 脚本
npm run build                      # 构建
npm run <script>                   # 运行任意自定义脚本

# ---- 国内镜像（下载慢时设置一次） ----
npm config set registry https://registry.npmmirror.com
npm config get registry            # 验证是否生效（应输出镜像地址）
```

## 踩坑记录

- **`npm install <pkg>` 默认是生产依赖**：构建工具、格式化工具（如 Prettier、ESLint）要用 `-D`，否则部署时体积变大
- **`npm run` 不加脚本名不行**：直接输 `npm run` 会列出所有可用脚本；`npm dev` 这种省略写法不生效（要 `npm run dev`）
- **node_modules 不要手动改**：依赖装不进 package-lock.json，团队间会不一致；删了重新 `npm install`
- **镜像只改 npm 不影响 pnpm/yarn**：换包管理器要单独配置（如 pnpm 用 `.npmrc` 写 `registry=https://registry.npmmirror.com`）
- **版本号符号含义**：`^1.2.3` 允许小版本更新、`~1.2.3` 只允许补丁、`1.2.3` 锁死；CI 环境建议锁死版本
- **安装报权限错误（EACCES）**：不要用 sudo，改用 `nvm` 管理 Node 版本或 `npm config set prefix` 改全局路径
