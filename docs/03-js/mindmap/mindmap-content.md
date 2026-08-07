# JavaScript 知识体系

## 语言核心

- [01 入门与变量](../01-foundation/)
  - 运行方式 · 语句/表达式/分号 · alert/console 交互 · let/const/var · 类型转换 · 运算符
- [02 函数定义](../02-functions/)
  - 声明/表达式/箭头/IIFE · 提升差异 · 参数与返回值
- [03 作用域与闭包](../02-functions/)
  - 词法环境 · 作用域链 · 闭包本质 · 计数器/防抖 · TDZ
- [04 this 绑定](../02-functions/)
  - 四种规则 · 丢失 this · call/apply/bind · 箭头函数

## 数据与结构

- [05 对象](../03-objects/)
  - 创建方式 · 属性操作 · 遍历 · 不可变性
- [06 原型与 class](../03-objects/)
  - 原型链 · new 原理 · 继承与 super · 多态
- [07 深浅拷贝](../03-objects/)
  - 浅拷贝 · structuredClone · JSON 三坑 · 循环引用
- [08 数组](../04-arrays/)
  - 增删改查 · map/filter/reduce · 去重/分组 · 遍历与迭代器

## 异步与浏览器

- [09 事件循环](../05-async/)
  - 单线程 · 微/宏任务 · 执行顺序 · queueMicrotask
- [10 Promise](../05-async/)
  - 状态机 · then/catch/finally · all/race/any · 错误必须 catch
- [11 async/await](../05-async/)
  - 同步风格 · try/catch · 演进对比 · await 微任务
- [12 fetch 与并发](../05-async/)
  - GET/POST · res.ok · 串行 vs 并行 · 超时控制
- [13 DOM 操作](../06-dom-api/)
  - 查询 · 修改节点 · 属性与类名 · XSS 安全
- [14 事件机制](../06-dom-api/)
  - 事件流 · 捕获/冒泡 · 事件委托 · 性能优化

## 工程与防错

- [15 ES 模块](../07-es-modules/)
  - export/import · 动态导入 · import.meta
- [16 模块机制](../07-es-modules/)
  - 静态分析 · tree-shaking · 严格模式 · 循环依赖
- [17 ESM vs CJS](../07-es-modules/)
  - 语法差异 · 实时引用 vs 拷贝 · 浏览器支持
- [18 错误处理](../08-error-debug/)
  - try/catch · 异步错误 · 全局兜底 · 自定义错误
- [19 调试方法论](../08-error-debug/)
  - Console 全家桶 · 断点调试 · Source Map · 五步法

