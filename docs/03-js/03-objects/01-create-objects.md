---
title: 03.1 对象创建与属性
---

# 对象创建与属性：键值对的魔法

## 它是什么

对象就是**无序的键值对集合**——把"名字"（键）和"值"配对存放，值可以是任意类型（数字、字符串、数组，甚至函数）。生活化比喻：对象像一个**档案袋**，袋子上贴着标签（键），里面装着资料（值）。

```javascript
const user = {
  name: "Alice",          // 键: 值
  age: 25,
  greet() {               // 值也可以是函数（称为方法）
    return `Hi, I'm ${this.name}`;
  },
};
console.log(user.name);   // "Alice"（按标签取资料）
```

在 JavaScript 中，**几乎所有非原始类型的东西都是对象**——数组、函数、日期、正则，底层全是对象。掌握对象，就掌握了 JS 数据结构的大半江山。

## 三种创建方式

### 1. 对象字面量（最常用）

```javascript
const obj = { name: "Alice", age: 25 };
```

直观、简短，日常开发 95% 的场景用它。

### 2. Object.create（指定原型）

第一个参数指定对象的原型（`null` 表示没有原型）：

```javascript
const parent = { greet() { return "hi"; } };
const child = Object.create(parent);   // child 的原型是 parent
child.name = "Alice";
console.log(child.greet());            // "hi"（从原型继承来的方法）
```

### 3. 构造函数 / class + new

```javascript
function User(name) {
  this.name = name;
}
const u1 = new User("Alice");

// 更现代的写法：class（详见 03.3）
class User2 {
  constructor(name) { this.name = name; }
}
const u2 = new User2("Bob");
```

::: tip 什么时候选哪种
- 普通数据 → **字面量**（最快最直观）
- 需要自定义原型 / 纯字典 → **Object.create**（`Object.create(null)` 可做无原型的纯净字典）
- 需要模板批量造对象 → **构造函数 / class**
:::

## 属性操作：增删改查

```javascript
const user = { name: "Alice" };

// 读取（点语法）
user.name;                    // "Alice"

// 修改
user.age = 25;                // 新增属性 age
user.age = 26;                // 再赋值就是修改

// 删除
delete user.age;              // true（删除成功）
// delete user.name;          // 也能删

// 判断属性是否存在
"name" in user;               // true
"age" in user;                // false
```

### 方括号语法与动态键名

点语法要求键名是**合法标识符**；方括号语法可以放**任何字符串表达式**（动态键名），两者也能混用：

```javascript
const key = "score";
const player = {
  [key]: 99,                  // 计算属性名：键名是变量 key 的值 "score"
  "favorite-color": "blue",   // 带连字符的键必须用方括号访问
};

player.score;                 // 99
player["score"];              // 99
player["favorite-color"];     // "blue"（点语法 player.favorite-color 会解析出错）
```
::: warning 键名都会被转成字符串
对象的键最终都是字符串：`{ [true]: 1 }` 的键是 `"true"`，`{ [1]: "a" }` 的键是 `"1"`。
:::

### in 与 hasOwnProperty 的区别

- `in`：**自身或继承**的属性都算（会沿原型链查找）
- `hasOwnProperty`：**只看自身属性**，不沿原型链

```javascript
const obj = Object.create({ inherited: 1 });   // 原型上有 inherited
obj.own = 2;

"inherited" in obj;            // true（继承的也算）
obj.hasOwnProperty("inherited"); // false（不是自己的）
"own" in obj;                  // true
obj.hasOwnProperty("own");     // true
```

## 遍历对象

```javascript
const user = { name: "Alice", age: 25 };

Object.keys(user);     // ["name", "age"]        键
Object.values(user);   // ["Alice", 25]          值
Object.entries(user);  // [["name","Alice"], ["age",25]]  键值对

// 配合 for...of 遍历
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

::: warning for...in 慎用
`for...in` 会遍历**自身 + 继承**的所有可枚举属性（还有顺序不稳定等问题）。遍历对象键请优先 `Object.keys()` / `Object.entries()` + `for...of`。
:::

## 对象不可变性（进阶）

```javascript
const obj = { a: 1 };

Object.freeze(obj);     // 冻结：不可增、删、改（严格模式下操作会抛错）
// obj.a = 2;           // 静默失败 / 严格模式抛 TypeError
// delete obj.a;        // 不行

Object.seal(obj);       // 密封：不可增、删，但可以改已有值
// Object.seal 之后：obj.a = 2 ✅；obj.b = 3 ❌

Object.defineProperty(obj, "x", {
  value: 1,
  writable: false,      // 只读
});
// obj.x = 2;           // 静默失败（严格模式抛错）
```

::: tip freeze 也是浅的
`Object.freeze` 只冻结**第一层**，嵌套对象依然可以改。要做深度冻结需要递归处理（或配合 structuredClone 使用）。
:::

## 常见坑点

- 对象是**引用类型**：`const b = a` 后改 `b` 会影响 `a`（详见 [03.4 深浅拷贝](/03-js/03-objects/04-copy-objects)）
- `const` 对象可以修改属性：`const` 只锁"重新赋值"，不锁"改内容"
- 键名转字符串：数字键、布尔键都会变成字符串
- `for...in` 遍历出继承属性、`Object.keys` 不会——按需选择
- 读取不存在的属性返回 `undefined`（不会报错），但**读取 `undefined` 上的属性**才会报错：`user.address.city` 中 `address` 不存在时抛 `TypeError`

## 小结

- 对象是键值对集合，三种创建方式：字面量 / Object.create / 构造函数+new
- 属性增删改查 + 方括号动态键名；`in` 查继承链，`hasOwnProperty` 只看自身
- 遍历推荐 `Object.keys` / `values` / `entries`，慎用 `for...in`
- 不可变：`freeze` 全冻、`seal` 半冻、`defineProperty` 精细控制（都是浅的）

::: tip 速查卡片
对象创建与属性操作速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::
