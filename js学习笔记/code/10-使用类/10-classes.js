// ============================================================
// JavaScript 学习第十讲 — 使用类
// 知识点：class 声明、# 私有字段、getter/setter、static、extends/super
// ============================================================

// ---------- 1. 类的声明与实例化 ----------
class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toHex() {
        // 把数字转成十六进制 如果不足 2 位，前面补 0
        const toHex2 = (n) => n.toString(16).padStart(2, "0");
        return `#${toHex2(this.r)}${toHex2(this.g)}${toHex2(this.b)}`;
    }
}

// ⚠️ 类不会提升 — 必须先声明再使用
// const broken = new Color(0, 0, 0); // ReferenceError: Cannot access 'Color' before initialization

const red = new Color(255, 0, 0);
console.log(`red.toHex(): ${red.toHex()}`);

// 必须用 new 调用
// Color(255, 0, 0); // TypeError: Class constructor cannot be invoked without 'new'

// ---------- 2. 私有字段（# 前缀） ----------
class ColorPrivate {
    #values;  // 声明私有字段

    constructor(r, g, b) {
        this.#values = [r, g, b];
    }

    getRed() { return this.#values[0]; }
    setRed(value) { this.#values[0] = value; }
    toHex() {
        const toHex2 = (n) => n.toString(16).padStart(2, "0");
        return `#${toHex2(this.#values[0])}${toHex2(this.#values[1])}${toHex2(this.#values[2])}`;
    }
}

const green = new ColorPrivate(0, 255, 0);
console.log(`green.getRed(): ${green.getRed()}`);
console.log(`green.toHex(): ${green.toHex()}`);
// green.#values; // SyntaxError — 类外无法访问

// ---------- 3. getter/setter ----------
class ColorWithValidation {
    #values;
    constructor(r, g, b) { this.#values = [r, g, b]; }

    get red() { return this.#values[0]; }
    set red(value) {
        if (value < 0 || value > 255) throw new RangeError("无效的 R 值");
        this.#values[0] = value;
    }
}

const c = new ColorWithValidation(255, 0, 0);
console.log(`getter: c.red = ${c.red}`);
c.red = 128;  // 触发 setter
console.log(`setter 后: c.red = ${c.red}`);

// ---------- 4. 静态属性 ----------
class ColorUtil {
    static isValid(r, g, b) {
        return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
    }
}

console.log(`ColorUtil.isValid(255,0,0): ${ColorUtil.isValid(255, 0, 0)}`);  // true
// new ColorUtil().isValid; // undefined — 实例上没有

// ---------- 5. 继承 ----------
class Animal {
    constructor(name) { this.name = name; }
    speak() { return `${this.name} 发出了声音`; }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // ⚠️ 必须先调用！
        this.breed = breed;
    }

    // 方法覆盖 + super（JS 直接写方法名即可覆盖）
    speak() {
        return `${super.speak()}, ${this.name} 汪汪叫！`;
    }
}

const dog = new Dog("旺财", "哈士奇");
console.log(`dog.name: ${dog.name}`);
console.log(`dog.breed: ${dog.breed}`);
console.log(`dog.speak(): ${dog.speak()}`);
