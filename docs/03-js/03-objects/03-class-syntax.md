---
title: 03.3 class 语法
---

# class 语法：构造函数的糖衣

## 它是什么

ES6 的 `class` 是**构造函数的语法糖**——底层还是"构造函数 + 原型"那一套（详见 [03.2 原型链](/03-js/03-objects/02-prototype-chain)），只是把写法包装得更清晰、更像 Java/C++ 的类。它没有引入新的继承机制，只换了件更顺手的衣服。

```javascript
// 等价的两段代码：

// 构造函数写法
function Person(name) { this.name = name; }
Person.prototype.greet = function () { return `Hi, ${this.name}`; };

// class 写法（同义）
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi, ${this.name}`; }
}
```

::: tip 一句话理解
`class` 里的 `constructor` 就是原构造函数；`greet()` 自动挂到 `Person.prototype` 上——本质没变，只是更好读。
:::

## 基础语法：constructor / 实例方法 / 静态方法

```javascript
class Animal {
  // 构造器：new 时自动执行，用来初始化属性
  constructor(name) {
    this.name = name;
  }

  // 实例方法：挂在 prototype 上，所有实例共享
  speak() {
    return `${this.name} 发出声音`;
  }

  // 静态方法：挂在类自己身上，实例访问不到
  static kingdom() {
    return "动物界";
  }
}

const dog = new Animal("旺财");
dog.speak();            // "旺财 发出声音"（实例方法）
Animal.kingdom();       // "动物界"（静态方法：类上调用）
// dog.kingdom();       // ❌ TypeError：实例上没有静态方法
```

三个概念别混淆：

| 类型 | 定义位置 | 怎么调用 | 例子 |
| --- | --- | --- | --- |
| 构造器 | class 内部 | `new` 时自动执行 | 初始化属性 |
| 实例方法 | prototype | `实例.方法()` | `dog.speak()` |
| 静态方法 | 类本身 | `类名.方法()` | `Animal.kingdom()` |

## 继承：extends 与 super

`extends` 声明继承关系，`super` 有两个用途：

1. **`super(...)`**：调用父类构造器（子类构造器里**必须先 super 再碰 this**）
2. **`super.xxx()`**：调用父类的方法

```javascript
class Dog extends Animal {                 // Dog 继承 Animal
  constructor(name, breed) {
    super(name);        // ① 必须先调用父类构造器，初始化 name
    this.breed = breed; // ② 之后才能访问 this
  }

  // 方法覆盖（多态）：同名方法把父类的"顶掉"
  speak() {
    return `${this.name} 汪汪叫`;
  }

  info() {
    return `${super.speak()}，品种是${this.breed}`;  // 调用父类方法
  }
}

const dog = new Dog("旺财", "金毛");
dog.speak();            // "旺财 汪汪叫"（子类覆盖后的版本）
dog.info();             // "旺财 发出声音，品种是金毛"（super.speak() 调父类版本）
```

::: danger super 必须在 this 之前
子类构造器里**不调用 `super()` 就用 `this`**，会直接抛 `ReferenceError`。原因：子类的 `this` 要靠父类构造器来"初始化"（底层是先把父类实例建好，再往上面补子类属性）。
:::

```javascript
class BadDog extends Animal {
  constructor(name, breed) {
    this.breed = breed;      // ❌ ReferenceError: Must call super constructor before this
    super(name);
  }
}
```

## 方法覆盖（多态）

多态 = 同一个方法名，不同子类有不同行为：

```javascript
class Cat extends Animal {
  speak() { return `${this.name} 喵喵叫`; }
}

const dog = new Dog("旺财", "金毛");
const cat = new Cat("咪咪");
const pig = new Animal("佩奇");

[dog, cat, pig].forEach(a => console.log(a.speak()));
// "旺财 汪汪叫" / "咪咪 喵喵叫" / "佩奇 发出声音"
```

所有 `Animal` 的实例都能 `speak()`，但各自的行为不同——这就是**多态**。调用方完全不需要关心具体是哪种动物。

## 其他实用语法

```javascript
class Counter {
  // 类字段：声明式初始化（不必写在构造器里）
  count = 0;

  // 私有字段：# 开头，外部访问不到（ES2022）
  #secret = 42;

  getSecret() { return this.#secret; }

  // getter / setter：像属性一样访问，实际是方法
  get double() { return this.count * 2; }
  set reset(n) { this.count = n; }
}

const c = new Counter();
c.count;             // 0（类字段）
c.#secret;           // ❌ SyntaxError：私有字段外部不可访问
c.getSecret();       // 42
c.double;            // 0（getter 像属性一样读）
c.reset = 10;        // setter 像属性一样写
```

::: tip 私有字段 #
用 `#` 开头的字段是真正的**私有**：外部读不到、也拿不到引用，比"闭包模拟私有"更彻底（ES2022 起可用）。
:::

## 常见坑点

- **class 没有提升**：定义前使用会报 `ReferenceError`（和函数声明不同）
- 类名必须大写开头（`class dog` 语法不报错，但违反惯例且 `new dog` 会因 TDZ 类语义报错）
- 子类构造器**必须先 `super()`** 再操作 `this`
- 静态方法**不能**通过实例调用；实例方法也不能用类名直接调用
- class 里的方法**默认不可枚举**（和 `Person.prototype.greet = ...` 不同），一般不影响使用
- 需要动态 `this` 的回调里，别用 `this.method` 直接传参，会丢 this——用箭头函数包一层或 `bind`

## 小结

- `class` 是构造函数+原型的语法糖：`constructor` = 构造器，方法 = prototype 上的共享方法
- 实例方法实例调、静态方法类名调、构造器 `new` 时自动执行
- `extends` 继承、`super()` 调父类构造器（必须最先）、`super.xxx()` 调父类方法
- 同名方法覆盖实现多态；`#` 私有字段、getter/setter 让 class 更完整

::: tip 速查卡片
class 语法与继承速查，见 [对象与原型速查](/cheatsheet/data/object-prototype)。
:::
