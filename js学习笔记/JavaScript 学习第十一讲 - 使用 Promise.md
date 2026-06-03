# JS 学习第十一讲 - 使用 Promise

> 来源：[MDN JavaScript 指南 — Using promises](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

---

## 核心概念

- `Promise` 代表**异步操作的最终完成或失败**，替代回调地狱
- 三种状态：`pending`（等待中）→ `fulfilled`（成功）或 `rejected`（失败）
- Promise **只能决议一次**

---

## 知识点详解

### 1. 创建 Promise

```javascript
const p = new Promise((resolve, reject) => {
    if (/* 成功 */) {
        resolve("成功结果");
    } else {
        reject(new Error("失败原因"));
    }
});
```

### 2. 链式调用

```javascript
doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => doThirdThing(newResult))
    .catch(failureCallback);  // 任何一步出错都到这里
```

**⚠️ 最容易踩的坑：** `.then()` 里调用了异步函数但忘记 `return`：

```javascript
// ❌ 错误：缺少 return
doSomething()
    .then((result) => {
        doSomethingElse(result);  // 结果被丢弃
    })
    .then((newResult) => {
        console.log(newResult);  // → undefined
    });

// ✅ 正确写法
doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => console.log(newResult));
```

**经验法则：** 每当 `.then()` 里遇到 Promise，就 `return` 它。

### 3. async/await（最常用的写法）

```javascript
// async/await 等价写法
async function main() {
    try {
        const url = await doSomething();
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

**关键规则：**
- `await` 只能在 `async` 函数内部使用
- `await` 后面跟一个 Promise，会等待它 resolve 并返回结果
- `await` 只暂停当前 async 函数，不阻塞整个程序

```javascript
async function fn() {
    const res = await Promise.resolve("hello");
    console.log(res);  // "hello"
}
fn();
console.log("world");  // 先输出 "world"，再输出 "hello"
```

**async 函数返回的就是一个 Promise：**

```javascript
async function fn() { return "hello"; }
fn().then(console.log);  // "hello"
```

### 4. 组合工具

| 方法 | 全部成功？ | 有一个失败怎么办 | 返回值 |
| ------ | ----------- | ---------------- | ------ |
| `Promise.all()` | 需要全部 | 立刻拒绝 | 结果数组 `[r1, r2, ...]` |
| `Promise.allSettled()` | 不要求 | 继续等其他的 | 每个的结果状态 |
| `Promise.race()` | 不要求 | 看谁最快 | 最快的那个结果 |

```javascript
// Promise.all — 全有或全无
Promise.all([p1, p2, p3])
    .then(([r1, r2, r3]) => { /* 全部成功 */ })
    .catch(err => { /* 有一个失败就到这里 */ });
```

### 5. 微任务 vs 任务队列

Promise 回调是**微任务**，在同步代码执行完后、`setTimeout` 之前执行：

```javascript
Promise.resolve().then(() => console.log("microtask"));
setTimeout(() => console.log("macrotask"), 0);
console.log("sync");
// 输出：sync, microtask, macrotask
```

---

## 常见误区

1. `.then()` 里忘记 `return` — 下一个 `.then()` 收到 `undefined`
2. `Promise.all` 遇 reject 立即中断 — 不是等全部完成再判断
3. Promise 只能决议一次 — 先 `resolve` 后 `reject` 只有第一次有效
4. `race` 返回的是值本身，不是数组

---

## 快速自测（问答参考答案）

<details>
<summary>1. Promise.resolve().then(() => console.log(2)); console.log(1); 输出什么？</summary>

`1, 2` — Promise 回调是微任务，同步代码先执行。
</details>

<details>
<summary>2. Promise.all([Promise.resolve(1), Promise.reject("err")]).then() 会触发 then 吗？</summary>

不会。`all` 遇到 reject 立刻中断，走 `.catch()`。
</details>

<details>
<summary>3. Promise 的 .then() 里忘记 return 会怎样？</summary>

下一个 `.then()` 收到 `undefined`。
</details>

<details>
<summary>4. 一个 Promise 能先 resolve 再 reject 吗？</summary>

不能。只能决议一次，第一次调用说了算。
</details>

<details>
<summary>5. Promise.race([p1, p2]) 返回的是数组吗？</summary>

不是。返回最快那个 Promise 的结果值本身。
</details>
