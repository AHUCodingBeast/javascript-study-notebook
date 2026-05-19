# JS 学习第十一讲 - 使用 Promise（Using Promises）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises

## 核心概念

- `Promise` 是一个对象，代表**异步操作的最终完成或失败**
- 替代了传统的回调函数嵌套（"回调地狱"），支持链式调用
- Promise 有三种状态：`pending`（等待中）→ `fulfilled`（成功）或 `rejected`（失败）
- Promise **只能决议一次**，第一次 `resolve` 或 `reject` 后状态锁定
- 底层对应 Java 的 `CompletableFuture` / Python 的 `asyncio.Future`

## 知识点详解

### 1. 什么是 Promise？

Promise 本质上就是一个"承诺将来会有结果的对象"。你不用把回调函数传给它，而是在它上面绑定回调：

```js
// 传统回调风格（回调地狱）
doSomething(function(result) {
    doSomethingElse(result, function(newResult) {
        doThirdThing(newResult, function(finalResult) {
            console.log(finalResult);
        }, failureCallback);
    }, failureCallback);
}, failureCallback);

// Promise 风格（链式调用，只需一个 catch）
doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => doThirdThing(newResult))
    .then(finalResult => console.log(finalResult))
    .catch(failureCallback);
```

### 2. Promise 的基本使用

#### 2.1 创建 Promise

通过构造函数创建，接收一个**执行函数**（executor），该函数有两个参数：`resolve` 和 `reject`：

```js
const p = new Promise((resolve, reject) => {
    // 执行异步操作
    if (/* 成功 */) {
        resolve("成功结果");  // 状态变为 fulfilled
    } else {
        reject(new Error("失败原因"));  // 状态变为 rejected
    }
});

new Promise((resolve, reject) => {
    reject("some reason");  // 传入字符串也行
})
.catch(err => console.log(err));  // "some reason"
```

#### 2.2 常用方法

```js
// 创建一个已成功的 Promise
Promise.resolve("hello");

// 上面的这段代码等价于下面的这种写法
new Promise((resolve) => {
    resolve("hello");
});

// 创建一个已失败的 Promise
Promise.reject("error");
```

#### 2.3 绑定回调

```js
const p = new Promise((resolve, reject) => {
    resolve("hello");
});

// .then() — 成功时的回调
p.then(result => console.log(result));  // "hello"

// .catch() — 失败时的回调
p.catch(error => console.error(error));

// .finally() — 无论成功失败都执行
p.finally(() => console.log("完成"));
```

### 3. .then() 的返回值 — 链式调用的关键

**`.then()` 返回一个新的 Promise**，这是链式调用的基础：

```js
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
// promise2 不仅代表 doSomething() 的完成，还代表 successCallback 的完成
```

**⚠️ 最容易踩的坑：** `.then()` 里调用了异步函数但忘记 `return`，下一个 `.then()` 收到的是 `undefined`。

```js
// ❌ 漂浮 Promise（floating promise）
doSomething()
    .then((result) => {
        doSomethingElse(result);  // 缺少 return！结果被丢弃
    })
    .then((newResult) => {
        console.log(newResult);  // → undefined
    });

// ✅ 正确写法
doSomething()
    .then(result => doSomethingElse(result))  // 箭头函数隐式 return
    .then(newResult => console.log(newResult));
```

**经验法则：** 每当 `.then()` 里遇到 Promise，就 `return` 它。

### 4. 错误处理 — catch

`.catch()` 等同于 `.then(null, failureCallback)`，链中任何一步出错都跳到最近的 `catch`：

```js
doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => doThirdThing(newResult))
    .catch(failureCallback);  // 任何一步出错都到这里
```

行为类似 Java 的 `try-catch`：

```js
try {
    let result = syncDoSomething();
    let newResult = syncDoSomethingElse(result);
    console.log(newResult);
} catch (error) {
    failureCallback(error);
}
```

**catch 之后可以继续链式操作：**

```js
new Promise((resolve, reject) => {
    throw new Error("oops");
})
.catch(() => console.log("caught"))    // 捕获错误，链恢复正常
.then(() => console.log("done"));      // 继续执行
// 输出：caught → done

new Promise((resolve, reject) => {
    reject("original error");
})
.catch(err => { throw new Error("二次失败"); })  // 又抛异常
.then(result => console.log("不会执行"));  // 跳过
.catch(err => console.log(err));  // "二次失败"
```

**嵌套 catch（精细控制错误作用域）：**

```js
doSomethingCritical()
    .then(result =>
        doSomethingOptional()
            .then(optionalResult => doSomethingExtraNice(optionalResult))
            .catch(e => { /* 只捕获可选步骤的失败，外部不受影响 */ })
    )
    .then(() => moreCriticalStuff())
    .catch(e => console.error("严重失败"));  // 只捕获关键步骤的失败
```

### 5. 创建 Promise — 封装旧式回调 API

Promise 的构造函数常用于把旧式回调 API 改造成 Promise 风格：

```js
// 封装 setTimeout
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

wait(1000).then(() => console.log("1秒后"));
```

```js
// 封装旧式回调 API
function createAudioFileAsync(audioSettings, successCallback, failureCallback) {
    // 旧式实现...
}

// 用 Promise 封装
function createAudioFile(audioSettings) {
    return new Promise((resolve, reject) => {
        createAudioFileAsync(audioSettings, resolve, reject);
    });
}

createAudioFile(settings)
    .then(result => console.log("成功：" + result))
    .catch(error => console.error("失败：" + error));
```

### 6. 组合工具（并发异步操作）

| 方法 | 全部成功？ | 有一个失败怎么办？ | 返回值 |
|------|-----------|-------------------|--------|
| `Promise.all()` | 需要全部 | 立刻拒绝，中断 | 结果数组 `[r1, r2, ...]` |
| `Promise.allSettled()` | 不要求 | 继续等其他的 | `[{status, value/reason}, ...]` |
| `Promise.race()` | 不要求 | 看谁最快 | 最快的那个结果 |
| `Promise.any()` | 不要求 | 等第一个成功的 | 第一个成功的值 |

```js
// Promise.all — 全有或全无
Promise.all([p1, p2, p3])
    .then(([r1, r2, r3]) => { /* 全部成功 */ })
    .catch(err => { /* 有一个失败就到这里 */ });

// Promise.allSettled — 不管成败都等完
Promise.allSettled([p1, p2, p3])
    .then(results => {
        // [{status: "fulfilled", value: ...}, {status: "rejected", reason: ...}, ...]
    });

// Promise.race — 竞速，返回最快的那个
Promise.race([slow, fast]).then(console.log);
```

**顺序执行（用 reduce 扁平化）：**

```js
[f1, f2, f3]
    .reduce((p, f) => p.then(f), Promise.resolve())
    .then(result3 => { /* 使用最终结果 */ });
```

### 7. 时序 — 微任务 vs 任务队列

Promise 回调是**微任务（microtask）**，在同步代码执行完后、事件循环回到下一次循环**之前**执行：

```js
Promise.resolve().then(() => console.log(2));
console.log(1);
// 输出：1, 2（不是 2, 1！）
```

对比 `setTimeout`（任务队列，要等整个事件循环才执行）：

```js
Promise.resolve().then(() => console.log("microtask"));
setTimeout(() => console.log("macrotask"), 0);
console.log("sync");
// 输出：sync, microtask, macrotask
```

执行优先级：**同步代码 > 微任务（Promise） > 任务（setTimeout）**

Promise 保证：

- `.then()` 的回调永远不会在当前代码跑完之前执行
- 即使 Promise 已经 resolved，后面才加的 `.then()` 也会被调用
- 多次调用 `.then()` 可以加多个回调，按插入顺序执行

### 8. async/await

Promise 的语法糖，让异步代码看起来像同步代码：

```js
// Promise 链式
doSomething()
    .then(url => fetch(url))
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(failureCallback);

// async/await 等价写法
async function main() {
    try {
        const url = await doSomething();
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        failureCallback(error);
    }
}
```

`await` 不会阻塞整个程序，只暂停当前 `async` 函数内剩余部分。

**`await` 的关键规则：**

- `await` 只能在 `async` 函数内部使用，普通函数直接写 `await` 会报语法错误
- `await` 后面跟一个 Promise，会等待它 resolve 并返回结果值
- `await` 会暂停当前 `async` 函数，但不阻塞整个程序 — 其他代码照常执行
- 每个 `await` 都相当于一个 `.then()`，await 后的代码在微任务队列中执行

```js
async function fn() {
    const res = await Promise.resolve("hello");
    console.log(res);  // "hello"
}
fn();
console.log("world");  // 先输出 "world"，再输出 "hello"
```

**顶层 await（Top-level await）：**

模块文件中可以直接使用 `await`，不需要包裹在 `async` 函数中：

```js
// 模块文件（.js with type="module"）
const res = await fetch("./data.json");
const data = await res.json();
export { data };  // 父模块会等这里完成后再执行
```

- 普通脚本中顶层 `await` 报语法错误
- 模块中顶层 `await` 合法，父模块会等待它完成，但不阻塞兄弟模块加载

**`await` 的错误处理：**

```js
async function main() {
    try {
        const res = await fetch("/api/data");
        const data = await res.json();
    } catch (error) {
        // 等同于 .catch()
        console.error(error);
    }
}
```

### 8.1 async/await vs Python

JS 和 Python 的 async/await 语法几乎一模一样：

```python
# Python
import asyncio

async def main():
    res = await asyncio.sleep(1)
    print("done")

asyncio.run(main())
```

```js
// JavaScript
async function main() {
    const res = await wait(1000);
    console.log("done");
}
main();
```

| 特性 | JS | Python |
| ------ | ----------- | --------------- |
| 定义异步函数 | `async function fn()` | `async def fn()` |
| 等待 Promise/Future | `await promise` | `await future` |
| 并发等待 | `Promise.all()` | `asyncio.gather()` |
| 入口 | 直接调用 `main()` | `asyncio.run(main())` |
| 顶层 await | 模块中可用 | 需要 asyncio 支持 |

区别：Python 需要 `asyncio.run()` 启动事件循环，JS 的顶层 `async` 函数直接调用即可。

### 8.2 async/await 与 Promise 的对应关系

| async/await | 等价 Promise |
| --- | --- |
| `async function fn()` | `new Promise(...)` 返回 Promise |
| `return value` | `Promise.resolve(value)` |
| `throw error` | `Promise.reject(error)` |
| `await promise` | `promise.then(...)` |
| `try/catch` | `.catch(...)` |

```js
// async 函数返回的就是一个 Promise
async function fn() { return "hello"; }
fn().then(console.log);  // "hello"

// async 函数抛异常 = Promise.reject
async function errFn() { throw new Error("oops"); }
errFn().catch(console.error);  // Error: oops
```

### 9. 未处理拒绝事件

当 Promise 被拒绝但没有 `.catch()` 处理器时：

```js
// 浏览器环境
window.addEventListener("unhandledrejection", event => {
    console.log(event.promise);   // 被拒绝的 Promise
    console.log(event.reason);    // 拒绝原因
});

// Node.js 环境
process.on("unhandledRejection", (reason, promise) => {
    // 检查未处理的拒绝
});
```

## 常见误区

1. **`.then()` 里忘记 `return`** — 下一个 `.then()` 收到 `undefined`（漂浮 Promise）
2. **`Promise.all` 遇 reject 立即中断** — 不是等全部完成再判断
3. **Promise 只能决议一次** — 先 `resolve` 后 `reject` 只有第一次有效
4. **`then()` 回调是微任务** — 不会立刻执行，要等同步代码跑完
5. **`race` 返回的是值本身** — 不是数组，是最快的那个 Promise 的结果
6. **`catch` 后链式操作继续执行** — `catch` 不中断链，除非它本身也抛出异常

## 跨语言对比

### Promise vs Java CompletableFuture

| 特性 | JS Promise | Java CompletableFuture |
| ------ | ----------- | ---------------------- |
| 成功回调 | `.then(callback)` | `.thenAccept(callback)` |
| 转换 | `.then(x => transform(x))` | `.thenApply(fn)` |
| 错误处理 | `.catch(error => ...)` | `.exceptionally(fn)` |
| 并行全部 | `Promise.all()` | `CompletableFuture.allOf()` |
| 竞速 | `Promise.race()` | 无直接等价 |

### Promise vs Python asyncio

| 特性 | JS Promise | Python asyncio |
| ------ | ----------- | --------------- |
| 异步对象 | `Promise` | `asyncio.Future` / `Task` |
| 回调 | `.then(callback)` | `.add_done_callback()` |
| 并发 | `Promise.all()` | `asyncio.gather()` |
| async/await | `async/await` | `async def` / `await`（几乎一样） |

## 速查表

| 对比 | 说明 |
|------|------|
| `then` vs `catch` | then 处理成功；catch 处理失败（捕获链中任何错误） |
| `Promise.all` vs `allSettled` | all 遇错中断；allSettled 等全部完成 |
| `Promise.race` vs `any` | race 返回最快（成功或失败）；any 返回第一个成功 |
| 回调 vs Promise | 回调嵌套深（地狱）；Promise 链式扁平 |
| 微任务 vs 任务 | Promise 回调是微任务（先执行）；setTimeout 是任务（后执行） |
| `.then(fn)` vs `.then(() => fn())` | 前者直接传函数引用；后者立即调用后传返回值 |

## 快速自测

<details>
<summary>1. `Promise.resolve().then(() => console.log(2)); console.log(1);` 输出什么？</summary>

`1, 2` — Promise 回调是微任务，同步代码先执行
</details>

<details>
<summary>2. `Promise.all([Promise.resolve(1), Promise.reject("err")]).then()` 会触发 then 吗？</summary>

不会。`all` 遇到 reject 立刻中断，走 `.catch()`
</details>

<details>
<summary>3. Promise 的 `.then()` 里忘记 `return` 会怎样？</summary>

下一个 `.then()` 收到 `undefined`，前面的异步操作变成了"漂浮 Promise"
</details>

<details>
<summary>4. 一个 Promise 能先 resolve 再 reject 吗？</summary>

不能。只能决议一次，第一次调用（resolve 或 reject）说了算
</details>

<details>
<summary>5. `Promise.race([p1, p2])` 返回的是数组吗？</summary>

不是。返回最快那个 Promise 的结果值本身
</details>
