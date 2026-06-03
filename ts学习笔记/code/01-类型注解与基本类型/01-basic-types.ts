// ============================================================
// TypeScript 学习第一讲 — 类型注解与基本类型
// 知识点：类型注解、基本类型、unknown vs any、元组、可选链、空值合并
// ============================================================

// ---------- 1. 基本类型 ----------
let name: string = "张三";
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// ---------- 2. unknown vs any ----------

// any — 关闭类型检查（不推荐）
let anything: any = "hello";
anything = 42;
anything.foo();  // 编译通过，运行时报错

// unknown — 安全的 any，必须先检查类型
let something: unknown = "hello";
// something.length;  // ❌ 编译错误

if (typeof something === "string") {
    console.log(something.length);  // ✅ TS 知道这是 string
}

// ---------- 3. 元组（Tuple） ----------
let tuple: [string, number] = ["坐标", 42];
console.log(`${tuple[0]}: ${tuple[1]}`);

// tuple[3] = "extra";  // ❌ 越界
// tuple = [42, "坐标"];  // ❌ 类型不对

// ---------- 4. 可选链 ?.（ES2020+） ----------
interface Address {
    city: string;
    zip?: string;
}

interface User {
    name: string;
    address?: Address;
}

const user: User = { name: "张三", address: { city: "北京" } };

// 安全访问深层属性
const city = user?.address?.city;
console.log(`city: ${city}`);

const zip = user?.address?.zip ?? "未知";
console.log(`zip: ${zip}`);

// ---------- 5. 空值合并 ??（ES2020+） ----------
const timeout: number | null = null;
const actualTimeout = timeout ?? 5000;
console.log(`timeout: ${actualTimeout}`);  // 5000

const zero = 0;
const value = zero ?? 100;
console.log(`0 ?? 100 = ${value}`);  // 0（?? 只在 null/undefined 时替换）

// ---------- 6. 联合类型 ----------
function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}

printId("abc-123");
printId(42);
