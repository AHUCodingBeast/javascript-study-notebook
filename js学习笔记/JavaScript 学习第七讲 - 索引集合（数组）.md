# JS 学习第七讲 - 索引集合（数组）

> 来源：[MDN JavaScript 指南 — Indexed collections](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections)

---

## 核心概念

- JS 数组是 `Array` 对象的特殊形式，本质上是**以数字为键名的对象**
- 数组方法分为两大类：**改变原数组**和**返回新数组**

---

## 知识点详解

### 1. 创建数组

```javascript
const arr1 = [1, 2, 3];          // 推荐：字面量
const arr2 = Array.of(3);        // [3] — 安全方式
const arr3 = new Array(3);       // [ <3 empty items> ] — 长度为 3 的空数组，不推荐
```

### 2. length

```javascript
arr.length = 2;   // 截断为前 2 个元素
arr.length = 0;   // 清空数组
```

### 3. 添加/删除元素

| 方法 | 位置 | 操作 | 返回值 |
| ------ | ------ | ------ | ------ |
| `push()` | 末尾 | 添加 | 新长度 |
| `pop()` | 末尾 | 删除最后一个 | 被删除的元素 |
| `unshift()` | 开头 | 添加 | 新长度 |
| `shift()` | 开头 | 删除第一个 | 被删除的元素 |

### 4. 不改变原数组的方法

| 方法 | 作用 | 示例 |
| ------ | ------ | ------ |
| `slice(start, end)` | 截取片段 | `["a","b","c"].slice(1,2)` → `["b"]` |
| `concat()` | 合并数组 | `[1].concat([2,3])` → `[1,2,3]` |
| `join(sep)` | 拼接为字符串 | `["a","b"].join("-")` → `"a-b"` |
| `at(index)` | 按索引取值，支持负数 | `arr.at(-1)` → 最后一个元素 |

**slice vs splice 核心区别：**

```javascript
arr.slice(1, 3);    // 返回 ["b", "c"]，arr 不变
arr.splice(1, 2);   // 返回 ["b", "c"]，arr 被修改
```

### 5. 迭代方法（最常用）

| 方法 | 返回值 | 说明 |
| ------ | ------ | ------ |
| `forEach(fn)` | `undefined` | 遍历每个元素 |
| `map(fn)` | **新数组** | 每个元素转换后的结果 |
| `filter(fn)` | **新数组** | 满足条件的元素 |
| `find(fn)` | **元素值** | 第一个匹配的元素 |
| `every(fn)` | `true/false` | 全部满足才 true |
| `some(fn)` | `true/false` | 有一个满足就 true |
| `reduce(fn, init)` | **累积值** | 归约为单一结果 |

```javascript
nums.map(x => x * 2);         // [2, 4, 6, 8, 10]
nums.filter(x => x > 3);      // [4, 5]
nums.find(x => x > 3);        // 4（第一个匹配值）
nums.every(x => x > 0);       // true
nums.reduce((a, b) => a + b, 0);  // 15
```

### 6. 改变原数组的方法

| 方法 | 作用 |
| ------ | ------ |
| `push` / `pop` | 末尾增/删 |
| `shift` / `unshift` | 开头增/删 |
| `splice(start, count, ...items)` | 删除 + 替换 |
| `sort(fn)` | 排序（原地） |
| `reverse()` | 反转（原地） |

**sort 注意：** 默认按字符串排序，需要比较函数：

```javascript
[10, 2, 1].sort((a, b) => a - b);   // [1, 2, 10] 升序
```

---

## 常见误区

1. `Array(3)` 不是 `[3]` — 是长度为 3 的空数组，用 `[3]` 或 `Array.of(3)`
2. `slice` 不改变原数组，`splice` 改变 — 名字像但行为完全不同
3. `sort()` 默认按字符串排 — `[10, 2, 1].sort()` 结果是 `[1, 10, 2]`
4. `find` 返回元素，`filter` 返回数组 — `find` 找到第一个就停
5. `arguments` 不是数组 — 用 `...args` 代替

---

## 快速自测（问答参考答案）

<details>
<summary>1. [].push(1) 返回什么？</summary>

`1` — push 返回的是新数组长度，不是数组本身。
</details>

<details>
<summary>2. ["a","b","c"].slice(0, 1) 返回什么？</summary>

`["a"]` — 包含索引 0，不含索引 1。
</details>

<details>
<summary>3. [3, 1, 2].sort() 返回什么？</summary>

`[1, 2, 3]`（碰巧对）；但 `[10, 2, 1].sort()` 返回 `[1, 10, 2]`（按字符串排）。
</details>

<details>
<summary>4. [1, 2, 3].find(x => x > 5) 返回什么？</summary>

`undefined` — 没有匹配的元素。
</details>

<details>
<summary>5. 类数组对象转真数组有哪些方式？</summary>

`Array.from()`、`[...obj]`、rest 参数 `...args`。
</details>
