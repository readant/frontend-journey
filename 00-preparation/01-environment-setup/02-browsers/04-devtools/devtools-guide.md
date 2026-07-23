# 浏览器开发者工具使用指南

## 打开开发者工具

### 快捷键

| 快捷键 | 功能 |
| :--- | :--- |
| `F12` | 打开/关闭开发者工具 |
| `Ctrl + Shift + I` | 打开开发者工具 |
| `Ctrl + Shift + C` | 打开元素选择器 |

### 菜单方式

- Chrome: `更多工具 > 开发者工具`
- Firefox: `Web开发者 > 切换开发者工具`
- Edge: `更多工具 > 开发者工具`

## 主要面板

### 1. Elements（元素面板）

- **功能**: 查看和修改HTML/CSS
- **常用操作**:
  - 点击元素选择器选择页面元素
  - 双击标签或属性进行编辑
  - 右键菜单可复制、删除、隐藏元素

### 2. Console（控制台）

- **功能**: 显示日志和执行JavaScript
- **常用命令**:

  ```javascript
  console.log('Hello World');  // 普通日志
  console.warn('Warning');     // 警告信息
  console.error('Error');      // 错误信息
  console.table(arr);          // 表格输出
  console.time('timer');       // 开始计时
  console.timeEnd('timer');    // 结束计时
  ```

### 3. Sources（源代码）

- **功能**: 调试JavaScript代码
- **常用功能**:
  - 设置断点（点击行号）
  - 单步执行（F10/F11）
  - 查看调用栈
  - 监视变量

### 4. Network（网络）

- **功能**: 查看网络请求
- **常用操作**:
  - 筛选请求类型（XHR、JS、CSS、Img等）
  - 查看请求详情（Headers、Response、Preview）
  - 模拟网络状态（Slow 3G、Offline）

### 5. Performance（性能）

- **功能**: 分析页面性能
- **使用方法**:
  1. 点击录制按钮
  2. 执行要测试的操作
  3. 停止录制查看结果

### 6. Application（应用）

- **功能**: 管理存储和资源
- **包含**:
  - Local Storage
  - Session Storage
  - Cookies
  - IndexedDB
  - Cache Storage

## 调试技巧

### 条件断点

1. 在断点行右键选择 `Edit condition`
2. 输入条件表达式
3. 只有当条件为true时才会触发断点

### 日志断点

- 右键断点选择 `Add log point`
- 输入要输出的日志内容（支持 `{变量名}` 格式）

### DOM断点

1. 在Elements面板右键元素
2. 选择 `Break on`
3. 选择触发条件：
   - `Subtree modifications` - 子节点变化
   - `Attribute modifications` - 属性变化
   - `Node removal` - 节点移除

## 常用快捷键

| 快捷键 | 功能 |
| :--- | :--- |
| `Ctrl + P` | 快速打开文件 |
| `Ctrl + Shift + P` | 命令面板 |
| `F8` | 继续执行 |
| `F10` | 单步跳过 |
| `F11` | 单步进入 |
| `Shift + F11` | 单步退出 |
| `Ctrl + R` | 刷新页面（保留控制台） |
| `Esc` | 返回Elements面板 |

## 实用技巧

### 1. 实时修改样式

- 在Elements面板的Styles中直接修改CSS
- 修改会立即反映到页面上

### 2. 模拟移动端

- 点击Toggle device toolbar按钮
- 选择设备类型或自定义分辨率

### 3. 禁用缓存

- 在Network面板勾选 `Disable cache`
- 刷新页面获取最新资源

### 4. 复制请求为cURL

- 在Network面板右键请求
- 选择 `Copy > Copy as cURL`

### 5. 查看事件监听器

- 在Elements面板点击 `Event Listeners` 标签
- 查看绑定在元素上的事件

## 调试流程

1. **重现问题**：在浏览器中复现bug
2. **定位代码**：使用Sources面板找到相关代码
3. **设置断点**：在关键位置设置断点
4. **分析变量**：通过Watch面板监视变量值
5. **验证假设**：逐步执行代码验证问题原因
6. **修复代码**：修改代码后测试修复效果