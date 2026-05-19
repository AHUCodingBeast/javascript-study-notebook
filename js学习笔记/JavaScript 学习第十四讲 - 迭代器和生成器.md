# JS 学习第十四讲 - 迭代器和生成器（Iterators and Generators）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators

## 核心概念

- **迭代器**：实现了 `next()` 方法的对象，每次调用返回 `{value, done}`
- **生成器**：用 `function*` 定义的函数，自动返回一个迭代器，通过 `yield` 暂停执行
- **可迭代对象**：实现了 `[Symbol.iterator]()` 方法的对象，可用 `for...of` 遍历
- 底层对应 Java 的 `Iterator`/`Iterable` 接口、Python 的 `__iter__`/`__next__`/`yield`

## 知识点详解

### 1. 迭代器（Iterator）

迭代器是一个对象，通过 `next()` 方法定义序列，终止时返回 `{done: true}`。

```js
// 迭代器协议：next() 返回 { value, done }
const iterator = {
    current: 0,
    last: 3,
    next() {
        if (this.current < this.last) {
            return { value: this.current++, done: false };
        }
        return { done: true };  // 终值，可选择性附带 value
    }
};

iterator.next();  // { value: 0, done: false }
iterator.next();  // { value: 1, done: false }
iterator.next();  // { value: 2, done: false }
iterator.next();  // { done: true }
```

**迭代器只能消耗一次**：产生终值后，后续 `next()` 都返回 `{done: true}`。

#### 自定义范围迭代器

```js
function createRangeIterator(start, end, step = 1) {
    let current = start;
    let count = 0;
    return {
        next() {
            if (current < end) {
                const value = current;
                current += step;
                count++;
                return { value, done: false };
            }
            return { value: count, done: true };  // 终值附带 count
        }
    };
}

const it = createRangeIterator(0, 5, 2);
it.next();  // { value: 0, done: false }
it.next();  // { value: 2, done: false }
it.next();  // { value: 4, done: false }
it.next();  // { value: 3, done: true }  — 3 是迭代次数
```

### 2. 生成器函数（Generator）

生成器用 `function*` 语法，通过 `yield` 关键字暂停执行，是迭代器的**语法糖**。

```js
function* range(start, end, step = 1) {
    let count = 0;
    for (let i = start; i < end; i += step) {
        count++;
        yield i;  // 暂停并返回值
    }
    return count;  // 终值
}

const gen = range(0, 5, 2);
gen.next();  // { value: 0, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 4, done: false }
gen.next();  // { value: 3, done: true }
```

**生成器关键行为：**
- 调用生成器函数**不执行代码**，而是返回一个生成器对象（迭代器）
- `next()` 调用时，代码执行到下一个 `yield` 后暂停
- 每次调用返回新的生成器，但每个生成器只能迭代一次

### 3. 可迭代对象（Iterable）

实现了 `[Symbol.iterator]()` 方法的对象，可用 `for...of`、展开语法等。

```js
const iterable = {
    [Symbol.iterator]() {
        let current = 0;
        const last = 3;
        return {
            next() {
                if (current < last) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

for (const value of iterable) {
    console.log(value);  // 0, 1, 2
}

[...iterable];  // [0, 1, 2]  — 展开语法
```

**内置可迭代对象：** `String`、`Array`、`TypedArray`、`Map`、`Set`。

`Object` 默认不可迭代（需要自己实现 `[Symbol.iterator]`）。

#### 生成器让对象可迭代

```js
const myObject = {
    a: 1,
    b: 2,
    c: 3,
    *[Symbol.iterator]() {
        for (const key of Object.keys(this)) {
            yield [key, this[key]];  // 返回 [key, value] 对
        }
    }
};

for (const [key, value] of myObject) {
    console.log(key, value);  // a 1, b 2, c 3
}
```

### 4. 用于可迭代对象的语法

```js
// for...of 循环
for (const x of [1, 2, 3]) { console.log(x); }

// 展开语法
const arr = [..."hello"];  // ["h", "e", "l", "l", "o"]

// 解构赋值
const [a, b, ...rest] = [1, 2, 3, 4];  // a=1, b=2, rest=[3, 4]

// yield* 委托
function* g1() { yield 1; yield 2; }
function* g2() { yield* g1(); yield 3; }
[...g2()];  // [1, 2, 3]
```

### 5. 高级生成器 — `next()` 传值

`next()` 方法可以接受参数，该参数会被**上一个 `yield` 接收**：

```js
function* generator() {
    const a = yield 1;  // yield 1，暂停
    console.log(a);     // 下次 next 时执行
    const b = yield 2;
    console.log(b);
    return 3;
}

const gen = generator();
gen.next();           // { value: 1, done: false } — 第一个 next 传值无效
gen.next("hello");    // 输出 "hello"，{ value: 2, done: false }
gen.next("world");    // 输出 "world"，{ value: 3, done: true }
```

**⚠️ 传给第一个 `next()` 的值会被忽略**，因为没有上一个 `yield` 来接收。

#### 斐波那契生成器（用 `next()` 重启）

```js
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        [prev, curr] = [curr, prev + curr];
        const reset = yield curr;
        if (reset) {
            [prev, curr] = [0, 1];  // 重置
        }
    }
}

const fib = fibonacci();
fib.next();  // { value: 1, done: false }
fib.next();  // { value: 2, done: false }
fib.next();  // { value: 3, done: false }
fib.next(true);  // 重置序列，{ value: 1, done: false }
```

### 6. 生成器控制 — `throw()` 和 `return()`

```js
function* gen() {
    try {
        yield 1;
        yield 2;
    } catch (e) {
        console.log("捕获异常:", e.message);
    }
    yield 3;
}

const g = gen();
g.next();       // { value: 1, done: false }
g.throw(new Error("oops"));  // 输出 "捕获异常: oops"，{ value: 3, done: false }
g.next();       // { done: true }
```

- `throw(error)` — 向生成器注入异常，从当前暂停的 `yield` 处抛出
- `return(value)` — 立即终结生成器，返回指定值

### 7. 无限序列

生成器可以表示无限序列，因为值是按需计算的：

```js
function* naturalNumbers() {
    let n = 1;
    while (true) {
        yield n++;
    }
}

const nums = naturalNumbers();
nums.next().value;  // 1
nums.next().value;  // 2
// ... 无限继续，不会卡死
```

## 常见误区

1. **迭代器就是数组** — 迭代器是对象，通过 `next()` 消耗，不一定表示为数组
2. **第一个 `next()` 传值有效** — 无效，没有上一个 `yield` 来接收
3. **生成器调用后直接执行** — 不会，返回生成器对象，需要 `next()` 才执行
4. **生成器可以重复迭代** — 不行，每个生成器只能消耗一次，需重新调用 `function*`
5. **`Object` 可直接 `for...of`** — 不行，`Object` 没有 `[Symbol.iterator]`
6. **`yield` 和 `return` 一样** — 不一样，`yield` 暂停可恢复；`return` 终结生成器
7. **迭代器用完还能再用** — 不行，迭代是消耗性的

## 跨语言对比

### Iterator/Generator vs Java

| 特性 | JS | Java |
|------|----|------|
| 迭代器 | `next()` → `{value, done}` | `hasNext()` + `next()` |
| 可迭代 | `[Symbol.iterator]()` | 实现 `Iterable<T>` |
| 生成器 | `function*` + `yield` | 无直接等价（可用 Stream 模拟） |
| for-each | `for...of` | `for (T x : collection)` |
| 延迟计算 | 生成器按需 yield | `Stream` 惰性求值 |

### Iterator/Generator vs Python

| 特性 | JS | Python |
|------|----|--------|
| 迭代协议 | `next()` → `{value, done}` | `__next__()` / `StopIteration` |
| 可迭代 | `[Symbol.iterator]()` | `__iter__()` |
| 生成器 | `function*` + `yield` | `def` + `yield` |
| 传值 | `next(value)` | `gen.send(value)` |
| 注入异常 | `gen.throw(e)` | `gen.throw(e)` |
| 终结 | `gen.return(value)` | 无直接等价 |
| 委托 | `yield*` | `yield from` |
| 无限序列 | `while(true) yield` | `while True: yield` |

## 速查表

| 对比 | 说明 |
|------|------|
| 迭代器 vs 可迭代对象 | 迭代器：有 `next()`；可迭代对象：有 `[Symbol.iterator]()` |
| `function*` vs 普通函数 | `function*` 调用返回生成器（迭代器），不立即执行 |
| `yield` vs `return` | `yield` 暂停并可恢复；`return` 终结并返回终值 |
| `yield` vs `yield*` | `yield` 返回单个值；`yield*` 委托另一个迭代器 |
| `for...of` vs `for...in` | `of` 遍历值（可迭代）；`in` 遍历键（包括原型链） |
| 展开语法 vs 迭代器 | `[...iterable]` 自动消耗迭代器为数组 |
| `next(val)` | 传给上一个 `yield`，第一个 `next()` 传值无效 |

## 快速自测

<details>
<summary>1. 调用生成器函数 `function* gen() { yield 1; }` 后，`gen()` 的返回值是什么？</summary>

生成器对象（迭代器），不会立即执行函数体
</details>

<details>
<summary>2. `gen.next("hello")` 中的 `"hello"` 会传给谁？</summary>

传给上一个 `yield` 表达式作为其返回值，第一个 `next()` 传值无效
</details>

<details>
<summary>3. `{}` 能直接用在 `for...of` 中吗？</summary>

不能 — `Object` 没有 `[Symbol.iterator]` 方法
</details>

<details>
<summary>4. `for...in` 和 `for...of` 有什么区别？</summary>

`in` 遍历对象的键名（包括原型链）；`of` 遍历可迭代对象的值
</details>

<details>
<summary>5. 生成器能表示无限序列吗？</summary>

能 — 值按需计算，不会卡死
</details>

<details>
<summary>6. `yield*` 的作用是什么？</summary>

将迭代委托给另一个可迭代对象/生成器
</details>
