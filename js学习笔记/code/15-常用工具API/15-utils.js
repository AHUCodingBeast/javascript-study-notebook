// ============================================================
// JavaScript 学习第十五讲 — 常用工具 API
// 知识点：可选链 ??、空值合并 ??、JSON、正则、定时器、fetch、
//          Object 静态方法、字符串方法
// ============================================================

// ---------- 1. 可选链 ?. ----------
const user = {
    name: "张三",
    address: { city: "北京", details: { zip: "100000" } },
};

// 安全访问深层属性
const city = user?.address?.city;
console.log(`可选链 city: ${city}`);  // "北京"

// 中间为 null/undefined 时返回 undefined
const missing = user?.contact?.phone;
console.log(`可选链 missing: ${missing}`);  // undefined

// 用于函数调用
const api = { getData: () => "数据" };
const result = api?.getData?.();
console.log(`可选链函数调用: ${result}`);

// 用于数组访问
const arr = [1, 2, 3];
const first = arr?.[0];
const last = arr?.[arr.length - 1];
console.log(`可选链数组: first=${first}, last=${last}`);

// ---------- 2. 空值合并 ?? ----------
function getConfig(input) {
    const timeout = input?.timeout ?? 5000;     // null/undefined 时用默认值
    const retries = input?.retries ?? 3;
    const name = input?.name ?? "默认服务";
    return { timeout, retries, name };
}

console.log("\n--- 空值合并 ?? ---");
console.log(getConfig(null));                    // 全部默认值
console.log(getConfig({ timeout: 0 }));          // timeout=0 保留（?? 不替换 0）
console.log(getConfig({ retries: 0, name: "" })); // retries=0, name="" 都保留

// ---------- 3. JSON ----------
console.log("\n--- JSON ---");

const obj = { name: "张三", age: 25, tags: ["前端", "TypeScript"] };

// 对象 → JSON 字符串
const json = JSON.stringify(obj);
console.log(`stringify: ${json}`);

// JSON 字符串 → 对象
const parsed = JSON.parse(json);
console.log(`parse:`, parsed);

// 格式化输出（调试用）
console.log(`格式化输出:\n${JSON.stringify(obj, null, 2)}`);

// ⚠️ JSON.stringify 会丢失 undefined、函数、Symbol
const lossy = { a: 1, b: undefined, c: function() {}, d: Symbol() };
console.log(`丢失值: ${JSON.stringify(lossy)}`);  // {"a":1}

// ---------- 4. 正则表达式 ----------
console.log("\n--- 正则表达式 ---");

// test — 是否匹配（最常用）
console.log(`/^\\d+$/.test("123"): ${/^\d+$/.test("123")}`);       // true
console.log(`/^\\d+$/.test("abc"): ${/^\d+$/.test("abc")}`);       // false

// match — 返回匹配结果
console.log(`"hello".match(/l/g): ${"hello".match(/l/g)}`);       // ["l", "l"]

// replace — 替换
console.log(`"hello".replace(/l/g, "L"): ${"hello".replace(/l/g, "L")}`);  // "heLLo"

// split — 分割
console.log(`"a,b,c".split(/,/): ${["a", "b", "c"]}`);

// 常用模式
const email = "test@example.com";
console.log(`邮箱验证: ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}`);  // true
console.log(`手机号验证: ${/^1[3-9]\d{9}$/.test("13800138000")}`);  // true

// ---------- 5. 定时器 ----------
console.log("\n--- 定时器 ---");
const timerId = setTimeout(() => {
    console.log("  1秒后执行（setTimeout）");
}, 1000);
// clearTimeout(timerId);  // 取消

// ---------- 6. Object 静态方法 ----------
console.log("\n--- Object 静态方法 ---");
const sampleObj = { a: 1, b: 2, c: 3 };
console.log(`Object.keys: ${Object.keys(sampleObj)}`);
console.log(`Object.values: ${Object.values(sampleObj)}`);
console.log(`Object.entries: ${JSON.stringify(Object.entries(sampleObj))}`);

// 合并对象
const merged = { ...sampleObj, d: 4 };
console.log(`合并:`, merged);

// 冻结对象
const frozen = Object.freeze({ x: 1 });
// frozen.x = 2;  // 严格模式下报错

// ---------- 7. 字符串常用方法 ----------
console.log("\n--- 字符串方法 ---");
const str = "Hello World";
console.log(`startsWith("Hello"): ${str.startsWith("Hello")}`);
console.log(`endsWith("World"): ${str.endsWith("World")}`);
console.log(`includes("lo"): ${str.includes("lo")}`);
console.log(`indexOf("World"): ${str.indexOf("World")}`);
console.log(`trim(): "${"  hello  ".trim()}"`);
console.log(`padStart(15, "0"): "${str.padStart(15, "0")}"`);
console.log(`repeat(2): "${str.repeat(2)}"`);
console.log(`toLowerCase(): "${str.toLowerCase()}"`);

// URL 编码
console.log(`\nencodeURIComponent("你好 世界"): ${encodeURIComponent("你好 世界")}`);
console.log(`decodeURIComponent: ${decodeURIComponent("%E4%BD%A0%E5%A5%BD")}`);
