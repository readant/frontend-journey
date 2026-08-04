---
title: 03. 对象与原型
---

# 对象、原型链与 class

## 它是什么

JavaScript 的对象是**无序键值对集合**，值是数据或函数（此时称为方法）。几乎所有"非原始类型"的东西都是对象——数组、函数、日期、正则都是对象。

```javascript
const user = {
  name: "Alice",
  age: 25,
  greet() {              // 方法（简写语法）
    return `Hi, I'm ${this.name}`;
  },
};
```

但对象真正的精髓不是"键值对"，而是**原型（Prototype）机制**——对象之间通过隐藏的 `[[Prototype]]` 链接共享属性，这就是继承在 JS 中的实现方式。

## 核心机制

### 1. 原型链（Prototype Chain）

每个对象都有一个隐藏的 `[[Prototype]]`（可理解为"爸爸"）。访问属性时，如果对象自身没有，就**沿原型链向上找**，直到 `Object.prototype`（最顶层），再没有返回 `undefined`。

```
user（自身：name, age）
  └─ [[Prototype]] → Person.prototype（共享方法 greet）
       └─ [[Prototype]] → Object.prototype（toString 等通用方法）
            └─ [[Prototype]] → null（尽头）
```

```javascript
const person = { greet() { return "hi"; } };
const user = Object.create(person);   // user 的原型是 person
user.name = "Alice";

console.log(user.name);    // "Alice"（自身属性）
console.log(user.greet()); // "hi"（自身没有，沿原型链找到）
```

### 2. 构造函数 + new 的原理

`new` 做了四件事（理解它 = 理解原型）：

```javascript
function Person(name) {
  this.name = name;          // 3. this 指向新对象
}
// Person.prototype 上放共享方法
Person.prototype.greet = function () { return `Hi, ${this.name}`; };

const alice = new Person("Alice");
// 1. 创建空对象
// 2. 空对象的 [[Prototype]] = Person.prototype
// 3. 执行 Person，this = 空对象
// 4. 返回该对象
```

**`instanceof` 的原理**：沿着对象的原型链，看能不能找到右侧构造函数的 `prototype`：

```javascript
alice instanceof Person;    // true
alice instanceof Object;    // true（原型链最终到 Object.prototype）
```

### 3. class 是"语法糖"

ES6 的 `class` 只是把上面的构造函数 + 原型写法**包装成更清晰的语法**，底层机制完全一样：

```javascript
class Person {
  constructor(name) { this.name = name; }   // 构造器
  greet() { return `Hi, ${this.name}`; }    // 自动挂到 Person.prototype
  static create(name) { return new Person(name); }  // 静态方法
}
```

## 标准语法

### 对象创建三方式

```javascript
// 1. 对象字面量（最常用）
const obj = { key: "value" };

// 2. Object.create（指定原型）
const child = Object.create(parentObj);

// 3. 构造函数 / class + new
const instance = new MyClass();
```

### 属性操作

```javascript
const user = { name: "Alice" };

// 读取 / 修改 / 新增
user.age = 25;                 // 新增
user["age"] = 26;              // 方括号语法（动态键名）
delete user.age;               // 删除
console.log("name" in user);   // true（in 会沿原型链找）
user.hasOwnProperty("name");   // true（只看自身属性）

// 遍历
Object.keys(user);             // ["name"]（自身可枚举键）
Object.values(user);           // ["Alice"]
Object.entries(user);          // [["name", "Alice"]]
for (const key in user) { }    // 自身 + 继承的可枚举键（慎用）
```

### class 完整语法

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() { return `${this.name} 发出声音`; }
  static kingdom() { return "动物界"; }      // 静态：类上调用
}

class Dog extends Animal {                     // 继承
  constructor(name, breed) {
    super(name);                               // 必须先调用 super
    this.breed = breed;
  }
  speak() { return `${this.name} 汪汪叫`; }    // 覆盖（多态）
}

const dog = new Dog("旺财", "金毛");
dog.speak();           // "旺财 汪汪叫"
Dog.kingdom();         // "动物界"
```

### 深浅拷贝

```javascript
// 浅拷贝：只复制一层（嵌套对象仍共享引用）
const copy1 = { ...obj };                 // 展开运算符
const copy2 = Object.assign({}, obj);     // assign

// 深拷贝：递归复制所有层级
const deep = structuredClone(obj);        // 现代浏览器原生深拷贝（推荐）
// const json = JSON.parse(JSON.stringify(obj)); // 老方案（有坑，见下）
```

## 深入理解

### 1. 浅拷贝 vs 深拷贝（为什么必须区分）

```javascript
const original = { a: 1, nested: { b: 2 } };

const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b);   // 99  ← 浅拷贝共享了嵌套对象！

const deep = structuredClone(original);
deep.nested.b = 100;
console.log(original.nested.b);   // 2   ← 深拷贝完全独立
```

::: danger JSON 深拷贝的三个坑
`JSON.parse(JSON.stringify(obj))` 会丢失：
- `undefined`、`function`、`Symbol`（直接消失）
- `Date`（变字符串）、`RegExp`（变 `{}`）
- 循环引用（直接抛错 `TypeError`）

有以上任意情况必须用 `structuredClone` 或 lodash 的 `cloneDeep`。
:::

### 2. 原型链的验证手段

```javascript
Object.getPrototypeOf(alice) === Person.prototype;  // true 标准方式
alice.__proto__ === Person.prototype;               // true（老的非标准方式，避免使用）
```

### 3. class 继承的 super 规则

- 派生类（extends 的类）构造函数里**必须先 `super()` 再访问 `this`**
- `super.method()` 调用父类方法，`super()` 调用父类构造器

### 4. 对象不可变性（进阶）

```javascript
Object.freeze(obj);      // 完全冻结（不可增删改）
Object.seal(obj);        // 密封（不可增删，可改值）
Object.defineProperty(obj, "x", { value: 1, writable: false });
// 只读属性：读取可，赋值静默失败（严格模式抛错）
```

### 5. 经典坑点

- **`for...in` 会遍历继承属性**：遍历对象键请用 `Object.keys()` + `for...of`
- **解构默认值只在 undefined 时生效**：`const { x = 1 } = { x: null }` → x 是 null（不是 1）
- **对象键名会被转成字符串**：`{ [true]: 1 }` 的键是 `"true"`
- **`Object.create(null)` 的对象没有 toString**：打印或拼接会报错

## 关联速查

::: tip 速查卡片
对象创建、原型方法、拷贝模板速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::

::: info 延伸阅读
原型链的规范细节，见 [MDN - 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)。
:::
