# 控制流与错误处理 学习笔记

> 来源：[MDN JavaScript 指南 — 控制流与错误处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

---

## 核心概念

- **块语句**：用 `{}` 组合多条语句，是控制流语句的基础
- **条件语句**：`if...else` 和 `switch`，根据不同条件执行不同代码
- **异常处理**：`throw` 抛出异常，`try...catch` 捕获并处理，`finally` 无论是否异常都会执行

---

## 知识点详解

### 1. 块语句

用花括号 `{}` 包裹一条或多条语句：

```javascript
{
    statement1;
    statement2;
}
```

常用于 `if`、`for`、`while` 等控制流语句中。

**注意**：`var` 在块内声明的变量不受块级作用域限制（是函数作用域或全局作用域），`let`/`const` 才受块级限制。

### 2. if...else 语句

```javascript
if (condition) {
    // condition 为 true 时执行
} else if (condition2) {
    // condition2 为 true 时执行
} else {
    // 以上都不满足时执行
}
```

- `else if` 可以链式使用，但**只会执行第一个条件为真的分支**
- 最佳实践：**始终使用花括号**，即使是单行语句

### 3. 假值（Falsy）

以下 6 个值在条件判断中会被当作 `false`：

| 假值 | 类型 |
|------|------|
| `false` | Boolean |
| `undefined` | 未定义 |
| `null` | 空值 |
| `0` | Number |
| `NaN` | Number |
| `""` | 空字符串 |

> 除以上 6 个值外，**所有值都是 truthy**（包括所有对象）。

### 4. switch 语句

```javascript
switch (expression) {
    case label1:
        statements1;
        break;
    case label2:
        statements2;
        break;
    default:
        statementsDefault;
}
```

- `switch` 用**严格相等**（`===`）匹配 case 标签
- **每个 case 后要加 `break`**，否则会穿透（fall-through）到下一个 case
- `default` 通常放最后，但不是必须的

### 5. throw 语句

JavaScript 可以抛出**任意值**作为异常：

```javascript
throw "错误信息";          // 字符串
throw 42;                   // 数字
throw new Error("boom");    // Error 对象（推荐）
```

**推荐抛出 `Error` 对象**，因为它自带 `name` 和 `message` 属性，便于调试和分类。

### 6. try...catch...finally

```javascript
try {
    // 可能抛出异常的代码
} catch (e) {
    // 捕获异常后的处理代码
    console.error(e.message);
} finally {
    // 无论是否异常都会执行的清理代码
}
```

**执行顺序**：
1. `try` 块正常执行
2. 如果抛出异常，立即跳到 `catch`
3. `finally` 块**总会执行**（无论是否抛异常）
4. 最后继续执行 try...catch 之后的代码

**finally 中的 return**：会覆盖 try 和 catch 中的返回值，应避免在 finally 中使用 return。

### 7. Error 对象

```javascript
try {
    throw new Error("消息");
} catch (e) {
    console.error(e.name);    // "Error"
    console.error(e.message); // "消息"
}
```

调试时建议使用 `console.error()` 而非 `console.log()`，会将消息格式化为错误信息。

---

## 常见误区

| 误区 | 正确理解 |
|------|---------|
| `if (new Boolean(false))` 为 false | 对象都是 truthy，`new Boolean(false)` 是对象，所以条件为 true |
| switch 匹配后会自动停止 | 不加 `break` 会穿透到下一个 case |
| `var` 在块内声明是块级作用域 | `var` 只有函数作用域，不受 `{}` 限制 |
| `if (0)` 会执行 if 分支 | `0` 是假值，走 else 分支 |
| finally 只在出错时执行 | finally 无论是否异常都会执行 |
| finally 中的 return 无效 | finally 中的 return 会覆盖 try/catch 的返回值 |
| throw 只能抛出 Error 对象 | JS 可以抛出任意值，但推荐用 Error 对象 |
| else if 多个条件为真会都执行 | 只执行第一个匹配到的分支 |

---

## 速查表

### if...else vs switch

| 特性 | if...else | switch |
|------|-----------|--------|
| 适用场景 | 范围判断、复杂条件 | 精确值匹配 |
| 比较方式 | 任何表达式 | 严格相等（===） |
| 多个匹配 | 只执行第一个为真的分支 | 不加 break 会穿透所有后续 case |

### try...catch...finally 执行流

```
正常情况：try → finally → 后续代码
异常情况：try(抛异常) → catch → finally → 后续代码
无 catch：try(抛异常) → finally → 程序报错
```

---

## 快速自测

1. `if ("")` 会走哪个分支？
2. 下面代码输出什么？`const x = {}; if (x) { console.log("truthy"); }`
3. switch 的 case 穿透是什么意思？如何避免？
4. `finally` 块什么时候执行？
5. JS 有几个假值？分别是什么？
6. `throw` 可以抛出什么类型的值？最佳实践是什么？
7. `try { return 1; } finally { return 2; }` 返回什么？
8. `if...else if` 链中有多个条件为真时，执行几个？
9. 调试 catch 块中的错误建议用什么方法？
10. `var` 和 `let` 在块语句中的作用域有什么不同？

---

### 自测题答案

1. else 分支（空字符串是假值）
2. `"truthy"`（对象都是 truthy）
3. 不加 break 会执行下一个 case；加 break 避免
4. 无论 try 是否抛异常都会执行
5. 6 个：`false`、`undefined`、`null`、`0`、`NaN`、`""`
6. 任意值；最佳实践是 throw Error 对象
7. 返回 `2`（finally 中的 return 会覆盖）
8. 只执行第一个匹配到的分支
9. `console.error()`
10. `var` 没有块级作用域，`let` 有块级作用域
