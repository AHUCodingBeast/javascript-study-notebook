# JavaScript 学习第一讲 — 语法与变量

> 来源：[MDN JavaScript 指南 — 语法与类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types)

---

## 1. 基础语法

- JavaScript **区分大小写**：`Früh` 和 `früh` 是两个不同的变量
- 支持 Unicode 字符作为变量名
- 语句用分号 `;` 分隔，最佳实践是**始终手动加分号**

```javascript
const Früh = "foobar";  // OK
const früh = "different";  // 和 Früh 是不同的变量
```

## 2. 注释

```javascript
// 单行注释

/*
  多行注释
*/
```

- ⚠️ JavaScript **不支持嵌套注释**，第一个 `*/` 就会结束注释
- `#!/usr/bin/env node` — Hashbang 注释，指定脚本执行引擎

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
// var 变量提升
console.log(a);  // undefined
var a = 3;

// let 暂时性死区
console.log(b);  // ReferenceError
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

const arr = [1, 2];
arr.push(3);  // OK
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
| Symbol | 唯一且不可变 | `Symbol()` |

### 引用类型（1 种）

| 类型 | 说明 |
|------|------|
| Object | 键值对的集合 |

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

## 6. 函数提升

函数声明会被**完整提升**，可以在声明之前调用：

```javascript
sayHello();  // "Hello!"

function sayHello() {
    console.log("Hello!");
}
```

## 7. 模板字符串

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

## 8. 字符串基础

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

## 快速自测

1. `var` 的作用域是什么？`let` 呢？
2. `if (true) { var x = 5; } console.log(x);` 输出什么？
3. `console.log(a); var a = 3;` 输出什么？
4. `console.log(b); let b = 3;` 输出什么？
5. `"37" + 7` 和 `"37" - 7` 分别等于什么？
6. `const` 声明的对象能修改属性吗？
7. JavaScript 有哪 8 种数据类型？
8. 模板字符串如何插入变量？
