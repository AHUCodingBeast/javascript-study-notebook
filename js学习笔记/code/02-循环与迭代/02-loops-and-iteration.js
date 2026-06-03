// ============================================================
// JavaScript 学习第二讲 — 循环与迭代
// 知识点：for/while/do...while、break/continue、
//          for...in、for...of、解构赋值、扩展运算符
// ============================================================

// ---------- 1. 三种基础循环 ----------

// for
console.log("--- for 循环 ---");
for (let i = 0; i < 3; i++) {
    console.log(`for: ${i}`);
}

// while
console.log("--- while 循环 ---");
let i = 0;
while (i < 3) {
    console.log(`while: ${i}`);
    i++;
}

// do...while — 至少执行一次
console.log("--- do...while ---");
let j = 10;
do {
    console.log(`do...while: ${j}`);
} while (j < 3);  // 条件不满足，但已执行一次

// ---------- 2. break / continue ----------
for (let n = 0; n < 5; n++) {
    if (n === 2) continue;  // 跳过 n=2
    if (n === 4) break;     // n=4 时跳出
    console.log(`break/continue: ${n}`);  // 输出 0, 1, 3
}

// ---------- 3. for...in — 遍历对象键名 ----------
const person = { name: "张三", age: 30, city: "北京" };
console.log("\n--- for...in ---");
for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// ⚠️ 不要用它遍历数组
const arr = ["a", "b", "c"];
arr.extra = "附加";  // 数组也能挂自定义属性
for (const key in arr) {
    console.log(`for...in 遍历数组: key=${key}, value=${arr[key]}`);
    // 输出 "0", "1", "2", "extra" — 连自定义属性也会出来
}

// ---------- 4. for...of — 遍历可迭代对象的值 ----------
console.log("\n--- for...of ---");
const colors = ["red", "green", "blue"];
for (const color of colors) {
    console.log(color);
}

// 遍历字符串
for (const ch of "abc") {
    console.log(`字符: ${ch}`);
}

// ---------- 5. 解构赋值 ----------

// 对象解构
const { name, age } = person;
console.log(`解构: name=${name}, age=${age}`);

// 重命名
const { name: userName } = person;
console.log(`重命名: userName=${userName}`);

// 默认值
const { hobby = "编程" } = person;  // person 没有 hobby，用默认值
console.log(`默认值: hobby=${hobby}`);

// 数组解构
const rgb = [255, 128, 0];
const [r, g, b] = rgb;
console.log(`RGB: ${r}, ${g}, ${b}`);

// 跳过元素
const [first, , third] = rgb;
console.log(`跳过: first=${first}, third=${third}`);

// 函数参数解构（AI 代码中很常见）
function greet({ name, age }) {
    console.log(`${name} 今年 ${age} 岁`);
}
greet(person);

// ---------- 6. 扩展运算符 ----------

// 展开数组
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log(`展开数组: [${arr2}]`);  // [1, 2, 3, 4]

// 合并对象
const a = { name: "张三" };
const b = { age: 30 };
const c = { ...a, ...b };
console.log(`合并对象:`, c);  // { name: "张三", age: 30 }

// 数组去重（经典一行）
const unique = [...new Set([1, 2, 2, 3, 3, 3])];
console.log(`去重: [${unique}]`);  // [1, 2, 3]

// for...in vs for...of 速查:
// for...in → 键名（遍历对象）
// for...of → 值（遍历数组、Map、Set、字符串）
