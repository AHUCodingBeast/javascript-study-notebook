# 函数 学习笔记

> 来源：[MDN JavaScript 指南 — 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)

---

## 核心概念

- **函数声明 vs 函数表达式** — 两种定义方式，提升行为不同
- **箭头函数**（ES6）— 简洁语法，`this` 词法绑定
- **函数参数** — 默认参数（ES6）、剩余参数（ES6）、`arguments` 对象
- **闭包** — 函数记住了定义时的环境变量
- **函数提升** — 函数声明会被完整提升到作用域顶部
- **对象方法简写**（ES6）— 对象里的方法可以省略 `function`

---

## 知识点详解

### 1. 函数声明 vs 函数表达式

**函数声明** — 会被完整提升，可以在定义前调用：

```javascript
greet("张三");  // ✅ "Hello 张三" — 提升后可以提前调用

function greet(name) {
    return "Hello " + name;
}
```

**函数表达式** — 不会被提升（赋值没提升），定义前调用会报错：

```javascript
greet("李四");  // ❌ TypeError: greet is not a function

const greet = function(name) {
    return "Hello " + name;
};
```

### 2. 箭头函数（ES6 重点）

```javascript
// 原始写法
const greet = function(name) {
    return "Hello " + name;
};

// 箭头函数 — 单行可省略 return 和大括号
const greet = (name) => "Hello " + name;

// 多行需要大括号和 return
const greet2 = (name) => {
    const msg = "Hello " + name;
    return msg;
};

// 无参数时写空括号
const hello = () => console.log("Hello");

// 一个参数时可省略括号（不推荐，影响可读性）
const square = x => x * x;
```

**箭头函数的关键特性：`this` 词法绑定**

箭头函数**没有自己的 `this`**，继承定义时所在环境的 `this`。

```javascript
// ❌ 普通函数在回调中 this 会变
class Counter {
    count = 0;
    start() {
        setInterval(function() {
            this.count++;  // ❌ this 指向 window，不是 Counter 实例
        }, 1000);
    }
}

// ✅ 箭头函数在回调中保 this
class Counter {
    count = 0;
    start() {
        setInterval(() => {
            this.count++;  // ✅ this 仍然是 Counter 实例
        }, 1000);
    }
}
```

⚠️ 箭头函数**不适合做对象/类的方法**，因为它没有自己的 `this`。

### 3. 对象方法简写（ES6）

```javascript
// ES5 写法
const obj = {
    start: function() { console.log("开始"); }
};

// ES6 简写 — 省略 function 关键字和冒号
const obj = {
    start() { console.log("开始"); }
};
```

两者完全等价，ES6 写法更简洁。

### 4. 函数参数

#### 默认参数（ES6）

```javascript
function greet(name = "陌生人") {
    return `你好，${name}！`;
}

greet();           // "你好，陌生人！"
greet("张三");     // "你好，张三！"
```

和 Python 的默认参数用法一样。

#### 剩余参数（ES6）

```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3);  // 6
sum(10, 20);   // 30
```

`...numbers` 把所有参数收集成一个真正的 `Array`。

#### arguments 对象

```javascript
function showArgs() {
    console.log(arguments.length);  // 3
    console.log(arguments[0]);      // 1
}
showArgs(1, 2, 3);
```

`arguments` 是函数内部的"类数组对象"，包含所有传参。⚠️ 不是真正的数组，没有 `.map()`、`.filter()` 等方法。现代开发中**推荐用剩余参数 `...args` 替代**。

### 5. 闭包（Closure）

闭包 = 函数 + 它定义时所处的环境变量。

```javascript
function createCounter() {
    let count = 0;           // 这个变量被闭包"保存"
    return function() {
        count++;             // 每次访问的都是同一个 count
        return count;
    };
}

const counter = createCounter();
counter();  // 1
counter();  // 2
counter();  // 3
```

**为什么能这样？**
- 正常情况下，`createCounter()` 执行完后，`count` 应该被销毁
- 但返回的内部函数**引用了** `count`，JavaScript 引擎发现还有人要用，就不销毁
- 每次调用 `counter()`，操作的都是同一个闭包环境中的 `count`

**经典场景：数据封装 / 私有变量**

```javascript
function createWallet() {
    let balance = 100;  // 外部无法直接访问
    return {
        getBalance: () => balance,
        deposit: (amount) => { balance += amount; },
        withdraw: (amount) => { balance -= amount; }
    };
}

const wallet = createWallet();
wallet.getBalance();   // 100
wallet.deposit(50);
wallet.getBalance();   // 150
// wallet.balance;     // undefined — 无法直接访问
```

### 6. 函数提升

**函数声明**会被完整提升（声明 + 函数体）：

```javascript
fn();  // ✅ 可以调用

function fn() { console.log("B"); }
```

**函数表达式**不会被提升（变量提升但赋值没有）：

```javascript
fn();  // ❌ TypeError

const fn = function() { console.log("A"); };
```

**当两者同名时，函数声明优先级高于 var：**

```javascript
fn();  // "B" — 调用时 fn 指向函数声明
var fn = function() { console.log("A"); };
function fn() { console.log("B"); }
```

相当于：
```javascript
function fn() { console.log("B"); }  // ① 函数声明，完整提升
fn();                                 // ② 输出 "B"
fn = function() { console.log("A"); }; // ③ 赋值，之后 fn 变成 "A" 版本
```

### 7. 高阶函数

函数可以作为参数传递，也可以作为返回值返回：

```javascript
// 函数作为参数
function timer(fn) {
    return function(...args) {
        const start = Date.now();
        const result = fn(...args);
        console.log(`耗时 ${Date.now() - start}ms`);
        return result;
    };
}

// 等价于 Python 的装饰器模式
const myFunc = timer(() => {
    // 原始逻辑
});
```

---

## 速查表

### 函数定义方式对比

| 方式 | 语法 | 提升 | 适用场景 |
|------|------|------|---------|
| 函数声明 | `function fn() {}` | ✅ 完整提升 | 通用，可提前调用 |
| 函数表达式 | `const fn = function() {}` | ❌ | 需要控制作用域时 |
| 箭头函数 | `const fn = () => {}` | ❌ | 回调函数，保 this |
| 对象方法简写 | `{ fn() {} }` | N/A | 对象/类的方法 |

### 参数语法对比

| 语法 | 版本 | 说明 |
|------|------|------|
| `arguments` | ES5 | 类数组对象，不是真数组 |
| `...args` | ES6 | 真正的数组，推荐用 |
| `name = "默认"` | ES6 | 默认参数，类似 Python |

---

## 常见误区

| 误区 | 正确理解 |
|------|---------|
| 箭头函数和普通函数完全等价 | 箭头函数没有自己的 `this`，也不能做构造器 |
| 闭包很难理解 | 闭包就是"函数记住了定义时的变量"，每次调用都在操作同一份数据 |
| `function` 和 `const fn = function` 一样 | 前者会提升，后者不会 |
| 箭头函数适合做对象方法 | 不适合，因为 `this` 不会指向对象本身 |
| `arguments` 是真数组 | 不是，是"类数组对象"，没有数组方法，推荐用 `...args` |
| `start() {}` 是某种新语法 | 只是 ES6 对象方法简写，等价于 `start: function() {}` |

---

## 快速自测

1. `function fn() {}` 和 `const fn = function() {}` 有什么区别？
2. 箭头函数 `const f = () => 42` 等价于什么普通函数？
3. 箭头函数能做对象的方法吗？为什么？
4. `function sum(...args) { return args.length; }` 调用 `sum(1, 2, 3)` 返回什么？
5. 闭包的核心特征是什么？
6. `fn(); function fn() { console.log("A"); }` 能运行吗？输出什么？
7. `{ start() {} }` 是什么语法？
8. `arguments` 和 `...args` 的区别？

---

### 自测题答案

1. 前者会被完整提升，后者不会
2. `const f = function() { return 42; }`
3. 不适合，因为箭头函数没有自己的 `this`，无法指向对象本身
4. `3`（传了 3 个参数）
5. 函数记住了定义时所处的环境变量，可以持续访问和修改
6. 能，输出 `"A"`（函数声明被提升了）
7. ES6 对象方法简写，等价于 `start: function() {}`
8. `arguments` 是类数组（没有数组方法），`...args` 是真数组
