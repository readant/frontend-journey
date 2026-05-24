# VS Code 安装配置

## 1. 下载安装

### 1.1 下载地址
- 官方网站：https://code.visualstudio.com/
- 选择对应操作系统版本下载

### 1.2 安装步骤
1. 双击安装包运行安装程序
2. 选择安装路径
3. 勾选必要的选项：
   - ✅ 添加到PATH（重启后生效）
   - ✅ 注册为支持的文件类型
   - ✅ 添加右键菜单

## 2. 基本配置

### 2.1 用户设置

打开设置界面：`Ctrl + ,` 或 `File > Preferences > Settings`

#### 常用设置

```json
{
  "editor.fontSize": 14,
  "editor.lineNumbers": "on",
  "editor.wordWrap": "on",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "workbench.colorTheme": "One Dark Pro",
  "terminal.integrated.shell.windows": "powershell.exe"
}
```

### 2.2 快捷键

| 快捷键 | 功能 |
| :--- | :--- |
| `Ctrl + S` | 保存文件 |
| `Ctrl + Shift + S` | 另存为 |
| `Ctrl + N` | 新建文件 |
| `Ctrl + W` | 关闭当前文件 |
| `Ctrl + Tab` | 切换文件 |
| `Ctrl + B` | 显示/隐藏侧边栏 |
| `Ctrl + Shift + E` | 打开资源管理器 |
| `Ctrl + Shift + F` | 全局搜索 |
| `F5` | 启动调试 |
| `Ctrl + /` | 注释代码 |

## 3. 必备插件

### 3.1 前端开发必备

| 插件名称 | 功能 |
| :--- | :--- |
| **ESLint** | 代码规范检查 |
| **Prettier** | 代码格式化 |
| **Live Server** | 本地开发服务器 |
| **HTML CSS Support** | HTML/CSS智能提示 |
| **JavaScript and TypeScript** | JS/TS支持 |
| **Vetur** | Vue.js支持 |
| **React Developer Tools** | React支持 |
| **Auto Rename Tag** | 自动重命名标签 |
| **Path Intellisense** | 路径自动补全 |
| **GitLens** | Git增强 |

### 3.2 安装命令

```bash
# 通过命令行安装插件
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ritwickdey.LiveServer
```

## 4. 工作区配置

### 4.1 创建 .vscode 目录

在项目根目录创建 `.vscode` 文件夹，包含以下文件：

#### settings.json - 项目特定设置
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.printWidth": 80,
  "prettier.singleQuote": true
}
```

#### extensions.json - 推荐插件
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ritwickdey.LiveServer"
  ]
}
```

## 5. 常用技巧

### 5.1 代码片段

通过 `File > Preferences > User Snippets` 创建自定义代码片段：

```json
{
  "HTML Template": {
    "prefix": "html",
    "body": [
      "<!DOCTYPE html>",
      "<html lang=\"zh-CN\">",
      "<head>",
      "  <meta charset=\"UTF-8\">",
      "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
      "  <title>$1</title>",
      "</head>",
      "<body>",
      "  $0",
      "</body>",
      "</html>"
    ],
    "description": "HTML基础模板"
  }
}
```

### 5.2 调试配置

创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5500",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## 6. 性能优化

- 禁用不常用的插件
- 使用 `File > Auto Save` 自动保存
- 开启 `Settings Sync` 同步配置到云端
