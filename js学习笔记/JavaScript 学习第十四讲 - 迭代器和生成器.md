# JS 学习第十四讲 - 迭代器和生成器

> 来源：[MDN JavaScript 指南 — Iterators and generators](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)

---

## 核心概念

- **生成器**：用 `function*` 定义，通过 `yield` 暂停执行，返回迭代器
- **可迭代对象**：实现了 `[Symbol.iterator]()` 方法的对象，可用 `for...of` 遍历

---

## 知识点详解

### 1. 生成器函数（Generator）

```javascript
function* range(start, end, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;  // 暂停并返回值
    }
}

const gen = range(0, 5, 2);
gen.next();  // { value: 0, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 4, done: false }
gen.next();  // { value: undefined, done: true }
```

**关键行为：**
- 调用生成器函数**不执行代码**，返回一个生成器对象
- `next()` 调用时，代码执行到下一个 `yield` 后暂停
- 每个生成器只能迭代一次

### 2. 可迭代对象

内置可迭代对象：`String`、`Array`、`TypedArray`、`Map`、`Set`。
`Object` 默认不可迭代。

### 3. 用于可迭代对象的语法

```javascript
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

---

## 跨语言对比

| 特性 | JS | Java | Python |
| ------ | ---- | ------ | -------- |
| 生成器 | `function*` + `yield` | 无直接等价 | `def` + `yield` |
| 可迭代 | `[Symbol.iterator]()` | `Iterable<T>` | `__iter__()` |
| for-each | `for...of` | `for (T x : collection)` | `for x in collection` |

---

## 常见误区

1. 生成器调用后**不立即执行** — 返回生成器对象，需要 `next()` 才执行
2. 生成器**不能重复迭代** — 每个生成器只能消耗一次
3. `Object` 不能直接用在 `for...of` 中 — 没有 `[Symbol.iterator]`
