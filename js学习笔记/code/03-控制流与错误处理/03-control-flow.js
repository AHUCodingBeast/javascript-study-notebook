// ============================================================
// JavaScript 学习第三讲 — 控制流与错误处理
// 知识点：if...else、switch、假值、try...catch...finally、throw
// ============================================================

// ---------- 1. if...else ----------
const score = 85;

if (score >= 90) {
    console.log("优秀");
} else if (score >= 60) {
    console.log("及格");  // 这个分支
} else {
    console.log("不及格");
}

// ---------- 2. 假值（Falsy）测试 ----------
const falsyValues = [false, undefined, null, 0, NaN, ""];
console.log("\n--- 假值测试 ---");
falsyValues.forEach(v => {
    console.log(`${String(v)} → ${v ? "truthy" : "falsy"}`);
});

// 对象都是 truthy
console.log("\n--- 对象 truthy ---");
if ({}) {
    console.log("空对象也是 truthy");
}

// ---------- 3. switch ----------
const day = 3;
console.log("\n--- switch ---");
switch (day) {
    case 1:
        console.log("星期一");
        break;
    case 2:
        console.log("星期二");
        break;
    case 3:
        console.log("星期三");  // 这个分支
        break;
    default:
        console.log("其他");
}

// switch 穿透演示（不加 break）
console.log("\n--- switch 穿透演示 ---");
switch (1) {
    case 1:
        console.log("case 1");
        // 不加 break — 穿透
    case 2:
        console.log("case 2");
        break;
}
// 输出: case 1, case 2

// switch 用严格相等 ===
console.log("\n--- switch 严格相等 ---");
const val = "2";
switch (val) {
    case 2:
        console.log("数字 2");  // 不会执行（=== 比较）
        break;
    case "2":
        console.log("字符串 '2'");  // 这个
        break;
}

// ---------- 4. try...catch...finally ----------
console.log("\n--- try...catch...finally ---");

function divide(a, b) {
    if (b === 0) {
        throw new Error("除数不能为 0");
    }
    return a / b;
}

try {
    console.log(divide(10, 2));  // 5
    console.log(divide(10, 0));  // 抛异常
} catch (e) {
    console.error(`捕获异常: ${e.message}`);
} finally {
    console.log("finally 总会执行");
}

// ---------- 5. 抛出异常 ----------
// 最佳实践：throw Error 对象
function validateAge(age) {
    if (age < 0 || age > 150) {
        throw new Error(`无效的年龄: ${age}`);
    }
    return true;
}

try {
    validateAge(-1);
} catch (e) {
    console.error(`验证失败: ${e.message}`);
}

// finally 中的 return 会覆盖 try 的返回值
function testReturn() {
    try {
        return 1;
    } finally {
        return 2;
    }
}
console.log(`\nfinally return: ${testReturn()}`);  // 2
