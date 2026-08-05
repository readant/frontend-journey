// Prettier 配置文件
// 配置文档：https://prettier.io/docs/en/options.html

module.exports = {
  // 缩进设置（改为空格，主流前端生态标准）
  useTabs: false, // 使用空格缩进
  tabWidth: 2, // 缩进宽度为2个空格

  // 语句结尾
  semi: true, // 在语句末尾添加分号

  // 引号风格
  singleQuote: false, // 使用双引号

  // 尾逗号
  trailingComma: "es5", // 在ES5语法允许的地方添加尾逗号

  // 行宽限制（放宽到100，更适合中文笔记和长链接）
  printWidth: 100,

  // 针对学习仓库的特殊覆盖规则
  overrides: [
    {
      files: "*.md", // Markdown 学习笔记
      options: {
        printWidth: 120, // 段落更宽松，防止长链接被拆断
        proseWrap: "always", // 自动换行保持段落整洁
      },
    },
    {
      files: "*.json", // package.json 等文件
      options: {
        trailingComma: "none", // JSON 格式不允许尾逗号
      },
    },
  ],
};
