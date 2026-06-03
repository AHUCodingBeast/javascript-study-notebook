# 循环与迭代 学习笔记

> 来源：[MDN JavaScript 指南 — 循环与迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Loops_and_iteration)

---

## 核心概念

- **基础循环**：`for`、`do...while`、`while`
- **循环控制**：`break`（跳出循环）、`continue`（跳过本次）
- **for...in** — 遍历对象的**键名**（属性名）
- **for...of**（ES6）— 遍历可迭代对象的**值**（推荐）
- **解构赋值**：从对象或数组中"拆包"取值
- **扩展运算符**：把集合展开成独立元素

---

## 知识点详解

### 1. 三种基础循环

| 循环 | 何时判断条件 | 至少执行次数 |
|------|------------|------------|
| `for` | 每次循环前 | 0 次 |
| `while` | 每次循环前 | 0 次 |
| `do...while` | 每次循环后 | **至少 1 次** |

### 2. break vs continue

- **`break`** — 直接跳出**整个循环**
- **`continue`** — 跳过**本次循环剩余代码**，进入下一次循环

### 3. for...in — 遍历对象的键名

```javascript
const person = { name: "张三", age: 30 };
for (const key in person) {
    console.log(key);        // "name", "age"
    console.log(person[key]); // "张三", 30
}
```

⚠️ **不要用它遍历数组**，它会遍历到自定义属性。

### 4. for...of — ES6 遍历可迭代对象的值（重点）

```javascript
const arr = [1, 2, 3];
for (const val of arr) { console.log(val); }  // 1, 2, 3
```

`for...of` 可以遍历：数组、字符串、Map、Set。

### 5. 解构赋值（Destructuring Assignment）

**对象解构：**

```javascript
const person = { name: "张三", age: 30, city: "北京" };

const { name, age } = person;           // 按属性名匹配
const { name: userName } = person;      // 重命名
const { hobby = "编程" } = person;       // 默认值
```

**数组解构：**

```javascript
const colors = ["red", "green", "blue"];
const [first, second] = colors;  // first="red", second="green"
```

**函数参数解构（AI 代码中非常常见）：**

```javascript
function greet({ name, age }) {
    console.log(`${name} 今年 ${age} 岁`);
}
greet(person);
```

### 6. 扩展运算符（Spread Operator `...`）

```javascript
// 展开数组
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];  // [1, 2, 3, 4]

// 合并对象
const a = { name: "张三" };
const b = { age: 30 };
const c = { ...a, ...b };  // { name: "张三", age: 30 }

// 数组去重（经典一行）
const unique = [...new Set([1, 2, 2, 3])];  // [1, 2, 3]
```

---

## for...in vs for...of 速查表

| | `for...in` | `for...of` |
|---|---|---|
| 遍历什么 | 键名 | 值 |
| 适用对象 | 普通对象 `{}` | 数组、Map、Set、字符串 |

**简单记**：`for...in` → 对象；`for...of` → 数组等可迭代对象。

---

## 快速自测（问答参考答案）

<details>
<summary>1. do...while 循环的特点是什么？</summary>

先执行循环体再判断，**至少执行一次**。
</details>

<details>
<summary>2. break 和 continue 的区别？</summary>

`break` 跳出整个循环；`continue` 跳过本次进入下一次。
</details>

<details>
<summary>3. for...in 遍历数组得到的是什么？</summary>

数组的**索引**（字符串形式："0", "1", "2"），不是值。
</details>

<details>
<summary>4. for...of 能遍历普通对象吗？</summary>

**不能**，普通对象不是可迭代对象。
</details>

<details>
<summary>5. 一行代码把 [1, 2, 2, 3] 去重，怎么写？</summary>

`[...new Set([1, 2, 2, 3])]`
</details>

<details>
<summary>6. const { name: n, age = 20 } = { name: "李四" } — n 和 age 分别是多少？</summary>

`n = "李四"`，`age = 20`（原对象没有 age，用了默认值）。
</details>

<details>
<summary>7. export default 和 export 的导入方式有什么区别？</summary>

`export default` 导入**不用花括号**，名字随意；`export` 导入**必须花括号**，名字要一致。
</details>

<details>
<summary>8. 扩展运算符 [...arr] 和解构赋值 const [a, b] = arr 分别做什么？</summary>

扩展运算符**拆开**集合；解构赋值**装包**到变量。
</details>
