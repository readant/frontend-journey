// Prettier 配置文件
// Prettier 是一个代码格式化工具，支持多种语言
// 配置文档：https://prettier.io/docs/en/options.html

module.exports = {
  // 缩进设置
  useTabs: true,           // 使用制表符缩进，而不是空格
  tabWidth: 2,             // 制表符宽度为2个字符
  
  // 语句结尾
  semi: true,              // 在语句末尾添加分号
  
  // 引号风格
  singleQuote: false,      // 使用双引号，而不是单引号
  
  // 尾逗号
  trailingComma: "es5",    // 在ES5语法允许的地方添加尾逗号（对象、数组等）
  
  // 行宽限制
  printWidth: 80,          // 每行最大80个字符，超过则换行
};