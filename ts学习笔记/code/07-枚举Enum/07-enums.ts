// ============================================================
// TypeScript 学习第七讲 — 枚举 Enum
// 知识点：数字枚举、字符串枚举、枚举用法、TS vs Java 对比
// ============================================================

// ---------- 1. 数字枚举 ----------
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right,   // 3
}

let d: Direction = Direction.Up;
console.log(`数字枚举 Direction.Up = ${d}`);  // 0

// 自定义起始值
enum Status {
    Active = 1,
    Inactive,   // 2
    Pending,    // 3
}
console.log(`Status.Active = ${Status.Active}, Status.Pending = ${Status.Pending}`);

// ---------- 2. 字符串枚举（推荐） ----------
enum Direction2 {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

console.log(`字符串枚举 Direction2.Up = ${Direction2.Up}`);  // "UP"
// 字符串枚举调试更友好（日志显示 "UP" 而不是 0）

// ---------- 3. 枚举的实际用法 ----------
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

console.log(`Role.Admin 权限: ${checkPermission(Role.Admin)}`);
console.log(`Role.Guest 权限: ${checkPermission(Role.Guest)}`);

// ---------- 4. TS enum vs Java enum 对比 ----------
//
// | 特性           | Java enum           | TS enum                        |
// |----------------|---------------------|-------------------------------|
// | 运行时存在     | ✅ 是真正的对象      | ❌ 编译后是普通 JS 对象        |
// | 方法           | 可以定义方法         | 不能，只是值的集合             |
// | 反射           | 支持反射             | 无运行时概念                   |
//
// Java: enum 可以有字段、方法、构造函数
// TS: enum 只是值的集合，不能定义方法

// ---------- 5. 枚举 vs 字面量联合类型 ----------
// 现代 TS 中，字面量联合类型也常用来替代枚举：

type Direction3 = "up" | "down" | "left" | "right";

function move(dir: Direction3) {
    switch (dir) {
        case "up": console.log("向上"); break;
        case "down": console.log("向下"); break;
        case "left": console.log("向左"); break;
        case "right": console.log("向右"); break;
    }
}

move("up");
