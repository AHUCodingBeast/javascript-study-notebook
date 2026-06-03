# JS 学习第十五讲 — 常用工具 API

> 来源：MDN Web API 文档 & ES2020+ 新特性

---

## 核心概念

- **可选链 `?.`** — 安全访问深层嵌套属性
- **空值合并 `??`** — 只在 null/undefined 时用默认值
- **JSON** — 前后端数据交换的标准格式
- **正则表达式** — 字符串匹配、验证、替换
- **定时器** — 延迟执行和周期性执行
- **fetch API** — 发 HTTP 请求

---

## 知识点详解

### 1. 可选链 `?.`（ES2020）

安全访问深层属性，避免 `Cannot read property of undefined`：

```javascript
const user = { name: "张三", address: { city: "北京" } };

// ❌ 传统写法 — 如果 address 是 null/undefined 会报错
const city = user.address.city;

// ✅ 可选链 — 中间任何一个为 null/undefined 就返回 undefined
const city = user?.address?.city;  // "北京"

// 也可用于函数调用和数组访问
const result = api?.getData?.();
const first = arr?.[0];
```

> 这是 AI 写代码中最常见的特性之一，大幅减少判空代码。

### 2. 空值合并 `??`（ES2020）

只在值为 `null` 或 `undefined` 时用默认值：

```javascript
const config = userInput ?? "默认值";

// 对比 || 的坑：
0 || "默认";      // "默认" — 0 是 falsy，被替换了
0 ?? "默认";      // 0 — 0 不是 null/undefined，保留
"" || "默认";     // "默认" — 空字符串是 falsy
"" ?? "默认";     // "" — 空字符串保留
```

### 3. JSON 序列化

前后端数据交互的标准格式：

```javascript
// 对象转 JSON 字符串
const json = JSON.stringify({ name: "张三", age: 25 });
// '{"name":"张三","age":25}'

// JSON 字符串转对象
const obj = JSON.parse('{"name":"张三","age":25}');
// { name: "张三", age: 25 }

// 格式化输出（调试用）
console.log(JSON.stringify(obj, null, 2));
```

### 4. 正则表达式 RegExp

#### 4.1 创建方式

```javascript
// 字面量（推荐）
const re = /abc/gi;  // g=全局, i=忽略大小写

// 构造函数（动态生成正则时用）
const re = new RegExp("abc", "gi");
```

#### 4.2 常用方法

```javascript
const str = "Hello World";

// test — 是否匹配（最常用）
/^\d+$/.test("123");    // true

// match — 返回匹配结果
"hello".match(/l/g);    // ["l", "l"]

// replace — 替换
"hello".replace(/l/g, "L");  // "heLLo"

// split — 分割
"a,b,c".split(/,/);     // ["a", "b", "c"]
```

#### 4.3 常用模式速查

| 模式 | 含义 | 示例 |
|------|------|------|
| `\d` | 数字 | `/\d+/` 匹配 "123" |
| `\w` | 字母/数字/下划线 | `/\w+/` 匹配 "abc_123" |
| `\s` | 空白字符 | `/\s+/` 匹配空格/换行 |
| `.` | 任意字符（除换行） | `/./` 匹配 "a" |
| `^` | 开头 | `/^hello/` |
| `$` | 结尾 | `/world$/` |
| `*` | 0 次或多次 | `/a*/` |
| `+` | 1 次或多次 | `/a+/` |
| `?` | 0 次或 1 次 | `/a?/` |
| `{n,m}` | n 到 m 次 | `/a{2,4}/` |
| `[abc]` | 字符集 | `/[a-z]/` 匹配小写字母 |

#### 4.4 实战示例

```javascript
// 邮箱验证
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test("test@example.com");  // true

// 手机号验证（中国大陆）
/^1[3-9]\d{9}$/.test("13800138000");  // true

// 提取 URL 中的参数
const url = "https://example.com?name=张三&age=25";
const params = url.match(/\w+=\w+/g);  // ["name=张三", "age=25"]
```

### 5. 定时器

```javascript
// setTimeout — 延迟执行一次
const timerId = setTimeout(() => {
    console.log("1秒后执行");
}, 1000);

// 取消定时器
clearTimeout(timerId);

// setInterval — 周期性执行
const intervalId = setInterval(() => {
    console.log("每 2 秒执行一次");
}, 2000);

// 取消周期性执行
clearInterval(intervalId);
```

> **注意**：`setInterval` 会不管上一次回调是否完成就再次触发，如果需要精确控制间隔，推荐用 `setTimeout` 递归。

### 6. fetch API — 发 HTTP 请求

```javascript
// GET 请求
fetch("https://api.example.com/users")
    .then(res => res.json())       // 解析 JSON 响应
    .then(data => console.log(data))
    .catch(err => console.error(err));

// async/await 写法（推荐）
async function getUsers() {
    const res = await fetch("https://api.example.com/users");
    const data = await res.json();
    return data;
}

// POST 请求
async function createUser(user) {
    const res = await fetch("https://api.example.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return res.json();
}
```

**fetch 的关键点：**
- 网络错误才会触发 `catch`，HTTP 404/500 不会（需要手动 `if (!res.ok) throw...`）
- `res.json()` 返回一个 Promise，需要 `await`
- 老项目可能还在用 `axios` 或 `XMLHttpRequest`，但 fetch 是原生标准

### 7. 常用全局对象与方法

#### console

```javascript
console.log("普通日志");
console.error("错误日志");  // 红色输出
console.warn("警告日志");   // 黄色输出
console.table([{a:1}, {a:2}]);  // 表格输出
```

#### URL 编码

```javascript
encodeURIComponent("你好 世界");  // "%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C"
decodeURIComponent("%E4%BD%A0%E5%A5%BD");  // "你好"
```

#### Math（最常用的几个）

```javascript
Math.max(...[1, 5, 3]);   // 5
Math.min(...[1, 5, 3]);   // 1
Math.random();            // [0, 1) 的随机数
Math.floor(3.9);          // 3
Math.ceil(3.1);           // 4
Math.round(3.5);          // 4
```

### 8. Object 静态方法

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);         // ["a", "b", "c"] — 所有键
Object.values(obj);       // [1, 2, 3] — 所有值
Object.entries(obj);      // [["a",1], ["b",2], ["c",3]] — 键值对

// 合并对象（浅拷贝）
const merged = Object.assign({}, obj, { d: 4 });
// 或用扩展运算符
const merged2 = { ...obj, d: 4 };

// 冻结对象（不可修改）
const frozen = Object.freeze({ x: 1 });
frozen.x = 2;  // 严格模式下报错
```

### 9. 字符串常用方法

```javascript
const str = "Hello World";

str.startsWith("Hello");   // true
str.endsWith("World");     // true
str.includes("lo");        // true
str.indexOf("World");      // 6（第一次出现的索引，没有返回 -1）
str.trim();                // 去除两端空白
str.toLowerCase();         // "hello world"
str.toUpperCase();         // "HELLO WORLD"
str.padStart(15, "0");     // "0000Hello World"
str.padEnd(15, "!");       // "Hello World!!!!"
str.repeat(3);             // "Hello WorldHello WorldHello World"
```

---

## 常见误区

1. `?.` 只检测 null/undefined，不检测空字符串 — `""?.length` 返回 0，不是 undefined
2. `??` 和 `||` 不一样 — `0 ?? "默认"` 返回 0，`0 || "默认"` 返回 "默认"
3. `JSON.stringify()` 会丢失 `undefined`、函数、Symbol — 这些值在 JSON 中没有对应表示
4. fetch 的 404/500 **不会**触发 catch — 需要手动检查 `res.ok`
5. 正则字面量 `/pattern/g` 不要和构造函数 `new RegExp("pattern", "g")` 混淆，后者需要转义反斜杠

---

## 速查表

| 对比 | 说明 |
|------|------|
| `?.` vs `&&` | `user?.address` 等价于 `user && user.address`，但更简洁 |
| `??` vs `||` | `??` 只在 null/undefined 时替换；`||` 对所有 falsy 都替换 |
| `test()` vs `match()` | test 返回布尔值；match 返回匹配数组或 null |
| `setTimeout` vs `setInterval` | 前者执行一次；后者周期性执行 |
| `JSON.stringify` vs `JSON.parse` | 对象→字符串；字符串→对象 |
| `fetch` vs `axios` | fetch 是浏览器原生；axios 是第三方库，功能更丰富 |
