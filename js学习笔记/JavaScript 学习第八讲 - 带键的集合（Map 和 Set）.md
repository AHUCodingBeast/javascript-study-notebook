# JS 学习第八讲 - 带键的集合（Map 和 Set）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Keyed_collections

## 核心概念

- `Map` 和 `Set` 是 ES6 新增的集合类型，支持**任意类型**的键
- 与 `Object` 不同，Map/Set 的迭代顺序就是**插入顺序**
- `WeakMap` 和 `WeakSet` 是"弱引用"版本，键对象可以被垃圾回收

## 知识点详解

### 1. Map — 键/值对集合

```js
const m = new Map();
m.set("a", 1);
m.set(1, 2);       // 键可以是数字
m.set(true, 3);    // 键可以是布尔值
m.set({x: 1}, 4);  // 键可以是对象

m.get("a");    // 1
m.get(1);      // 2
m.has("a");    // true
m.delete("a"); // true
m.clear();     // 清空
m.size;        // 键值对数量
```

**初始化时直接传二维数组：**

```js
const map = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3]
]);
```

**遍历：**

```js
// for...of（每次拿到 [key, value]）
for (const [key, value] of map) {
    console.log(key, value);
}

// 快捷方法
map.keys();    // 所有键
map.values();  // 所有值
map.entries(); // 所有 [key, value]
```

### 2. Map vs Object 对比

| 特性 | Object | Map |
|------|--------|-----|
| 键的类型 | 只能字符串/Symbol | 任意类型 |
| 获取大小 | `Object.keys(obj).length` | `map.size` |
| 遍历顺序 | 不保证插入顺序 | 严格按插入顺序 |
| 原型 | 有（`toString` 等默认键） | 无（干净的键空间） |
| 频繁增删 | 性能较差 | 性能更好 |
| JSON 序列化 | 支持 | 不支持 |

**选择建议：**
- 存配置、数据结构、JSON → **Object**（写法简洁）
- 键类型不确定、频繁增删、需要保序 → **Map**

### 3. WeakMap — 弱引用 Map

```js
const wm = new WeakMap();
const obj = { name: "test" };
wm.set(obj, "secret data");
wm.get(obj);     // "secret data"
wm.has(obj);     // true
wm.delete(obj);  // true
```

**WeakMap 的限制：**

| 特性 | Map | WeakMap |
|------|-----|---------|
| 没有 `size` | 有 | ❌ `undefined` |
| 不能遍历 | 可以 | ❌ 没有 keys()/values()/entries() |
| 键类型 | 任意值 | 只能是**对象**或 Symbol |

**为什么没 size？** 因为键对象可能被垃圾回收了，里面的元素数量随时在变。

**核心概念：弱引用**

- 普通 Map 会"死死抓住"键对象，阻止其被垃圾回收
- WeakMap 是"松手"的 —— 键对象在外面没有其他引用时，就会被垃圾回收，对应的键值对也跟着消失
- 和 Java 的 `WeakHashMap` / `WeakReference` 是同一个概念

**典型用途：**

1. 给对象附加**私有数据**，不影响垃圾回收
2. 缓存 DOM 元素的元数据，元素删除后数据自动清理，**不泄漏内存**

```js
const elementData = new WeakMap();
const el = document.getElementById("myDiv");
elementData.set(el, { clickCount: 0 });
// 如果 el 被 DOM 移除且无其他引用，数据自动被回收
```

### 4. Set — 唯一值的集合

```js
const s = new Set();
s.add(1);
s.add("text");
s.add(1);      // 重复，无效
s.has(1);      // true
s.delete(1);   // true
s.clear();
s.size;        // 元素数量
```

**初始化时传数组：**

```js
const s = new Set([1, 2, 2, 3, 3]);  // Set {1, 2, 3}
```

**遍历：**

```js
for (const item of s) {
    console.log(item);
}

// 或直接用 keys()/values()（Set 的 key 和 value 是同一个）
```

### 5. Set 的常用场景

**数组去重：**

```js
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];      // [1, 2, 3]
// 或
const unique2 = Array.from(new Set(arr));  // [1, 2, 3]
```

**Set vs Array：**

| 操作 | Array | Set |
|------|-------|-----|
| 去重 | 手动写逻辑 | 自动 |
| 删除元素 | `arr.splice(arr.indexOf(val), 1)` | `s.delete(val)` |
| 查找 NaN | `indexOf` 找不到 | `has(NaN)` 返回 true |
| 按索引访问 | ✅ `arr[0]` | ❌ 不支持 |
| JSON 序列化 | ✅ | ❌ 需转回数组 |

### 6. WeakSet — 弱引用 Set

和 WeakMap 类似：

- 只能存**对象**或 Symbol
- 没有 `size`，不能遍历
- 对象无其他引用时自动被垃圾回收
- 用途：标记 DOM 元素是否被处理过，不泄漏内存

### 7. SameValueZero 相等算法

Map 和 Set 判断相等用的是 **SameValueZero**，不是 `===`：

```js
// 和 === 的区别：
NaN === NaN;           // false
// 但 Map/Set 里 NaN 等于 NaN：
new Set([NaN, NaN]).size;  // 1

// +0 和 -0 被认为相等
new Set([+0, -0]).size;    // 1
```

| 比较方式 | NaN 等于 NaN | +0 等于 -0 | 类型检查 |
|---------|-------------|-----------|---------|
| `==` | false | true | ❌ |
| `===` | false | true | ✅ |
| SameValueZero | ✅ | ✅ | ✅ |
| Object.is | false | ❌ | ✅ |

## 常见误区

1. **`Object` 的键都是字符串** — 数字键 `obj[1]` 会被转成 `"1"`，Map 保留原始类型
2. **`NaN` 在 Set 中只有一份** — SameValueZero 算法认为 NaN 等于 NaN
3. **WeakMap 没有 `size` 和遍历方法** — 因为垃圾回收随时发生，数量不确定
4. **WeakMap 的键必须是对象** — 不能是数字、字符串等原始值
5. **`delete obj[key]` 性能不如 `map.delete(key)`** — JS 引擎对 delete 优化不佳
6. **Map/Set 不能直接 JSON 序列化** — 需要转回 Object/Array 再序列化

## 速查表

| 集合 | 键类型 | 有 size | 可遍历 | 弱引用 | 典型用途 |
|------|--------|---------|--------|--------|---------|
| Object | 字符串/Symbol | 手动算 | ✅ | ❌ | 配置、数据结构 |
| Map | 任意 | ✅ | ✅ | ❌ | 键值映射、频繁增删 |
| WeakMap | 仅对象 | ❌ | ❌ | ✅ | 私有数据、DOM 缓存 |
| Array | 数字索引 | ✅ | ✅ | ❌ | 有序列表 |
| Set | —（只有值）| ✅ | ✅ | ❌ | 去重、成员检查 |
| WeakSet | 仅对象 | ❌ | ❌ | ✅ | 对象标记、追踪 |

## 快速自测

<details>
<summary>1. `new Map([["a", 1], ["a", 2]]).size` 是多少？</summary>

`1` — 第二个 "a" 覆盖了第一个，键唯一
</details>

<details>
<summary>2. 一行代码去重数组 `[1, 2, 2, 3]` 怎么写？</summary>

`[...new Set([1, 2, 2, 3])]` → `[1, 2, 3]`
</details>

<details>
<summary>3. WeakMap 可以存字符串作为键吗？</summary>

不可以。WeakMap 的键必须是对象或 Symbol
</details>

<details>
<summary>4. `map.set(NaN, "a"); map.set(NaN, "b"); map.get(NaN)` 输出什么？</summary>

`"b"` — 两个 NaN 被认为是同一个键，第二个覆盖了第一个
</details>

<details>
<summary>5. Map 和 Object 什么时候该用哪个？</summary>

存配置/JSON → Object；键类型不确定/频繁增删/保序 → Map
</details>
