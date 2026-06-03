# TypeScript 学习第五讲 — 泛型 Generics

> 来源：[TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

## 1. 泛型基础

泛型让你可以写**可复用的、类型安全的**代码，不用 `any` 牺牲类型检查。

### 1.1 问题：没有泛型时

```typescript
// 用 any — 丢失类型信息
function identity(value: any): any {
    return value;
}

let result = identity("hello");  // result 类型是 any，没有 string 的信息
```

### 1.2 用泛型解决

```typescript
function identity<T>(value: T): T {
    return value;
}

let result = identity("hello");  // result 类型是 string ✅
```

> Java 对比：`public <T> T identity(T value)` — **语法几乎一样！** `T` 是类型参数，调用时自动推断。

### 1.3 泛型类型参数调用方式

```typescript
// 方式 1：TS 自动推断（推荐）
identity("hello");   // T 推断为 string

// 方式 2：显式指定（类似 Java）
identity<string>("hello");  // 显式告诉 T = string
```

> Java 也是自动推断为主，显式指定只在必要时（如 `Collections.<String>emptyList()`）。

---

## 2. 泛型函数

和 Java 一样，TS 的泛型可以约束参数之间的关系：

```typescript
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

firstElement([1, 2, 3]);      // 返回类型 number | undefined
firstElement(["a", "b"]);     // 返回类型 string | undefined
```

> Java 写法：`public <T> T firstElement(T[] arr)` — 完全对应。

### 2.1 多个类型参数

```typescript
function map<Input, Output>(
    arr: Input[],
    func: (arg: Input) => Output
): Output[] {
    return arr.map(func);
}

map([1, 2, 3], (n) => n.toString());  // 返回 string[]
```

> 类似 Java 的 `BiFunction<Input, Output, R>` 泛型映射。

---

## 3. 泛型约束（Constraints）

用 `extends` 关键字约束泛型必须满足某个条件：

```typescript
// T 必须有 length 属性
function len<T extends { length: number }>(value: T): number {
    return value.length;
}

len("hello");           // string 有 length ✅
len([1, 2, 3]);         // Array 有 length ✅
len(123);               // number 没有 length ❌
```

> Java 对比：`public <T extends HasLength> int len(T value)` — 也是用 `extends` 做约束。

### 3.1 用 keyof 约束

`keyof` 获取对象的所有 key 的联合类型：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let user = { name: "张三", age: 25 };
getProperty(user, "name");   // ✅ 返回 string
getProperty(user, "email");  // ❌ "email" 不在 keyof user 中
```

> Java 没有 `keyof` 这个概念。最接近的是反射中的字段枚举，但完全不同。

---

## 4. 泛型接口

接口也可以使用泛型参数：

```typescript
interface Box<T> {
    content: T;
}

let stringBox: Box<string> = { content: "hello" };
let numberBox: Box<number> = { content: 42 };
```

> 这和 Java 的 `interface Box<T> { T getContent(); }` 完全对应！

### 4.1 泛型工具接口

```typescript
// 类似 Java 的 Optional<T>
interface Optional<T> {
    value: T | undefined;
}

// 类似 Java 的 List<T>
interface Array<T> {
    push(...items: T[]): number;
    pop(): T | undefined;
    // ...
}
```

---

## 5. 泛型类

类也可以使用泛型：

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

> Java 中的 `class Box<T> { private T content; }` — 语法几乎一样。

---

## 6. 泛型工具类型（Utility Types）

TS 内置了很多实用的泛型工具类型，这在 Java 中是没有的：

### 6.1 Partial<T> — 所有属性变为可选

```typescript
interface User {
    name: string;
    email: string;
    age: number;
}

// Partial<User> 等价于 { name?: string; email?: string; age?: number; }
let partialUser: Partial<User> = { name: "张三" };
```

> Java 没有内置工具。通常用 Builder 模式或 Lombok 的 `@Builder` 实现。

### 6.2 Required<T> — 所有属性变为必填

```typescript
interface Config {
    host?: string;
    port?: number;
}

// Required<Config> 等价于 { host: string; port: number; }
let fullConfig: Required<Config> = { host: "localhost", port: 8080 };
```

### 6.3 Pick<T, K> — 从 T 中选择部分属性

```typescript
interface User {
    name: string;
    email: string;
    age: number;
}

// Pick<User, "name" | "email"> 等价于 { name: string; email: string; }
let nameAndEmail: Pick<User, "name" | "email"> = {
    name: "张三",
    email: "zhang@example.com",
};
```

### 6.4 Omit<T, K> — 从 T 中排除部分属性

```typescript
// Omit<User, "age"> 等价于 { name: string; email: string; }
let userWithoutAge: Omit<User, "age"> = {
    name: "张三",
    email: "zhang@example.com",
};
```

### 6.5 Record<K, V> — 构建键值对类型

```typescript
// Record<string, number> 等价于 { [key: string]: number; }
let scores: Record<string, number> = {
    math: 95,
    english: 88,
};
```

> Java 中对应 `Map<String, Integer>`。

### 6.6 常用工具类型速查表

| 工具类型 | 作用 | Java 近似 |
|----------|------|-----------|
| `Partial<T>` | 所有属性可选 | Lombok `@Builder` |
| `Required<T>` | 所有属性必填 | 无 |
| `Pick<T, K>` | 选部分属性 | 无，新定义接口 |
| `Omit<T, K>` | 排除部分属性 | 无，新定义接口 |
| `Record<K, V>` | 键值对映射 | `Map<K, V>` |
| `Readonly<T>` | 所有属性只读 | `Collections.unmodifiableXxx` |
| `Exclude<T, U>` | 从 T 中排除 U | 无 |
| `Extract<T, U>` | 从 T 中提取 U | 无 |

---

## 7. 泛型 vs any 的对比

```typescript
// ❌ 用 any — 类型信息丢失
function badSwap(a: any, b: any): [any, any] {
    return [b, a];
}
let [x, y] = badSwap(1, "hello");  // x, y 都是 any

// ✅ 用泛型 — 类型信息保留
function goodSwap<T, U>(a: T, b: U): [U, T] {
    return [b, a];
}
let [x, y] = goodSwap(1, "hello");  // x 是 string, y 是 number
```

> **黄金法则**：能用泛型解决的地方，不要用 `any`。

---

## 8. 泛型推断 vs 显式指定

```typescript
function identity<T>(value: T): T {
    return value;
}

identity("hello");        // T 自动推断为 string ✅（推荐）
identity<string>("hello"); // 显式指定 T = string
```

> 和 Java 一样，**让编译器推断**是推荐做法。只有推断失败时才显式指定。

---

---

## 快速自测（问答参考答案）

### 1. TypeScript 中 `<T>` 泛型和 Java 的 `<T>` 泛型在语法上有什么相似之处？

**答：** 语法几乎完全一样：`function identity<T>(value: T): T` 对应 Java 的 `public <T> T identity(T value)`。类型参数都用 `<T>` 声明，放在函数名/类名后面，调用时自动推断。

### 2. 为什么 `function identity(value: any): any` 不好？泛型解决了什么问题？

**答：** `any` 切断了参数和返回值之间的类型关联，调用后丢失类型信息。

```typescript
function badIdentity(value: any): any {
    return value;
}
let result = badIdentity("hello");  // result 类型是 any，丢失 string 信息
```

泛型 `<T>` 告诉 TS："输入是什么类型，输出就是什么类型"，类型信息贯穿始终。

### 3. `T extends { length: number }` 的含义是什么？对应 Java 的什么语法？

**答：** 约束 `T` 必须有 `length` 属性且是 `number` 类型。对应 Java 的泛型上限：`<T extends HasLength>`。

区别：TS 是**结构类型**，只要对象结构里有 `length: number` 就行（字符串、数组都行）；Java 是**名义类型**，必须是具体的子类或实现了某个接口的类。

### 4. `keyof T` 的作用是什么？Java 中有类似的概念吗？

**答：** 获取对象所有**键（key）**的联合类型（字面量字符串）。

```typescript
interface User { name: string; age: number; }
type Keys = keyof User;  // "name" | "age"
```

Java 没有 `keyof`。最接近的是反射中的字段枚举，但完全不同。

### 5. `Partial<User>` 和 `Pick<User, "name" | "email">` 分别做了什么？

**答：**

| 工具类型 | 作用 |
| ------ | ------ |
| `Partial<User>` | 让 `User` 所有属性变成可选 |
| `Pick<User, "name" \| "email">` | 只保留指定的属性，其余属性不存在 |

### 6. `Record<string, number>` 对应 Java 中的什么类型？

**答：** 对应 Java 的 `Map<String, Integer>`。构建键值对类型。

### 7. 泛型函数的类型参数调用时需要显式指定吗？什么时候需要？

**答：** 不需要，**让编译器自动推断**是推荐做法。只有推断失败时（如返回值依赖泛型但参数里没有泛型信息）才显式指定。

### 8. 泛型和 `any` 的根本区别是什么？

**答：** `any` 丢失类型信息，泛型保留类型信息。

```typescript
// any — 类型信息丢失
function badSwap(a: any, b: any): [any, any] { return [b, a]; }
let [x, y] = badSwap(1, "hello");  // x, y 都是 any

// 泛型 — 类型信息保留
function goodSwap<T, U>(a: T, b: U): [U, T] { return [b, a]; }
let [x, y] = goodSwap(1, "hello");  // x 是 string, y 是 number
```

**黄金法则**：能用泛型解决的地方，不要用 `any`。
