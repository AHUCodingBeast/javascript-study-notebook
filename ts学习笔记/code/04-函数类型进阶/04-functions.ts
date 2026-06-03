// ============================================================
// TypeScript 学习第四讲 — 函数类型进阶
// 知识点：函数类型表达式、函数重载、返回值推断、void vs never、剩余参数
// ============================================================

// ---------- 1. 函数类型表达式 ----------
let fn: (a: string, b: number) => string;

fn = function(name: string, count: number): string {
    return `${name} has ${count} items.`;
};

console.log(fn("张三", 5));

// ---------- 2. 函数重载 ----------
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

console.log(greet("张三"));
console.log(greet("张三", "Dr."));

// ---------- 3. 返回值推断 ----------
// 始终显式标注返回值
function getGreeting(name: string): string {
    if (!name) return "Hello!";  // 不标注的话返回值会偷偷变成 string | null
    return `Hello, ${name}!`;
}

console.log(getGreeting("李四"));

// ---------- 4. void vs never ----------

// void — 函数执行完毕，不返回值
function log(msg: string): void {
    console.log(`[LOG] ${msg}`);
}

log("这是一条日志");

// never — 函数永远不会正常结束
function throwError(msg: string): never {
    throw new Error(msg);
}

function infiniteLoop(): never {
    while (true) {}
}

// ---------- 5. 剩余参数 ----------
function sum(...nums: number[]): number {
    return nums.reduce((a, b) => a + b, 0);
}

console.log(`sum(1, 2, 3) = ${sum(1, 2, 3)}`);
console.log(`sum(10, 20) = ${sum(10, 20)}`);

// ---------- 6. 可选链调用函数 ----------
let optionalFn: (() => string) | undefined;

// optionalFn();  // ❌ 可能为 undefined
console.log(optionalFn?.());  // undefined — 安全调用

optionalFn = () => "hello";
console.log(optionalFn?.());  // "hello"
