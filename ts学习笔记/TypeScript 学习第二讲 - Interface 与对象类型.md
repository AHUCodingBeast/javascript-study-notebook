# TypeScript 学习第二讲 — 接口 Interface 与对象类型

> 来源：[TypeScript Handbook — Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

## 1. 接口基础

TypeScript 的 `interface` 用来定义对象的**形状（shape）**：有哪些属性、什么类型、是否可选。

```typescript
interface Person {
    name: string;
    age: number;
}

// 使用接口
let person: Person = {
    name: "张三",
    age: 25,
};
```

### 1.1 与 Java 的 interface 对比

| 特性 | Java interface | TypeScript interface |
|------|---------------|---------------------|
| 作用 | 定义行为契约 | 定义对象的形状（结构） |
| 方法 | 必须有方法签名 | 只描述属性，不描述实现 |
| 实现 | `implements` | 对象字面量直接匹配 |
| 运行时 | 存在于运行时（反射等） | 编译后被擦除，不产生任何 JS 代码 |

> **核心区别**：Java 的 interface 是一个真正的类型，运行时需要验证对象是否 `implements` 了它；TypeScript 用**结构类型（Structural Typing）**，只要对象的属性和接口匹配就行，不需要显式声明"我实现了这个接口"。

```typescript
interface Point {
    x: number;
    y: number;
}

// 不需要 implements，只要属性匹配就行
const p = { x: 10, y: 20 };  // 这个对象可以直接当 Point 用

// 也可以在 interface 中定义方法签名
interface User {
    name: string;
    age: number;
    // 直接定义方法
    greet(): string;
    setEmail(email: string): void;
}

let user: User = {
    name: "张三",
    age: 25,
    greet() {
        return `Hello, I'm ${this.name}!`;
    },
    setEmail(email: string) {
        console.log(`Email set to: ${email}`);
    },
};
```

> Java 中这叫 **Duck Typing** 的编译时版本："如果它走起来像鸭子、叫起来像鸭子，那它就是鸭子"。

---

## 2. 可选属性

用 `?` 标记属性为可选：

```typescript
interface User {
    name: string;
    email?: string;     // 可选
    age?: number;       // 可选
}

let u1: User = { name: "张三" };                    // OK
let u2: User = { name: "李四", email: "li@example.com" };  // OK
```

> Java interface 不支持可选属性。最接近的是 Java Bean 中的 getter 可能返回 null，但语义完全不同。

---

## 3. 只读属性

用 `readonly` 标记属性为只读（创建后不能修改）：

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

const p: Point = { x: 10, y: 20 };
p.x = 30;  // 编译错误：Cannot assign to 'x' because it is a read-only property
```

> 类似 Java 的 `final` 字段，或只有 getter 没有 setter 的不可变对象。但注意，TypeScript 的 `readonly` 只在**编译时**检查，运行时 JS 代码仍然可以修改。

### 3.1 readonly vs const

| 关键字 | 用于 | 说明 |
|--------|------|------|
| `const` | 变量 | 变量不能被重新赋值 |
| `readonly` | 属性 | 属性不能被重新赋值 |

```typescript
const x = 10;        // const 用于变量
interface Point {
    readonly x: number;  // readonly 用于属性
}
```

---

## 4. 索引签名 — 不确定的键

当你不知道对象会有哪些 key，但知道 key 和 value 的类型时：

```typescript
interface StringMap {
    [key: string]: string;
}

let map: StringMap = {
    name: "张三",
    city: "北京",
};
map.email = "test@example.com";  // OK，任意 string key 都可以
map.age = 25;    // 编译错误：25 不是 string 类型
```

> Java 中最接近的是 `Map<String, String>`。TypeScript 的索引签名语法更简洁，适合做字典/映射。

---

## 5. 接口扩展

用 `extends` 继承另一个接口：

```typescript
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
    bark(): string;
}

let dog: Dog = {
    name: "旺财",
    breed: "金毛",
    bark() {
        return "汪汪!";
    },
};
```

> 这个和 Java 的 `extends` 基本一样。一个接口可以 `extends` 多个接口（Java 的 interface 也可以多继承）。

```typescript
interface A { a: string }
interface B { b: number }
interface C extends A, B { c: boolean }  // C 包含 a, b, c 三个属性
```

---

## 6. type vs interface

TypeScript 中有两种方式定义"类型"：`interface` 和 `type`。

```typescript
// 用 interface
interface Person {
    name: string;
    age: number;
}

// 用 type
type Person = {
    name: string;
    age: number;
};
```

### 6.1 什么时候用 interface，什么时候用 type？

| 特性 | interface | type |
|------|-----------|------|
| 定义对象 | ✅ | ✅ |
| extends | ✅ | ❌（用交叉类型 `&`） |
| 联合类型 | ❌ | ✅ |
| 基本类型别名 | ❌ | ✅ |
| 元组 | ❌ | ✅ |
| 声明合并 | ✅ | ❌ |
| 计算属性 | ❌ | ✅ |

**推荐实践：**
- 定义**对象形状**时优先用 `interface`（可以被 `implements` 和 `extends`）
- 定义**联合类型、元组、基本类型别名**时用 `type`

---

## 7. implements 关键字

类可以用 `implements` 来实现接口，这和 Java 非常像：

```typescript
interface Clock {
    currentTime: Date;
    setTime(d: Date): void;
}

class MyClock implements Clock {
    currentTime: Date = new Date();

    setTime(d: Date): void {
        this.currentTime = d;
    }
}
```

> **与 Java 的区别**：Java 中 `implements` 意味着这个类"遵守这个契约"，编译和运行时都会检查；TypeScript 中 `implements` 只是**告诉编译器做类型检查**，运行时不做任何验证。

---

## 8. 函数的接口定义

接口不仅可以描述对象，也可以描述**函数签名**：

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src: string, sub: string): boolean {
    return src.includes(sub);
};
```

> Java 中对应的是 `@FunctionalInterface`，如 `Predicate<String>`。

---

## 9. 嵌套对象

接口可以嵌套定义：

```typescript
interface Address {
    city: string;
    street: string;
}

interface Person {
    name: string;
    address: Address;
}

let person: Person = {
    name: "张三",
    address: {
        city: "北京",
        street: "长安街",
    },
};
```

---

## 10. 实际案例

```typescript
// 定义一个 API 响应接口
interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// 使用
interface User {
    name: string;
    email: string;
}

let response: ApiResponse<User> = {
    code: 200,
    message: "success",
    data: {
        name: "张三",
        email: "zhang@example.com",
    },
};
```

> 这完全对应 Java 中常见的 `ApiResponse<User>` 结构。

---

## 11. 结构类型 vs 名义类型

这是 TypeScript 和 Java 类型系统最**根本的区别**：

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D {
    x: number;
    y: number;
}

let p2d: Point2D = { x: 10, y: 20 };
let p3d: Point3D = p2d;   // ✅ TypeScript 允许！因为结构一样
```

> Java 是**名义类型（Nominal Typing）**：`Point2D` 和 `Point3D` 是不同的名字，即使属性完全一样，也不能互相赋值。
> 
> TypeScript 是**结构类型（Structural Typing）**：只要对象的属性形状匹配，就可以赋值，不管接口名字是否一样。

---

## 快速自测

1. TypeScript 的 interface 和 Java 的 interface 最大的区别是什么？
2. 如何在 interface 中标记一个属性为可选？
3. `readonly` 属性的含义是什么？它和 `const` 有什么区别？
4. 索引签名 `[key: string]: string` 对应 Java 中的什么？
5. 一个接口如何继承多个接口？
6. `interface` 和 `type` 的主要区别是什么？什么时候用哪个？
7. `implements` 关键字在 TypeScript 中的作用是什么？
8. TypeScript 是结构类型还是名义类型？这意味着什么？
