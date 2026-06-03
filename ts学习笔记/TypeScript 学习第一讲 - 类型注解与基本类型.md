# TypeScript 学习第一讲 — 类型注解与基本类型

> 来源：[TypeScript Handbook — Every Day Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

## 1. 类型注解语法

TypeScript 在 JS 基础上加了类型声明。类型信息只在编译阶段存在，**运行时会被完全擦除**。

```typescript
// 语法：在变量名后加 : Type
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
```

> Java 是 `类型 变量名`（`String name`），TS 是 `变量名: 类型`（`name: string`）。

---

## 2. 基本类型

| TypeScript 类型 | 对应 JS 值 | 示例 |
| ------ | ------ | ------ |
| `string` | 字符串 | `"hello"` |
| `number` | 整数 + 浮点数 | `42`, `3.14` |
| `boolean` | 布尔值 | `true`, `false` |

> TS 的 `number` 不区分整数和浮点数，`42` 和 `3.14` 都是 `number`。

---

## 3. 类型推断

如果**声明时就赋值**，TS 自动推断类型：

```typescript
let name = "张三";    // 推断为 string
let age = 25;         // 推断为 number
let isDone = false;   // 推断为 boolean
```

### 什么时候必须写类型注解？

| 场景 | 是否需要 | 示例 |
| ------ | ------ | ------ |
| 声明 + 赋值同时 | ❌ | `let x = 10;` → 推断 `number` |
| 只声明不赋值 | ✅ | `let x: number;` |
| 函数参数 | ✅ | `function add(a: number)` |
| 函数返回值 | 建议写 | `function get(): string` |

---

## 4. 函数类型

### 4.1 参数和返回值

```typescript
function add(x: number, y: number): number {
    return x + y;
}

// 无返回值用 void
function log(message: string): void {
    console.log(message);
}
```

### 4.2 可选参数

```typescript
function greet(name: string, title?: string): string {
    if (title) {
        return `Hello, ${title} ${name}!`;
    }
    return `Hello, ${name}!`;
}
```

> Java 中没有这种语法，需要通过方法重载实现。

### 4.3 默认参数

```typescript
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}
```

---

## 5. 数组类型

两种写法完全等价：

```typescript
let numbers: number[] = [1, 2, 3];
let numbers2: Array<number> = [1, 2, 3];
```

---

## 6. 对象类型

### 6.1 内联对象类型

```typescript
let person: { name: string; age: number } = {
    name: "张三",
    age: 25,
};
```

### 6.2 可选属性

```typescript
let person: { name: string; email?: string } = {
    name: "张三",
};
```

---

## 7. any / unknown

### any — 关闭类型检查

```typescript
let value: any = "hello";
value = 42;          // OK
value.foo.bar();     // OK（但运行时会报错！）
```

> ⚠️ **学习阶段避免使用 `any`**！

### unknown — 安全的 any

```typescript
let value: unknown = "hello";
value = 42;          // OK
// value.foo.bar();  // ❌ 编译错误！unknown 必须先做类型检查
if (typeof value === "string") {
    console.log(value.toUpperCase());  // ✅
}
```

> **建议**：不确定类型时用 `unknown` 而不是 `any`，编译器会强制你先做类型检查。

---

## 8. 元组 Tuple

固定长度、固定类型的数组：

```typescript
let pair: [string, number] = ["张三", 25];
pair[0];    // string
pair[1];    // number
pair.push(3);  // OK（TS 4.x 之后允许 push）
```

---

## 9. 联合类型

用 `|` 连接，表示"可以是这几种类型中的任意一种"：

```typescript
let id: string | number;
id = "abc";   // OK
id = 123;     // OK
```

### 函数中的联合类型

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

将具体的值作为类型：

```typescript
type Direction = "left" | "right" | "up" | "down";
let direction: Direction = "left";
```

> 类似 Java 的 `enum`，但更轻量。

---

## 11. 可选链与空值合并

### 可选链 `?.`（ES2020）

```typescript
const user = { address: { city: "北京" } };
const city = user?.address?.city;  // "北京"
const zip = user?.address?.zip;    // undefined（不会报错）
```

### 空值合并 `??`

```typescript
const name = userInput ?? "默认名";  // 只在 null/undefined 时用默认值
```

> `??` 和 `||` 不同：`0 ?? "默认"` 返回 `0`，`0 || "默认"` 返回 `"默认"`。

---

## 快速自测（问答参考答案）

<details>
<summary>1. TS 中如何声明 number 类型变量？和 Java 有什么区别？</summary>

`let x: number = 10;`。Java 类型在前（`int x`），TS 类型在变量名后（`x: number`）。
</details>

<details>
<summary>2. let x = 10; 中 x 的类型是什么？</summary>

`number` — TS 通过赋值自动推断。
</details>

<details>
<summary>3. 什么时候必须写类型注解？</summary>

只声明不赋值、函数参数、函数返回值。
</details>

<details>
<summary>4. `any` 和 `unknown` 的区别是什么？</summary>

`any` 完全关闭类型检查；`unknown` 强制先做类型检查才能访问属性/方法。
</details>

<details>
<summary>5. 如何声明只能存 string 的数组？</summary>

`string[]` 或 `Array<string>`。
</details>

<details>
<summary>6. 函数参数加了 `?` 标记表示什么？</summary>

可选参数，调用时可以不传。
</details>
