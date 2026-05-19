# JS 学习第十三讲 - 类型化数组（Typed Arrays）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Typed_arrays

## 核心概念

- 类型化数组是**类似数组的对象**，提供一种在内存缓冲中访问**原始二进制数据**的机制
- 用于处理音频/视频编辑、WebSocket 原始数据、WebGL、网络协议等底层操作
- 实现拆分为两部分：**缓冲（Buffer）+ 视图（View）**
- 底层对应 Java 的 `ByteBuffer` / `NIO Buffer`、Python 的 `struct` + `bytearray` / `array.array`

## 知识点详解

### 1. 为什么需要类型化数组？

普通 JS 数组是稀疏的、类型不固定的，不适合高效操作二进制数据。类型化数组：
- 元素是固定类型的原始二进制值（8 位整数到 64 位浮点数）
- 连续内存布局，访问效率高
- 不是普通数组的替代品，而是**补充** — 操作二进制数据的专用接口

### 2. 缓冲（Buffer）— 内存块

缓冲是内存块的低级表示，没有格式，不能直接读写。需要通过视图来访问。

#### 2.1 ArrayBuffer

```js
// 创建 16 字节的缓冲，初始化为 0
const buffer = new ArrayBuffer(16);
console.log(buffer.byteLength);  // 16
```

**支持的操作：**

| 操作 | 方法 | 说明 |
|------|------|------|
| 分配 | `new ArrayBuffer(size)` | 创建并初始化为 0 |
| 复制 | `buffer.slice(begin, end)` | 高效复制一部分数据 |
| 转移 | `buffer.transfer()` | 转移所有权给新缓冲，原缓冲不可用 |
| 调整大小 | `buffer.resize(newSize)` | 需预设 `maxByteLength` |

#### 2.2 SharedArrayBuffer

与 `ArrayBuffer` 的区别：

| 特性 | ArrayBuffer | SharedArrayBuffer |
|------|------------|-------------------|
| 所有权 | 同一时刻只能属于单个执行上下文 | 可被多个执行上下文同时访问 |
| 转移 | 传递给其他上下文时被转移 | 不被转移，共享访问 |
| 竞争 | 无 | 可能有竞争条件，需要 `Atomics` |
| 调整大小 | 可增可减 | 只能增长不能缩小 |

### 3. 视图（View）— 访问缓冲的数据

两种视图：

#### 3.1 类型化数组视图

| 类型 | 值范围 | 字节数 | 描述 | C 等效类型 |
|------|--------|--------|------|-----------|
| `Int8Array` | -128 ~ 127 | 1 | 8 位有符号整数 | `int8_t` |
| `Uint8Array` | 0 ~ 255 | 1 | 8 位无符号整数 | `uint8_t` |
| `Uint8ClampedArray` | 0 ~ 255 | 1 | 8 位无符号（值被钳制） | `uint8_t` |
| `Int16Array` | -32768 ~ 32767 | 2 | 16 位有符号整数 | `int16_t` |
| `Uint16Array` | 0 ~ 65535 | 2 | 16 位无符号整数 | `uint16_t` |
| `Int32Array` | ±2^31 - 1 | 4 | 32 位有符号整数 | `int32_t` |
| `Uint32Array` | 0 ~ 2^32 - 1 | 4 | 32 位无符号整数 | `uint32_t` |
| `Float32Array` | ±3.4E38 | 4 | 32 位 IEEE 浮点数 | `float` |
| `Float64Array` | ±1.8E308 | 8 | 64 位 IEEE 浮点数 | `double` |
| `BigInt64Array` | ±2^63 - 1 | 8 | 64 位有符号整数 | `int64_t` |
| `BigUint64Array` | 0 ~ 2^64 - 1 | 8 | 64 位无符号整数 | `uint64_t` |

```js
// 创建缓冲
const buffer = new ArrayBuffer(16);

// 创建 32 位有符号整数视图（4 个元素，每个 4 字节）
const int32View = new Int32Array(buffer);

// 像普通数组一样访问
int32View[0] = 0;
int32View[1] = 2;
int32View[2] = 4;
int32View[3] = 6;
```

#### 3.2 同一缓冲上的多个视图

可以在同一数据上创建不同格式的视图，它们共享底层缓冲：

```js
const buffer = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);
int32View[0] = 0;
int32View[1] = 2;
int32View[2] = 4;
int32View[3] = 6;

// 16 位整数视图，共享同一缓冲
const int16View = new Int16Array(buffer);
console.log(int16View);  // [0, 0, 2, 0, 4, 0, 6, 0]（小端序）

// 修改 int16View 会反映到 int32View
int16View[0] = 32;
console.log(int32View[0]);  // 32
```

内存布局示意（小端序）：

```
Int16Array  |  32  |  0   |   2  |  0   |   4  |  0   |   6  |  0   |
Int32Array  |     32      |      2      |      4      |      6      |
ArrayBuffer | 20 00 00 00 | 02 00 00 00 | 04 00 00 00 | 06 00 00 00 |
```

#### 3.3 视图共有属性

所有视图都有：
- `buffer` — 所引用的底层缓冲
- `byteOffset` — 相对于缓冲起始位置的偏移量
- `byteLength` — 视图的字节长度

#### 3.4 类型化数组特有方法

类型化数组**不能**改变长度（没有 `push`/`pop`/`shift`/`splice`），但有两个特有方法：

```js
// set() — 用另一个数组/类型化数组的数据批量设置多个索引
const a = new Uint8Array(8);
const b = new Uint8Array([1, 2, 3]);
a.set(b, 2);  // 从索引 2 开始设置 → [0, 0, 1, 2, 3, 0, 0, 0]

// subarray() — 创建共享同一缓冲的窄范围视图
const c = a.subarray(2, 5);  // → Uint8Array [1, 2, 3]，修改 c 会影响 a
```

**越界访问行为：**
- 读取越界 → 返回 `undefined`（不报错）
- 写入越界 → 静默忽略（不报错也不改变数据）

#### 3.5 `Uint8ClampedArray` 的特殊性

钳制（clamp）值到 0 ~ 255：

```js
const c = new Uint8ClampedArray([0, 100, 255, 300, -10]);
// → [0, 100, 255, 255, 0]  — 超过 255 的变 255，小于 0 的变 0
```

用于 Canvas 像素数据处理（`ImageData.data`）。

### 4. DataView — 底层精确控制

`DataView` 可以精确控制字节序和数据格式，适合混合类型数据的场景。

```js
const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);

// 写入不同类型的值
view.setUint8(0, 255);       // 偏移 0：8 位无符号
view.setInt32(1, 42);        // 偏移 1：32 位有符号
view.setFloat64(5, 3.14);    // 偏移 5：64 位浮点数

// 读取
console.log(view.getUint8(0));      // 255
console.log(view.getInt32(1));      // 42
console.log(view.getFloat64(5));    // 3.14
```

**字节序控制**：`DataView` 默认大端序，可显式指定小端序：

```js
view.setInt32(0, 42, true);   // true = 小端序
view.setInt32(0, 42, false);  // false = 大端序（默认）
```

**不对齐访问**：多字节读写可以从任意偏移开始，不需要内存对齐。

### 5. 使用场景

#### 5.1 从缓冲读取文本

```js
// UTF-8 文本
const buffer = new ArrayBuffer(11);
new Uint8Array(buffer).set(new TextEncoder().encode("Hello World"));
const text = new TextDecoder().decode(buffer);  // "Hello World"

// UTF-16 文本
const buffer16 = new ArrayBuffer(10);
const view16 = new Uint16Array(buffer16);
view16.set([72, 101, 108, 108, 111]);  // "Hello" 的 UTF-16 编码
const text16 = String.fromCharCode(...view16);  // "Hello"
```

#### 5.2 复杂数据结构（模拟 C 结构体）

```c
// C 结构体
// struct { int id; float amount; char status[4]; } Invoice;
```

```js
const buffer = new ArrayBuffer(12);  // 4 + 4 + 4
const view = new DataView(buffer);
view.setInt32(0, 1234);        // id
view.setFloat32(4, 99.99);     // amount
// status 可以通过 Uint8Array 访问
```

#### 5.3 常见 Web API

| API | 用法 |
|-----|------|
| `FileReader.readAsArrayBuffer()` | 读取 Blob/File 为缓冲 |
| `XMLHttpRequest.send()` | 发送类型化数组/ArrayBuffer |
| `ImageData.data` | `Uint8ClampedArray`，RGBA 像素数据 |

### 6. 类型化数组 vs 普通数组

| 特性 | 普通 Array | TypedArray |
|------|-----------|------------|
| 元素类型 | 任意混合类型 | 固定单一类型 |
| 内存布局 | 可能稀疏 | 连续内存 |
| 长度 | 可变（push/pop） | 固定长度 |
| `Array.isArray()` | true | false |
| 支持的方法 | 全部 | 大部分，但不包括 push/pop/shift/splice |
| 特有方法 | 无 | `set()`, `subarray()` |

**转换为普通数组：**

```js
const typed = new Uint8Array([1, 2, 3]);
const arr1 = Array.from(typed);
const arr2 = [...typed];
```

## 常见误区

1. **类型化数组就是普通数组** — `Array.isArray()` 返回 `false`，是不同对象
2. **可以 push/pop 改变长度** — 不行，长度固定，用 `set()`/`subarray()` 代替
3. **越界访问会报错** — 不会，读取返回 `undefined`，写入静默忽略
4. **`Uint8ClampedArray` 会取模** — 不会，超过 255 变 255，小于 0 变 0（钳制）
5. **Buffer 可以直接读写** — 不行，必须通过视图（TypedArray 或 DataView）
6. **同一缓冲上多视图互不影响** — 影响！它们共享底层内存

## 跨语言对比

### TypedArray vs Java ByteBuffer

| 特性 | JS TypedArray | Java ByteBuffer |
|------|--------------|-----------------|
| 缓冲 | `ArrayBuffer` | `ByteBuffer.allocate()` |
| 视图 | `Int32Array`, `Float64Array` 等 | `getInt()`, `putFloat()` |
| 字节序 | 依赖平台（小端序常见） | `order(ByteOrder)` |
| 直接操作 | `typedArray[i] = value` | `buffer.putInt(offset, value)` |
| 直接缓冲 | 无直接等价 | `ByteBuffer.allocateDirect()` |

### TypedArray vs Python struct/array

| 特性 | JS TypedArray | Python |
|------|--------------|--------|
| 二进制缓冲 | `ArrayBuffer` | `bytearray` |
| 类型数组 | `Int32Array` 等 | `array.array('i', [...])` |
| 结构体打包 | `DataView` | `struct.pack/unpack` |
| 内存视图 | `subarray()` | `memoryview` |

## 速查表

| 对比 | 说明 |
|------|------|
| `ArrayBuffer` vs `SharedArrayBuffer` | 前者单上下文独占；后者多上下文共享，需 `Atomics` |
| `TypedArray` vs `DataView` | 前者便捷、类型固定；后者底层、可混类型、可控字节序 |
| `Uint8Array` vs `Uint8ClampedArray` | 前者超出范围取模；后者钳制到 0~255 |
| 类型化数组 vs 普通数组 | 前者固定长度、连续内存、单类型；后者可变、稀疏、混合类型 |
| `set()` vs 逐元素赋值 | `set()` 批量操作更高效，特别是共享同一缓冲时 |
| `subarray()` vs `slice()` | `subarray()` 共享缓冲（修改影响原数组）；`slice()` 拷贝新数组 |

## 快速自测

<details>
<summary>1. `Array.isArray(new Uint8Array(5))` 返回什么？</summary>

`false` — 类型化数组不是普通数组
</details>

<details>
<summary>2. 在同一 `ArrayBuffer` 上创建 `Int32Array` 和 `Int16Array`，修改一个会影响另一个吗？</summary>

会 — 它们共享底层内存
</details>

<details>
<summary>3. `new Uint8ClampedArray([300, -10])` 的结果是什么？</summary>

`[255, 0]` — 超过 255 钳制为 255，小于 0 钳制为 0
</details>

<details>
<summary>4. `typedArray[999]` 越界访问会报错吗？</summary>

不会，返回 `undefined`
</details>

<details>
<summary>5. `DataView` 默认的字节序是什么？</summary>

大端序（big-endian），可显式指定小端序
</details>

<details>
<summary>6. 类型化数组支持 `push()` 吗？</summary>

不支持 — 长度固定，无法动态增删元素
</details>
