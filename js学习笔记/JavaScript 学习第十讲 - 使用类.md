# JS 学习第十讲 - 使用类

> 来源：[MDN JavaScript 指南 — Using classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_classes)

---

## 核心概念

- JS 的 `class` 是 ES6 引入的**语法糖**，底层仍是**原型链继承**
- 类通过 `new` 创建实例，构造函数用 `constructor`
- JS 支持硬私有字段（`#` 前缀）、getter/setter、静态属性、继承

---

## 知识点详解

### 1. 类的声明与实例化

```javascript
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

**类不会提升（No Hoisting）：** 必须先声明再使用，等价于 `let`/`const` 的暂时性死区。

### 2. 私有字段（`#` 前缀）

JS 的 `#` 是"硬私有"——类外访问会报语法错误：

```javascript
class Color {
    #values;

    constructor(r, g, b) {
        this.#values = [r, g, b];
    }

    getRed() {
        return this.#values[0];
    }
}

const red = new Color(255, 0, 0);
red.getRed();    // 255 ✅
red.#values;     // SyntaxError ❌
```

**私有字段不能被子类访问**，每个类的 `#` 字段都是独立的。

### 3. getter/setter

```javascript
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
red.red = 100;          // 触发 setter
console.log(red.red);   // 触发 getter → 100
```

### 4. 静态属性 static

```javascript
class Color {
    static isValid(r, g, b) {
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }
}

Color.isValid(255, 0, 0);  // true — 通过类调用
new Color().isValid;       // undefined — 实例上没有
```

### 5. 继承（extends + super）

```javascript
class Animal {
    constructor(name) { this.name = name; }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);       // ⚠️ 必须第一行！
        this.breed = breed;
    }
}

const d = new Dog("旺财", "哈士奇");
d.name;    // "旺财"
d.breed;   // "哈士奇"
```

**方法覆盖 + super 调用：**

```javascript
class Circle extends Shape {
    toString() {
        return `${super.toString()}, Circle`;
    }
}
```

---

## JS vs Java 对比

| 特性 | Java | JavaScript |
| ------ | ------ | ------------ |
| 私有 | `private` 关键字 | `#` 前缀（硬私有） |
| 静态 | `static` 关键字 | `static` 关键字 |
| 继承 | `extends` | `extends`（底层是原型链） |
| super 调用 | 不强制第一行 | 必须第一行 |
| 类声明提升 | 不适用 | 不提升 |

---

## 快速自测（问答参考答案）

<details>
<summary>1. 类必须用 new 调用吗？</summary>

是的。`MyClass()` 会抛 TypeError，必须 `new MyClass()`。
</details>

<details>
<summary>2. class 声明会被提升吗？</summary>

不会。等价于 `let`/`const` 的暂时性死区，先声明再使用。
</details>

<details>
<summary>3. 子类能访问父类的 # 私有字段吗？</summary>

不能。每个类的 `#` 字段都是独立的，即使是同名。
</details>

<details>
<summary>4. 派生类构造函数中 super() 能放在 this.xxx 之后吗？</summary>

不能。JS 强制要求 `super()` 必须先于任何 `this` 访问。
</details>

<details>
<summary>5. 构造函数返回 {} 会怎样？</summary>

`new` 的结果变成 `{}`，构建的 `this` 实例被丢弃。
</details>
