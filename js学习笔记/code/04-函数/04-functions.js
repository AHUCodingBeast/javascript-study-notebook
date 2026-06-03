// ============================================================
// JavaScript 学习第四讲 — 函数
// 知识点：函数声明 vs 表达式、箭头函数、默认参数、剩余参数、闭包
// ============================================================

// ---------- 1. 函数声明 vs 函数表达式 ----------

// 函数声明 — 会被完整提升，可以在定义前调用
greet("张三");  // ✅ OK — 提升生效

function greet(name) {
    return "Hello " + name;
}
console.log(greet("李四"));

// 函数表达式 — 不会被提升
// greet2("王五");  // ❌ TypeError: greet2 is not a function

const greet2 = function(name) {
    return "Hello " + name;
};
console.log(greet2("王五"));

// ---------- 2. 箭头函数（ES6） ----------

// 单行可省略 return 和大括号
const add = (a, b) => a + b;
console.log(`add(2, 3) = ${add(2, 3)}`);

// 多行需要大括号和 return
const addVerbose = (a, b) => {
    const result = a + b;
    return result;
};

// 箭头函数 this 词法绑定 — 演示
const counter = {
    count: 0,
    // 普通函数在回调中 this 会变
    incrementWithFunction() {
        setTimeout(function() {
            console.log(`普通函数 this.count:`, this.count);  // undefined
        }, 10);
    },
    // 箭头函数保 this
    incrementWithArrow() {
        setTimeout(() => {
            console.log(`箭头函数 this.count:`, this.count);  // 0
        }, 10);
    },
};

counter.incrementWithFunction();
counter.incrementWithArrow();

// ⚠️ 箭头函数不适合做对象/类的方法
const obj = {
    name: "obj",
    // getName: () => this.name,  // ❌ this 不是 obj
    getName() { return this.name; },  // ✅ 简写方法（普通函数）
};
console.log(obj.getName());

// ---------- 3. 函数参数 ----------

// 默认参数
function greet3(name = "陌生人") {
    return `你好，${name}！`;
}
console.log(greet3());           // 你好，陌生人！
console.log(greet3("赵六"));    // 你好，赵六！

// 剩余参数（推荐替代 arguments）
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
console.log(`sum(1, 2, 3, 4, 5) = ${sum(1, 2, 3, 4, 5)}`);

// ---------- 4. 闭包 ----------

// 闭包 = 函数 + 它定义时所处的环境变量
function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter1 = createCounter();
console.log(`闭包计数器: ${counter1()}`);  // 1
console.log(`闭包计数器: ${counter1()}`);  // 2

// 数据封装 / 私有变量
function createWallet() {
    let balance = 100;
    return {
        getBalance: () => balance,
        deposit: (amount) => { balance += amount; },
        withdraw: (amount) => {
            if (amount <= balance) {
                balance -= amount;
                return true;
            }
            return false;
        },
    };
}

const wallet = createWallet();
console.log(`钱包余额: ${wallet.getBalance()}`);  // 100
wallet.deposit(50);
console.log(`存款后余额: ${wallet.getBalance()}`);  // 150
wallet.withdraw(30);
console.log(`取款后余额: ${wallet.getBalance()}`);  // 120
// wallet.balance;  // undefined — 外部无法直接访问 balance
