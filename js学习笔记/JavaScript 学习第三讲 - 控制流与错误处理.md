# 控制流与错误处理 学习笔记

> 来源：[MDN JavaScript 指南 — 控制流与错误处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

---

## 核心概念

- **条件语句**：`if...else` 和 `switch`
- **异常处理**：`throw` 抛出异常，`try...catch` 捕获处理，`finally` 总会执行

---

## 知识点详解

### 1. if...else 语句

```javascript
if (condition) {
    // condition 为 true 时执行
} else if (condition2) {
    // condition2 为 true 时执行
} else {
    // 以上都不满足时执行
}
```

- `else if` 链**只会执行第一个条件为真的分支**
- 最佳实践：**始终使用花括号**，即使是单行语句

### 2. 假值（Falsy）

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

### 3. switch 语句

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

- `switch` 用**严格相等**（`===`）匹配 case
- **每个 case 后要加 `break`**，否则会穿透到下一个 case

### 4. try...catch...finally

```javascript
try {
    // 可能抛出异常的代码
} catch (e) {
    console.error(e.message);
} finally {
    // 无论是否异常都会执行的清理代码
}
```

- `finally` **总会执行**（无论是否抛异常）
- **避免在 finally 中使用 return**，会覆盖 try/catch 的返回值

### 5. 抛出异常

```javascript
throw new Error("boom");    // 推荐用 Error 对象
```

---

## 快速自测（问答参考答案）

<details>
<summary>1. if ("") 会走哪个分支？</summary>

else 分支 — 空字符串是假值。
</details>

<details>
<summary>2. const x = {}; if (x) { console.log("truthy"); } 输出什么？</summary>

`"truthy"` — 对象都是 truthy。
</details>

<details>
<summary>3. switch 的 case 穿透是什么意思？如何避免？</summary>

不加 break 会执行下一个 case；加 break 避免。
</details>

<details>
<summary>4. finally 块什么时候执行？</summary>

无论 try 是否抛异常都**总会执行**。
</details>

<details>
<summary>5. JS 有几个假值？分别是什么？</summary>

6 个：`false`、`undefined`、`null`、`0`、`NaN`、`""`。
</details>

<details>
<summary>6. throw 可以抛出什么类型的值？最佳实践是什么？</summary>

任意值；最佳实践是 throw Error 对象。
</details>

<details>
<summary>7. try { return 1; } finally { return 2; } 返回什么？</summary>

返回 `2` — finally 中的 return 会覆盖 try/catch 的返回值。
</details>

<details>
<summary>8. if...else if 链中有多个条件为真时，执行几个？</summary>

只执行第一个匹配到的分支。
</details>

<details>
<summary>9. var 和 let 在块语句中的作用域有什么不同？</summary>

`var` 没有块级作用域，`let` 有块级作用域。
</details>
