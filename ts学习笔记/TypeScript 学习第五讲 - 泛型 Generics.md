# TypeScript 学习第五讲 — 泛型 Generics

> 来源：[TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

## 1. 泛型基础

泛型让你写**可复用的、类型安全的**代码，不用 `any` 牺牲类型检查。

```typescript
// ❌ 用 any — 丢失类型信息
function identity(value: any): any {
    return value;
}
let result = identity("hello");  // result 是 any，丢失 string 信息

// ✅ 用泛型 — 保留类型信息
function identity<T>(value: T): T {
    return value;
}
let result = identity("hello");  // result 是 string ✅
```

> Java 对比：`public <T> T identity(T value)` — 语法几乎一样！

---

## 2. 泛型函数

```typescript
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}
```

> Java 写法：`public <T> T firstElement(T[] arr)` — 完全对应。

### 多个类型参数

```typescript
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}
```

---

## 3. 泛型约束

```typescript
// T 必须有 length 属性
function len<T extends { length: number }>(value: T): number {
    return value.length;
}

len("hello");    // ✅
len([1, 2, 3]);  // ✅
len(123);        // ❌
```

### keyof 约束

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let user = { name: "张三", age: 25 };
getProperty(user, "name");   // ✅ 返回 string
getProperty(user, "email");  // ❌
```

---

## 4. 泛型接口

```typescript
interface Box<T> { content: T; }
let stringBox: Box<string> = { content: "hello" };
```

---

## 5. 实用工具类型

TS 内置的 `Partial<T>`、`Pick<T, K>`、`Omit<T, K>`、`Record<K, V>` 等工具类型虽然也是泛型实现的，但内容较多，单独放在**第八讲 — 实用工具类型**中讲解。

---

## 6. 泛型 vs any

```typescript
// any — 类型信息丢失
function badSwap(a: any, b: any): [any, any] { return [b, a]; }

// 泛型 — 类型信息保留
function goodSwap<T, U>(a: T, b: U): [U, T] { return [b, a]; }
let [x, y] = goodSwap(1, "hello");  // x 是 string, y 是 number
```

**黄金法则**：能用泛型解决的地方，不要用 `any`。

---

## 快速自测（问答参考答案）

<details>
<summary>1. TS 的泛型和 Java 的泛型有什么相似之处？</summary>

语法几乎完全一样，都放在函数名后面，调用时自动推断。
</details>

<details>
<summary>2. 为什么 function identity(value: any): any 不好？</summary>

`any` 切断了参数和返回值之间的类型关联，调用后丢失类型信息。
</details>

<details>
<summary>3. T extends { length: number } 的含义是什么？</summary>

约束 T 必须有 length 属性且是 number 类型。对应 Java 的泛型上限 `<T extends HasLength>`。
</details>

<details>
<summary>4. keyof T 的作用是什么？</summary>

获取对象所有键的联合类型（字面量字符串）。Java 没有这个概念。
</details>

<details>
<summary>5. 泛型函数 swap(a: T, b: U): [U, T] 调用 swap(1, "hello") 时，T 和 U 分别是什么？</summary>

`T = number`, `U = string`，返回值类型是 `[string, number]`。泛型保留了每个位置的类型信息。
</details>
