---
title: 对象与原型速查
---

# 对象与原型速查

## 何时用

| 场景 | 用什么 |
| --- | --- |
| 创建普通对象 | 字面量 `{...}` |
| 指定原型的对象 | `Object.create(proto)` |
| 共享方法/继承 | `class` + `extends` |
| 浅拷贝 | 展开 `{...obj}` / `Object.assign` |
| 深拷贝 | `structuredClone(obj)`（有函数/日期/循环引用也能拷） |
| 判断自身属性 | `Object.prototype.hasOwnProperty` / `Object.hasOwn` |

## 核心代码

```javascript
// 对象操作
const user = { name: "Alice", age: 25 };
user.age = 26;                      // 改
user.city = "BJ";                   // 增
delete user.city;                   // 删
"name" in user;                     // true（含继承链）
user.hasOwnProperty("name");        // true（仅自身）
Object.keys(user);                  // ["name","age"]
Object.values(user);                // ["Alice",26]
Object.entries(user);               // [["name","Alice"],["age",26]]

// class
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} 发声`; }
  static kingdom() { return "动物界"; }
}
class Dog extends Animal {
  constructor(name) { super(name); }          // 必须先 super()
  speak() { return `${this.name} 汪汪叫`; }   // 覆盖
}

// 拷贝
const shallow = { ...original };              // 浅
const deep = structuredClone(original);       // 深（推荐）

// 原型验证
Object.getPrototypeOf(instance) === Class.prototype;  // true
instance instanceof Class;                           // true
```

## 踩坑记录

- **浅拷贝共享嵌套对象**：`{...obj}` 只复制一层，`shallow.nested.x = 1` 会影响原对象；要全独立用 `structuredClone`
- **`JSON.parse(JSON.stringify(obj))` 深拷贝有坑**：丢 `undefined`/`function`/`Symbol`，`Date` 变字符串，循环引用直接抛错
- **`for...in` 会遍历继承属性**：遍历自身键用 `Object.keys()` + `for...of`
- **`class` 继承必须在构造函数开头 `super()`**：不调 super 访问 this 抛 ReferenceError
- **解构默认值只在 undefined 时生效**：`const { x = 1 } = { x: null }` → x 是 null
- **对象键会被转字符串**：`{ [true]: 1 }` 的键是 `"true"`
- **`Object.freeze` 是浅冻结**：嵌套对象仍可改
