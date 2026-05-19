# JS 学习第十讲 - 使用类（Using Classes）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_classes

## 核心概念

- JS 的 `class` 是 ES6（2015）引入的**语法糖**，底层仍是**原型链继承**
- 类通过 `new` 创建实例，构造函数用 `constructor` 关键字
- JS 支持**硬私有**字段（`#` 前缀）、访问器（getter/setter）、静态属性、继承（`extends`）

> 硬私有：比如我们在 Python 中定义一个私有的实例变量，我们可能会在__init__ 方法里写上 self.__color=xxxx,这样写之后，如果我们在类的实例中使用 obj.__color 是会报 `AttributeError` 错误，但是实际上我们可以通过 obj._类名.__color 这种方式来访问到这个私有变量值，这种方式算不上硬私有

## 知识点详解

### 1. 类的声明与实例化

```js
class Color {
    constructor(r, g, b) {
        this.values = [r, g, b];
    }
    getRed() {
        return this.values[0];
    }
}

const red = new Color(255, 0, 0);
```

**类 vs 函数构造器的对应关系：**

| class 语法 | 等价的函数构造器写法 |
|---|---|
| `class MyClass {}` | `function MyClass() {}` |
| `constructor() {}` | 函数体本身 |
| `myMethod() {}` | `MyClass.prototype.myMethod = function() {}` |
| `static myStatic() {}` | `MyClass.myStatic = function() {}` |
| `#privateField` | ❌ 函数构造器无等价语法 |

**类不会提升（No Hoisting）：**

```js
new MyClass();  // ReferenceError！类声明不像函数那样被提升
class MyClass {}
```

等价于 `let`/`const` 的暂时性死区行为。

**类必须用 `new` 调用：**

```js
class MyClass {}
MyClass();  // TypeError: Class constructor MyClass cannot be invoked without 'new'
```

### 2. 实例方法 vs 构造函数内定义函数

```js
// ✅ 推荐：方法定义在原型上，所有实例共享
class Color {
    getRed() { return this.values[0]; }
}
new Color().getRed === new Color().getRed;  // true（同一个函数）

// ❌ 不推荐：每个实例创建独立函数
class Color {
    constructor() {
        this.getRed = function() { return this.values[0]; };
    }
}
new Color().getRed === new Color().getRed;  // false（不同的函数对象）
```

方法定义在 `Color.prototype` 上，通过 `this` 区分不同实例的数据。

### 3. 私有字段（`#` 前缀）

JS 的 `#` 是"硬私有"——类外访问会报**语法错误**：

```js
class Color {
    #values;  // 声明私有字段

    constructor(r, g, b) {
        this.#values = [r, g, b];
    }

    getRed() {
        return this.#values[0];  // 类内部可以访问
    }
}

const red = new Color(255, 0, 0);
red.getRed();        // 255 ✅
red.#values;         // SyntaxError ❌ 类外不能访问
```

**同一类的方法可以访问其他实例的私有字段：**

```js
class Color {
    #values;
    constructor(r, g, b) { this.#values = [r, g, b]; }

    redDiff(anotherColor) {
        return this.#values[0] - anotherColor.#values[0];  // 可以访问！
    }
}
```

**私有字段不能被子类访问：**

```js
class Shape {
    #name = "Shape";
    toString() { return this.#name; }
}

class Circle extends Shape {
    #name = "Circle";  // 和 Shape 的 #name 是独立的
}

new Circle().toString();  // "Shape" — toString 只能看到 Shape 的 #name
```

### 4. 访问器字段（getter/setter）

用 `get`/`set` 前缀，像操作属性一样触发方法：

```js
class Color {
    #values;
    constructor(r, g, b) { this.#values = [r, g, b]; }

    get red() { return this.#values[0]; }
    set red(value) {
        if (value < 0 || value > 255) throw new RangeError("无效的 R 值");
        this.#values[0] = value;
    }
}

const red = new Color(255, 0, 0);
red.red = 100;      // 触发 setter
console.log(red.red);  // 触发 getter → 100
```

只有 getter 没有 setter → 只读属性。

### 5. 公共字段

类体中直接定义的公共字段等价于 `this.xxx = ...`：

```js
class MyClass {
    luckyNumber = Math.random();
    // 等价于：
    // constructor() { this.luckyNumber = Math.random(); }
}
```

### 6. 静态属性

用 `static` 关键字，属于**类本身**，不属于实例：

```js
class Color {
    static isValid(r, g, b) {
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }
}

Color.isValid(255, 0, 0);  // true — 通过类调用
new Color().isValid;        // undefined — 实例上没有
```

### 7. 继承（extends + super）

```js
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);      // ⚠️ 必须第一行！先初始化父类
        this.breed = breed;  // 然后才能用 this
    }
}

const d = new Dog("旺财", "哈士奇");
d.name;    // "旺财" — 继承自 Animal
d.breed;   // "哈士奇" — Dog 自己的
```

**方法覆盖 + super 调用：**

```js
class Shape {
    toString() { return "Shape"; }
}

class Circle extends Shape {
    toString() {
        return `${super.toString()}, Circle`;  // "Shape, Circle"
    }
}
```

**静态属性也会被继承：**

```js
class Color {
    static isValid(r, g, b) { return r >= 0 && r <= 255; }
}

class ColorWithAlpha extends Color {
    static isValid(r, g, b, a) {
        return super.isValid(r, g, b) && a >= 0 && a <= 1;
    }
}
```

**子类不能访问父类私有字段：**

```js
class Color {
    #values = [255, 0, 0];
}

class ColorWithAlpha extends Color {
    log() { console.log(this.#values); }  // SyntaxError！
}
```

**instanceof：**

```js
const d = new Dog("旺财", "哈士奇");
d instanceof Dog;      // true
d instanceof Animal;   // true
d instanceof Object;   // true
```

### 8. 类表达式

类可以像函数一样作为表达式赋值：

```js
const foo = class MyClass {
    getName() { return typeof MyClass; }  // 内部可访问
};

typeof foo;       // "function"
typeof MyClass;   // "undefined" — 外部不可见
```

## 常见误区

1. **对象比较 `==` 和 `===` 没区别** — 都是比引用，不是比值
2. **构造函数返回对象会覆盖 `new` 的结果** — 返回非原始类型时，`this` 被丢弃
3. **私有字段 `#` 是"硬私有"** — 类外访问是语法错误，不是运行时错误
4. **派生类必须 `super()` 在第一行** — JS 强制要求，Python 不强制
5. **子类同名私有字段不影响父类** — 两个 `#name` 是完全独立的
6. **类不会提升** — 不像函数声明，必须先声明再使用
7. **方法定义在原型上共享** — 构造函数里 `this.fn = function() {}` 每个实例独立

## JS vs Java 对比

| 特性 | Java | JavaScript |
|------|------|------------|
| 私有 | `private` 关键字 | `#` 前缀（硬私有） |
| 构造函数 | 无返回值，方法名同类名 | `constructor` 方法，可返回值 |
| 方法共享 | 实例方法自动共享 | class 语法方法在原型上共享 |
| 静态 | `static` 关键字 | `static` 关键字 |
| 继承 | `extends` | `extends`（底层是原型链） |
| super 调用 | 不强制第一行 | 必须第一行 |
| 类声明提升 | 不适用 | 不提升（暂时性死区） |
| 多继承 | 接口（interface） | mixins 或类组合 |

## 速查表

| 对比 | 说明 |
|------|------|
| `constructor` vs 工厂函数 | 前者用 `new`，后者直接调用 |
| 方法定义 vs 构造函数内函数 | 方法共享在原型上；构造函数内每个实例独立 |
| `#` 私有 vs `_` 约定 | `#` 是语法级强制私有；`_` 只是命名约定 |
| `get`/`set` vs 普通方法 | 前者像属性访问（`obj.red`）；后者需调用（`obj.getRed()`） |
| 静态 vs 实例 | 静态属类本身（`Color.isValid()`）；实例属对象（`red.getRed()`） |
| `extends` vs `Object.create` | 前者是 class 继承语法糖；后者是原型继承底层 API |
| `class` vs 函数构造器 | class 是语法糖，多了 `#` 私有、静态块等新特性 |

## 快速自测

<details>
<summary>1. 类必须用 `new` 调用吗？</summary>

是的。`MyClass()` 会抛 TypeError，必须 `new MyClass()`
</details>

<details>
<summary>2. `class` 声明会被提升吗？</summary>

不会。等价于 `let`/`const` 的暂时性死区，先声明再使用
</details>

<details>
<summary>3. 子类能访问父类的 `#` 私有字段吗？</summary>

不能。每个类的 `#` 字段都是独立的，即使是同名
</details>

<details>
<summary>4. 派生类构造函数中 `super()` 能放在 `this.xxx` 之后吗？</summary>

不能。JS 强制要求 `super()` 必须先于任何 `this` 访问
</details>

<details>
<summary>5. 构造函数返回 `{}` 会怎样？</summary>

`new` 的结果变成 `{}`，构建的 `this` 实例被丢弃
</details>
