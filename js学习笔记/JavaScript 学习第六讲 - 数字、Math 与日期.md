# JS 学习第六讲 — 数字、Math 与日期

> 来源：[MDN JavaScript 指南 — Numbers and Dates](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Numbers_and_strings)

---

## 核心概念

- JS 里所有数字都是**双精度浮点数**（IEEE 754），没有整数类型
- `Math` 对象提供数学函数，不能自己创建
- `Date` 对象处理日期时间，**月份从 0 开始**

---

## 知识点详解

### 1. 数字类型

三种特殊值：
- `+Infinity`（正无穷）
- `-Infinity`（负无穷）
- `NaN`（非数字）— **NaN 不等于任何值，包括自己**

```javascript
NaN == NaN;               // false！
Number.isNaN(NaN);        // true ✅ 推荐判断方式
Number.isNaN("hello");    // false（不转换类型）
isNaN("hello");           // true（全局 isNaN 会先转类型，不推荐）
```

### 2. Math 对象

```javascript
Math.floor(3.9);    // 3（向下取整）
Math.ceil(3.1);     // 4（向上取整）
Math.round(3.5);    // 4（四舍五入）
Math.trunc(3.9);    // 3（截断小数）
Math.max(1, 5, 3);  // 5
Math.random();      // [0, 1) 的随机数
Math.PI;            // 3.141592653589793
```

**生成 N 到 M 的随机整数：**

```javascript
Math.floor(Math.random() * (M - N + 1)) + N;
```

### 3. 数字格式化

| 方法 | 说明 | 示例 | 结果 |
| ------ | ------ | ------ | ------ |
| `toFixed(n)` | 固定 n 位小数 | `(3.14).toFixed(2)` | `"3.14"` |

都返回**字符串**，不是数字。

### 4. Date 对象

```javascript
new Date();                        // 当前时间
new Date("1995-12-25");            // 字符串解析
new Date(1995, 11, 25);            // 年, 月(0-11), 日
```

**⚠️ 月份从 0 开始！** 0 = 一月，11 = 十二月。

```javascript
const d = new Date(1995, 11, 25);
d.getFullYear();    // 1995
d.getMonth();       // 11（十二月）
d.getDate();        // 25（月份中的第几天）
d.getTime();        // 毫秒时间戳
```

**Date.now()** 获取当前时间戳（最常用）。

---

## 常见误区

1. `NaN == NaN` 是 `false` — 用 `Number.isNaN()` 判断
2. `Date` 月份从 0 开始 — 12 月写 `11`
3. `toFixed` 返回字符串 — 不是数字
4. `Date` 对象有设计缺陷（月份从 0、可变、时区混乱）— 大项目推荐用 day.js / date-fns

---

## 快速自测（问答参考答案）

<details>
<summary>1. new Date(2026, 0, 1).getMonth() 输出什么？</summary>

`0` — 1 月对应索引 0。
</details>

<details>
<summary>2. console.log(Number.isFinite(Infinity)); 输出什么？</summary>

`false` — Infinity 不是有限数字。
</details>

<details>
<summary>3. (123.4).toFixed(0) 输出什么类型？值是什么？</summary>

类型是 `"string"`，值是 `"123"`。
</details>

<details>
<summary>4. 生成 1-100 的随机整数怎么写？</summary>

`Math.floor(Math.random() * 100) + 1`
</details>
