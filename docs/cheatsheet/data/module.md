---
title: ES 模块速查
---

# ES 模块速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 拆分代码到文件 | `export` / `import`（ESM） |
| 每模块一个主出口 | `export default` |
| 按需/条件加载 | `import()` 动态导入 |
| 汇总再导出 | `export { x } from "./a.js"` |
| 获取模块自身信息 | `import.meta.url` |

## 核心代码

```javascript
// ===== math.js =====
export const PI = 3.14;                          // 命名导出
export function square(x) { return x * x; }      // 命名导出
export default function greet(n) { return `hi ${n}`; } // 默认导出

// ===== main.js =====
import { square, PI as 圆周率 } from "./math.js"; // 命名导入（别名）
import greet from "./math.js";                    // 默认导入
import * as math from "./math.js";                // 命名空间
import greet, { square } from "./math.js";        // 混合

// 动态导入（按需加载）
button.addEventListener("click", async () => {
  const { default: chart } = await import("./chart.js");
  chart.render();
});

// 浏览器引入
// <script type="module" src="main.js"></script>
```

## 踩坑记录

- **`import` 必须在顶层**：不能写进 if/函数里（那是动态导入 `import()` 的活）
- **默认导入的名字随意**：`export default function f(){}` 导入时 `import f` / `import 任意名` 都行；命名导入必须同名（可加 as 别名）
- **模块自动严格模式**：模块内 `this` 是 `undefined`，未声明变量赋值直接报错
- **模块脚本自动 defer**：不阻塞解析，按依赖顺序执行；一个模块只执行一次（有缓存）
- **循环依赖是坏味道**：ESM 能容忍（实时绑定）但可能读到 undefined；应抽公共模块避免
- **`import()` 返回 Promise**：要 `await` 或用 `.then` 消费；常用于路由懒加载
- **浏览器直接用 ESM 需完整路径**：`import "./math.js"` 要写全扩展名（打包工具里可省略）
