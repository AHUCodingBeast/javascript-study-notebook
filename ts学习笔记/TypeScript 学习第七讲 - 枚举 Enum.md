# TypeScript 学习第七讲 — 枚举 Enum

> 来源：[TypeScript Handbook — Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

---

## 1. 数字枚举（Numeric Enums）

```typescript
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right,   // 3
}

let d: Direction = Direction.Up;  // 0
```

> Java 中 `enum Direction { UP, DOWN, LEFT, RIGHT }` — 语义基本一样。
> TS 的枚举值默认从 `0` 开始自动递增，和 Java 的 `ordinal()` 类似。

### 1.1 自定义起始值

```typescript
enum Status {
    Active = 1,
    Inactive,    // 2
    Pending,     // 3
}
```

---

## 2. 字符串枚举（String Enums）

这是 TS 独有的，Java 没有直接对应：

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

> 字符串枚举的值就是字符串本身，调试时更友好（日志显示 `"UP"` 而不是 `0`）。
> **推荐优先使用字符串枚举**，比数字枚举更直观。

---

## 3. 枚举的反向映射（仅数字枚举）

TS 的数字枚举有**反向映射**——可以通过值拿到键名：

```typescript
enum Direction { Up = 0, Down = 1 }

Direction.Up;      // 0
Direction[0];      // "Up"  ← 反向映射
```

> Java 没有这个特性。Java 需要通过 `Enum.values()[index]` 或遍历才能反向查找。
> 注意：**字符串枚举没有反向映射**。

---

## 4. const enum（常量枚举）

用 `const` 声明的枚举，编译后会**完全内联**，不产生任何 JS 对象：

```typescript
const enum Direction {
    Up = "UP",
    Down = "DOWN",
}

let d = Direction.Up;
// 编译后变成：let d = "UP";  — Direction 对象不存在了
```

> **用途**：减少运行时开销，适合大量枚举值的场景。但注意：其他文件如果用 `import` 导入 `const enum`，需要配置 `isolatedModules: false`，否则会报错。

---

## 6. 枚举的实际用法

```typescript
enum Role {
    Admin = "admin",
    User = "user",
    Guest = "guest",
}

function checkPermission(role: Role): string {
    switch (role) {
        case Role.Admin:
            return "全部权限";
        case Role.User:
            return "部分权限";
        case Role.Guest:
            return "只读";
    }
}

checkPermission(Role.Admin);  // "全部权限"
```

> Java 的 enum 还可以有方法、字段；TS 的 enum 只是值的集合，不能定义方法。

---

## 快速自测

1. TS 数字枚举的默认起始值是多少？
2. 字符串枚举和数字枚举的区别是什么？
3. 什么是枚举的"反向映射"？字符串枚举有吗？
4. `const enum` 和普通 `enum` 的编译结果有什么区别？
5. TS 的 enum 和 Java 的 enum 最大的区别是什么（运行时层面）？
