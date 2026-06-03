# JS 学习第十三讲 - 类型化数组

> 来源：[MDN JavaScript 指南 — Typed arrays](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Typed_arrays)

---

## 核心概念

- 类型化数组提供在内存缓冲中访问**原始二进制数据**的机制
- 用于音频/视频编辑、WebSocket 原始数据、WebGL 等底层操作
- 实现拆分为两部分：**缓冲（ArrayBuffer）+ 视图（TypedArray/DataView）**

---

## 知识点详解

### 1. ArrayBuffer — 内存块

```javascript
const buffer = new ArrayBuffer(16);  // 16 字节缓冲
console.log(buffer.byteLength);      // 16
```

### 2. 类型化数组视图

| 类型 | 字节数 | 描述 |
| ------ | ------ | ------ |
| `Int8Array` | 1 | 8 位有符号整数 |
| `Uint8Array` | 1 | 8 位无符号整数 |
| `Int16Array` | 2 | 16 位有符号整数 |
| `Int32Array` | 4 | 32 位有符号整数 |
| `Float32Array` | 4 | 32 位浮点数 |
| `Float64Array` | 8 | 64 位浮点数 |

```javascript
const buffer = new ArrayBuffer(16);
const int32View = new Int32Array(buffer);
int32View[0] = 0;
int32View[1] = 2;
```

### 3. 同一缓冲上多视图共享内存

```javascript
const int16View = new Int16Array(buffer);
int16View[0] = 32;
console.log(int32View[0]);  // 32 — 修改 int16View 会反映到 int32View
```

### 4. 类型化数组 vs 普通数组

| 特性 | 普通 Array | TypedArray |
| ------ | ----------- | ------------ |
| 元素类型 | 任意混合类型 | 固定单一类型 |
| 长度 | 可变（push/pop） | 固定长度 |
| `Array.isArray()` | true | false |
| 特有方法 | 无 | `set()`, `subarray()` |

### 5. 常见使用场景

```javascript
// 从缓冲读取文本
const buffer = new ArrayBuffer(11);
new Uint8Array(buffer).set(new TextEncoder().encode("Hello World"));
const text = new TextDecoder().decode(buffer);  // "Hello World"
```

---

## 常见误区

1. 类型化数组不是普通数组 — `Array.isArray()` 返回 `false`
2. 不能 push/pop 改变长度 — 长度固定
3. 同一缓冲上多视图**互相影响** — 它们共享底层内存
