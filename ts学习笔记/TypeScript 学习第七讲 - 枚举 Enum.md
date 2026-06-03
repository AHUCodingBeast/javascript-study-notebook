# TypeScript 学习第七讲 — 枚举 Enum

> 来源：[TypeScript Handbook — Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

---

## 1. 数字枚举

```typescript
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right,   // 3
}

let d: Direction = Direction.Up;  // 0
```

> 默认从 `0` 开始自动递增。可自定义起始值：`enum Status { Active = 1, Inactive, Pending }`

---

## 2. 字符串枚举（推荐）

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

> 字符串枚举调试更友好（日志显示 `"UP"` 而不是 `0`）。**推荐优先使用字符串枚举**。

---

## 3. 枚举的实际用法

```typescript
enum Role {
    Admin = "admin",
    User = "user",
    Guest = "guest",
}

function checkPermission(role: Role): string {
    switch (role) {
        case Role.Admin: return "全部权限";
        case Role.User: return "部分权限";
        case Role.Guest: return "只读";
    }
}
```

> Java 的 enum 还可以有方法、字段；TS 的 enum 只是值的集合，不能定义方法。

---

## TS 的 enum vs Java 的 enum

| 特性 | Java enum | TS enum |
| ------ | ------ | ------ |
| 运行时存在 | ✅ 是真正的对象 | ❌ 编译后是普通 JS 对象 |
| 方法 | 可以在 enum 里定义方法 | 不能，只是值的集合 |
| 反射 | 支持反射 | 无运行时概念 |

---

## 快速自测（问答参考答案）

<details>
<summary>1. TS 数字枚举的默认起始值是多少？</summary>

`0`，自动递增。
</details>

<details>
<summary>2. 字符串枚举和数字枚举的区别是什么？</summary>

字符串枚举的值是字符串本身，调试更友好；数字枚举有反向映射（可以通过值拿到键名），字符串枚举没有。
</details>

<details>
<summary>3. TS 的 enum 和 Java 的 enum 最大的区别是什么？</summary>

Java 的 enum 是一个真正的类，运行时存在，可以有方法；TS 的 enum 编译后是普通 JS 对象，只是值的集合，不能定义方法。
</details>
