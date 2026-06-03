// ============================================================
// JavaScript 学习第九讲 — 使用对象
// 知识点：属性访问、创建方式、枚举属性、this 绑定、getter/setter、对象比较
// ============================================================

// ---------- 1. 属性访问 ----------
const myCar = { make: "Ford", model: "Mustang", year: 1969 };

console.log("点号访问:", myCar.make);          // "Ford"
console.log("方括号访问:", myCar["make"]);      // "Ford"
const prop = "model";
console.log("动态键名:", myCar[prop]);          // "Mustang"

// ⚠️ Object 的键都会被转成字符串
const obj = {};
obj[1] = "one";
console.log(`obj[1] === obj["1"]: ${obj[1] === obj["1"]}`);  // true

// ---------- 2. 创建对象的三种方式 ----------

// 方式一：字面量（最常用）
const car1 = { make: "Ford", model: "Mustang", year: 1969 };

// 方式二：构造函数 + new
function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}
const car2 = new Car("Chevrolet", "Camaro", 1969);
console.log("构造函数创建:", car2);

// 方式三：Object.create() — 指定原型
const Animal = {
    type: "Invertebrates",
    displayType() { console.log(this.type); }
};
const fish = Object.create(Animal);
fish.type = "Fishes";
console.log("Object.create 创建:");
fish.displayType();  // "Fishes"

// ---------- 3. 枚举对象属性 ----------
console.log("\n--- 枚举属性 ---");
console.log("Object.keys:", Object.keys(car1));

// ---------- 4. this 绑定规则 ----------
const car3 = {
    make: "Ford",
    display() { return this.make; }
};

console.log("car.display():", car3.display());  // "Ford" ✅

const fn = car3.display;
console.log("提取方法后直接调用:", fn());  // undefined ❌ this 指向全局

// 解决：bind
const fn2 = car3.display.bind(car3);
console.log("bind 后调用:", fn2());  // "Ford" ✅

// ---------- 5. getter/setter ----------
const wallet = {
    _balance: 100,
    get balance() { return this._balance; },
    set balance(value) {
        if (value < 0) throw new Error("余额不能为负数");
        this._balance = value;
    }
};

console.log(`\ngetter: wallet.balance = ${wallet.balance}`);
wallet.balance = 200;  // 触发 setter
console.log(`setter 后: wallet.balance = ${wallet.balance}`);

// ---------- 6. 对象比较 ----------
console.log("\n--- 对象比较 ---");
const a = { name: "apple" };
const b = { name: "apple" };
console.log(`属性相同的两个对象相等吗? ${a === b}`);  // false — 引用不同

const c = a;
console.log(`同一个引用的两个变量相等吗? ${a === c}`);  // true
