// ============================================================
// JavaScript 学习第六讲 — 数字、Math 与日期
// 知识点：Number/NaN、Math、Date
// ============================================================

// ---------- 1. 数字类型 ----------
console.log("--- 特殊值 ---");
console.log(`+Infinity: ${Infinity}`);
console.log(`-Infinity: ${-Infinity}`);
console.log(`NaN: ${NaN}`);

// ⚠️ NaN 不等于任何值，包括自己
console.log(`NaN == NaN: ${NaN == NaN}`);           // false!
console.log(`Number.isNaN(NaN): ${Number.isNaN(NaN)}`);  // true ✅
console.log(`Number.isNaN("hello"): ${Number.isNaN("hello")}`); // false
console.log(`isNaN("hello"): ${isNaN("hello")}`);   // true（全局 isNaN 会转类型，不推荐）

// 其他 Number 工具
console.log(`Number.isFinite(Infinity): ${Number.isFinite(Infinity)}`);  // false
console.log(`Number.isFinite(42): ${Number.isFinite(42)}`);              // true

// ---------- 2. Math 对象 ----------
console.log("\n--- Math ---");
console.log(`Math.floor(3.9): ${Math.floor(3.9)}`);   // 3
console.log(`Math.ceil(3.1): ${Math.ceil(3.1)}`);     // 4
console.log(`Math.round(3.5): ${Math.round(3.5)}`);   // 4
console.log(`Math.trunc(3.9): ${Math.trunc(3.9)}`);   // 3
console.log(`Math.max(1, 5, 3): ${Math.max(1, 5, 3)}`); // 5
console.log(`Math.min(1, 5, 3): ${Math.min(1, 5, 3)}`); // 1
console.log(`Math.PI: ${Math.PI}`);

// 生成 N 到 M 的随机整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(`随机 1-100: ${randomInt(1, 100)}`);

// ---------- 3. 数字格式化 ----------
console.log("\n--- 格式化 ---");
console.log(`(3.14).toFixed(2): ${(3.14).toFixed(2)}`);  // "3.14"（字符串！）
console.log(`typeof ${(3.14).toFixed(2)}: ${typeof (3.14).toFixed(2)}`); // "string"

// ---------- 4. Date 对象 ----------
console.log("\n--- Date ---");

// 创建日期
const now = new Date();
console.log(`当前时间: ${now}`);

const d1 = new Date("1995-12-25");
console.log(`字符串解析: ${d1}`);

// ⚠️ 月份从 0 开始！0 = 一月，11 = 十二月
const d2 = new Date(1995, 11, 25);
console.log(`年,月(0-11),日: ${d2}`);
console.log(`getFullYear: ${d2.getFullYear()}`);   // 1995
console.log(`getMonth: ${d2.getMonth()}`);         // 11（十二月！）
console.log(`getDate: ${d2.getDate()}`);           // 25

// 获取时间戳（最常用）
console.log(`Date.now(): ${Date.now()}`);
