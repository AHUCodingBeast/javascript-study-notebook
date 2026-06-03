# TypeScript 学习第一讲 — 类型注解与基本类型

> 来源：[TypeScript Handbook — Every Day Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

## 1. 什么是类型注解？

TypeScript 是 JavaScript 的**类型化超集**，在 JS 的基础上加了类型声明语法。TS 代码最终会被编译成纯 JS 运行，**类型信息只在编译阶段存在，运行时会被完全擦除**。

### 1.1 语法：在变量名后加 `: Type`

```typescript
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
```

### 1.2 Java 对比

```java
// Java —— 类型在前
String name = "张三";
int age = 25;
boolean isStudent = true;
```

```typescript
// TypeScript —— 类型在变量名后面（冒号分隔）
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
```

> **关键区别**：Java 是 `类型 变量名`，TypeScript 是 `变量名: 类型`。这种 `name: type` 语法叫"类型注解"（Type Annotation），TypeScript 用它来声明函数参数、返回值、类属性的类型。

---

## 2. 基本类型

TypeScript 的原始类型和 JS 运行时类型一一对应，全部**小写**：

| TypeScript 类型 | 对应 JS 值 | Java 对应 | 示例 |
|----------------|-----------|-----------|------|
| `string` | 字符串 | `String` | `"hello"` |
| `number` | 整数 + 浮点数 | `int`, `double`, `float` 等 | `42`, `3.14` |
| `boolean` | 布尔值 | `boolean` | `true`, `false` |
| `bigint` | 大整数 | `BigInteger` | `100n` |
| `symbol` | 唯一标识符 | 无直接对应 | `Symbol()` |

### 2.1 string

```typescript
let greeting: string = "Hello, TypeScript!";
let template: string = `你好，${greeting}`;  // 模板字符串也还是 string
```

### 2.2 number

```typescript
// TypeScript 中 number 统一表示所有数字（JS 没有 int/float 区分）
let integer: number = 42;
let float: number = 3.14;
let hex: number = 0xf00d;       // 十六进制
let binary: number = 0b1010;    // 二进制
let octal: number = 0o744;      // 八进制
```

> ⚠️ 与 Java 不同，TypeScript 的 `number` 不区分整数和浮点数。`42` 和 `3.14` 都是 `number` 类型。

### 2.3 boolean

```typescript
let isDone: boolean = false;
```

### 2.4 bigint（ES2020）

```typescript
let bigNumber: bigint = 9007199254740991n;
// 注意：number 和 bigint 不能混用
// let result: number = bigNumber + 1;  // 编译错误！
```

---

## 3. 类型推断 — TS 帮你偷懒

TypeScript 编译器很聪明，如果你**声明时就赋值**，它可以推断出类型，不需要显式写注解：

```typescript
let name = "张三";      // TS 自动推断为 string
let age = 25;           // TS 自动推断为 number
let isDone = false;     // TS 自动推断为 boolean
```

这等价于：

```typescript
let name: string = "张三";
let age: number = 25;
let isDone: boolean = false;
```

### 3.1 什么时候必须写类型注解？

| 场景 | 是否需要类型注解 | 示例 |
|------|-----------------|------|
| 声明 + 赋值同时 | ❌ 不需要，TS 会推断 | `let x = 10;` → 推断 `number` |
| 只声明不赋值 | ✅ 必须写 | `let x: number;` |
| 函数参数 | ✅ 必须写 | `function add(a: number)` |
| 函数返回值 | 建议写（不写则推断为 any） | `function get(): string` |
| 变量初始化为 null/undefined | ✅ 建议写 | `let x: string \| null = null;` |

```typescript
// 只声明不赋值 — 必须写类型
let message: string;
message = "hello";

// 函数参数 — 必须写类型
function greet(name: string): string {
    return `Hello, ${name}!`;
}
```

> 这与 Java 不同——Java 变量声明必须写类型，TypeScript 可以靠推断省掉。

---

## 4. 函数类型

### 4.1 参数类型

```typescript
function add(x: number, y: number): number {
    return x + y;
}

add(1, 2);       // 3
add("1", 2);     // 编译错误：类型不匹配
```

### 4.2 返回值类型

```typescript
// 有返回值 — 建议显式标注
function getGreeting(name: string): string {
    return `Hello, ${name}!`;
}

// 无返回值 — 标注 void
function log(message: string): void {
    console.log(message);
    // 没有 return 语句
}

// 也可以不写返回值，TS 会推断
function multiply(a: number, b: number) {
    return a * b;   // TS 推断返回类型为 number
}
```

### 4.3 void — 无返回值

```typescript
// void 表示函数不返回任何值（类似 Java 的 void）
function printHello(): void {
    console.log("Hello!");
}
```

### 4.4 可选参数

```typescript
// 用 ? 标记可选参数（必须在必填参数后面）
function greet(name: string, title?: string): string {
    if (title) {
        return `Hello, ${title} ${name}!`;
    }
    return `Hello, ${name}!`;
}

greet("张三");           // "Hello, 张三!"
greet("张三", "Dr.");    // "Hello, Dr. 张三!"
```

> Java 中没有这种语法，需要通过方法重载实现。TypeScript 的 `?` 是更简洁的替代方案。

### 4.5 默认参数

```typescript
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

greet("张三");           // "Hello, 张三!"
greet("张三", "Hi");    // "Hi, 张三!"
```

---

## 5. 数组类型

TypeScript 提供了两种语法来声明数组：

```typescript
// 语法 1：元素类型后加 []
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// 语法 2：泛型写法 Array<元素类型>
let numbers2: Array<number> = [1, 2, 3];
```

> 这两种写法完全等价。Java 中 `int[]` 和语法 1 类似，但 `Array<number>` 更像 Java 的泛型 `List<Integer>`。

### 5.1 类型安全

```typescript
let scores: number[] = [90, 85, 100];

scores.push(95);        // OK
scores.push("A");       // 编译错误：类型不匹配
scores[0] = "99";       // 编译错误：类型不匹配
```

> Java 里数组是 `int[]`，TypeScript 是 `number[]`，但 TS 会在**编译时**做类型检查，Java 在编译时也会检查泛型（类型擦除）。

---

## 6. 对象类型

### 6.1 内联对象类型

```typescript
let person: { name: string; age: number } = {
    name: "张三",
    age: 25,
};

person.name;    // OK
person.email;   // 编译错误：属性 email 不存在
```

### 6.2 可选属性

```typescript
let person: { name: string; email?: string } = {
    name: "张三",
    // email 可选，没有也不会报错
};
```

---

## 7. any 类型 — "关闭类型检查"

`any` 表示"任意类型"，相当于告诉编译器"不要检查这个变量的类型"：

```typescript
let value: any = "hello";
value = 42;          // OK
value = true;        // OK
value.foo.bar();     // OK（但运行时会报错！）
```

> ⚠️ **学习阶段避免使用 `any`**！它完全丧失了类型保护的好处。开启了 `strict: true` 后，不声明类型就赋值会导致编译错误，而不是隐式降级为 `any`。

---

## 8. 类型别名 — 给类型起个名字

用 `type` 关键字给类型起别名，类似 Java 中定义一个新类型：

```typescript
type Person = {
    name: string;
    age: number;
};

let p1: Person = { name: "张三", age: 25 };
let p2: Person = { name: "李四", age: 30 };

// 别名也支持基本类型
type ID = string | number;
let userId: ID = "abc123";
userId = 456;  // OK
```

> Java 没有直接对应的语法，最接近的是 `class` 定义。TypeScript 的 `type` 只是别名，**不会生成任何运行时代码**。

---

## 9. 联合类型 — TypeScript 独有

联合类型用 `|` 连接，表示"可以是这几种类型中的任意一种"：

```typescript
let id: string | number;
id = "abc";   // OK
id = 123;     // OK
id = true;    // 编译错误：类型不匹配
```

> Java 没有联合类型。最接近的是 Java 的泛型上限 `<T extends A | B>`，但完全不同。这是 TS 特有的类型系统特性。

### 9.1 函数中的联合类型

```typescript
function printId(id: string | number): void {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}
```

---

## 10. 字面量类型

TypeScript 可以将具体的值作为类型：

```typescript
let direction: "left" | "right" | "up" | "down";
direction = "left";     // OK
direction = "down";     // OK
direction = "north";    // 编译错误
```

这类似于 Java 的 `enum`，但更轻量：

```java
// Java
enum Direction { LEFT, RIGHT, UP, DOWN }
Direction direction = Direction.LEFT;
```

```typescript
// TypeScript
type Direction = "left" | "right" | "up" | "down";
let direction: Direction = "left";
```

---

## 11. 编译时类型检查

这是 TypeScript 与 JavaScript 的**核心区别**：

```typescript
function add(a: number, b: number): number {
    return a + b;
}

add(1, 2);        // ✅ 编译通过
add("1", 2);      // ❌ 编译报错：Argument of type 'string' is not assignable to parameter of type 'number'
```

> **运行时**，这段代码编译出来的 JS 和原始 JS 没有任何区别——类型信息已被擦除。类型检查只发生在**编译阶段**。

---

## 12. let vs const

和 JavaScript 一样，TypeScript 支持 `let` 和 `const`：

```typescript
// const — 声明后不可重新赋值
const PI: number = 3.14159;
// PI = 3;  // 编译错误

// let — 可以重新赋值
let count: number = 0;
count = 1;  // OK
```

> **最佳实践**（和 JS 一样）：优先用 `const`，需要重新赋值时才用 `let`。

---

## 快速自测

1. 在 TypeScript 中，如何声明一个 `number` 类型的变量？和 Java 语法有什么区别？
2. TypeScript 的 `number` 和 Java 的 `int` / `double` 有什么区别？
3. `let x = 10;` 这行代码中，`x` 的类型是什么？为什么？
4. 什么时候 TypeScript 推断不出类型，需要手动写注解？
5. `void` 类型表示什么？Java 中有类似的概念吗？
6. `any` 类型有什么风险？学习阶段为什么建议避免使用？
7. 如何声明一个只能存 `string` 的数组？两种语法分别是什么？
8. `type Direction = "up" | "down"` 这行代码定义的类型，在 Java 中最接近什么？
9. 函数参数加了 `?` 标记表示什么？Java 中有类似语法吗？
10. TypeScript 的类型信息在运行时会存在吗？
