# JS 学习第九讲 - 使用对象

> 来源：[MDN JavaScript 指南 — Working with objects](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_objects)

---

## 核心概念

- JS 对象是一系列属性的集合，属性包含**名**和**值**
- 属性值可以是函数，此时也称为**方法**
- JS 的继承基于**原型链**，不是基于类

---

## 知识点详解

### 1. 对象属性访问

```javascript
const myCar = { make: "Ford", model: "Mustang", year: 1969 };

myCar.make;           // "Ford" — 点号访问
myCar["make"];        // "Ford" — 方括号访问
const prop = "model";
myCar[prop];          // "Mustang" — 动态键名
```

**⚠️ Object 的键都会被转成字符串：** `obj[1]` 和 `obj["1"]` 是同一个键。

### 2. 创建对象的三种方式

**方式一：字面量（最常用）**

```javascript
const obj = { name: "test", engine: { cylinders: 4 } };
```

**方式二：构造函数 + new**

```javascript
function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}
const car1 = new Car("Ford", "Mustang", 1969);
```

#### 什么是原型？

JS 中每个对象都有一个隐藏的 `[[Prototype]]` 链接，指向另一个对象（这个被指向的对象就叫"原型"）。当你访问一个对象的属性时：

1. 先在对象**自身**找
2. 没找到？去它的**原型**上找
3. 原型上也没找到？去原型的原型继续找
4. 一直找到 `null` 为止 — 这条链就是**原型链**

```text
对象 ──[[Prototype]]──→ 原型对象 ──[[Prototype]]──→ Object.prototype ──→ null
   ↓ 找属性
   自身属性
```

这其实就是 JS 的"继承"机制 — 对象通过原型链共享方法和属性。

#### 理解 `Object.create()` 的作用

`Object.create(proto)` 创建一个新对象，并把它的 `[[Prototype]]` 指向 `proto`。新对象可以访问 `proto` 上的所有属性和方法。

```javascript
const Animal = {
    type: "Invertebrates",
    displayType() { console.log(this.type); }
};

// fish 的原型指向 Animal
const fish = Object.create(Animal);
fish.type = "Fishes";

fish.displayType();  // "Fishes"
// 执行过程：fish 自身没有 displayType → 去原型 Animal 上找 → 找到了，调用 it
```

对比 Java 思维：`Animal` 相当于父类，`fish` 相当于子类实例。但 JS 没有"类"，是用原型链实现同样的效果。

### 3. 枚举对象属性

| 方法 | 自身属性 | 原型链属性 |
|------|---------|-----------|
| `for...in` | ✅ | ✅ |
| `Object.keys(o)` | ✅ | ❌ |
| `Object.getOwnPropertyNames(o)` | ✅ | ❌ |

```javascript
Object.keys({a: 1, b: 2});     // ["a", "b"]
Object.keys(dog);               // 只返回自身可枚举属性
```

### 4. this 绑定规则

`this` 的值取决于**怎么调用**，不是**在哪定义**：

```javascript
const car = { make: "Ford", display: function() { return this.make; } };

car.display();              // "Ford" ✅ this 指向 car

const fn = car.display;
fn();                       // undefined ❌ this 指向全局

// 解决：bind
const fn2 = car.display.bind(car);
fn2();                      // "Ford" ✅
```

### 5. getter 与 setter

```javascript
const o = {
    a: 7,
    get b() { return this.a + 1; },
    set c(x) { this.a = x / 2; }
};

console.log(o.b);   // 8（触发 getter）
o.c = 50;           // 触发 setter，this.a = 25
```

### 6. 比较对象

```javascript
const fruit = { name: "apple" };
const fruitbear = { name: "apple" };
fruit === fruitbear;    // false — 两个独立的对象，引用不同

const fruit2 = { name: "apple" };
const fruitbear2 = fruit2;
fruit2 === fruitbear2;  // true — 同一个对象的引用
```

---

## 常见误区

1. `typeof null` 返回 `"object"` — 历史 bug
2. 两个属性相同的对象不相等 — 对象比较的是引用，不是值
3. `obj[1]` 和 `obj["1"]` 是同一个键 — Object 的键都会转成字符串
4. `this` 取决于调用方式 — 提取方法后直接调用，`this` 丢失
5. `Object.keys()` 不包含原型链属性 — 只有自身可枚举属性

---

## 快速自测（问答参考答案）

<details>
<summary>1. var a = {x:1}; var b = a; b.x = 2; console.log(a.x); 输出什么？</summary>

`2` — 对象赋值是引用传递，a 和 b 指向同一个对象。
</details>

<details>
<summary>2. typeof null 输出什么？</summary>

`"object"` — JS 历史遗留 bug。
</details>

<details>
<summary>3. {a:1} == {a:1} 返回什么？</summary>

`false` — 两个独立的对象，引用不同。
</details>

<details>
<summary>4. 构造函数中 this 指向谁？</summary>

指向通过 `new` 创建的新实例对象。
</details>

<details>
<summary>5. delete obj.prop 之后，obj.prop 返回什么？</summary>

`undefined` — 属性已被删除。
</details>
