// ============================================================
// TypeScript 学习第五讲 — 泛型 Generics
// 知识点：泛型函数、泛型约束、keyof、泛型接口、泛型工具类型
// ============================================================

// ---------- 1. 泛型基础 ----------

// ❌ 用 any — 丢失类型信息
function identityBad(value: any): any {
    return value;
}
let badResult = identityBad("hello");  // badResult 是 any

// ✅ 用泛型 — 保留类型信息
function identity<T>(value: T): T {
    return value;
}
let goodResult = identity("hello");  // goodResult 是 string ✅

console.log(`泛型类型: ${typeof goodResult}, 值: ${goodResult}`);

// ---------- 2. 泛型函数 ----------
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

console.log(firstElement([1, 2, 3]));   // T = number
console.log(firstElement(["a", "b"]));  // T = string

// 多个类型参数
function map<Input, Output>(
    arr: Input[],
    func: (arg: Input) => Output
): Output[] {
    return arr.map(func);
}

const doubled = map([1, 2, 3], (n) => n * 2);
console.log(`map 结果: [${doubled}]`);

// ---------- 3. 泛型约束 ----------
// T 必须有 length 属性
function len<T extends { length: number }>(value: T): number {
    return value.length;
}

console.log(`len("hello"): ${len("hello")}`);
console.log(`len([1,2,3]): ${len([1, 2, 3])}`);
// len(123);  // ❌ number 没有 length 属性

// ---------- 4. keyof 约束 ----------
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let user = { name: "张三", age: 25 };
console.log(getProperty(user, "name"));   // ✅ 返回 string
// getProperty(user, "email");  // ❌ "email" 不在 keyof User 中

// ---------- 5. 泛型接口 ----------
interface Box<T> {
    content: T;
}

let stringBox: Box<string> = { content: "hello" };
let numberBox: Box<number> = { content: 42 };
console.log(`Box<string>: ${stringBox.content}`);
console.log(`Box<number>: ${numberBox.content}`);

// ---------- 6. 泛型工具类型 ----------

interface User {
    name: string;
    email: string;
    age: number;
}

// Partial<T> — 所有属性变为可选
let partialUser: Partial<User> = { name: "张三" };
console.log("Partial<User>:", partialUser);

// Pick<T, K> — 选部分属性
let nameAndEmail: Pick<User, "name" | "email"> = {
    name: "张三",
    email: "zhang@example.com",
};
console.log("Pick<User>:", nameAndEmail);

// Omit<T, K> — 排除部分属性
let userWithoutAge: Omit<User, "age"> = {
    name: "张三",
    email: "zhang@example.com",
};
console.log("Omit<User>:", userWithoutAge);

// Record<K, V> — 键值对映射
let scores: Record<string, number> = { math: 95, english: 88 };
console.log("Record:", scores);

// ---------- 7. 泛型 vs any ----------
function goodSwap<T, U>(a: T, b: U): [U, T] {
    return [b, a];
}

let [x, y] = goodSwap(1, "hello");
console.log(`swap 后: x=${x} (string), y=${y} (number)`);
