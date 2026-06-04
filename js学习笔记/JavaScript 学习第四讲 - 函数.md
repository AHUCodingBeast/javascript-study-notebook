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

#### 箭头函数的核心特性：`this` 词法绑定

箭头函数**没有自己的 `this`**，它会从**定义它的那个作用域**中捕获 `this`，就像捕获一个普通变量一样。这个行为叫**词法绑定**（定义时绑定，不是调用时绑定）。

**先理解：普通函数的 `this` 是怎么丢的？**

```javascript
const obj = {
    name: "张三",
    say: function() {
        console.log(this.name);  // ✅ "张三"
    }
};
obj.say();  // this 指向 obj，没问题
```

```javascript
const obj = {
    name: "张三",
    greet: function() {
        setTimeout(function() {
            console.log(this.name);  // ❌ undefined (this 指向 window)
        }, 100);
    }
};
obj.greet();
```

为什么会这样？因为普通函数的 `this` 是**调用时决定的**，不是定义时决定的。`setTimeout` 内部调用那个回调函数时，它不是在 `obj` 上调用的，所以 `this` 变成了 `window`（非严格模式）或 `undefined`（严格模式）。

**箭头函数的解法：**

```javascript
const obj = {
    name: "张三",
    greet: function() {
        setTimeout(() => {
            console.log(this.name);  // ✅ "张三"
        }, 100);
    }
};
obj.greet();
```

箭头函数定义在 `greet()` 内部，它捕获的是 `greet()` 执行时的 `this`（即 `obj`），所以即使 `setTimeout` 延迟调用，`this` 也不会变。

**更常见的场景 — 类中的回调：**

```javascript
class Counter {
    count = 0;

    start() {
        // ❌ 普通函数回调：this 丢失
        setInterval(function() {
            this.count++;  // ❌ TypeError: Cannot read property 'count' of undefined
        }, 1000);

        // ✅ 箭头函数回调：this 保留
        setInterval(() => {
            this.count++;  // ✅ this 仍然是 Counter 实例
        }, 1000);
    }
}
```

#### ⚠️ 箭头函数不适合做对象/类的方法

原因恰恰和上面相反 — 方法需要 `this` **随调用者变化**，但箭头函数的 `this` 在定义时就固定了，不会变。

```javascript
// ❌ 对象方法用箭头函数
const obj = {
    name: "张三",
    say: () => {
        console.log(this.name);  // ❌ undefined，this 指向外层 window
    }
};
obj.say();
```

箭头函数定义在对象字面量里时，它捕获的是**定义对象时所在的作用域**（通常是全局 window），而不是对象本身。

```javascript
// ❌ 类字段箭头函数做方法（虽然 class fields 写法常见，但有坑）
class Person {
    name = "李四";
    say = () => {
        console.log(this.name);  // 能用，但 say 不再是原型方法
    }
}
// 每个实例都有独立的 say 函数拷贝，浪费内存
// 且无法通过 super.say() 被子类覆盖
```

```javascript
// ✅ 类方法应该用普通函数（或简写方法）
class Person {
    name = "李四";
    say() {  // 等同于 say: function()
        console.log(this.name);  // ✅ this 指向调用该方法的实例
    }
}
```

#### `this` 绑定时机对比

| 关键字       | `this` 绑定时机          | 适合场景             |
|--------------|:------------------------:|----------------------|
| `function()` | **调用时**决定           | 对象方法、类方法     |
| `() => {}`   | **定义时**捕获（词法）   | 回调函数、嵌套函数   |

#### 什么时候用箭头函数？

- ✅ **回调函数** — `setTimeout`, `setInterval`, 事件监听, Promise `.then()`
- ✅ **数组方法回调** — `.map()`, `.filter()`, `.reduce()` 等
- ✅ **嵌套函数** — 需要访问外层 `this` 时

#### 什么时候不用箭头函数？

- ❌ **对象方法** — `const obj = { say: () => {} }`
- ❌ **类的方法** — `class A { method() { ... } }` 用简写方法，不用 `=>`
- ❌ **构造函数** — 箭头函数没有 `[[Construct]]`，不能 `new`
- ❌ **需要 `arguments` 的函数** — 箭头函数没有 `arguments`，用 `...args` 替代

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
