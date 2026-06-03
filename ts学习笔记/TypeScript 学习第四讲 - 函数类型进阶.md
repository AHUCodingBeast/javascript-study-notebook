# TypeScript 学习第四讲 — 函数类型进阶

> 来源：[TypeScript Handbook — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

---

## 1. 函数类型表达式

TS 允许你直接声明"函数类型"，用 `=>` 语法：

```typescript
// 参数: 参数类型, 返回值: 返回值类型
let fn: (a: string, b: number) => string;

fn = function(name: string, count: number): string {
    return `${name} has ${count} items.`;
};
```

> Java 中没有这种语法。最接近的是 `BiFunction<String, Integer, String>` 这样的函数式接口。

---

## 2. 函数重载（Function Overloads）

TypeScript 支持**函数重载**，但和 Java 的实现方式不同。

### 2.1 Java 方式 vs TypeScript 方式

```java
// Java：写多个方法签名
public void greet(String name) { ... }
public void greet(String name, String title) { ... }
```

```typescript
// TypeScript：先声明多个重载签名，再写一个统一实现
// 重载签名 1
function greet(name: string): string;
// 重载签名 2
function greet(name: string, title: string): string;
// 实现（必须兼容所有重载签名）
function greet(name: string, title?: string): string {
    if (title) {
        return `Hello, ${title} ${name}!`;
    }
    return `Hello, ${name}!`;
}
```

### 2.2 关键区别

| 特性 | Java 重载 | TypeScript 重载 |
|------|----------|----------------|
| 实现方式 | 每个签名对应一个方法体 | 多个签名 + **一个**统一实现 |
| 运行时 | 真正的多个方法 | 只有**一个**函数，重载只在编译时有效 |
| 调用时 | 编译器选择匹配的方法 | 编译器根据参数匹配对应的重载签名 |

> **核心区别**：Java 编译后会生成多个方法；TypeScript 编译后只有一个函数，重载签名全部被擦除。

### 2.3 重载签名必须"精确"

TS 的重载签名不能太宽泛，必须具体：

```typescript
// ✅ 正确：重载签名具体
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
    if (month !== undefined && day !== undefined) {
        return new Date(yearOrTimestamp, month, day);
    } else {
        return new Date(yearOrTimestamp);
    }
}

makeDate(12345678);          // ✅ 匹配第一个签名
makeDate(2024, 1, 15);       // ✅ 匹配第二个签名
makeDate(2024, 1);           // ❌ 不匹配任何重载签名
```

---

## 3. this 类型

TypeScript 允许你**显式声明函数中的 `this` 类型**，这是 JS 独有的能力（Java 的 `this` 类型是固定的）。

```typescript
interface User {
    name: string;
    admin: boolean;
}

// 第一个参数是 this 类型声明（运行时不传参）
function checkAdmin(this: User) {
    return this.admin;
}
```

> **注意**：`this` 参数是**伪参数**，它只在编译时存在，调用函数时不需要传。

```typescript
const user: User = { name: "张三", admin: true };
checkAdmin.call(user);  //  `checkAdmin.call(user)` 是把 user 当作 this 上下文绑定进去 用 call/apply 绑定 this
```

---

## 4. 函数重载的 "this" 重载

TS 还可以在重载中声明 `this` 的约束：

```typescript
class DB {
    connected = false;
    query(sql: string): any[] { return []; }
}

// 用 this 类型约束方法的调用上下文
function safeQuery(this: DB, sql: string) {
    if (!this.connected) {
        throw new Error("Not connected!");
    }
    return this.query(sql);
}
```

上面的代码中：

this: DB 就是编译时的一个约束标记：

告诉编译器：调用这个函数时，this 必须绑定到一个 DB 实例上

告诉编译器：函数内部的 this 有 connected 属性和 query() 方法

运行时不占任何参数位置，sql 才是唯一的真实参数，调用的时候一般像下面的这段代码这样进行调用 使用的是 call 方法：

```typescript
const db = new DB();
safeQuery.call(db, "SELECT * FROM users"); 
```

---

## 5. 函数返回值推断

TS 可以推断函数返回值，但**建议始终显式标注**：

```typescript
// TS 推断返回 string
function greet(name: string) {
    return `Hello, ${name}!`;
}

// 建议显式标注
function greet(name: string): string {
    return `Hello, ${name}!`;
}
```

> 为什么建议显式标注？因为如果你不小心改了返回值类型，编译器会报错提醒你。不标注的话，返回值类型会随着实现悄悄改变。

---

## 6. void vs undefined vs never

| 返回类型 | 含义 | 示例 |
|----------|------|------|
| `void` | 函数不返回值（或返回 undefined） | `function log() {}` |
| `undefined` | 函数明确返回 `undefined` | `function get(): undefined { return undefined; }` |
| `never` | 函数永远不会返回 | `function error(): never { throw new Error(); }` |

```typescript
// void 函数可以有 return，但值会被忽略
function doNothing(): void {
    return;  // OK
    return undefined;  // 也 OK
}

// never 函数不能有正常返回
function infiniteLoop(): never {
    while (true) {}
}
```

---

## 7. 剩余参数（Rest Parameters）

和 JS 一样，TS 支持 `...args`：

```typescript
function sum(...nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3);     // 6
sum(10, 20);      // 30
```

> Java 中的写法是 `int... nums`（可变参数）。TS 的 `...nums: number[]` 语义类似。

---

## 8. 可选链调用函数

```typescript
let fn: (() => string) | undefined;

// 如果 fn 存在才调用
fn?.();  // 等价于 fn ? fn() : undefined
```

> Java 没有这个语法。Java 需要 `if (fn != null) fn.get();` 或用 `Optional`。

---

---

## 快速自测（问答参考答案）

### 1. TypeScript 中如何声明一个"接收两个 number 参数，返回 number"的函数类型？

**答：** `(a: number, b: number) => number`

```typescript
let fn: (a: number, b: number) => number;
fn = function(x, y) { return x + y; };
```

### 2. TS 的函数重载和 Java 的函数重载在**实现方式**上有什么本质区别？

**答：**

| 特性       | Java 重载                       | TypeScript 重载                       |
| ---------- | ------------------------------- | ------------------------------------- |
| 实现方式   | 每个签名对应一个方法体          | 多个签名 + **一个**统一实现           |
| 运行时     | 真正的多个方法                  | 只有一个函数，重载签名编译后被擦除    |

Java 写 2 个重载签名就要写 2 个方法体；TS 只要写 1 个统一实现，但参数必须能兼容所有重载签名。

### 3. TS 的重载签名必须"精确"，调用 `f(1, undefined)` 会匹配哪个？

**答：** 会匹配第二个重载 `(x: number, y: number)`。因为第一个重载只接收一个参数，不匹配两个参数的调用。

> 注意：实际开发中尽量避免用 `undefined` 作为重载参数，推荐用可选参数 `y?: number` 替代。

### 4. `this` 参数在 TS 中是伪参数，运行时需不需要传？

**答：** 不需要。`this: User` 只在编译时存在，用于约束 `this` 的类型，编译后完全消失。调用时用 `call()`/`apply()` 绑定 `this` 上下文即可。

### 5. `void` 和 `never` 返回值有什么区别？

**答：**

| 返回类型 | 含义 | 示例 |
| ------ | ------ | ------ |
| `void` | 函数执行完毕，不返回值 | `function log() {}` |
| `never` | 函数永远不会正常结束 | `function error(): never { throw new Error(); }` |

### 6. 为什么建议函数**始终显式标注返回值类型**？

**答：** 显式标注返回值类型，相当于给函数加了一个**类型契约**。如果不标注，返回值类型会随着实现悄悄改变，编译器不会提醒你。

```typescript
// 不标注 — 返回值偷偷变成 string | null，编译器不报错
function getGreeting(name: string) {
    if (!name) return null;
    return `Hello, ${name}!`;
}

// 显式标注 — 编译器会报错提醒你修改签名
function getGreeting(name: string): string {
    if (!name) return null;  // ❌ null 不是 string
    return `Hello, ${name}!`;
}
```

### 7. TS 的 `...args: number[]` 对应 Java 中的什么语法？

**答：** 对应 Java 的**可变参数** `int... args`。语义完全一样——支持不定数量的参数。
