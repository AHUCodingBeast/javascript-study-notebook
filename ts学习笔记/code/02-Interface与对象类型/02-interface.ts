// ============================================================
// TypeScript 学习第二讲 — Interface 与对象类型
// 知识点：interface 基础、可选属性、readonly、索引签名、接口扩展、
//          type vs interface、implements、结构类型
// ============================================================

// ---------- 1. Interface 基础 ----------
interface Person {
    name: string;
    age: number;
}

let person: Person = { name: "张三", age: 25 };
console.log(`${person.name}, ${person.age}`);

// ---------- 2. 接口中定义方法 ----------
interface User {
    name: string;
    greet(): string;
}

const user: User = {
    name: "张三",
    greet() { return `Hello, I'm ${this.name}!`; },
};
console.log(user.greet());

// ---------- 3. 可选属性 ----------
interface Config {
    api: string;
    timeout?: number;
    debug?: boolean;
}

const cfg1: Config = { api: "/api" };  // 可选属性可以不写
const cfg2: Config = { api: "/api", timeout: 5000, debug: true };

// ---------- 4. 只读属性 ----------
interface Point {
    readonly x: number;
    readonly y: number;
}

const p: Point = { x: 10, y: 20 };
console.log(`Point: (${p.x}, ${p.y})`);
// p.x = 30;  // ❌ 编译错误 — readonly 属性不能修改

// ---------- 5. 索引签名 ----------
interface StringMap {
    [key: string]: string;
}

const map: StringMap = { name: "张三", city: "北京" };
map.email = "test@example.com";  // OK — 动态添加键
console.log(`索引签名:`, map);

// ---------- 6. 接口扩展 ----------
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
    bark(): string;
}

const dog: Dog = {
    name: "旺财",
    breed: "哈士奇",
    bark() { return "汪汪!"; },
};
console.log(`${dog.name} (${dog.breed}): ${dog.bark()}`);

// ---------- 7. type vs interface ----------

// interface — 定义对象形状
interface IUser {
    name: string;
    age: number;
}

// type — 联合类型、元组、别名
type Status = "active" | "inactive" | "pending";
type Coordinate = [number, number];
type ID = string | number;

const status: Status = "active";
const coord: Coordinate = [10, 20];
const id: ID = "abc-123";
console.log(`status: ${status}, coord: (${coord}), id: ${id}`);

// ---------- 8. implements 关键字 ----------
interface Printable {
    print(): string;
}

class Document implements Printable {
    constructor(public content: string) {}
    print(): string { return this.content; }
}

const doc = new Document("Hello, TypeScript!");
console.log(doc.print());

// ---------- 9. 结构类型（Duck Typing） ----------
interface Point2D { x: number; y: number; }
interface Point3D { x: number; y: number; }

const p2d: Point2D = { x: 10, y: 20 };
const p3d: Point3D = p2d;  // ✅ TS 允许！结构一样就行
console.log(`结构类型: Point2D 可以赋值给 Point3D`);
