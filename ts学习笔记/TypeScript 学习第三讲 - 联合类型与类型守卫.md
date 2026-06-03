# TypeScript 学习第三讲 — 联合类型与类型守卫

> 来源：[TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## 1. 回顾：联合类型

联合类型用 `|` 连接，表示变量可以是多种类型之一：

```typescript
function printId(id: string | number) {
    console.log(id.toUpperCase());  
    // ❌ 报错：Property 'toUpperCase' does not exist on type 'string | number'.
}
```

> **问题**：当 TS 不知道 `id` 到底是 `string` 还是 `number` 时，它只允许你调用两者**共有**的方法。
> `number` 没有 `toUpperCase`，所以报错了。

要解决这个问题，我们需要**类型守卫**，告诉编译器“在这个分支里，它就是 string”。

---

## 2. 类型守卫（Type Guards）与类型收窄

类型守卫是一段逻辑判断，帮助 TypeScript 在代码的某个分支里**收窄（Narrow）**变量的类型。

### 2.1 `typeof` 守卫

最常用的原生守卫，用来检查基本类型：

```typescript
function printId(id: string | number) {
    if (typeof id === "string") {
        // 在这个分支里，TS 知道 id 是 string
        console.log(id.toUpperCase());  // ✅
    } else {
        // 这里排除了 string，id 就只剩下 number
        console.log(id);  // ✅
    }
}
```

> Java 中没有 `typeof` 关键字。Java 用 `instanceof` 检查引用类型，但对基本类型（int, double）没有这种运行时检查。

### 2.2 相等性守卫（`===` 和 `!==`）

当联合类型是**字面量类型**时，可以直接用相等判断：

```typescript
function move(direction: "up" | "down" | "left" | "right") {
    if (direction === "up") {
        console.log("向上移动");
    } else if (direction === "down") {
        console.log("向下移动");
    }
    // TS 知道剩下的情况是 "left" | "right"
}
```

### 2.3 `in` 运算符守卫

用来检查对象是否拥有某个属性：

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        // TS 知道这是 Fish
        animal.swim();  // ✅
    } else {
        // TS 知道这是 Bird
        animal.fly();  // ✅
    }
}
```

> **与 Java 的区别**：Java 里你通常用 `instanceof Fish` 来判断。但 TS 这里判断的是**属性**，而不是类实例。

---

## 3. `instanceof` 守卫

检查一个对象是否是某个类的实例：

```typescript
class Dog {
    bark() { console.log("汪汪"); }
}

class Cat {
    meow() { console.log("喵喵"); }
}

function pet(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();  // ✅
    } else {
        animal.meow();  // ✅
    }
}
```

> **Java 对比**：这和 Java 的 `if (animal instanceof Dog)` **完全一致**！
> 
> **区别**：
> 1. Java 的 `instanceof` 会**改变变量的静态类型**（Java 16+ 支持模式匹配，TS 一直支持）。
> 2. TS 里如果联合类型是接口（Interface），`instanceof` 无效（接口在运行时不存在），这时候应该用 `in` 检查属性。

---

## 4. 类型断言（Type Assertions）

当你比编译器更清楚某个值的类型时，可以用 `as` 关键字进行断言（类似 Java 的强转，但**不是运行时转换**）：

```typescript
// 假设从 API 拿到一个未知类型的值
let value: unknown = "hello";

// 告诉编译器：相信我，它是 string
let len: number = (value as string).length;

// 也可以写在前头
let str = value as string;
console.log(str.toUpperCase());
```

> **与 Java 强转的区别**：
> - Java `(String) obj` 会在运行时做类型检查，如果不匹配会抛 `ClassCastException`。
> - TS `value as string` **不做任何运行时检查**，它纯粹是为了骗过编译器。如果 `value` 实际不是 string，运行时会报错。
> - **建议**：尽量用类型守卫（`typeof`、`in` 等），少用 `as`，除非你真的很有把握。

### 4.1 非空断言 `!`

如果你确定某个变量不会是 `null` 或 `undefined`，可以用 `!` 告诉编译器忽略：

```typescript
let user: User | null = getUser();
console.log(user!.name);  // 告诉 TS：user 这里一定不是 null
```

> **风险**：如果 `user` 真的是 `null`，运行时会崩。学习阶段建议用 `if (user)` 守卫来替代。

---

## 5. 自定义类型守卫（Type Predicates）

你可以定义一个函数作为类型守卫，返回值是一个**类型谓词**：

```typescript
interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

// 返回值是 `arg is Fish`，告诉 TS：如果返回 true，arg 就是 Fish
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
    if (isFish(pet)) {
        pet.swim();  // ✅ TS 知道这里是 Fish
    } else {
        pet.fly();   // ✅ TS 知道这里是 Bird
    }
}
```

> **Java 没有这种语法**。Java 通常用 `if (pet instanceof Fish)` 或模式匹配。TS 允许你抽象出复杂的判断逻辑，并让编译器理解。

---

## 6. 区分联合（Discriminated Unions）

这是 TS 中一种非常强大的设计模式：给每个类型加一个**共同的、字面量类型的属性**（叫“区分属性”），然后用它做类型守卫。

```typescript
interface Circle {
    kind: "circle";  // 区分属性
    radius: number;
}

interface Square {
    kind: "square";  // 区分属性
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
    }
}
```

> **Java 类比**：
> 1. 类似 Java 的 `enum` + `switch`，或者抽象类的多态方法。
> 2. TS 这种写法不需要定义类或方法，纯粹用数据结构驱动，非常适合描述**状态机**、**API 响应状态**（成功/失败）、**UI 组件状态**（加载中/成功/报错）。

---

## 7. 控制流分析（Control Flow Analysis）

TypeScript 不仅检查 `if`，还能理解复杂的代码流：

```typescript
function example(x: string | number) {
    if (typeof x === "string") {
        return x.toUpperCase();
    }
    // 这里排除了 string，所以 x 一定是 number
    return x.toFixed(2);  // ✅ 不需要 else 也能推断
}
```

甚至变量赋值后的变化也能推断：

```typescript
let x: string | number = Math.random() > 0.5 ? "hello" : 100;

if (typeof x === "string") {
    x = 100;  // 在分支里改了类型
}

// TS 知道这里 x 可能是 string（如果没进 if）或 number（进了 if），所以是 string | number
x.toFixed();  // ❌ string 没有 toFixed
```

---

## 8. never 类型

当一个联合类型的所有可能性都被排除了，剩下的就是 `never`（表示**永远不可能发生**）：

```typescript
function handleError(error: Error | null) {
    if (error instanceof Error) {
        console.log(error.message);
    } else if (error === null) {
        console.log("No error");
    } else {
        // 这里 error 的类型是 never，因为所有情况都被覆盖了
        const _exhaustiveCheck: never = error;
        return _exhaustiveCheck;
    }
}
```

> **用途**：用于 **switch 语句的完备性检查**。如果你漏掉了一种联合类型的情况，TS 会在 `never` 赋值那里报错，提醒你补全逻辑。
> Java 中没有直接对应的类型，最接近的是抛出异常表示“不可达代码”。

---

---

## 快速自测（问答参考答案）

### 1. 如果联合类型是 string | number，用什么守卫最方便？

**答：** 使用 `typeof` 关键字。

```typescript
function printId(id: string | number) {
    if (typeof id === “string”) {
        // id 收窄为 string
        console.log(id.toUpperCase());
    } else {
        // id 收窄为 number
        console.log(id.toFixed(2));
    }
}
```

### 2. 检查对象有没有某个属性，用什么运算符？（Java 里没有这个）

**答：** 使用 `in` 运算符。

```typescript
if (“swim” in animal) {
    animal.swim();  // TS 知道这是 Fish
}
```

与 Python 对比：

| 语言 | 检查对象属性 | 检查字典 key |
| ------ | ------------ | ------------ |
| Python | `hasattr(obj, “swim”)` | `”key” in dict` |
| TS | `”swim” in obj` | `”key” in obj` |

TS 的 `in` 同时覆盖了 Python 的 `hasattr()` 和字典的 `in`。

### 3. instanceof 守卫在什么情况下无效？

**答：** 当联合类型是 **interface** 或 **type 别名**时无效。

`instanceof` 是**运行时**运算符，它检查对象的原型链。但 TypeScript 的 `interface` 和 `type` 在编译后**完全被擦除**，不存在于运行时的 JS 中。

```typescript
// ❌ 无效 — 编译后 Fish 接口不存在
if (animal instanceof Fish) { ... }

// ✅ 有效 — 用 in 检查属性
if (“swim” in animal) { ... }

// ✅ 有效 — Dog 是一个 class，运行时存在
if (animal instanceof Dog) { ... }
```

**结论**：联合类型是接口/type 时用 `in` 守卫；联合类型是 class 实例时才用 `instanceof`。

### 4. value as string 和 Java 的 (String) value 有什么本质区别？

**答：** 核心区别在**运行时行为**：

| | Java `(String) value` | TS `value as string` |
|---|---|---|
| 运行时检查 | ✅ 会检查，不匹配抛 `ClassCastException` | ❌ **没有任何检查** |
| 本质 | 真正的类型转换 | 纯粹骗过编译器 |
| 运行时错误 | 编译通过但运行可能崩 | 如果实际不是 string，运行时调用方法才崩 |

TS 的 `as` 更像是**编译器的提示**：”我知道它是 string，你别管了”。编译器就信了，但运行时该崩还是崩。

### 5. 自定义类型守卫的返回值语法是什么？

**答：** 用 `is` 关键字，返回值是**类型谓词（Type Predicate）**。

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` 告诉编译器：如果函数返回 `true`，那么 `pet` 在这个分支里就是 `Fish` 类型。Java 没有这种语法。

### 6. 什么是”区分联合（Discriminated Unions）”？它在 TS 中有什么优势？

**答：** 给每个类型加一个**共同的、字面量类型的属性**（区分属性），让 `switch/case` 能精准推断类型。

```typescript
interface Circle { kind: “circle”; radius: number; }
interface Square { kind: “square”; sideLength: number; }
type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case “circle”:
            // TS 自动知道 shape 是 Circle ✅
            return Math.PI * shape.radius ** 2;
        case “square”:
            // TS 自动知道 shape 是 Square ✅
            return shape.sideLength ** 2;
    }
}
```

**优势：**
1. **不需要 `instanceof` 或 `typeof`**，一个属性就能区分所有类型
2. **配合 `never` 做完备性检查**：漏掉一种情况时 TS 编译时报错
3. **适合建模状态机**：API 响应、UI 组件状态等

Java 中最接近的是 `enum` + `switch` 或抽象类多态，但 TS 写法**不需要定义类和继承**，纯用数据结构驱动，轻量很多。

### 7. never 类型代表什么？它通常用在什么场景？

**答：** `never` 表示**永远不可能出现的值**，当联合类型的所有可能性都被排除后剩下的就是 `never`。

**常用场景：**
1. **switch 完备性检查**（确保所有联合类型分支都被覆盖）
2. **抛出异常的函数**（永远不会返回）
3. **死循环**（永远不会结束）

### 8. 为什么直接用 if 就能改变 TS 对变量类型的推断？

**答：** 这个机制的正式名称叫**控制流分析（Control Flow Analysis）**。

TS 编译器在编译时会像”跟踪程序执行路径”一样，分析每个 `if/else/switch` 分支的逻辑判断。当你写了 `typeof x === “string”` 或 `x instanceof Dog` 等判断逻辑，编译器就会在对应的分支内**自动收窄变量的类型**。

这不是”理解逻辑”，而是编译器内置的规则：识别特定模式的类型守卫语句，在对应的代码块内收窄类型。
