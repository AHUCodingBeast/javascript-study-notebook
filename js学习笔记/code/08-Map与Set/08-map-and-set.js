// ============================================================
// JavaScript 学习第八讲 — 带键的集合（Map 和 Set）
// 知识点：Map 增删改查、Map vs Object、Set、数组去重
// ============================================================

// ---------- 1. Map ----------
console.log("--- Map 基本操作 ---");
const map = new Map();
map.set("a", 1);
map.set(1, 2);        // 键可以是数字
map.set(true, 3);     // 键可以是布尔值

console.log(`get("a"): ${map.get("a")}`);   // 1
console.log(`has("a"): ${map.has("a")}`);   // true
console.log(`delete("a"): ${map.delete("a")}`); // true
console.log(`size: ${map.size}`);           // 2

// 初始化时传二维数组
const config = new Map([
    ["api", "/api/v1"],
    ["timeout", 5000],
    ["retry", true],
]);

// 遍历
console.log("\n--- Map 遍历 ---");
for (const [key, value] of config) {
    console.log(`  ${key}: ${value}`);
}

// ---------- 2. Map vs Object ----------
console.log("\n--- Map vs Object ---");

const obj = {};
obj["name"] = "张三";
obj[1] = "数字键被转为字符串";  // obj["1"] === obj[1]

const mapObj = new Map();
mapObj.set("name", "张三");
mapObj.set(1, "数字键保留类型");
mapObj.set(1, "覆盖了");

console.log(`Object: obj[1] === obj["1"]: ${obj[1] === obj["1"]}`);  // true
console.log(`Map: mapObj.get(1): "${mapObj.get(1)}"`);  // 覆盖了

// ---------- 3. Set ----------
console.log("\n--- Set ---");
const s = new Set();
s.add(1);
s.add("text");
s.add(1);       // 重复，无效
console.log(`has(1): ${s.has(1)}`);    // true
console.log(`size: ${s.size}`);        // 2

// 经典用法：数组去重
const arr = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(arr)];
console.log(`去重前: [${arr}]`);
console.log(`去重后: [${unique}]`);

// NaN 在 Set 中只一份
const nanSet = new Set();
nanSet.add(NaN);
nanSet.add(NaN);
console.log(`Set 中 NaN 数量: ${nanSet.size}`);  // 1
