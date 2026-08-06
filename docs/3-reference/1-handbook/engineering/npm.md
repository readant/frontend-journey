---
title: npm 包管理完整手册
---

# npm 包管理

## 核心概念

npm 是 Node.js 生态的**包管理器**：安装依赖、管理版本、封装脚本，全部围绕一份 `package.json` 展开。核心知识点：**依赖类型、语义化版本、锁文件、scripts**。

## 完整内容

### 是什么 / 为什么

前端项目几乎都站在成千上万第三方包的肩膀上。npm 解决三件事：**依赖怎么装、版本怎么控、命令怎么统一**——一份 `package.json` 就是项目的「依赖清单 + 操作说明书」。

### 一、package.json 关键字段

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs"
  },
  "dependencies": {
    "markmap-lib": "^0.18.12"
  },
  "devDependencies": {
    "vitepress": "^1.6.4"
  }
}
```

| 字段 | 作用 |
| :--- | :--- |
| `name` / `version` | 包的身份标识 |
| `private: true` | 防止误发布到 npm 公共仓库 |
| `scripts` | 项目自定义命令的别名 |
| `dependencies` | 运行时依赖（上线也要） |
| `devDependencies` | 开发期依赖（构建工具、格式化器，上线不需要） |
| `type: "module"` | 声明项目用 ES Module |

### 二、依赖安装

```bash
npm install                 # 按 package.json 安装全部依赖
npm install <pkg>           # 安装并写入 dependencies
npm install -D <pkg>        # 安装并写入 devDependencies
npm install -g <pkg>        # 全局安装（命令行工具）
npm uninstall <pkg>         # 卸载
npm ci                      # 严格按锁文件安装（CI 用，快且可复现）
```

**判定一个包放 dependencies 还是 devDependencies**：上线后还需要它吗？

- 需要（框架、组件库、请求库）→ `dependencies`
- 不需要（构建器、检查器、格式化器）→ `devDependencies`

### 三、语义化版本（SemVer）

版本号 `主版本.次版本.补丁`（如 `1.4.2`）：

| 变化 | 含义 |
| :--- | :--- |
| 主版本 +1 | **破坏性变更**，可能不兼容 |
| 次版本 +1 | 新增功能，向后兼容 |
| 补丁 +1 | 修 Bug，向后兼容 |

| 写法 | 含义 |
| :--- | :--- |
| `1.4.2` | 锁定精确版本 |
| `^1.4.2` | 允许 1.x 内的次版本/补丁更新（默认） |
| `~1.4.2` | 只允许 1.4.x 内的补丁更新 |
| `>=1.4.2 <2.0.0` | 区间约束 |

### 四、锁文件（package-lock.json）

**锁文件 = 安装结果的「指纹」**：记录每个依赖的精确版本与来源。作用：

1. **可复现**：任何人、任何机器 `npm ci` 装出的依赖完全一致
2. **防漂移**：不会因「有人装时依赖已升版」导致环境不一致

所以：**锁文件必须提交进版本库**，装完依赖后看到它的 diff 是正常现象。

### 五、scripts：命令封装

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "prepublishOnly": "npm test"
  }
}
```

- `npm run <name>` 执行自定义脚本，`npm start` / `npm test` 可直接运行
- 脚本内可用 `npm run` 嵌套调用其他脚本
- 命名 `pre`/`post` 前缀的脚本会在对应命令前后自动执行（如 `prebuild`）

### 语法速查

| 需求 | 命令 |
| :--- | :--- |
| 安装全部依赖 | `npm install` |
| 装运行时依赖 | `npm install <pkg>` |
| 装开发依赖 | `npm install -D <pkg>` |
| 严格复现安装 | `npm ci` |
| 运行自定义命令 | `npm run <script>` |
| 查看版本 | `npm ls <pkg>` |
| 检查过期依赖 | `npm outdated` |

### 常见用法

**团队新成员拉取项目后的标准三步**：

```bash
git clone <仓库地址>   # 1. 拉代码
npm install            # 2. 按 package.json 装依赖
npm run dev            # 3. 跑起开发脚本
```

### 注意事项

- ⚠️ `package-lock.json` 要提交，别进 `.gitignore`；反而 `.gitignore` 应忽略 `node_modules/`。
- ⚠️ 全局安装的工具尽量少，团队协作更依赖 `devDependencies` + `npx`。
- ⚠️ 大版本升级（`^` 允许的范围内）也可能带来隐性行为变化，升级后跑一遍构建与测试。
- ⚠️ `npm install` 与 `npm ci` 行为不同：前者可能改锁文件，后者严格只读执行。
- ⚠️ 发布过的包版本号不可覆盖，发错版本用 `npm version patch` 升号重发。

## 相关

- 📖 相邻手册：[Git 版本控制](/3-reference/1-handbook/engineering/git)、[构建工具](/3-reference/1-handbook/engineering/build-tools)
- 🕊️ 星盘导航：[知识星盘](/3-reference/) —— 忘记概念放在哪时点一颗星
