# Node.js 安装指南

## 下载安装

### 1. 官方下载

**下载地址**: https://nodejs.org/

推荐选择 **LTS 版本**（长期支持版本），更稳定可靠。

### 2. 安装步骤

#### Windows

1. 双击下载的 `.msi` 文件
2. 点击 `Next` 继续
3. 勾选 `I accept the terms in the License Agreement`
4. 选择安装路径（建议默认）
5. 在 "Custom Setup" 页面，确保勾选：
   - Node.js runtime
   - npm package manager
   - Add to PATH
6. 点击 `Next` 完成安装

#### macOS

1. 双击下载的 `.pkg` 文件
2. 跟随安装向导完成安装

#### Linux

```bash
# 使用官方脚本
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 验证安装

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v
```

## 升级 npm

```bash
npm install -g npm@latest
```

## 配置国内镜像

### 临时使用

```bash
npm install --registry=https://registry.npmmirror.com <package>
```

### 永久配置

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 查看配置
npm config get registry

# 恢复官方源
npm config set registry https://registry.npmjs.org
```

### 使用 nrm 管理镜像源

```bash
# 安装 nrm
npm install -g nrm

# 查看可用源
nrm ls

# 切换源
nrm use taobao

# 添加自定义源
nrm add myregistry https://registry.myregistry.com
```

## 目录结构说明

### 全局安装目录

- Windows: `C:\Users\<用户名>\AppData\Roaming\npm`
- macOS/Linux: `/usr/local/lib/node_modules`

### 项目本地目录

```
your-project/
├── node_modules/          # 依赖包
├── package.json           # 项目配置
├── package-lock.json      # 依赖锁定
└── ...
```

## package.json 基础结构

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My Frontend Project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "build": "webpack",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "webpack": "^5.0.0"
  }
}
```

## 常用 npm 命令

```bash
# 初始化项目
npm init
npm init -y               # 使用默认配置

# 安装依赖
npm install <package>     # 安装到生产依赖
npm install -D <package>  # 安装到开发依赖
npm install -g <package>  # 全局安装

# 安装指定版本
npm install <package>@1.0.0

# 卸载依赖
npm uninstall <package>

# 更新依赖
npm update <package>

# 查看已安装依赖
npm list
npm list --depth=0        # 只显示顶层依赖

# 查看包信息
npm view <package>
npm view <package> versions

# 运行脚本
npm run <script-name>
npm start                 # 快捷命令（对应 "start" 脚本）
npm test                  # 快捷命令（对应 "test" 脚本）

# 检查过时依赖
npm outdated

# 清理缓存
npm cache clean --force
```

## 使用 nvm 管理多版本（推荐）

### 安装 nvm

**Windows**: https://github.com/coreybutler/nvm-windows

**macOS/Linux**:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 常用命令

```bash
# 查看可用版本
nvm ls-remote

# 安装指定版本
nvm install 18.17.0
nvm install --lts         # 安装 LTS 版本

# 使用指定版本
nvm use 18.17.0
nvm use --lts             # 使用 LTS 版本

# 查看已安装版本
nvm ls

# 设置默认版本
nvm alias default 18.17.0
```

## 常见问题

### 1. npm 安装失败

- **原因**: 网络问题或权限不足
- **解决**: 使用国内镜像或提升权限

### 2. 命令找不到

- **原因**: Node.js 未添加到 PATH
- **解决**: 重新安装并确保勾选 "Add to PATH"

### 3. 权限问题（Linux/macOS）

```bash
# 使用 sudo（不推荐）
sudo npm install -g <package>

# 或修改 npm 全局目录权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

### 4. Node.js 版本不兼容

- **原因**: 项目需要特定版本
- **解决**: 使用 nvm 管理多版本