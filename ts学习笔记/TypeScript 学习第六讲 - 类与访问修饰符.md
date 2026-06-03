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

const p = new Person("张三", 25);
console.log(p.greet());
```

> 和 Java 的区别：TS 不需要 getter/setter 就能直接访问属性（默认公开）。

---

## 2. 访问修饰符

TS 支持 `public`、`private`、`protected`，和 Java 用法完全一致：

| 修饰符 | 类内 | 子类 | 类外 |
|--------|------|------|------|
| `public`（默认） | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ❌ |
| `private` | ✅ | ❌ | ❌ |

```typescript
class Employee {
    public name: string;           // 默认就是 public
    private salary: number;        // 只能在类内访问
    protected department: string;  // 类内 + 子类可访问

    constructor(name: string, salary: number, dept: string) {
        this.name = name;
        this.salary = salary;
        this.department = dept;
    }
}
```

> **注意**：TS 的 `private`/`protected` 只是**编译时检查**，编译后的 JS 代码中这些修饰符都不存在，属性仍然可以通过 `obj.salary` 访问。Java 则是运行时就保护。

---

## 3. 参数属性简写（TS 特有）

TS 允许在构造函数参数中直接声明属性，省掉冗余代码：

```typescript
// 传统写法（和 Java 一样）
class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// TS 简写（推荐）
class Person {
    constructor(
        public name: string,
        public age: number
    ) {}
}
```

> Java 没有这个语法。TS 的简写会自动创建同名的实例属性并赋值，等价于上面的传统写法。

---

## 4. readonly 属性

和 interface 一样，类属性也可以用 `readonly` 标记：

```typescript
class User {
    readonly id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;       // 构造函数内可以赋值
        this.name = name;
    }
}

const u = new User("123", "张三");
u.name = "李四";   // OK
u.id = "456";      // ❌ 编译错误：id 是只读的
```

> 类似 Java 的 `final` 字段，创建后不能修改。

---

## 5. 继承 extends

和 Java 完全一样：

```typescript
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    move(): string {
        return `${this.name} is moving`;
    }
}

class Dog extends Animal {
    breed: string;
    constructor(name: string, breed: string) {
        super(name);  // 必须先调用 super
        this.breed = breed;
    }
    bark(): string {
        return "汪汪!";
    }
}
```

---

## 6. 方法重写 override

TS 支持 `override` 关键字（可选），显式标记重写：

```typescript
class Animal {
    speak(): string { return "..." }
}

class Dog extends Animal {
    override speak(): string { return "汪汪!" }  // override 可选，建议写上
}
```

> Java 用 `@Override` 注解。TS 的 `override` 关键字更直接，编译器会检查你是否真的重写了父类方法，没重写就报错。

---

## 7. 静态成员 static

和 Java 一样用 `static` 标记类级别的属性和方法：

```typescript
class MathUtil {
    static PI = 3.14159;

    static add(a: number, b: number): number {
        return a + b;
    }
}

MathUtil.PI;         // 3.14159
MathUtil.add(1, 2);  // 3
```

> 和 Java 完全一致。

---

## 8. 抽象类 abstract

```typescript
abstract class Shape {
    abstract getArea(): number;  // 抽象方法，子类必须实现

    describe(): string {
        return `Area: ${this.getArea()}`;
    }
}

class Circle extends Shape {
    radius: number;
    constructor(radius: number) {
        super();
        this.radius = radius;
    }
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}
```

> 和 Java 的 `abstract class` 完全一样：不能实例化，子类必须实现抽象方法。

---

## 9. 类实现接口

用 `implements` 让类实现接口，和 Java 一样：

```typescript
interface Printable {
    print(): string;
}

class Document implements Printable {
    content: string;
    constructor(content: string) {
        this.content = content;
    }
    print(): string {
        return this.content;
    }
}
```

> Java 的 `implements` 是运行时契约；TS 的 `implements` 只是**编译时类型检查**，运行时不验证。

---

## 快速自测

1. TS 类中属性的默认访问修饰符是什么？
2. TS 的 `private` 和 Java 的 `private` 有什么关键区别（运行时层面）？
3. TS 的"参数属性简写"语法是什么？Java 中有类似写法吗？
4. `override` 关键字在 TS 中的作用是什么？
5. `abstract` 类和普通类有什么区别？
6. TS 的 `static` 和 Java 的 `static` 用法一样吗？
