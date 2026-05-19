# JS 学习第六讲 — 数字、Math 与日期

> 来源：
> - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Numbers_and_strings
> - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Representing_dates_times

## 核心概念

- JS 里所有数字都是**双精度浮点数**（IEEE 754），没有单独的整数类型
- `Math` 对象提供数学函数，**不能自己创建** Math 对象
- `Date` 对象处理日期时间，但已被标记为**历史遗留**，新代码推荐用 day.js / date-fns 等库

## 知识点详解

### 1. 数字类型

JS 数字全部是双精度 64 位浮点，范围约 ±10^308，精度 53 位。

**三种特殊值：**
- `+Infinity`（正无穷）
- `-Infinity`（负无穷）
- `NaN`（not-a-number，非数字）—— **NaN 不等于任何值，包括自己**

**BigInt** 用于表示超大整数，但不能与 `Number` 混用，也不能用 `Math` 操作。

### 2. 四种进制表示

| 进制 | 前缀 | 示例 | 十进制值 |
|------|------|------|---------|
| 十进制 | 无 | `42` | 42 |
| 二进制 | `0b` 或 `0B` | `0b1010` | 10 |
| 八进制 | `0o` 或 `0O` | `0o77` | 63 |
| 十六进制 | `0x` 或 `0X` | `0xFF` | 255 |

**注意：** 以 `0` 开头后接 0-7 的数字会被当作八进制（老语法），如 `0777` = 511。但 `0888` 会当作十进制解析。

**指数形式：** `1e3` = 1000，`5e-2` = 0.05

### 3. Number 对象的常量与方法

**常量（只读）：**

| 常量 | 说明 |
|------|------|
| `Number.MAX_VALUE` | 可表示的最大值 |
| `Number.MIN_VALUE` | 可表示的最小值 |
| `Number.NaN` | 非数字 |
| `Number.POSITIVE_INFINITY` | 正无穷 |
| `Number.NEGATIVE_INFINITY` | 负无穷 |
| `Number.EPSILON` | 1 与最小大于 1 的数之间的差值（浮点精度比较用） |
| `Number.MAX_SAFE_INTEGER` | 最大安全整数（2^53 - 1） |
| `Number.MIN_SAFE_INTEGER` | 最小安全整数（-(2^53 - 1)） |

**判断方法：**

```js
Number.isFinite(42);       // true
Number.isFinite(Infinity); // false
Number.isInteger(42);      // true
Number.isInteger(3.14);    // false
Number.isSafeInteger(9007199254740991);  // true
Number.isSafeInteger(9007199254740992);  // false
```

**NaN 检测的坑：**

```js
NaN == NaN;               // false！不能用 == 判断
Number.isNaN(NaN);        // true ✓ 推荐
Number.isNaN("hello");    // false（不转换类型）
isNaN("hello");           // true（全局 isNaN 会先转类型，不推荐）
```

**字符串转数字：**

```js
Number.parseFloat("3.14abc");  // 3.14
Number.parseInt("42px", 10);   // 42
```

### 4. 数字格式化方法

| 方法 | 说明 | 示例 | 结果 |
|------|------|------|------|
| `toFixed(n)` | 固定 n 位**小数** | `(3.14159).toFixed(2)` | `"3.14"` |
| `toExponential(n)` | 科学计数法，小数点后 n 位 | `(123).toExponential(2)` | `"1.23e+2"` |
| `toPrecision(n)` | 总共 n 位**有效数字** | `(123).toPrecision(2)` | `"1.2e+2"` |

都返回**字符串**，不是数字。

### 5. Math 对象

**常用方法：**

```js
// 取整
Math.floor(3.9);    // 3（向下取整）
Math.ceil(3.1);     // 4（向上取整）
Math.round(3.5);    // 4（四舍五入）
Math.round(-3.5);   // -3（注意：向正无穷方向取）
Math.trunc(3.9);    // 3（截断小数）

// 最值
Math.max(1, 5, 3);  // 5
Math.min(1, 5, 3);  // 1

// 随机数 [0, 1)
Math.random();      // 0.834...

// 平方根、绝对值等
Math.sqrt(16);      // 4
Math.abs(-5);       // 5
Math.pow(2, 3);     // 8

// 常量
Math.PI;            // 3.141592653589793
```

**生成 N 到 M 的随机整数：**

```js
Math.floor(Math.random() * (M - N + 1)) + N;
```

### 6. Date 对象

**创建方式：**

```js
// 当前时间
new Date();

// 字符串
new Date("1995-12-25");

// 年, 月(0-11), 日
new Date(1995, 11, 25);  // 1995年12月25日

// 年, 月, 日, 时, 分, 秒
new Date(1995, 11, 25, 9, 30, 0);
```

**⚠️ 月份从 0 开始！** 0 = 一月，11 = 十二月。这是 Date 最反直觉的设计。

**常用方法：**

```js
var d = new Date(1995, 11, 25);

// get 方法
d.getFullYear();    // 1995
d.getMonth();       // 11（十二月）
d.getDate();        // 25（月份中的第几天）
d.getDay();         // 1（星期一，0=周日）
d.getHours();       // 0
d.getTime();        // 毫秒时间戳（自 1970-01-01）

// set 方法
d.setFullYear(2026);

// ⚠️ 没有 setDay() —— 星期几是自动计算的
```

**比较日期——用 getTime()：**

```js
var today = new Date();
var target = new Date(2026, 11, 31);
var msPerDay = 24 * 60 * 60 * 1000;
var daysLeft = Math.round((target.getTime() - today.getTime()) / msPerDay);
```

**Date.parse()** 解析日期字符串为毫秒时间戳：

```js
Date.parse("Aug 9, 1995");  // 返回毫秒数
```

**Date.now()** 获取当前时间戳（最常用）：

```js
Date.now();  // 1715673600000
```

**Date 的设计缺陷：**
1. 月份从 0 开始，日期从 1 开始（不一致）
2. Date 对象是可变的（mutable），容易被意外修改
3. 时区处理混乱，不同浏览器解析结果可能不同
4. 不支持非 UTC/本地的其他时区

**推荐替代方案：**

| 场景 | 方案 |
|------|------|
| 简单获取时间戳 | `Date.now()` |
| 日期格式化 | `Intl.DateTimeFormat` |
| 大项目日期处理 | day.js / date-fns / Luxon |
| 未来方案 | Temporal API（提案 Stage 3） |

## 常见误区

1. **`NaN == NaN` 是 `false`** —— 用 `Number.isNaN()` 判断
2. **`Date` 月份从 0 开始** —— 12 月写 `11`，不是 `12`
3. **`toFixed` 返回字符串** —— 不是数字，需要用 `parseFloat()` 转回
4. **安全整数范围有限** —— 超过 `Number.MAX_SAFE_INTEGER` 的整数会丢失精度
5. **`Number.isNaN` vs `isNaN`** —— 全局 `isNaN("hello")` 返回 `true`（会先转类型），`Number.isNaN("hello")` 返回 `false`（不转类型）
6. **`Date` 对象已被标记为历史遗留** —— 新项目推荐用 day.js 或 date-fns

## 速查表

| 对比 | 说明 |
|------|------|
| `toFixed(n)` vs `toPrecision(n)` | 前者控制小数位数，后者控制有效数字总位数 |
| `Math.floor` vs `Math.ceil` | 向下取整 vs 向上取整 |
| `Math.round(3.5)` vs `Math.round(-3.5)` | `4` vs `-3`（向正无穷方向取） |
| `Number.isNaN` vs `isNaN` | 严格判断 NaN vs 会隐式转换的判断 |
| `Date.getMonth()` vs `Date.getDate()` | 月份(0-11) vs 日期(1-31) |
| `== NaN` vs `Number.isNaN()` | 永远 false vs 正确的判断方式 |

## 快速自测

<details>
<summary>1. `console.log(0b1111);` 输出什么？</summary>

`15` —— 8+4+2+1
</details>

<details>
<summary>2. `new Date(2026, 0, 1).getMonth()` 输出什么？</summary>

`0` —— 1月对应索引 0
</details>

<details>
<summary>3. `console.log(Number.isFinite(Infinity));` 输出什么？</summary>

`false` —— Infinity 不是有限数字
</details>

<details>
<summary>4. `console.log((123.4).toFixed(0));` 输出什么类型？值是什么？</summary>

类型是 `"string"`，值是 `"123"`
</details>

<details>
<summary>5. 生成 1-100 的随机整数怎么写？</summary>

`Math.floor(Math.random() * 100) + 1`
</details>
