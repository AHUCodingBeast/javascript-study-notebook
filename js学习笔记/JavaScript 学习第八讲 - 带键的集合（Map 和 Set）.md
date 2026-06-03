# JS 学习第八讲 - 带键的集合（Map 和 Set）

> 来源：[MDN JavaScript 指南 — Keyed collections](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Keyed_collections)

---

## 核心概念

- `Map` 和 `Set` 是 ES6 新增的集合类型，支持**任意类型**的键
- Map/Set 的迭代顺序就是**插入顺序**

---

## 知识点详解

### 1. Map — 键/值对集合

```javascript
const m = new Map();
m.set("a", 1);
m.set(1, 2);       // 键可以是数字
m.set(true, 3);    // 键可以是布尔值

m.get("a");    // 1
m.has("a");    // true
m.delete("a"); // true
m.size;        // 键值对数量
```

**初始化时直接传二维数组：**

```javascript
const map = new Map([
    ["a", 1],
    ["b", 2],
]);
```

**遍历：**

```javascript
for (const [key, value] of map) {
    console.log(key, value);
}
```

### 2. Map vs Object 对比

| 特性 | Object | Map |
| ------ | ------ | ----- |
| 键的类型 | 只能字符串/Symbol | 任意类型 |
| 获取大小 | `Object.keys(obj).length` | `map.size` |
| 遍历顺序 | 不保证插入顺序 | 严格按插入顺序 |
| 频繁增删 | 性能较差 | 性能更好 |
| JSON 序列化 | 支持 | 不支持 |

**选择建议：**
- 存配置、JSON → **Object**
- 键类型不确定、频繁增删、需要保序 → **Map**

### 3. Set — 唯一值的集合

```javascript
const s = new Set();
s.add(1);
s.add("text");
s.add(1);      // 重复，无效
s.has(1);      // true
s.delete(1);   // true
```

**经典用法：一行数组去重**

```javascript
const arr = [1, 2, 2, 3];
const unique = [...new Set(arr)];  // [1, 2, 3]
```

---

## 常见误区

1. `Object` 的键都是字符串 — 数字键 `obj[1]` 会被转成 `"1"`，Map 保留原始类型
2. `NaN` 在 Set 中只一份 — SameValueZero 算法认为 NaN 等于 NaN
3. Map/Set 不能直接 JSON 序列化 — 需要转回 Object/Array 再序列化

---

## 快速自测（问答参考答案）

<details>
<summary>1. new Map([["a", 1], ["a", 2]]).size 是多少？</summary>

`1` — 第二个 "a" 覆盖了第一个，键唯一。
</details>

<details>
<summary>2. 一行代码去重数组 [1, 2, 2, 3] 怎么写？</summary>

`[...new Set([1, 2, 2, 3])]` → `[1, 2, 3]`
</details>

<details>
<summary>3. map.set(NaN, "a"); map.set(NaN, "b"); map.get(NaN) 输出什么？</summary>

`"b"` — 两个 NaN 被认为是同一个键，第二个覆盖了第一个。
</details>

<details>
<summary>4. Map 和 Object 什么时候该用哪个？</summary>

存配置/JSON → Object；键类型不确定/频繁增删/保序 → Map。
</details>
