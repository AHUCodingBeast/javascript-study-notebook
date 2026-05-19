# JS 学习第七讲 - 索引集合（数组）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections

## 核心概念

- JS 没有原生的"数组类型"，数组是 `Array` 对象的特殊形式
- 数组本质上是**以数字为键名的对象**，索引从 0 开始
- 数组方法分为两大类：**改变原数组**（push、splice 等）和 **返回新数组**（map、filter、slice 等）

## 知识点详解

### 1. 创建数组

```js
// 推荐：数组字面量
const arr1 = [1, 2, 3];

// 不推荐：构造函数（单个数字参数是长度，不是元素！）
const arr2 = new Array(3);   // [ <3 empty items> ] 长度 3，无元素
const arr3 = [3];             // [3] 包含一个元素 3

// 安全方式：Array.of（无论传什么都当元素处理）
const arr4 = Array.of(3);     // [3]
const arr5 = Array.of(9.3);   // [9.3]
```

### 2. 理解 length

```js
const arr = [1, 2, 3];
arr.length;       // 3

// length 可写
arr.length = 2;   // 截断为 [1, 2]
arr.length = 0;   // 清空数组 []

// 跳着赋值会自动拉伸
const cats = [];
cats[30] = "Dusty";
cats.length;      // 31
```

### 3. 添加/删除元素

| 方法 | 位置 | 操作 | 返回值 |
|------|------|------|--------|
| `push()` | 末尾 | 添加 | 新长度 |
| `pop()` | 末尾 | 删除最后一个 | 被删除的元素 |
| `unshift()` | 开头 | 添加 | 新长度 |
| `shift()` | 开头 | 删除第一个 | 被删除的元素 |

```js
var arr = [1, 2, 3];
arr.push(4);      // [1, 2, 3, 4]
arr.pop();        // [1, 2, 3]
arr.unshift(0);   // [0, 1, 2, 3]
arr.shift();      // [1, 2, 3]
```

### 4. 不改变原数组的方法

| 方法 | 作用 | 示例 |
|------|------|------|
| `slice(start, end)` | 截取片段（含 start，不含 end） | `["a","b","c"].slice(1,2)` → `["b"]` |
| `concat()` | 合并数组 | `[1].concat([2,3])` → `[1,2,3]` |
| `join(sep)` | 拼接为字符串 | `["a","b"].join("-")` → `"a-b"` |
| `at(index)` | 按索引取值，支持负数 | `["a","b","c"].at(-1)` → `"c"` |
| `flat()` | 展平嵌套数组 | `[1,[2,[3]]].flat()` → `[1,2,[3]]` |

**slice vs splice 核心区别：**

```js
var arr = ["a", "b", "c", "d", "e"];

arr.slice(1, 3);    // 返回 ["b", "c"]，arr 不变
arr.splice(1, 2);   // 返回 ["b", "c"]，arr 变成 ["a", "d", "e"]
```

`slice` 不改变原数组，`splice` **原地修改**。

### 5. 迭代方法（不改变原数组）

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `forEach(fn)` | `undefined` | 遍历每个元素，无返回值 |
| `map(fn)` | **新数组** | 每个元素转换后的结果 |
| `filter(fn)` | **新数组** | 满足条件的元素 |
| `find(fn)` | **元素值** | 第一个匹配的元素 |
| `findLast(fn)` | **元素值** | 最后一个匹配的元素 |
| `findIndex(fn)` | **索引** | 第一个匹配的索引 |
| `findLastIndex(fn)` | **索引** | 最后一个匹配的索引 |
| `every(fn)` | `true/false` | 全部满足才 true |
| `some(fn)` | `true/false` | 有一个满足就 true |
| `reduce(fn, init)` | **累积值** | 归约为单一结果 |
| `reduceRight(fn)` | **累积值** | 从右向左归约 |

```js
var nums = [1, 2, 3, 4, 5];

nums.map(x => x * 2);         // [2, 4, 6, 8, 10]
nums.filter(x => x > 3);      // [4, 5]
nums.find(x => x > 3);        // 4（第一个匹配值）
nums.every(x => x > 0);       // true
nums.some(x => x > 4);        // true

nums.reduce((a, b) => a + b, 0);  // 15
nums.reduce((a, b) => Math.max(a, b));  // 5
```

### 6. 改变原数组的方法

| 方法 | 作用 |
|------|------|
| `push` / `pop` | 末尾增/删 |
| `shift` / `unshift` | 开头增/删 |
| `splice(start, count, ...items)` | 删除 + 替换 |
| `sort(fn)` | 排序（原地） |
| `reverse()` | 反转（原地） |

**sort 注意：** 默认按字符串排序，`[10, 2, 1].sort()` → `[1, 10, 2]`。需要比较函数：

```js
[10, 2, 1].sort((a, b) => a - b);   // [1, 2, 10] 升序
[10, 2, 1].sort((a, b) => b - a);   // [10, 2, 1] 降序
```

### 7. 稀疏数组（空槽）

空槽 ≠ `undefined`，创建方式：

```js
Array(5);               // [ <5 empty items> ]
[1, 2, , 4];            // 中间空了一个
const a = [1, 2]; a[4] = 5;  // 2和4之间有空槽
delete arr[2];          // 删除元素产生空槽
```

**空槽的行为：**

```js
// 访问空槽 → undefined
sparse[2];              // undefined

// for...of → 空槽变 undefined
for (const x of [1, , 3]) console.log(x);  // 1, undefined, 3

// forEach/map/filter → 跳过空槽
[1, , 3].forEach(x => console.log(x));     // 只输出 1, 3

// 显式赋 undefined 不会被跳过
[1, undefined, 3].forEach(x => console.log(x));  // 输出 1, undefined, 3
```

### 8. 类数组对象

`arguments`、`NodeList` 等像数组（有 length 和索引），但**没有数组方法**：

```js
function foo() {
    arguments.forEach(x => console.log(x));  // TypeError!
}
```

**转成真数组：**

```js
// 方式1：Array.from
Array.from(arguments).forEach(...);

// 方式2：rest 参数（ES6 推荐）
function foo(...args) {
    args.forEach(x => console.log(x));  // args 是真数组
}
```

### 9. 多维数组

JS 没有内置多维数组，通过嵌套实现：

```js
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
matrix[1][2];  // 6
```

## 常见误区

1. **`Array(3)` 不是 `[3]`** — 是长度为 3 的空数组，用 `[3]` 或 `Array.of(3)`
2. **`slice` 不改变原数组，`splice` 改变** — 名字像但行为完全不同
3. **`sort()` 默认按字符串排** — `[10, 2, 1].sort()` 结果是 `[1, 10, 2]`
4. **`find` 返回元素，`filter` 返回数组** — `find` 找到第一个就停
5. **空槽会被 `forEach` 跳过，但显式 `undefined` 不会**
6. **`arguments` 不是数组** — 不能直接用 `forEach`，用 `...args` 代替

## 速查表

| 对比 | 说明 |
|------|------|
| `slice(start, end)` vs `splice(start, count)` | 前者不改变原数组且 end 不含；后者原地修改 |
| `push/pop` vs `shift/unshift` | 前者操作末尾，前者操作开头 |
| `map` vs `forEach` | map 返回新数组；forEach 无返回值 |
| `filter` vs `find` | filter 返回所有匹配的数组；find 返回第一个匹配值 |
| `every` vs `some` | every 要求全部满足；some 有一个满足即可 |
| `indexOf` vs `findIndex` | indexOf 精确匹配值；findIndex 用函数判断条件 |
| `Array(n)` vs `Array.of(n)` vs `[n]` | 长度为 n 的空数组 vs 包含 n 的数组 vs 包含 n 的数组 |

## 快速自测

<details>
<summary>1. `[].push(1)` 返回什么？</summary>

`1` — push 返回的是新数组长度，不是数组本身
</details>

<details>
<summary>2. `["a","b","c"].slice(0, 1)` 返回什么？</summary>

`["a"]` — 包含索引 0，不含索引 1
</details>

<details>
<summary>3. `[3, 1, 2].sort()` 返回什么？</summary>

`[1, 2, 3]`（碰巧对，因为字符串排序和数字排序结果一致）；但 `[10, 2, 1].sort()` 返回 `[1, 10, 2]`
</details>

<details>
<summary>4. `[1, 2, 3].find(x => x > 5)` 返回什么？</summary>

`undefined` — 没有匹配的元素
</details>

<details>
<summary>5. 类数组对象转真数组有哪些方式？</summary>

`Array.from()`、`[...obj]`、`Array.prototype.slice.call(obj)`、rest 参数 `...args`
</details>
