// ============================================================
// JavaScript 学习第五讲 — 表达式与运算符
// 知识点：== vs ===、逻辑运算符与短路、??、三元运算符、typeof/instanceof
// ============================================================

// ---------- 1. 比较运算符 —— == vs === ----------
console.log("--- == vs === ---");
console.log(`2 == "2": ${2 == "2"}`);           // true — 隐式类型转换
console.log(`2 === "2": ${2 === "2"}`);         // false — 类型不同
console.log(`null == undefined: ${null == undefined}`);  // true
console.log(`null === undefined: ${null === undefined}`); // false

// ---------- 2. 逻辑运算符与短路 ----------
console.log("\n--- 逻辑运算符 ---");
console.log(`"Cat" && "Dog": ${"Cat" && "Dog"}`);   // "Dog"
console.log(`"Cat" || "Dog": ${"Cat" || "Dog"}`);   // "Cat"（短路）
console.log(`"" || "Dog": ${"" || "Dog"}`);         // "Dog"（空字符串是 falsy）

// 空值合并 ?? — 只在 null/undefined 时用默认值
console.log("\n--- 空值合并 ?? ---");
console.log(`0 || "默认": ${0 || "默认"}`);     // "默认" — 0 是 falsy
console.log(`0 ?? "默认": ${0 ?? "默认"}`);     // 0 — 0 不是 null/undefined
console.log(`"" || "默认": ${"" || "默认"}`);   // "默认"
console.log(`"" ?? "默认": ${"" ?? "默认"}`);   // "" — 空字符串保留

// ??= 和 ||= 的区别
let x = 0;
x ??= 5;
console.log(`x ??= 5 (x=0): ${x}`);   // 0 — ??= 只在 null/undefined 时替换

let y = 0;
y ||= 5;
console.log(`y ||= 5 (y=0): ${y}`);   // 5 — ||= 对所有 falsy 都替换

// ---------- 3. 三元运算符 ----------
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(`\n三元运算符: ${status}`);  // adult

// ---------- 4. typeof ----------
console.log("\n--- typeof ---");
console.log(`typeof null: ${typeof null}`);           // "object" — 历史 bug
console.log(`typeof undefined: ${typeof undefined}`);  // "undefined"
console.log(`typeof {}: ${typeof {}}`);                // "object"
console.log(`typeof []: ${typeof []}`);                // "object" — 不能区分数组
console.log(`Array.isArray([]): ${Array.isArray([])}`); // true ✅

// ---------- 5. instanceof ----------
class Animal {}
class Dog extends Animal {}
const dog = new Dog();
console.log(`\ninstanceof: dog instanceof Dog: ${dog instanceof Dog}`);   // true
console.log(`instanceof: dog instanceof Animal: ${dog instanceof Animal}`); // true

// ---------- 6. 解构赋值 ----------
const [one, two] = ["one", "two"];
console.log(`\n数组解构: one="${one}", two="${two}"`);

const { name, age: userAge } = { name: "张三", age: 25 };
console.log(`对象解构: name="${name}", age=${userAge}`);
