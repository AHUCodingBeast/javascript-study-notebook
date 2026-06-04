# TS 学习第八讲 - 实用工具类型（Utility Types）

> 来源：[TypeScript Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

## 核心概念

- 工具类型是 TS 内置的泛型类型，用来**对一个已有类型做转换**
- 类似 Java 的 `Collections.unmodifiableList()`、`Optional` 等包装器
- 开发中几乎每天用到，尤其是 `Partial`、`Pick`、`Omit`

---

## 知识点详解

### 1. Partial<T> — 全部变可选

把 `T` 的所有属性变成可选的。

```typescript
interface User {
    name: string;
    age: number;
    email: string;
}

// 更新用户时，不需要传所有字段
function updateUser(id: number, updates: Partial<User>) {
    console.log(`更新用户 ${id}:`, updates);
}

updateUser(1, { name: "新名字" });       // ✅ 只传部分字段
updateUser(1, { name: "李四", age: 30 }); // ✅ 传多个也行
```

> 对比 Java：类似 Builder 模式中 `setName()`、`setAge()` 可以单独调用。

### 2. Required<T> — 全部变必填

和 `Partial` 相反，把 `T` 的所有属性变成必填。

```typescript
interface Config {
    host?: string;
    port?: number;
    timeout?: number;
}

// 校验后得到完整配置
function validate(cfg: Config): Required<Config> {
    return {
        host: cfg.host ?? "localhost",
        port: cfg.port ?? 8080,
        timeout: cfg.timeout ?? 5000,
    };
}
```

### 3. Readonly<T> — 全部变只读

把 `T` 的所有属性变成 `readonly`。

```typescript
interface Todo {
    title: string;
    completed: boolean;
}

const todo: Readonly<Todo> = { title: "学习TS", completed: false };
// todo.completed = true;  // ❌ 编译错误 — 只读属性不能修改
```

> 对比 Java：类似 `Collections.unmodifiableMap()`。

### 4. Pick<T, K> — 挑几个属性

从 `T` 中挑选指定的一组属性 `K`，组成新类型。

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// 对外只暴露安全字段，隐藏密码
type PublicUser = Pick<User, "id" | "name" | "email">;

const publicUser: PublicUser = {
    id: 1,
    name: "张三",
    email: "zhang@example.com",
    // password: "xxx"  // ❌ 不允许
};
```

> 对比 Java：类似 DTO 转换，从 Entity 选几个字段组装成 VO。

### 5. Omit<T, K> — 排除几个属性

和 `Pick` 相反，从 `T` 中排除指定属性，剩下的组成新类型。

```typescript
type CreateUserInput = Omit<User, "id">;  // 创建时不需要 id

const input: CreateUserInput = {
    name: "李四",
    email: "li@example.com",
    password: "123456",
};
```

`Omit<T, K>` 等价于 `Pick<T, Exclude<keyof T, K>>`。

### 6. Record<K, T> — 键值对映射

创建一个对象类型，键的类型是 `K`，值的类型是 `T`。

```typescript
// 类似 Java 的 Map<Role, Permission[]>
type Role = "admin" | "user" | "guest";

interface Permission {
    canRead: boolean;
    canWrite: boolean;
}

const rolePermissions: Record<Role, Permission> = {
    admin: { canRead: true, canWrite: true },
    user:  { canRead: true, canWrite: false },
    guest: { canRead: false, canWrite: false },
};

console.log(rolePermissions.admin.canWrite);  // true
```

> 对比 Java：`Map<Role, Permission>`，但类型更安全。

### 7. Exclude<T, U> 与 Extract<T, U>

```typescript
// Exclude — 从 T 中排除能赋给 U 的类型
type T0 = Exclude<"a" | "b" | "c", "a">;       // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"

// Extract — 从 T 中提取能赋给 U 的类型
type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
```

### 8. ReturnType<T> 与 Parameters<T>

获取函数的返回值类型 / 参数类型。

```typescript
function getUser(id: number) {
    return { id, name: "张三" };
}

type User = ReturnType<typeof getUser>;  // { id: number; name: string }
type Args = Parameters<typeof getUser>;  // [number]
```

---

## 速查表

| 工具类型 | 作用 | 示例 |
|----------|------|------|
| `Partial<T>` | 全部变可选 | `Partial<User>` |
| `Required<T>` | 全部变必填 | `Required<Config>` |
| `Readonly<T>` | 全部变只读 | `Readonly<Todo>` |
| `Pick<T, K>` | 挑几个属性 | `Pick<User, "id" \| "name">` |
| `Omit<T, K>` | 排除几个属性 | `Omit<User, "password">` |
| `Record<K, T>` | 键值映射 | `Record<string, number>` |
| `Exclude<T, U>` | 从联合中排除 | `Exclude<"a" \| "b", "a">` |
| `Extract<T, U>` | 从联合中提取 | `Extract<"a" \| "b", "a">` |
| `ReturnType<T>` | 函数返回类型 | `ReturnType<typeof fn>` |
| `Parameters<T>` | 函数参数类型 | `Parameters<typeof fn>` |

---

## 快速自测（问答参考答案）

<details>
<summary>1. `Partial<User>` 和 `Required<User>` 分别做了什么？</summary>

`Partial` 把 `User` 的所有属性变成可选的；`Required` 把所有属性变成必填的。
</details>

<details>
<summary>2. `Pick<User, "id" | "name">` 和 `Omit<User, "password">` 有什么区别？</summary>

`Pick` 是白名单 — 只保留指定的属性；`Omit` 是黑名单 — 排除指定的属性，剩下的保留。
</details>

<details>
<summary>3. `Record<string, number>` 对应 Java 中的什么类型？</summary>

`Map<String, Integer>`，但类型更安全，不用 `.get()` 再判空。
</details>

<details>
<summary>4. `Exclude<"a" | "b" | "c", "a">` 返回什么？</summary>

`"b" | "c"`。
</details>

<details>
<summary>5. `ReturnType<typeof fn>` 的作用是什么？</summary>

自动推断函数 `fn` 的返回值类型，不用手动重复写。
</details>
