# 函数 学习笔记

> 来源：[MDN JavaScript 指南 — 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)

---

## 核心概念

- **函数声明 vs 函数表达式** — 两种定义方式，提升行为不同
- **箭头函数**（ES6）— 简洁语法，`this` 词法绑定
- **函数参数** — 默认参数、剩余参数 `...args`
- **闭包** — 函数记住了定义时的环境变量

---

## 知识点详解

### 1. 函数声明 vs 函数表达式

**函数声明** — 会被完整提升，可以在定义前调用：

```javascript
greet("张三");  // ✅ 提升后可以调用

function greet(name) {
    return "Hello " + name;
}
```

**函数表达式** — 不会被提升：

```javascript
greet("李四");  // ❌ TypeError: greet is not a function

const greet = function(name) {
    return "Hello " + name;
};
```

### 2. 箭头函数（ES6 重点）

```javascript
// 单行可省略 return 和大括号
const greet = (name) => "Hello " + name;

// 多行需要大括号和 return
const greet2 = (name) => {
    const msg = "Hello " + name;
    return msg;
};
```

**箭头函数的关键特性：`this` 词法绑定**

箭头函数**没有自己的 `this`**，继承定义时所在环境的 `this`。

```javascript
// ❌ 普通函数在回调中 this 会变
setInterval(function() {
    this.count++;  // ❌ this 指向 window
}, 1000);

// ✅ 箭头函数在回调中保 this
setInterval(() => {
    this.count++;  // ✅ this 仍然是 Counter 实例
}, 1000);
```

⚠️ 箭头函数**不适合做对象/类的方法**，因为它没有自己的 `this`。

### 3. 函数参数

#### 默认参数

```javascript
function greet(name = "陌生人") {
    return `你好，${name}！`;
}
```

#### 剩余参数（推荐用）

```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);  // 6
```

`...numbers` 把所有参数收集成一个真正的 `Array`。

> `arguments` 是 ES5 的类数组对象，现代开发中**推荐用 `...args` 替代**。

### 4. 闭包（Closure）

闭包 = 函数 + 它定义时所处的环境变量。

```javascript
function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
counter();  // 1
counter();  // 2
```

**经典场景：数据封装 / 私有变量**

```javascript
function createWallet() {
    let balance = 100;
    return {
        getBalance: () => balance,
        deposit: (amount) => { balance += amount; }
    };
}
```

---

## 速查表

### 函数定义方式对比

| 方式 | 语法 | 提升 | 适用场景 |
|------|------|------|---------|
| 函数声明 | `function fn() {}` | ✅ 完整提升 | 通用 |
| 函数表达式 | `const fn = function() {}` | ❌ | 需要控制作用域时 |
| 箭头函数 | `const fn = () => {}` | ❌ | 回调函数，保 this |

---

## 快速自测（问答参考答案）

<details>
<summary>1. function fn() {} 和 const fn = function() {} 有什么区别？</summary>

前者会被完整提升，后者不会。
</details>

<details>
<summary>2. 箭头函数 const f = () => 42 等价于什么普通函数？</summary>

`const f = function() { return 42; }`
</details>

<details>
<summary>3. 箭头函数能做对象的方法吗？为什么？</summary>

不适合，因为箭头函数没有自己的 `this`，无法指向对象本身。
</details>

<details>
<summary>4. function sum(...args) { return args.length; } 调用 sum(1, 2, 3) 返回什么？</summary>

`3`（传了 3 个参数）。
</details>

<details>
<summary>5. 闭包的核心特征是什么？</summary>

函数记住了定义时所处的环境变量，可以持续访问和修改。
</details>

<details>
<summary>6. fn(); function fn() { console.log("A"); } 能运行吗？输出什么？</summary>

能，输出 `"A"`（函数声明被提升了）。
</details>

<details>
<summary>7. arguments 和 ...args 的区别？</summary>

`arguments` 是类数组（没有数组方法），`...args` 是真数组。
</details>
