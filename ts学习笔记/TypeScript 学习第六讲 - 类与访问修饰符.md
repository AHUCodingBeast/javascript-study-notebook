# TypeScript 学习第六讲 — 类与访问修饰符

> 来源：[TypeScript Handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

---

## 1. 类基础

TS 的类和 Java 几乎一样：

```typescript
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}
```

---

## 2. 访问修饰符

TS 支持 `public`、`private`、`protected`，和 Java 用法一致：

| 修饰符 | 类内 | 子类 | 类外 |
| ------ | ------ | ------ | ------ |
| `public`（默认） | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

> **注意**：TS 的 `private`/`protected` 只是**编译时检查**，编译后的 JS 代码中这些修饰符都不存在。

---

## 3. 参数属性简写（TS 特有）

```typescript
// TS 简写（推荐）
class Person {
    constructor(
        public name: string,
        public age: number
    ) {}
}
```

> 自动创建同名的实例属性并赋值。Java 没有这个语法。

---

## 4. 继承 extends

```typescript
class Animal {
    constructor(public name: string) {}
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);  // 必须先调用
        this.breed = breed;
    }
}
```

---

## 5. 方法重写 override

```typescript
class Dog extends Animal {
    override speak(): string { return "汪汪!" }
}
```

> Java 用 `@Override` 注解。TS 的 `override` 关键字更直接，编译器会验证。

---

## 6. 静态成员 static

```typescript
class MathUtil {
    static PI = 3.14159;
    static add(a: number, b: number): number { return a + b; }
}

MathUtil.PI;         // 3.14159
MathUtil.add(1, 2);  // 3
```

---

## 7. 类实现接口

```typescript
interface Printable { print(): string; }

class Document implements Printable {
    constructor(public content: string) {}
    print(): string { return this.content; }
}
```

> TS 的 `implements` 只是编译时类型检查，运行时不验证。

---

## TS vs Java 对比

| 特性 | Java | TS |
| ------ | ------ | ------ |
| 私有 | `private` 关键字 | `private`（编译时检查） |
| 静态 | `static` | `static` |
| 继承 | `extends` | `extends`（底层是原型链） |
| super 调用 | 不强制第一行 | 必须第一行 |
| 多继承 | 接口 | mixins 或类组合 |

---

## 快速自测（问答参考答案）

<details>
<summary>1. TS 类中属性的默认访问修饰符是什么？</summary>

`public`（默认公开）。
</details>

<details>
<summary>2. TS 的 private 和 Java 的 private 有什么关键区别？</summary>

TS 的 `private` 只在编译时检查，编译后的 JS 中不存在，仍然可以通过 `obj.salary` 访问。Java 则运行时也保护。
</details>

<details>
<summary>3. TS 的"参数属性简写"语法是什么？</summary>

在构造函数参数前加修饰符（`public`/`private` 等），自动创建同名实例属性：`constructor(public name: string) {}`
</details>

<details>
<summary>4. override 关键字的作用是什么？</summary>

显式标记重写，编译器会验证是否真的重写了父类方法。
</details>

<details>
<summary>5. TS 的 static 和 Java 的 static 用法一样吗？</summary>

一样。都属于类本身，不属于实例，通过类名调用。
</details>
