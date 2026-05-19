# 循环与迭代 学习笔记

> 来源：[MDN JavaScript 指南 — 循环与迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Loops_and_iteration)

---

## 核心概念

- **基础循环**：`for`、`do...while`、`while` 控制代码重复执行
- **循环控制**：`break`（跳出循环）、`continue`（跳过本次）、`label`（标记多层循环）
- **for...in**（ES5）— 遍历对象的**键名**（属性名）
- **for...of**（ES6）— 遍历可迭代对象的**值**
- **ES6 新数据结构**：`Map`（键值映射表）、`Set`（不重复集合）
- **解构赋值**：从对象或数组中"拆包"取值
- **扩展运算符**：把集合展开成独立元素
- **模块导入导出**：ES6 的 `import` / `export` 语法

---

## 知识点详解

### 1. 三种基础循环

| 循环 | 何时判断条件 | 至少执行次数 |
|------|------------|------------|
| `for` | 每次循环前 | 0 次（可能一次都不执行） |
| `while` | 每次循环前 | 0 次 |
| `do...while` | 每次循环后 | **至少 1 次**（先执行再判断） |

```javascript
// do...while 至少执行一次
let i = 10;
do {
    console.log(i);  // 输出 10
    i++;
} while (i < 5);  // 条件一开始就是 false，但已经执行过一次了
```

### 2. break vs continue

- **`break`** — 直接跳出**整个循环**
- **`continue`** — 跳过**本次循环剩余代码**，进入下一次循环

### 3. label 标签语句

用于给循环打标签，配合 `break label` 可以跳出多层嵌套循环：

```javascript
outPoint: for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i === 5 && j === 5) {
            break outPoint;  // 同时跳出内外两层循环
        }
    }
}
```

实际开发中较少使用，了解一下即可。

### 4. for...in — 遍历对象的键名

`for...in` 是**为普通对象设计的**，遍历出来的是**属性名（key）**：

```javascript
const person = { name: "张三", age: 30 };
for (const key in person) {
    console.log(key);        // "name", "age"
    console.log(person[key]); // "张三", 30
}
```

⚠️ **不要用它遍历数组**，它会遍历到你在数组上自定义的属性：

```javascript
const arr = [1, 2, 3];
arr.foo = "hello";
for (const k in arr) { console.log(k); }  // "0", "1", "2", "foo" ← 多了 foo
```

### 5. for...of — ES6 遍历可迭代对象的值（重点）

`for...of` 是 ES6 引入的，遍历出来的是**实际的元素值**：

```javascript
const arr = [1, 2, 3];
for (const val of arr) { console.log(val); }  // 1, 2, 3 ← 只要值，不要 "foo"
```

`for...of` 可以遍历的数据结构：
- 数组 `Array`
- 字符串 `String`（逐个字符遍历）
- `Map`
- `Set`
- `arguments`（函数的参数列表）
- 任何实现了迭代器协议的对象

### 6. Map — ES6 键值映射表

JS 的 `Map` 跟 Java 的 HashMap 类似，就是 key-value 映射表。

**与普通对象 `{}` 的对比：**

| 对比 | 普通对象 `{}` | `Map` |
|------|--------------|-------|
| key 的类型 | 只能是字符串或 Symbol | 任意类型（对象、函数、数字等） |
| 获取长度 | `Object.keys(obj).length` | `map.size` |
| 遍历 | `for...in`（会遍历原型链） | `for...of`（干净） |
| 频繁增删性能 | 一般 | 更好 |

**创建和遍历：**

```javascript
const map = new Map([["name", "张三"], ["age", 30]]);

for (const [key, value] of map) {
    console.log(key, value);  // "name" "张三"，"age" 30
}
```

**其他常用方法：**

```javascript
map.set("city", "北京");   // 添加
map.get("name");            // "张三"
map.has("age");             // true
map.delete("age");          // 删除某个键值对
map.size;                   // 2
```

### 7. Set — ES6 不重复集合

`Set` 中元素**不能重复**，有**插入顺序**（类似 Java 的 LinkedHashSet）。

```javascript
const s = new Set([3, 1, 2, 1]);  // 1 重复了，自动去重
// Set { 3, 1, 2 }

for (const val of s) { console.log(val); }  // 3, 1, 2 ← 按插入顺序
```

**经典用法：一行数组去重**

```javascript
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];  // [1, 2, 3, 4]
```

### 8. 解构赋值（Destructuring Assignment）

ES6 语法，从对象或数组中"拆包"取出值，赋值给变量。

**对象解构：**

```javascript
const person = { name: "张三", age: 30, city: "北京" };

// 基本用法：按属性名匹配
const { name, age } = person;
console.log(name);  // "张三"
console.log(age);   // 30

// 重命名：原名 : 新变量名
const { name: userName } = person;
console.log(userName);  // "张三"

// 默认值：属性不存在时用默认值
const { hobby = "编程" } = person;
console.log(hobby);  // "编程"（原对象没有）

// 以上可以组合使用
const { name: u, age: a, hobby: h = "编程" } = person;
```

**数组解构：**

```javascript
const colors = ["red", "green", "blue"];

// 按位置匹配
const [first, second] = colors;
console.log(first);   // "red"
console.log(second);  // "green"
```

**函数参数解构：**

```javascript
function greet({ name, age }) {
    console.log(`${name} 今年 ${age} 岁`);
}
greet(person);  // "张三 今年 30 岁"
```

### 9. 扩展运算符（Spread Operator `...`）

ES6 语法，把一个集合**展开**成独立的元素。

```javascript
// 展开数组
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];  // [1, 2, 3, 4]

// 合并对象
const a = { name: "张三" };
const b = { age: 30 };
const c = { ...a, ...b };  // { name: "张三", age: 30 }

// 字符串转数组
const chars = [..."Hello"];  // ["H", "e", "l", "l", "o"]
```

**扩展运算符 vs 解构赋值对比：**

| 运算符 | 符号 | 作用 |
|--------|------|------|
| 扩展运算符 | `[...arr]` | 把**一个集合拆开**成多个独立元素 |
| 解构赋值 | `const [a, b] = arr` | 把**多个元素装到**变量里 |

```javascript
// 两者结合：数组去重
const unique = [...new Set([1, 2, 2, 3])];  // [1, 2, 3]
```

### 10. 模块导入导出（import / export）

ES6 的模块系统，语法借鉴了 Python 的 `from...import` 风格。

**具名导出（Named Export）：**

```javascript
// utils.js
export const PI = 3.14;
export function add(a, b) { return a + b; }

// 导入时必须用花括号，名字必须一致
import { PI, add } from "./utils.js";
```

**默认导出（Default Export）：**

```javascript
// math.js
export default function multiply(a, b) { return a * b; }

// 导入时不用花括号，名字可以随便起
import multiply from "./math.js";
import foo from "./math.js";  // 也可以叫 foo
```

**两种导入对比：**

```javascript
// 具名导入 — 花括号，名字要匹配
import { PI, add } from "./utils.js";

// 默认导入 — 无花括号，名字随意
import multiply from "./math.js";
```

---

## for...in vs for...of 速查表

| | `for...in` | `for...of` |
|---|---|---|
| 遍历什么 | 键名（属性名/索引） | 值 |
| 适用对象 | 普通对象 `{}` | 数组、Map、Set、字符串 |
| 会遍历自定义属性 | ✅ 是 | ❌ 否 |
| 版本 | ES5 | ES6 |

**简单记**：`for...in` → 对象；`for...of` → 数组等可迭代对象。

---

## 常见误区

| 误区 | 正确理解 |
|------|---------|
| `for...in` 遍历数组拿到值 | `for...in` 拿到的是索引（字符串），不是值 |
| `new Boolean(false)` 条件判断为 false | 对象都是 truthy，条件判断为 true |
| `switch` 匹配后自动停止 | 不加 `break` 会穿透到下一个 case |
| JS 的 `Map` 是 `Map` 函数 | `Map` 是 key-value 映射表，构造函数参数是 `[[key, val], ...]` 数组 |
| Python 的 `import utils` 写法用于 JS | JS 是 `import xxx from "./utils.js"` |
| `for...of` 可以遍历普通对象 | 不行，普通对象不是"可迭代"的，用 `for...in` 或 `Object.entries()` |

---

## 快速自测

1. `do...while` 循环的特点是什么？
2. `break` 和 `continue` 的区别？
3. `for...in` 遍历数组得到的是什么？
4. `for...of` 能遍历普通对象吗？
5. 一行代码把 `[1, 2, 2, 3]` 去重，怎么写？
6. `const { name: n, age = 20 } = { name: "李四" }` — `n` 和 `age` 分别是多少？
7. `export default` 和 `export` 的导入方式有什么区别？
8. 扩展运算符 `[...arr]` 和解构赋值 `const [a, b] = arr` 分别做什么？
9. `Map` 和普通对象 `{}` 的区别，至少说两点？
10. JS 的 `Set` 有顺序吗？

---

### 自测题答案

1. 先执行循环体，再判断条件，**至少执行一次**
2. `break` 跳出整个循环；`continue` 跳过本次进入下一次
3. 数组的**索引**（字符串形式："0", "1", "2"）
4. **不能**，普通对象不是可迭代对象
5. `[...new Set([1, 2, 2, 3])]`
6. `n = "李四"`，`age = 20`（原对象没有 age，用了默认值）
7. `export default` 导入**不用花括号**，名字随意；`export` 导入**必须花括号**，名字要一致
8. 扩展运算符**拆开**集合；解构赋值**装包**到变量
9. Map 的 key 可以是任意类型；Map 有 `size` 属性；Map 按插入顺序遍历
10. **有顺序**，按插入顺序保存（不同于 Python 的 set，类似 Java 的 LinkedHashSet）
