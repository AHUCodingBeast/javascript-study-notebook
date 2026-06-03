# JS 表达式与运算符 学习笔记

> 来源：[MDN JavaScript 指南 — 表达式与运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_operators)

---

## 核心概念

- **赋值运算符**：`=`, `+=`, `-=`, `??=`, `||=`
- **比较运算符**：`==`（宽松） vs `===`（严格，推荐）
- **逻辑运算符**：`&&`, `||`, `??` — 返回操作数的原始值，不一定是布尔值
- **三元运算符**：`? :` — 唯一的三元运算符
- **typeof / instanceof / in / delete**

---

## 知识点详解

### 1. 比较运算符 — == vs ===

| 运算符 | 特点 |
| ------ | ------ |
| `==` | 宽松相等，会做隐式类型转换 |
| `===` | 严格相等，值和类型都必须相同（**推荐**） |

```javascript
2 == "2";       // true（字符串转数字）
2 === "2";      // false（类型不同）
null == undefined; // true（JS 特殊规则）
null === undefined; // false
```

### 2. 逻辑运算符与短路求值

`&&` 和 `||` **返回操作数的原始值**：

```javascript
"Cat" && "Dog";   // "Dog" — 第一个为真，返回第二个
"Cat" || "Dog";   // "Cat" — 第一个为真，直接返回（短路）
```

**空值合并 `??`**（ES2020）：

```javascript
const name = userInput ?? "默认名";  // 只在 null/undefined 时用默认值
```

### 3. 三元运算符

```javascript
const status = age >= 18 ? "adult" : "minor";
```

### 4. typeof 与 instanceof

```javascript
typeof null;          // "object" ← JS 历史 bug
typeof undefined;     // "undefined"
typeof {};            // "object"
typeof [];            // "object" ← 不能区分数组
Array.isArray([]);    // true ✅ 判断数组用这个

instanceof;           // 检查对象是否是某类型的实例
```

### 5. 解构赋值

```javascript
const [one, two] = ["one", "two"];       // 数组解构
const { name, age } = { name: "张三", age: 25 };  // 对象解构
```

---

## 常见误区

1. `typeof null` 返回 `"object"` — 历史 bug
2. `typeof []` 返回 `"object"` — 判断数组用 `Array.isArray()`
3. `null == undefined` 为 `true`，`null === undefined` 为 `false`
4. `||=` 和 `??=` 不一样 — `||=` 遇 falsy 替换，`??=` 仅 null/undefined 替换

---

## 快速自测（问答参考答案）

<details>
<summary>1. console.log(5 == "5"); 输出什么？</summary>

`true` — `==` 会做隐式类型转换。
</details>

<details>
<summary>2. console.log(typeof []) 输出什么？</summary>

`"object"` — JS 中数组也是对象。
</details>

<details>
<summary>3. console.log(null == undefined) 输出什么？</summary>

`true` — JS 特殊规则。
</details>

<details>
<summary>4. var x = 0; x ??= 5; console.log(x); 输出什么？</summary>

`0` — `??=` 只在值为 null/undefined 时替换，`0` 不算空值。
</details>

<details>
<summary>5. console.log("Cat" && "Dog"); 输出什么？</summary>

`"Dog"` — `&&` 第一个为真时返回第二个。
</details>
