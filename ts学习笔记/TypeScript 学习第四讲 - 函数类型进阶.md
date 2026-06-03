# TypeScript 学习第四讲 — 函数类型进阶

> 来源：[TypeScript Handbook — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

---

## 1. 函数类型表达式

```typescript
let fn: (a: string, b: number) => string;

fn = function(name: string, count: number): string {
    return `${name} has ${count} items.`;
};
```

> Java 中没有这种语法，最接近的是 `BiFunction<String, Integer, String>`。

---

## 2. 函数重载

TS 支持函数重载，但和 Java 实现方式不同：

```typescript
// 重载签名 1
function greet(name: string): string;
// 重载签名 2
function greet(name: string, title: string): string;
// 实现
function greet(name: string, title?: string): string {
    if (title) {
        return `Hello, ${title} ${name}!`;
    }
    return `Hello, ${name}!`;
}
```

| 特性 | Java 重载 | TS 重载 |
| ------ | ------ | ------ |
| 实现方式 | 每个签名对应一个方法体 | 多个签名 + **一个**统一实现 |
| 运行时 | 真正的多个方法 | 只有一个函数，重载只在编译时有效 |

---

## 3. 返回值推断

TS 可以推断返回值，但**建议始终显式标注**：

```typescript
// 不标注 — 返回值可能偷偷改变
function getGreeting(name: string) {
    if (!name) return null;  // 返回值变成 string | null
    return `Hello, ${name}!`;
}

// 显式标注 — 编译器会报错提醒
function getGreeting(name: string): string {
    if (!name) return null;  // ❌ null 不是 string
    return `Hello, ${name}!`;
}
```

---

## 4. void vs never

| 返回类型 | 含义 | 示例 |
| ------ | ------ | ------ |
| `void` | 函数执行完毕，不返回值 | `function log() {}` |
| `never` | 函数永远不会正常结束 | `function error(): never { throw new Error(); }` |

---

## 5. 剩余参数

```typescript
function sum(...nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
}
```

> Java 中写法是 `int... nums`，语义一样。

---

## 6. 可选链调用函数

```typescript
let fn: (() => string) | undefined;
fn?.();  // 等价于 fn ? fn() : undefined
```

---

## 快速自测（问答参考答案）

<details>
<summary>1. 如何声明"接收两个 number 参数，返回 number"的函数类型？</summary>

`(a: number, b: number) => number`
</details>

<details>
<summary>2. TS 的函数重载和 Java 的实现方式有什么本质区别？</summary>

Java 每个签名对应一个方法体；TS 多个签名 + 一个统一实现，编译后只有一个函数。
</details>

<details>
<summary>3. void 和 never 返回值有什么区别？</summary>

`void` 函数执行完不返回值；`never` 函数永远不会正常结束（抛异常或死循环）。
</details>

<details>
<summary>4. 为什么建议函数始终显式标注返回值类型？</summary>

相当于给函数加类型契约。不标注的话，返回值类型会随着实现悄悄改变，编译器不会提醒你。
</details>

<details>
<summary>5. TS 的 ...args: number[] 对应 Java 中的什么语法？</summary>

对应 Java 的可变参数 `int... args`。
</details>
