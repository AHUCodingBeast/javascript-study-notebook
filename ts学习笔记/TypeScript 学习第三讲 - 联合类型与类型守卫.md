# TypeScript 学习第三讲 — 联合类型与类型守卫

> 来源：[TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## 1. 联合类型回顾

```typescript
function printId(id: string | number) {
    console.log(id.toUpperCase());  
    // ❌ 报错：Property 'toUpperCase' does not exist on type 'string | number'.
}
```

TS 不知道 `id` 是哪个类型时，只允许调用两者**共有**的方法。

要解决需要用**类型守卫**，告诉编译器"在这个分支里，它就是 string"。

---

## 2. 类型守卫

### 2.1 typeof 守卫

```typescript
function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());  // ✅
    } else {
        console.log(id);  // ✅
    }
}
```

### 2.2 相等性守卫（===）

```typescript
function move(direction: "up" | "down" | "left" | "right") {
    if (direction === "up") {
        console.log("向上移动");
    }
}
```

### 2.3 in 运算符守卫

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim();  // ✅
    } else {
        animal.fly();   // ✅
    }
}
```

### 2.4 instanceof 守卫

```typescript
function pet(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();  // ✅
    } else {
        animal.meow();  // ✅
    }
}
```

> **注意**：`instanceof` 只对 class 有效，对 interface/type 无效（编译后被擦除）。

---

## 3. 类型断言（Type Assertions）

```typescript
let value: unknown = "hello";
let len = (value as string).length;
```

> `as` 不做运行时检查，纯粹告诉编译器"相信我"。如果实际类型不匹配，运行时会报错。
> **建议**：优先用类型守卫，少用 `as`。

---

## 4. as const 断言

```typescript
const config = { api: "/api", timeout: 5000 } as const;
// config 的类型变成：{ readonly api: "/api"; readonly timeout: 5000 }
```

> 把对象所有属性变成 `readonly`，值变成**字面量类型**。在提取配置时非常有用。

---

## 5. 区分联合（Discriminated Unions）

给每个类型加一个共同的字面量属性，让 `switch` 精准推断：

```typescript
interface Circle { kind: "circle"; radius: number; }
interface Square { kind: "square"; sideLength: number; }
type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;  // TS 知道是 Circle
        case "square":
            return shape.sideLength ** 2;         // TS 知道是 Square
    }
}
```

> 非常适合建模 API 响应状态（成功/失败）、UI 状态（加载中/成功/报错）。

---

## 6. never 类型

当所有联合可能性都被排除后，剩下的是 `never`：

```typescript
function handleError(error: Error | null) {
    if (error instanceof Error) {
        console.log(error.message);
    } else if (error === null) {
        console.log("No error");
    } else {
        const _exhaustiveCheck: never = error;  // 如果漏了情况会报错
    }
}
```

> 用于 switch 的**完备性检查**：漏掉一种联合类型时 TS 会报错。

---

## 快速自测（问答参考答案）

<details>
<summary>1. 联合类型 string | number 用什么守卫最方便？</summary>

`typeof`。
</details>

<details>
<summary>2. 检查对象有没有某个属性，用什么运算符？</summary>

`in` 运算符。
</details>

<details>
<summary>3. instanceof 守卫在什么情况下无效？</summary>

联合类型是 interface 或 type 时无效（编译后被擦除），只对 class 有效。
</details>

<details>
<summary>4. value as string 和 Java 的 (String) value 有什么本质区别？</summary>

Java 强转有运行时检查（不匹配抛 ClassCastException）；TS 的 `as` 没有运行时检查，纯粹骗过编译器。
</details>

<details>
<summary>5. 什么是"区分联合（Discriminated Unions）"？</summary>

给每个类型加共同字面量属性，让 switch 精准推断类型。适合建模状态机、API 响应等。
</details>

<details>
<summary>6. never 类型代表什么？</summary>

永远不可能出现的值。常用于 switch 完备性检查。
</details>
