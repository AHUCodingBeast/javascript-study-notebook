// ============================================================
// JavaScript 学习第十一讲 — 使用 Promise
// 知识点：创建 Promise、链式调用、async/await、Promise.all/allSettled/race、微任务
// ============================================================

// ---------- 1. 创建 Promise ----------
function delay(ms) {
    return new Promise((resolve, reject) => {
        if (ms < 0) {
            reject(new Error("延迟时间不能为负数"));
        } else {
            setTimeout(() => resolve(`等了 ${ms}ms`), ms);
        }
    });
}

// ---------- 2. 链式调用 ----------
console.log("--- Promise 链式调用 ---");

function doSomething() {
    return Promise.resolve("第一步结果");
}

function doSomethingElse(result) {
    console.log(`  doSomethingElse 收到: "${result}"`);
    return Promise.resolve(result + " → 第二步");
}

doSomething()
    .then(result => doSomethingElse(result))
    .then(newResult => console.log(`  最终结果: "${newResult}"`))
    .catch(err => console.error(`  错误: ${err.message}`));

// ---------- 3. async/await（推荐写法） ----------
async function asyncDemo() {
    console.log("\n--- async/await ---");
    try {
        const url = await doSomething();
        const result = await doSomethingElse(url);
        console.log(`  async 结果: "${result}"`);
    } catch (error) {
        console.error(`  错误: ${error.message}`);
    }
}

// 执行异步演示
(async () => {
    await asyncDemo();

    // await 后面跟 Promise，暂停当前 async 函数
    console.log("\n--- await 暂停演示 ---");
    console.log("  开始...");
    const res = await Promise.resolve("hello");
    console.log(`  await 结果: "${res}"`);
    console.log("  结束");

    // async 函数返回的就是一个 Promise
    async function fn() { return "hello"; }
    console.log("\n--- async 返回 Promise ---");
    fn().then(console.log);  // "hello"

    // ---------- 4. Promise.all / allSettled / race ----------
    console.log("\n--- Promise 组合 ---");

    const p1 = Promise.resolve("p1 成功");
    const p2 = Promise.resolve("p2 成功");
    const p3 = Promise.reject(new Error("p3 失败"));

    // Promise.all — 全有或全无
    Promise.all([p1, p2])
        .then(results => console.log(`all(全成功): [${results.join(", ")}]`))
        .catch(err => console.log(`all: 有一个失败 → ${err.message}`));

    Promise.all([p1, p3])
        .then(results => console.log(`all: 这个不会执行`))
        .catch(err => console.log(`all(有失败): → ${err.message}`));

    // Promise.allSettled — 不管成功失败都等完
    Promise.allSettled([p1, p3])
        .then(results => console.log(`allSettled:`, results));

    // Promise.race — 看谁最快
    Promise.race([p1, p2])
        .then(result => console.log(`race 最快: ${result}`));

    // ---------- 5. 微任务 vs 宏任务 ----------
    console.log("\n--- 微任务 vs 宏任务 ---");
    Promise.resolve().then(() => console.log("  microtask"));
    setTimeout(() => console.log("  macrotask"), 0);
    console.log("  sync");
    // 输出顺序: sync, microtask, macrotask
})();
