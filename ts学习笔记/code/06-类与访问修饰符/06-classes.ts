// ============================================================
// TypeScript 学习第六讲 — 类与访问修饰符
// 知识点：类基础、访问修饰符、参数属性简写、readonly、extends、
//          override、static、implements
// ============================================================

// ---------- 1. 类基础 ----------
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

const p = new Person("张三", 25);
console.log(p.greet());

// ---------- 2. 访问修饰符 ----------
// public（默认）— 类内、子类、类外都可访问
// protected — 类内、子类可访问，类外不可
// private — 仅类内可访问

class Employee {
    public name: string;
    protected salary: number;
    private secret: string;

    constructor(name: string, salary: number, secret: string) {
        this.name = name;
        this.salary = salary;
        this.secret = secret;
    }

    getInfo(): string {
        return `${this.name} 薪资: ${this.salary}, 机密: ${this.secret}`;
    }
}

const emp = new Employee("李四", 8000, "机密信息");
console.log(emp.name);       // ✅ public
// emp.salary;               // ❌ protected
// emp.secret;               // ❌ private
console.log(emp.getInfo());  // ✅ 类内可以访问所有字段

// ---------- 3. 参数属性简写（TS 特有） ----------
class Person2 {
    constructor(
        public name: string,
        public age: number
    ) {}
}

const p2 = new Person2("王五", 30);
console.log(`参数属性简写: ${p2.name}, ${p2.age}`);

// ---------- 4. 继承 ----------
class Animal {
    constructor(public name: string) {}

    speak(): string {
        return `${this.name} 发出了声音`;
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);  // 必须先调用
    }

    // 方法重写
    override speak(): string {
        return `${super.speak()}, 汪汪!`;
    }
}

const dog = new Dog("旺财", "哈士奇");
console.log(dog.speak());

// ---------- 5. 静态成员 ----------
class MathUtil {
    static PI = 3.14159;

    static add(a: number, b: number): number {
        return a + b;
    }
}

console.log(`MathUtil.PI: ${MathUtil.PI}`);
console.log(`MathUtil.add(1, 2): ${MathUtil.add(1, 2)}`);

// ---------- 6. 类实现接口 ----------
interface Printable {
    print(): string;
}

class MyDocument implements Printable {
    constructor(public content: string) {}
    print(): string { return this.content; }
}

const doc = new MyDocument("Hello TypeScript!");
console.log(doc.print());
