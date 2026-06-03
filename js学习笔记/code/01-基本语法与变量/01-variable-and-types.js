// ============================================================
// JavaScript 学习第一讲 — 基本语法与变量
// 知识点：var / let / const、数据类型、类型转换、模板字符串、字符串基础
// ============================================================

// ---------- 1. var / let / const ----------

// var — 函数作用域，变量提升
if (true) {
    var x = 5;
}
console.log("var x =", x); // 5 — 不受 {} 块限制

// let — 块级作用域
if (true) {
    let y = 5;
    // console.log(y); // OK — 块内可以访问
}
// console.log(y); // ReferenceError: y is not defined

// const — 块级作用域 + 不可重新赋值
const PI = 3.14159;
// PI = 3; // TypeError: Assignment to constant variable

// const 必须初始化
// const NAME; // SyntaxError: Missing initializer

// const 引用不可变，但对象/数组内容可修改
const person = { name: "张三" };
person.name = "李四"; // OK
person.age = 25;      // OK
// person = {};       // TypeError: 不能重新赋值

// ---------- 2. 数据类型 ----------
console.log(typeof true);         // "boolean"
console.log(typeof null);         // "object" — 历史 bug
console.log(typeof undefined);    // "undefined"
console.log(typeof 42);           // "number"
console.log(typeof 3.14n);        // "bigint"
console.log(typeof "hello");      // "string"
console.log(typeof Symbol());     // "symbol"
console.log(typeof {});           // "object"
console.log(Array.isArray([]));   // true — 判断数组用这个

// ---------- 3. 类型转换 ----------
console.log("37" + 7);           // "377" — + 遇到字符串做拼接
console.log("答案是 " + 42);     // "答案是 42"
console.log("37" - 7);           // 30 — 其他运算符做数学运算
console.log("37" * 7);           // 259

console.log(parseInt("101", 2));  // 5 — 二进制转十进制
console.log(parseFloat("3.14"));  // 3.14
console.log(+"1.1");              // 1.1 — 一元加号

// ---------- 4. 模板字符串 ----------
let name = "张三";
let msg = `你好，${name}！欢迎回来。`;
console.log(msg);

// 支持多行
let multiLine = `第一行
第二行
第三行`;
console.log(multiLine);

// ---------- 5. 字符串基础 ----------
let a = 'hello';
let b = "world";
console.log("Joyo 的猫".length);  // 7
