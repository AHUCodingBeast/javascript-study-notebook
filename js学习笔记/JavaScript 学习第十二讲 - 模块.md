# JS 学习第十二讲 - 模块

> 来源：[MDN JavaScript 指南 — Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

---

## 核心概念

- 模块是一种将 JS 程序拆分为可按需导入的单独文件的机制
- 使用 `export` 导出，`import` 导入
- 模块有独立作用域，不会污染全局

---

## 知识点详解

### 1. 具名导出（Named Exports）

```javascript
// utils.js — 导出方
export const PI = 3.14;
export function add(a, b) { return a + b; }
export class Circle {
    constructor(r) { this.r = r; }
    area() { return PI * this.r ** 2; }
}

// main.js — 导入方
import { PI, add, Circle } from "./utils.js";
// 必须用花括号，名字必须和导出的一致

// 也可以重命名
import { PI as MY_PI, add as sum } from "./utils.js";
```

### 2. 默认导出（Default Export）

```javascript
// math.js — 导出方
export default function multiply(a, b) { return a * b; }
// 或先定义再导出：
// function multiply(a, b) { return a * b; }
// export default multiply;

// main.js — 导入方
import multiply from "./math.js";
// 不用花括号，名字可以随便起
import calc from "./math.js";     // 换个名字也行
import foo from "./math.js";      // 都行
```

**一个文件只能有一个默认导出**，但可以有任意多个具名导出。

### 3. 混合导出
。
```javascript
// shape.js — 导出方
class Shape {
    constructor(type) { this.type = type; }
    render() { console.log(`渲染 ${this.type}`); }
}
export default Shape;                      // 默认导出
export const name = "shape-utils";         // 具名导出
export function draw(shape) {              // 具名导出
    console.log(`绘制 ${shape.type}`);
}

// main.js — 导入方
import Shape, { name, draw } from "./shape.js";
// 默认导出不带花括号 + 具名导出带花括号，写在一起
```

### 4. 模块对象 — import * as

把模块的所有导出打包成一个对象，**默认导出会变成 `.default` 属性**。

```javascript
// shape.js — 导出方
class Shape {
    constructor(type) { this.type = type; }
    render() { console.log(`渲染 ${this.type}`); }
}
export default Shape;                      // 默认导出
export const name = "shape-utils";         // 具名导出
export function draw(shape) {              // 具名导出
    console.log(`绘制 ${shape.type}`);
}
export function create(type) {             // 具名导出
    return new Shape(type);
}

// main.js — 导入方
import * as ShapeModule from "./shape.js";

// 访问具名导出 — 直接用属性名
ShapeModule.name;           // "shape-utils"
ShapeModule.draw({type: "circle"});  // "绘制 circle"
ShapeModule.create("square").render(); // "渲染 square"

// 访问默认导出 — 必须通过 .default
const MyShape = ShapeModule.default;
const s = new MyShape("triangle");
s.render();                 // "渲染 triangle"
```

> 对比 Java：`import * as` 类似 `import package.*;`，但 JS 是运行时拿到一个对象，不是编译期导入符号。

### 5. 动态加载 — import()

```javascript
// square.js — 导出方
export class Square {
    constructor(size) { this.size = size; }
    area() { return this.size ** 2; }
}
export const description = "正方形";

// main.js — 导入方
// 按需加载，返回 Promise，可以用在任何地方（函数内、if 分支里）
const module = await import("./square.js");
module.Square;          // 类需要 Module.ClassName 访问
module.description;     // "正方形"

// 或者 .then 写法
import("./square.js").then(mod => {
    const sq = new mod.Square(5);
    console.log(sq.area());  // 25
});
```

| 特性     | 静态 import          | 动态 import()                        |
|----------|----------------------|--------------------------------------|
| 位置     | 文件顶部             | 任何地方（函数内、if 里）            |
| 加载时机 | 预加载（页面加载时） | 按需加载（运行到时才加载）           |
| 返回值   | 直接获得绑定         | Promise → 模块对象                   |
| 适用场景 | 常规依赖             | 懒加载、条件加载、路由按需加载       |

### 6. 合并导出（Re-export）

```javascript
// circle.js — 导出方
export default class Circle {
    constructor(r) { this.r = r; }
    area() { return Math.PI * this.r ** 2; }
}

// square.js — 导出方
export default class Square {
    constructor(s) { this.s = s; }
    area() { return this.s ** 2; }
}

// shapes/index.js — 聚合导出方（统一入口）
export { default as Circle } from "./circle.js";
export { default as Square } from "./square.js";
export const version = "1.0";

// main.js — 导入方
// 只需从统一入口导入，不用管底层文件结构
import { Circle, Square, version } from "./shapes/index.js";
```

> 对比 Java：类似把分散在多个包的类通过一个公共包统一暴露，方便使用者 `import shapes.*;`。

---

## 常见误区

1. 导入的值不能重新赋值 — 导入是只读视图，类似 `const`
2. `export default` 不用花括号导入 — 默认导出不带花括号
3. 本地 `file://` 打开含模块的 HTML 不能运行 — 需要本地服务器
4. `import * as` 拿到的对象里，默认导出在 `.default` 上，不是直接挂在根上

---

## JS 模块 vs Java 模块系统

| 特性     | JS (ES Modules)              | Java                                 |
|----------|------------------------------|--------------------------------------|
| 导出     | `export`                     | `public` 类/方法                     |
| 导入     | `import { x } from "..."`    | `import package.Class;`              |
| 默认导出 | `export default`             | 一个 `.java` 文件一个 `public class` |
| 模块对象 | `import * as M from "..."`   | 无直接对应                           |
| 动态加载 | `import("...")` 返回 Promise | `Class.forName()` / 反射             |
| 合并导出 | `export { X } from "..."`    | 无直接对应                           |
