# TypeScript 学习第二讲 — 接口 Interface 与对象类型

> 来源：[TypeScript Handbook — Objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

## 1. 接口基础

`interface` 用来定义对象的**形状（shape）**：

```typescript
interface Person {
    name: string;
    age: number;
}

let person: Person = { name: "张三", age: 25 };
```

### 与 Java 的 interface 对比

| 特性 | Java interface | TypeScript interface |
| ------ | ------ | ------ |
| 作用 | 定义行为契约 | 定义对象的形状 |
| 实现 | `implements` | 对象字面量直接匹配 |
| 运行时 | 存在于运行时 | 编译后被擦除 |

> **核心区别**：TS 用**结构类型**，只要属性匹配就行，不需要显式声明"我实现了这个接口"。

```typescript
interface Point { x: number; y: number; }
const p = { x: 10, y: 20 };  // 不需要 implements，直接当 Point 用
```

### 接口中定义方法

```typescript
interface User {
    name: string;
    greet(): string;
}

let user: User = {
    name: "张三",
    greet() { return `Hello, I'm ${this.name}!`; },
};
```

---

## 2. 可选属性

用 `?` 标记属性为可选：

```typescript
interface User {
    name: string;
    email?: string;
    age?: number;
}

let u1: User = { name: "张三" };  // OK
```

---

## 3. 只读属性

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

const p: Point = { x: 10, y: 20 };
p.x = 30;  // ❌ 编译错误
```

> 类似 Java 的 `final`，但只在**编译时**检查。

---

## 4. 索引签名

当你不知道对象会有哪些 key，但知道 key 和 value 的类型时：

```typescript
interface StringMap {
    [key: string]: string;
}

let map: StringMap = { name: "张三", city: "北京" };
map.email = "test@example.com";  // OK
```

> Java 中最接近的是 `Map<String, String>`。

---

## 5. 接口扩展

```typescript
interface Animal { name: string; }

interface Dog extends Animal {
    breed: string;
    bark(): string;
}
```

一个接口可以 `extends` 多个接口。

---

## 6. type vs interface

| 特性 | interface | type |
| ------ | ------ | ------ |
| 定义对象 | ✅ | ✅ |
| extends | ✅ | ❌（用交叉类型 `&`） |
| 联合类型 | ❌ | ✅ |
| 基本类型别名 | ❌ | ✅ |

**推荐实践：**
- 定义**对象形状**时优先用 `interface`
- 定义**联合类型、元组、基本类型别名**时用 `type`

---

## 7. implements 关键字

```typescript
interface Printable { print(): string; }

class Document implements Printable {
    constructor(public content: string) {}
    print(): string { return this.content; }
}
```

> TS 的 `implements` 只是**编译时类型检查**，运行时不验证。

---

## 8. 结构类型 vs 名义类型

```typescript
interface Point2D { x: number; y: number; }
interface Point3D { x: number; y: number; }

let p2d: Point2D = { x: 10, y: 20 };
let p3d: Point3D = p2d;   // ✅ TS 允许！因为结构一样
```

> Java 是**名义类型**：`Point2D` 和 `Point3D` 是不同的名字，即使属性完全一样也不能互相赋值。TS 是**结构类型**：只要属性形状匹配就可以赋值。

---

## 快速自测（问答参考答案）

<details>
<summary>1. TS 的 interface 和 Java 的 interface 最大区别是什么？</summary>

TS 用结构类型（属性匹配就行），Java 用名义类型（名字必须匹配）。
</details>

<details>
<summary>2. 如何在 interface 中标记属性为可选？</summary>

用 `?` 标记：`email?: string;`
</details>

<details>
<summary>3. readonly 和 const 有什么区别？</summary>

`const` 用于变量，`readonly` 用于属性。
</details>

<details>
<summary>4. 索引签名对应 Java 中的什么？</summary>

`Map<String, String>`。
</details>

<details>
<summary>5. interface 和 type 什么时候用哪个？</summary>

对象形状用 interface；联合类型/元组/别名用 type。
</details>

<details>
<summary>6. TS 是结构类型还是名义类型？</summary>

结构类型 — 只要属性形状匹配就可以赋值，不管接口名字是否一样。
</details>
