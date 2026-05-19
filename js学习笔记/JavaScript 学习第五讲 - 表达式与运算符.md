# JS 表达式与运算符 学习笔记

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_operators

## 核心概念

- **表达式**：一组代码的集合，会返回一个值。分两类：有副作用的（如赋值 `x=7`）和纯计算的（如 `3+4`）
- **运算符**：作用于一个或多个操作数，返回结果。分一元（一个操作数）和二元（两个操作数），三元只有一个——条件运算符 `? :`

## 知识点详解

### 1. 赋值运算符

| 运算符 | 含义 |
|--------|------|
| `=` | 基本赋值 |
| `+=`, `-=`, `*=`, `/=`, `%=` | 算术赋值简写 |
| `**=` | 求幂赋值 |
| `&&=`, `\|\|=` | 逻辑赋值（ES2021） |
| `??=` | 空值赋值（ES2021） |

```js
x &&= f()  // 等价于 x && (x = f()) — x 为真时才赋值
x ||= f()  // 等价于 x || (x = f()) — x 为假时才赋值
x ??= f()  // 等价于 x ?? (x = f()) — x 为 null/undefined 时才赋值
```

**解构赋值**：

```js
var [one, two, three] = ["one", "two", "three"];  // 数组解构
var { name, age } = { name: "张三", age: 25 };     // 对象解构
```

### 2. 比较运算符 — `==` vs `===`

| 运算符 | 特点 |
|--------|------|
| `==` | 宽松相等，会做隐式类型转换 |
| `===` | 严格相等，值和类型都必须相同（推荐用这个） |
| `!=` / `!==` | 不等 / 严格不等 |

**特殊情况**：

```js
2 == "2"          // true（字符串转数字）
2 === "2"         // false（类型不同）
null == undefined // true（JS 特殊规则）
null === undefined // false
```

### 3. 算术运算符

```js
+ - * / % **          // 加减乘除、取余、求幂
++x / x++             // 前缀先加后返回；后缀先返回后加
--x / x--             // 自减同理
+x                    // 一元正号：尝试将非数值转为数值（+ "3" → 3）
-x                    // 一元负号：返回负值
```

### 4. 位运算符

将操作数视为 **32 位二进制串**进行运算：

```js
15 & 9   // 9  (1111 & 1001 = 1001)
15 | 9   // 15 (1111 | 1001 = 1111)
15 ^ 9   // 6  (1111 ^ 1001 = 0110)  — 相同为0，不同为1
~9       // -10（按位取反）
9 << 2   // 36（1001 左移2位 = 100100）
```

### 5. 逻辑运算符与短路求值

`&&` 和 `||` **返回操作数的原始值**，不一定是布尔值：

```js
"Cat" && "Dog"    // "Dog" — 第一个为真，返回第二个
"Cat" || "Dog"    // "Cat" — 第一个为真，直接返回（短路）
false && "Cat"    // false — 第一个为假，直接返回（短路）
false || "Cat"    // "Cat" — 第一个为假，返回第二个
```

Falsy 值：`null`、`0`、`NaN`、`""`、`undefined`、`false`

### 6. 三元运算符

```js
var status = age >= 18 ? "adult" : "minor";
```

JS 唯一的三元运算符，可嵌套但不推荐。

### 7. 逗号运算符

依次求值，返回**最后一个**表达式的值：

```js
var a = (1, 2, 3);    // a = 3
for (var i = 0, j = 9; i <= j; i++, j--) { }  // 常见用法
```

### 8. 一元操作符

**`delete`**：删除对象属性或数组元素

```js
var y = 43;
var obj = { name: "张三" };

delete y;        // false — var 声明的变量不能删除
delete obj.name; // true — 对象属性可以删除
```

**`typeof`**：返回类型的字符串

```js
typeof null;       // "object" ← JS 历史 bug！
typeof undefined;  // "undefined"
typeof {};         // "object"
typeof [];         // "object" ← 不能区分数组和对象！
typeof function(){}; // "function"
```

判断数组用 `Array.isArray()`，不要用 `typeof`。

**`void`**：表示运算无返回值，常见于 `href="javascript:void(0)"`

### 9. 关系运算符

**`in`**：检查属性/索引是否存在于对象中

```js
var arr = ["apple", "banana"];
0 in arr;          // true（索引 0 存在）
"apple" in arr;    // false（in 不查值！）
"length" in arr;   // true（length 是数组属性）
```

**`instanceof`**：检查对象是否是某类型的实例

```js
var theDay = new Date();
theDay instanceof Date;  // true
```

### 10. 运算符优先级（从高到低）

```
. []         — 成员访问
() new       — 调用/实例化
! ~ - + ++ -- typeof void delete  — 一元
* / %        — 乘除取余
+ -          — 加减
<< >> >>>    — 移位
< <= > >=    — 关系
== != === !== — 相等
&            — 按位与
^            — 按位异或
|            — 按位或
&&           — 逻辑与
||           — 逻辑或
?:           — 条件
= += -= ...  — 赋值
,            — 逗号（最低）
```

不确定优先级时，**用括号显式声明**。

## 常见误区

1. **`typeof null` 返回 `"object"`** — 这是 JS 第一个版本的 bug，一直保留至今
2. **`typeof []` 返回 `"object"`** — 判断数组用 `Array.isArray()`
3. **`delete` 不返回值本身，返回 true/false** — 表示是否删除成功
4. **`var` 声明的变量不能被 `delete`** — 隐式声明的变量可以
5. **`null == undefined` 为 `true`** — JS 特殊规定
6. **`in` 检查索引/属性名，不检查值** — `"banana" in ["banana"]` 是 `false`
7. **`||=` 和 `??=` 不一样** — `0`、`""`、`false` 对 `||=` 是 falsy 会替换，对 `??=` 不会

## 速查表

| 对比 | 说明 |
|------|------|
| `==` vs `===` | `==` 会隐式转换，`===` 严格比较类型+值 |
| `++x` vs `x++` | 前缀先加后返回，后缀先返回后加 |
| `&&` vs `\|\|` | `&&` 找第一个假值，`\|\|` 找第一个真值 |
| `||=` vs `??=` | `||=` 遇 falsy 替换，`??=` 仅 null/undefined 替换 |
| `>>` vs `>>>` | `>>` 保留符号位，`>>>` 左边补0 |
| `delete arr[i]` vs `arr[i] = undefined` | delete 删除索引但长度不变；后者索引还在 |

## 快速自测

<details>
<summary>1. `console.log(5 == "5");` 输出什么？</summary>

`true` — `==` 会做隐式类型转换
</details>

<details>
<summary>2. `console.log(typeof [])` 输出什么？</summary>

`"object"` — JS 中数组也是对象
</details>

<details>
<summary>3. `console.log(null == undefined)` 输出什么？</summary>

`true` — JS 特殊规则，两者表示"空/不存在"
</details>

<details>
<summary>4. `var x = 0; x ??= 5; console.log(x);` 输出什么？</summary>

`0` — `??=` 只在值为 null/undefined 时替换，`0` 不算空值
</details>

<details>
<summary>5. `console.log("Cat" && "Dog");` 输出什么？</summary>

`"Dog"` — `&&` 第一个为真时返回第二个
</details>

<details>
<summary>6. `console.log(delete Math.PI);` 输出什么？</summary>

`false` — 预定义属性不能删除
</details>
