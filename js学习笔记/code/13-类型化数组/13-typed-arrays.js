// ============================================================
// JavaScript 学习第十三讲 — 类型化数组
// 知识点：ArrayBuffer、类型化数组视图、多视图共享内存、TextEncoder/TextDecoder
// ============================================================

// ---------- 1. ArrayBuffer — 内存块 ----------
const buffer = new ArrayBuffer(16);  // 16 字节
console.log(`buffer.byteLength: ${buffer.byteLength}`);  // 16

// ---------- 2. 类型化数组视图 ----------
const int32View = new Int32Array(buffer);
int32View[0] = 0;
int32View[1] = 2;
console.log(`Int32Array: [${int32View}]`);

// 各类型字节数：
// Int8Array   - 1 字节
// Uint8Array  - 1 字节
// Int16Array  - 2 字节
// Int32Array  - 4 字节
// Float32Array - 4 字节
// Float64Array - 8 字节

// ---------- 3. 同一缓冲上多视图共享内存 ----------
const int16View = new Int16Array(buffer);
console.log(`\n多视图共享内存演示:`);
console.log(`修改前 int32View[0]: ${int32View[0]}`);
int16View[0] = 42;  // 修改低 16 位
console.log(`int16View[0]=42 后 int32View[0]: ${int32View[0]}`);
// 两个视图共享底层内存，修改一个会影响另一个

// ---------- 4. 类型化数组 vs 普通数组 ----------
const typedArr = new Int32Array([1, 2, 3]);
const normalArr = [1, 2, 3];

console.log("\n--- TypedArray vs Array ---");
console.log(`Array.isArray(typedArr): ${Array.isArray(typedArr)}`);  // false
console.log(`Array.isArray(normalArr): ${Array.isArray(normalArr)}`);  // true
// typedArr.push(4);  // ❌ TypeError — 没有 push/pop，长度固定

// ---------- 5. TextEncoder / TextDecoder ----------
const textBuffer = new ArrayBuffer(11);
const view = new Uint8Array(textBuffer);

// 写入文本
const encoded = new TextEncoder().encode("Hello World");
view.set(encoded);

// 读取文本
const decoded = new TextDecoder().decode(textBuffer);
console.log(`\nTextDecoder: "${decoded}"`);

// ---------- 6. 常见使用场景 ----------
// 生成随机颜色数据（模拟图像处理）
const pixels = new Uint8Array(12);  // 4 像素 × 3 通道 (RGB)
for (let i = 0; i < 12; i++) {
    pixels[i] = Math.floor(Math.random() * 256);
}
console.log(`\n随机像素 [${pixels}]`);
