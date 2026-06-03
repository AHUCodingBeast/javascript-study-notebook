// ============================================================
// JavaScript 学习第十四讲 — 迭代器和生成器
// 知识点：生成器函数、yield、next()、可迭代对象、yield* 委托
// ============================================================

// ---------- 1. 生成器函数（Generator） ----------
function* range(start, end, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;  // 暂停并返回值
    }
}

// 调用生成器函数不执行代码，返回生成器对象
const gen = range(0, 5, 2);
console.log("--- Generator next() ---");
console.log(gen.next());  // { value: 0, done: false }
console.log(gen.next());  // { value: 2, done: false }
console.log(gen.next());  // { value: 4, done: false }
console.log(gen.next());  // { value: undefined, done: true }

// ---------- 2. 用 for...of 遍历生成器 ----------
console.log("\n--- for...of 遍历生成器 ---");
for (const num of range(0, 5)) {
    console.log(`  ${num}`);
}

// ---------- 3. 生成器只能迭代一次 ----------
const gen2 = range(0, 3);
const first = [...gen2];
const second = [...gen2];
console.log(`\n第一次展开: [${first}]`);   // [0, 1, 2]
console.log(`第二次展开: [${second}]`);   // [] — 已消耗

// ---------- 4. 可迭代对象 ----------
// 内置可迭代：String、Array、TypedArray、Map、Set
// Object 默认不可迭代
// for (const x of { a: 1 }) {}  // ❌ TypeError

// 实现自定义可迭代对象
const myIterable = {
    data: [10, 20, 30],
    [Symbol.iterator]() {
        let index = 0;
        const data = this.data;
        return {
            next() {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

console.log("\n--- 自定义可迭代对象 ---");
for (const val of myIterable) {
    console.log(`  ${val}`);
}

// ---------- 5. yield* 委托 ----------
function* g1() { yield 1; yield 2; }
function* g2() { yield* g1(); yield 3; }

console.log(`\nyield* 委托: [${[...g2()]}]`);  // [1, 2, 3]

// ---------- 6. 展开语法 + 解构赋值 ----------
const spread = [..."hello"];
console.log(`展开字符串: [${spread}]`);  // ["h", "e", "l", "l", "o"]

const [a, b, ...rest] = [1, 2, 3, 4];
console.log(`解构: a=${a}, b=${b}, rest=[${rest}]`);  // a=1, b=2, rest=[3, 4]
