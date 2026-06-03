// ============================================================
// TypeScript 学习第三讲 — 联合类型与类型守卫
// 知识点：联合类型、typeof/in/instanceof 守卫、类型断言、as const、
//          区分联合、never 类型
// ============================================================

// ---------- 1. 联合类型 ----------
function printId(id: string | number) {
    // console.log(id.toUpperCase());  // ❌ 只能调用共有方法
    console.log(id);
}

printId("abc-123");
printId(42);

// ---------- 2. typeof 守卫 ----------
function printId2(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());  // ✅ TS 知道这是 string
    } else {
        console.log(id.toFixed(2));  // ✅ TS 知道这是 number
    }
}

// ---------- 3. 相等性守卫（===） ----------
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction) {
    if (direction === "up") {
        console.log("向上移动");
    } else if (direction === "down") {
        console.log("向下移动");
    }
}

move("up");

// ---------- 4. in 运算符守卫 ----------
interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

function moveAnimal(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim();  // ✅ TS 知道这是 Fish
    } else {
        animal.fly();  // ✅ TS 知道这是 Bird
    }
}

const fish: Fish = { swim: () => console.log("鱼在游泳") };
moveAnimal(fish);

// ---------- 5. instanceof 守卫 ----------
class Dog { bark() { console.log("汪汪!"); } }
class Cat { meow() { console.log("喵喵!"); } }

function pet(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();  // ✅
    } else {
        animal.meow();  // ✅
    }
}

pet(new Dog());

// ---------- 6. 类型断言（Type Assertions） ----------
let value: unknown = "hello";
// let len = value.length;  // ❌ unknown 没有 length
let len = (value as string).length;  // ✅ 告诉编译器"这是 string"
console.log(`类型断言 length: ${len}`);

// ---------- 7. as const 断言 ----------
// 没有 as const — 推断为宽泛类型
const config1 = { api: "/api", timeout: 5000 };
// config1.api 的类型是 string

// 有 as const — 推断为精确字面量类型
const config2 = { api: "/api", timeout: 5000 } as const;
// config2.api 的类型是 "/api"（精确字面量）

// 场景：替代 enum
const Role = {
    Admin: "admin",
    User: "user",
    Guest: "guest",
} as const;

type Role = (typeof Role)[keyof typeof Role];
// Role 的类型是 "admin" | "user" | "guest"

function checkPermission(role: Role): string {
    switch (role) {
        case Role.Admin: return "全部权限";
        case Role.User: return "部分权限";
        case Role.Guest: return "只读";
    }
}

console.log(checkPermission(Role.Admin));

// ---------- 8. 区分联合（Discriminated Unions） ----------
interface Circle { kind: "circle"; radius: number; }
interface Square { kind: "square"; sideLength: number; }
type Shape = Circle | Square;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;  // TS 知道是 Circle
        case "square":
            return shape.sideLength ** 2;  // TS 知道是 Square
    }
}

console.log(`圆面积: ${getArea({ kind: "circle", radius: 5 }).toFixed(2)}`);
console.log(`正方形面积: ${getArea({ kind: "square", sideLength: 4 })}`);

// ---------- 9. never 类型（完备性检查） ----------
function handleError(error: Error | null) {
    if (error instanceof Error) {
        console.log(error.message);
    } else if (error === null) {
        console.log("No error");
    } else {
        const _exhaustiveCheck: never = error;  // 如果漏了情况会报错
    }
}
