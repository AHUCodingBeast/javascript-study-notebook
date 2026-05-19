# JS 学习第九讲 - 使用对象（Working with Objects）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_objects

## 核心概念

- JS 对象是一系列属性的集合，属性包含**名**和**值**
- 属性值可以是函数，此时属性也称为**方法**
- JS 的继承基于**原型链**，不是基于类（ES6 class 是语法糖）

## 知识点详解

### 1. 对象的属性访问

```js
var myCar = {
    make: "Ford",
    model: "Mustang",
    year: 1969
};

// 点号访问
myCar.make;  // "Ford"

// 方括号访问（键名是字符串或变量）
myCar["make"];           // "Ford"
var prop = "model";
myCar[prop];             // "Mustang"（动态键名）
```

**⚠️ Object 的键都会被转成字符串：** `obj[1]` 和 `obj["1"]` 是同一个键。

**什么时候用方括号：**
- 键名包含空格或特殊字符：`obj["date created"]`
- 键名是动态计算的：`obj["prop" + i]`
- 键名以数字开头

### 2. 创建对象的三种方式

**方式一：对象初始化器（字面量）— 最常用**

```js
var obj = {
    name: "test",
    engine: {             // 嵌套对象
        cylinders: 4,
        size: 2.2
    }
};
```

**方式二：构造函数 + new**

```js
function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}

var car1 = new Car("Ford", "Mustang", 1969);
var car2 = new Car("Nissan", "300ZX", 1992);
```

**方式三：Object.create() — 可以指定原型对象**

```js
var Animal = {
    type: "Invertebrates",
    displayType: function() {
        console.log(this.type);
    }
};

var fish = Object.create(Animal);
fish.type = "Fishes";
fish.displayType();  // "Fishes"
```

### 3. 枚举对象属性

#### 什么是"可枚举"（enumerable）

每个对象属性都有一个隐藏的 `enumerable` 标记，默认为 `true`（可枚举），决定该属性是否会出现在 `for...in`、`Object.keys()` 等遍历中。

```js
var obj = { a: 1, b: 2 };
// a 和 b 的 enumerable 默认都是 true

Object.defineProperty(obj, "c", {
    value: 3,
    enumerable: false  // 设为不可枚举
});

console.log(Object.keys(obj));  // ["a", "b"] —— c 不会出现
console.log(obj.c);             // 3 —— 仍然可以正常访问
console.log("c" in obj);        // true —— in 操作符能找到
```

不可枚举的属性不是"没有"，只是遍历时跳过。类似 Java 里 `private` 修饰的字段——对象有，但外部遍历看不到。

**常见的不可枚举属性：** `Object.prototype` 上的 `toString`、`hasOwnProperty` 等方法就是不可枚举的，否则遍历任何对象都会看到一堆内置方法名。

#### 三种枚举方式对比

| 方法 | 自身属性 | 原型链属性 | 可枚举限制 |
|------|---------|-----------|-----------|
| `for...in` | ✅ | ✅ | **只遍历可枚举的** |
| `Object.keys(o)` | ✅ | ❌ | **只遍历可枚举的** |
| `Object.getOwnPropertyNames(o)` | ✅ | ❌ | **全部，不管是否可枚举** |

"可枚举限制"的意思是：前两个方法会跳过 `enumerable: false` 的属性，只有 `Object.getOwnPropertyNames()` 能把不可枚举的也列出来。

```js
let animal = {
    type: "animal",
    "id":"id001",
    "bark"(){
        console.log("hahaha")
    }
};

let dog =  Object.create(animal);
dog.name = "taidi";
console.log(dog.id); // id001

for(key in dog){
    console.log(key,dog[key]) // 可以打印出来所有属性，包括原型链上的
}

console.log("-------")
console.log(Object.keys(dog)) // ["name"]
console.log(Object.getOwnPropertyNames(dog))// ["name"]
```

### 4. 定义方法

```js
// 对象字面量中定义方法
var car = {
    make: "Ford",
    display() {                    // ES6 简写
        return `A Beautiful ${this.make}`;
    }
    // 等价于 display: function() { ... }
};

car.display();  // "A Beautiful Ford"
```

### 5. this 绑定规则

`this` 的值取决于**怎么调用**，不是**在哪定义**：

```js
var car = { make: "Ford", display: function() { return this.make; } };

car.display();              // "Ford" ✅ this 指向 car

var fn = car.display;
fn();                       // undefined ❌ this 指向全局/undefined

// 解决方式：bind (bind 是 Function.prototype 上的方法,这里的 display 是函数对象)
var fn2 = car.display.bind(car);
fn2();                      // "Ford" ✅
```

### 6. getter 与 setter

```js
var o = {
    a: 7,
    get b() { return this.a + 1; },
    set c(x) { this.a = x / 2; }
};

console.log(o.b);   // 8（触发 getter）
o.c = 50;           // 触发 setter，this.a = 25
console.log(o.b);   // 26
```

**对已有对象添加 getter/setter：**

```js
var o = { a: 0 };
Object.defineProperties(o, {
    b: { get: function() { return this.a + 1; } },
    c: { set: function(x) { this.a = x / 2; } }
});
```

**与 Java/Python 对比：**

| | Java | Python | JavaScript |
|---|---|---|---|
| getter | `getB()` | `@property def b(self):` | `get b() { ... }` |
| setter | `setC(x)` | `@b.setter def c(self, x):` | `set c(x) { ... }` |
| 调用方式 | `obj.getB()` | `obj.b` | `obj.b`（像属性一样访问） |

### 7. 删除属性

```js
var obj = { a: 5, b: 12 };
delete obj.a;
"a" in obj;    // false
obj.a;         // undefined
```

`delete` 只能删除**自身**属性，不能删除原型链上的属性。

### 8. 比较对象

```js
// 两个独立对象，属性相同也不相等
var fruit = { name: "apple" };
var fruitbear = { name: "apple" };
fruit == fruitbear;     // false
fruit === fruitbear;    // false

// 同一个对象的引用才相等
var fruit2 = { name: "apple" };
var fruitbear2 = fruit2;
fruit2 == fruitbear2;   // true
fruit2 === fruitbear2;  // true
```

### 9. 原型链与继承

每个对象都有 `[[Prototype]]`（可通过 `__proto__` 访问），指向另一个对象。属性查找沿原型链向上：

```js
function Animal(type) {
    this.type = type;
}

var dog = new Animal("dog");
Animal.prototype.sound = "bark";

dog.sound;                    // "bark"（从原型链找到）
dog.hasOwnProperty("sound");  // false（不是自身属性）
```

**为所有实例添加属性：**

```js
Car.prototype.color = "black";  // 所有 Car 实例都能访问 color
```

## 常见误区

1. **`typeof` 返回的是字符串，不是布尔值** — `typeof []` → `"object"`，`typeof null` → `"object"`（历史 bug）
2. **两个属性相同的对象不相等** — 对象比较的是引用，不是值
3. **`obj[1]` 和 `obj["1"]` 是同一个键** — Object 的键都会转成字符串
4. **`this` 取决于调用方式** — 提取方法后直接调用，`this` 丢失
5. **`Object.keys()` 不包含原型链属性** — 只有自身可枚举属性
6. **`delete` 不能删除原型链上的属性** — 只能删除自身属性

## 速查表

| 对比 | 说明 |
|------|------|
| 点号 vs 方括号 | `obj.make` vs `obj["make"]`，后者支持动态键名 |
| `for...in` vs `Object.keys()` | 前者遍历原型链，后者只遍历自身 |
| `delete` vs `= undefined` | delete 移除属性，赋值只是清空值 |
| `in` vs `hasOwnProperty()` | in 查原型链，hasOwnProperty 只看自身 |
| 对象字面量 vs 构造函数 | 单个对象 vs 批量创建同类型对象 |
| `typeof` vs `Array.isArray()` | typeof 无法区分数组和对象，用 isArray |

## 快速自测

<details>
<summary>1. `var a = {x:1}; var b = a; b.x = 2; console.log(a.x);` 输出什么？</summary>

`2` — 对象赋值是引用传递，a 和 b 指向同一个对象
</details>

<details>
<summary>2. `typeof null` 输出什么？</summary>

`"object"` — JS 历史遗留 bug
</details>

<details>
<summary>3. `{a:1} == {a:1}` 返回什么？</summary>

`false` — 两个独立的对象，引用不同
</details>

<details>
<summary>4. 构造函数中 `this` 指向谁？</summary>

指向通过 `new` 创建的新实例对象
</details>

<details>
<summary>5. `delete obj.prop` 之后，`obj.prop` 返回什么？</summary>

`undefined` — 属性已被删除
</details>
