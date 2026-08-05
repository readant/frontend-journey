---
title: 07.1 export/import 语法
---

# export / import：模块的"出口"与"入口"

## 它是什么

ES Module（简称 ESM）把每个 JS 文件当作一个**独立作用域的模块**。模块之间怎么共享代码？靠一对"快递柜"操作：

- **`export`（出口）**：把模块里的变量/函数"贴上标签、摆上货架"，允许别人取
- **`import`（入口）**：从别的模块"取件"进来用

```javascript
// math.js —— 贴上标签
export function add(a, b) { return a + b; }
export const PI = 3.14;

// main.js —— 取件使用
import { add, PI } from "./math.js";
console.log(add(PI, 1));   // 4.14
```

模块化的价值一目了然：**隔离作用域**（不污染全局）、**显式依赖**（一眼看清用了什么）、**按需加载**（tree-shaking 的基础，下一页讲）。

::: tip 文件后缀
浏览器环境里 import 路径要写完整后缀 `./math.js`；用 Vite/Webpack 打包时通常可省略。Node.js 中 `.mjs` 后缀或 `package.json` 里 `"type": "module"` 表示 ESM。
:::

## 三种导出：export 的写法

**① 命名导出（named export）**——最常用，一个模块可导出多个：

```javascript
export const PI = 3.14;
export function square(x) { return x * x; }
export class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// 也可以先声明、再统一导出
const answer = 42;
export { answer };
```

**② 默认导出（default export）**——每个模块**只能有一个**，适合"这个模块的核心就是它"的场景：

```javascript
// greet.js
export default function greet(name) {
  return `hi, ${name}`;
}
```

**③ 汇总导出（re-export）**——模块充当"中转站"，把别处的东西再导出去，适合组织公共入口（比如 `index.js` 汇总目录下所有模块）：

```javascript
// utils/index.js —— 收集再出口
export { formatDate } from "./date.js";
export { debounce } from "./debounce.js";
export { PI, square } from "./math.js";
// 使用时一行拿到全部
// import { debounce, formatDate } from "./utils/index.js";
```

## 三种导入：import 的写法

**① 命名导入**——名字必须与导出名一致，可用 `as` 起别名（避免重名）：

```javascript
import { square, PI } from "./math.js";
import { PI as 圆周率 } from "./math.js";   // 别名：此后用 圆周率 引用
```

**② 默认导入**——名字随便起，对应模块的默认导出：

```javascript
import greet from "./greet.js";    // greet 就是 default 导出的那个函数
```

**③ 整体导入（namespace）**——把模块所有导出收进一个命名空间对象，用 `.` 访问：

```javascript
import * as math from "./math.js";
math.square(3);     // 9
math.PI;            // 3.14
```

::: tip 三种导入怎么选
- 只要一两个东西 → **命名导入**（最清晰，还能被 tree-shaking 精确分析）
- 模块主打一个功能 → **默认导入**
- 模块导出很多、想一把梭 → **整体导入**（注意：无法 tree-shaking 个别字段，打包略大）
:::

## 混合导入

默认导入和命名导入可以写在一起，默认导入放前面：

```javascript
// utils.js 同时有默认导出和命名导出
import greet, { square, PI } from "./utils.js";
```

::: warning 不要混用两种风格管理同一个模块
同一个模块里既 `export default` 又大量 `export` 命名成员容易让使用者困惑。团队里定好约定：**要么主打默认导出，要么全命名导出**，可读性更好。
:::

## 动态导入：import() 返回 Promise

静态 `import` 必须写在顶层、不能按需加载。而 **`import()` 函数**可以放在任何地方（函数里、条件里），它**返回一个 Promise**，resolve 出来的是模块命名空间对象：

```javascript
// 按需加载：用户真正用到时才下载
button.addEventListener("click", async () => {
  const { default: chartLib } = await import("./chart-lib.js");
  chartLib.render();
});

// 也可以拿到整体命名空间
const mod = await import("./math.js");
mod.square(2);    // 4
```

::: tip 动态导入的经典场景
- **路由懒加载**：Vue Router / React Router 里 `() => import("./views/Home.vue")`，切到哪个页面才下载哪个页面的代码，首屏更快
- **按需引入大库**：图表库、编辑器只有用到才加载
- **条件分支加载**：`if (isMobile) { await import("./mobile-lib.js") }`

返回的是 Promise，所以可以 `await`、`Promise.all` 并行加载多个模块。
:::

## import.meta.url：当前模块的地址

`import.meta` 携带**当前模块自身的元信息**，最常用的是 `url`——当前模块文件的完整地址。常用来拼资源路径（不受打包器 base 路径影响）：

```javascript
import.meta.url;    // 例如 http://localhost:5173/src/main.js

// 基于当前文件位置，解析图片资源
const logoUrl = new URL("./img/logo.png", import.meta.url);
```

## 常见坑点

- **路径必须写对**：浏览器下 `import "./math.js"` 的路径相对于当前文件，别忘了后缀；写错会 404 报错
- **别和 CommonJS 混用**：`.mjs` / `import` 和 `require` 在同一个文件里混着用会报语法错误（详见 07.3）
- **`import * as` 无法 tree-shaking 单个字段**：只是整体对象，打包器无法精确删掉未用导出
- **默认导出只能有一个**：写了两个 `export default` 直接语法错误
- **`import` 语句会提升**：可以写在文件中间，但可读性差，**统一放文件顶部**

## 小结

- 导出三兄弟：命名导出（多个）、默认导出（一个）、re-export（中转汇总）
- 导入三兄弟：命名导入（可 `as` 别名）、默认导入（名字随便起）、整体导入（`* as`）
- 静态 `import` 必须顶层；需要按需加载用 **`import()` 动态导入**（返回 Promise）
- `import.meta.url` 提供当前模块地址，可拼资源路径

::: tip 速查卡片
export/import 全部语法速查，见 [ES 模块速查](/cheatsheet/data/module)。
:::
