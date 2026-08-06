---
title: JS 对象与原型完整手册
---

# JS 对象与原型

## 核心概念

对象 = 键值对集合，一切引用类型的容器；原型链让对象「继承」共享的方法。

## 完整内容

### 是什么 / 为什么

对象组织「相关的数据 + 行为」。JS 的继承基于**原型链**而非类，但 `class` 语法把原型继承包装得直观。理解「对象字面量 → 原型 → class」三者的关系，是组织代码结构的根基。

### 一、创建与操作对象

```javascript
// 对象字面量（最常见）
const user = {
  name: "张三",
  age: 20,
  greet() {
    return `你好，我是${this.name}`;
  },
};

// 增删改查
user.email = "a@b.com";     // 新增
user.age = 21;              // 修改
delete user.email;          // 删除

// 读取不存在的属性 → undefined（不报错）
user.phone;                 // undefined

// 遍历
Object.keys(user);          // ["name","age"]
Object.values(user);        // ["张三",20]
Object.entries(user);       // [["name","张三"],["age",20]]
for (const key in user) {}  // for...in 遍历键（含原型链，慎用）
```

**可选链防崩溃**：

```javascript
user?.address?.city;        // 中途为空不报错
```

### 二、常用静态方法

| 方法 | 作用 |
| :--- | :--- |
| `Object.keys(o)` | 键数组 |
| `Object.values(o)` | 值数组 |
| `Object.entries(o)` | 键值对数组 |
| `Object.assign(target, ...src)` | 合并对象（浅拷贝） |
| `Object.freeze(o)` | 冻结（只读，浅层） |
| `Object.hasOwn(o, key)` | 是否自有属性 |

**浅拷贝 vs 深拷贝**：

```javascript
const clone = { ...user };        // 浅拷贝：第一层独立，嵌套对象仍共享
const deep = structuredClone(user); // 深拷贝（现代浏览器内置）

// 浅拷贝陷阱：clone.addr === user.addr（同一个引用）
```

### 三、class 语法（面向对象）

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} 叫了一声`;
  }
  static create(name) {           // 静态方法：类上调用，不在实例上
    return new Animal(name);
  }
}

class Dog extends Animal {        // 继承
  constructor(name) {
    super(name);                  // 先调父构造器
  }
  speak() {
    return `${super.speak()}，汪汪！`;  // 复用父方法
  }
}
```

**私有字段（#）**：

```javascript
class Counter {
  #count = 0;                     // 私有：外部访问不到
  increment() {
    this.#count++;
  }
  get value() {
    return this.#count;           // getter 只读暴露
  }
}
```

### 四、原型链（本质）

```javascript
const obj = {};
obj.toString();   // 对象上没有 toString，沿原型链找到 Object.prototype

// 原型关系
dog instanceof Dog;              // true（实例是否在原型链上）
dog.constructor === Dog;         // 实例构造器
Object.getPrototypeOf(dog);      // 拿到原型对象
```

**原型链示意图**：

```
dog → Dog.prototype → Animal.prototype → Object.prototype → null
```

查找属性时**逐层向上**，找不到返回 undefined。给原型加方法，所有实例共享（节省内存）：

```javascript
Dog.prototype.bark = function () {
  return "汪汪";
};
```

### 语法速查

| 意图 | 写法 | 说明 |
| :--- | :--- | :--- |
| 创建 | `{ key: value }` | 字面量最常用 |
| 简写 | `{ name, age }` | 变量名即键名 |
| 方法 | `greet() {}` | 省略 `: function` |
| 合并/拷贝 | `{ ...a, ...b }` / `Object.assign` | 浅拷贝 |
| 深拷贝 | `structuredClone(o)` | 现代内置 |
| 类 | `class X extends Y` | 构造器 + 方法 |
| 私有 | `#field` | 真正私有 |
| 静态 | `static fn() {}` | 类级方法 |
| getter | `get value() {}` | 读取时执行 |

### 常见用法

**数据整理（entries 反转）**：

```javascript
const byId = Object.fromEntries(
  users.map((u) => [u.id, u])
);   // 数组 → 以 id 为键的对象（查找 O(1)）
```

**合并配置**：

```javascript
const config = { ...defaults, ...userConfig };  // 后者覆盖前者
```

### 注意事项

- ⚠️ `{ ...a }` 是浅拷贝，嵌套对象还是共享引用，要深拷贝用 `structuredClone`。
- ⚠️ `for...in` 会遍历到原型链上的键，遍历对象用 `Object.keys()` 或 `Object.entries()`。
- ⚠️ class 里 `extends` 必须先 `super()` 才能用 `this`。
- ⚠️ 私有字段 `#` 是真私有；下划线 `_field` 只是约定，外部照样能访问。
- ⚠️ 判断属性存在用 `Object.hasOwn(o, k)` 或 `k in o`（含原型），`o.k === undefined` 不可靠（值真可能为 undefined）。

## 相关

- 🔍 场景索引：[数据处理](/3-reference/2-scenarios/data)
- 📖 相邻手册：[数组](/3-reference/1-handbook/js/array)、[函数](/3-reference/1-handbook/js/functions)
