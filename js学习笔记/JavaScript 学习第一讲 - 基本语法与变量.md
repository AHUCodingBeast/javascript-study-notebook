# JavaScript 学习第一讲 — 语法与变量

> 来源：[MDN JavaScript 指南 — 语法与类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types)

---

## 1. 基础语法

- JavaScript **区分大小写**
- 语句用分号 `;` 分隔，最佳实践是**始终手动加分号**

## 2. 注释

```javascript
// 单行注释

/*
  多行注释
*/
```

## 3. 变量声明：var / let / const

| 特性 | `var` | `let` | `const` |
|------|-------|-------|---------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 可重新赋值 | ✅ | ✅ | ❌ |
| 变量提升 | ✅（值为 undefined） | ❌（暂时性死区） | ❌（暂时性死区） |
| 必须初始化 | ❌ | ❌ | ✅ |

**现代开发最佳实践：**
1. 优先使用 `const`
2. 需要重新赋值时使用 `let`
3. 避免使用 `var`

### 3.1 作用域对比

```javascript
// var — 函数作用域，不受 {} 限制
if (true) {
    var x = 5;
}
console.log(x);  // 5

// let / const — 块级作用域
if (true) {
    let y = 5;
}
console.log(y);  // ReferenceError: y is not defined
```

### 3.2 变量提升 vs 暂时性死区

```javascript
// var 变量提升，只提升了声明 不提升赋值逻辑
console.log(a);  // undefined
var a = 3;

// b 其实也已经被提升，但处于 TDZ 中
console.log(b);  // ReferenceError: Cannot access 'b' before initialization
let b = 3;
```

### 3.3 const 的特性

```javascript
// 必须初始化
const PI;  // SyntaxError

// 引用不可变，但对象属性/数组元素可修改
const person = { name: "张三" };
person.name = "李四";  // OK
person.age = 25;       // OK
person = {};           // TypeError: 不能重新赋值
```

## 4. 数据类型

JavaScript 有 **8 种数据类型**：

### 基本类型（7 种）

| 类型 | 说明 | 示例 |
|------|------|------|
| Boolean | 布尔值 | `true` / `false` |
| null | 空值 | `null` |
| undefined | 未定义 | `undefined` |
| Number | 整数或浮点数 | `42` / `3.14` |
| BigInt | 任意精度整数 | `9007199254740992n` |
| String | 文本字符序列 | `"hello"` |
| Symbol | 唯一标识符（用于对象属性键） | `Symbol()` |

### 引用类型（1 种）

| 类型 | 说明 |
|------|------|
| Object | 键值对的集合 |

> BigInt 和 Symbol 日常开发很少直接用，了解即可。

## 5. 类型转换

JavaScript 是**动态类型**语言，运行时自动转换类型。

```javascript
// + 运算符遇到字符串会做拼接
"37" + 7        // "377"
"答案是 " + 42  // "答案是 42"

// 其他运算符做数学运算
"37" - 7        // 30
"37" * 7        // 259
```

### 字符串转数字

```javascript
parseInt("101", 2)    // 5（第二个参数指定进制）
parseFloat("3.14")    // 3.14
+"1.1"                // 1.1（一元加号）
```

> 最佳实践：`parseInt` 始终传入第二个参数（进制）。

## 6. 模板字符串

ES6 引入，用反引号 `` ` `` 包裹：

```javascript
// 变量插值
let name = "张三";
let msg = `你好，${name}！欢迎回来。`;

// 支持多行
let multiLine = `第一行
第二行
第三行`;
```

## 7. 字符串基础

```javascript
// 单引号或双引号
let a = 'hello';
let b = "world";

// 长度属性
"Joyo 的猫".length  // 7

// 特殊字符转义
"一行\n另一行"    // 换行符
"c:\\temp"        // 反斜杠
"He said \"hi\""  // 双引号
```

---

## 快速自测（问答参考答案）

<details>
<summary>1. var 的作用域是什么？let 呢？</summary>

`var` 是函数作用域，`let` 是块级作用域。
</details>

<details>
<summary>2. if (true) { var x = 5; } console.log(x); 输出什么？</summary>

`5` — `var` 不受 `{}` 块限制。
</details>

<details>
<summary>3. console.log(a); var a = 3; 输出什么？</summary>

`undefined` — `var` 变量提升，声明提前但赋值没提前。
</details>

<details>
<summary>4. console.log(b); let b = 3; 输出什么？</summary>

`ReferenceError` — `let` 有暂时性死区，不会提升。
</details>

<details>
<summary>5. "37" + 7 和 "37" - 7 分别等于什么？</summary>

`"377"`（字符串拼接）和 `30`（数学运算）。
</details>

<details>
<summary>6. const 声明的对象能修改属性吗？</summary>

能。`const` 禁止重新赋值，但对象属性/数组元素可以修改。
</details>

<details>
<summary>7. JavaScript 有哪 8 种数据类型？</summary>

Boolean、null、undefined、Number、BigInt、String、Symbol（7 种基本类型）+ Object（引用类型）。
</details>

<details>
<summary>8. 模板字符串如何插入变量？</summary>

用 `${变量名}` 语法，如 `` `你好，${name}！` ``。
</details>
