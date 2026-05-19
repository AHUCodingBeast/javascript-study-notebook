# JS 学习第十二讲 - 模块（Modules）

> 来源：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules

## 核心概念

- 模块是一种将 JavaScript 程序拆分为可按需导入的单独文件的机制
- 使用 `export` 导出功能，`import` 导入功能
- 模块有独立作用域，不会污染全局命名空间
- 模块自动启用严格模式，自动延迟加载（类似 `defer`）
- 底层对应 Java 的包/模块系统（`import`/`package`）、Python 的模块导入（`import`/`from ... import`）

## 知识点详解

### 1. 为什么需要模块？

早期 JS 程序很小，现在项目复杂度高，需要一种**拆分和按需导入**的机制。Node.js 通过 CommonJS 实现了很久，浏览器原生支持是近年来的事（ES2015+）。

> 打包工具（webpack 等）仍有价值：代码分割、极简化、无用代码消除（tree-shaking）。

### 2. 导出与导入

#### 2.1 具名导出（Named Exports）

```js
// square.js — 逐个导出
export const name = "square";
export function draw() { console.log("drawing square"); }

// 或者末尾统一导出
const name = "square";
function draw() { console.log("drawing"); }
export { name, draw };
```

#### 2.2 默认导出（Default Export）

每个模块只能有一个 `export default`：

```js
// 写法一：定义 + 默认导出
export default class Shape { }

// 写法二：匿名函数默认导出
export default function() { console.log("default function"); }

// 写法三：先定义再默认导出
function randomSquare() { }
export default randomSquare;
```

#### 2.3 导入

```js
// 具名导入（花括号）
import { name, draw } from "./square.js";

// 默认导入（不用花括号）
import Shape from "./shape.js";

// 混合导入（默认 + 具名）
import Shape, { name, draw } from "./shape.js";

// 全部花括号写法（等价于上一行）
import { default as Shape, name, draw } from "./shape.js";
```

**⚠️ 导入的值是只读视图**，类似于 `const` 变量，不能重新赋值：

```js
import { name } from "./square.js";
name = "circle";       // ❌ TypeError
```

但如果导入的是对象，可以修改其属性：

```js
import { obj } from "./mod.js";
obj = { b: 2 };        // ❌ 不能重新赋值
obj.a = 100;           // ✅ 可以修改属性
```

### 3. 重命名导入/导出

```js
// 导入时重命名
import { draw as drawSquare } from "./square.js";
import { draw as drawCircle } from "./circle.js";

// 导出时重命名
export { draw as drawShape } from "./shape.js";
```

### 4. 模块对象 — `import * as`

```js
import * as Shape from "./shape.js";
Shape.draw();
Shape.name;
```

把所有导出挂载到一个对象上，自动获得命名空间，避免命名冲突。

### 5. 模块与类

模块可以导出 class，这也是避免命名冲突的方式：

```js
// square.js
export class Square {
    constructor(x, y, size) { }
    draw() { }
}

// main.js
import { Square } from "./square.js";
const square = new Square(0, 0, 100);
square.draw();
```

### 6. 导入映射（Import Maps）

解决不用写完整路径的问题，支持"裸模块名"（像 Node.js 那样）：

```html
<script type="importmap">
{
  "imports": {
    "square": "./modules/square.js",
    "lodash/": "/node_modules/lodash-es/"
  }
}
</script>
<script type="module">
  import { draw } from "square";          // 裸模块名
  import fp from "lodash/fp";             // 路径前缀映射
</script>
```

**用途：** 裸模块名、版本管理（scopes）、带 hash 文件名缓存优化。

### 7. 模块 vs 经典脚本

| 特性 | 普通 `<script>` | `<script type="module">` |
|------|----------------|------------------------|
| 作用域 | 全局（var 挂到 window） | 模块独立作用域 |
| this 顶层 | `window` | `undefined`（严格模式） |
| 严格模式 | 需手动声明 | 自动启用 |
| 加载方式 | 同步阻塞 | 自动延迟（defer 效果） |
| 顶层 await | ❌ 语法错误 | ✅ 合法 |
| import/export | ❌ 不能用 | ✅ 可以 |
| 本地文件测试 | 可用 | CORS 错误，需服务器 |

### 8. 动态加载模块 — `import()`

`import()` 是一个**函数**，返回 **Promise**，兑现为模块对象：

```js
// 按需加载
button.addEventListener("click", () => {
    import("./square.js").then((module) => {
        module.draw();
    });
});

// await 写法
const module = await import("./square.js");
module.Square;  // 类需要 Module.ClassName 访问
```

| 特性 | 静态 `import` | 动态 `import()` |
|------|--------------|----------------|
| 位置 | 只能文件顶部 | 任何地方（函数内、if 内） |
| 加载时机 | 页面加载时全部预加载 | 运行时按需加载 |
| 返回值 | 直接获得绑定 | Promise → 模块对象 |
| 性能 | 所有模块都加载 | 只加载需要的 |

### 9. 顶层 await（Top-level Await）

模块文件中可以直接使用 `await`，不需要包裹在 `async` 函数中：

```js
// 模块文件
const res = await fetch("./colors.json");
const colors = await res.json();
export { colors };  // 父模块会等这里完成后再执行
```

- 普通脚本中顶层 `await` 报语法错误
- 模块中合法，父模块等待它完成，但不阻塞兄弟模块加载

### 10. 导入声明提升

`import` 语句会被提升（hoisting），不管写在文件哪个位置，都会在模块代码执行之前处理：

```js
console.log("start");
import { Canvas } from "./canvas.js";  // 虽然不是顶部，但会被提升
console.log("end");
// 输出：start → end（两个模块都已加载完）
```

最佳实践：仍把所有 `import` 放在文件顶部，方便分析依赖。

### 11. 循环导入

模块 a 导入 b，b 又导入 a — 形成循环。JS 使用**实时绑定（live binding）**，不一定报错：

```js
// a.js
import { b } from "./b.js";
setTimeout(() => console.log("a sees b =", b), 1000);  // 异步读取 → ✅
export const a = "hello from a";

// b.js
import { a } from "./a.js";
console.log("b sees a =", a);  // 此时 a 已初始化 → ✅
export const b = "hello from b";
```

但如果同步读取未初始化的值，会报 `ReferenceError`。**建议尽量避免循环导入**，可合并模块、拆分共享代码。

### 12. 合并模块（Re-export）

```js
// shapes.js — 聚合子模块
export { default as Circle } from "./circle.js";
export { default as Square } from "./square.js";
export { default as Triangle } from "./triangle.js";

// main.js — 只需一行
import { Circle, Square, Triangle } from "./shapes.js";
```

`shapes.js` 不写任何逻辑，只是把其他模块的导出转发出去。

### 13. 加载非 JS 资源 — 导入属性

```js
import data from "./data.json" with { type: "json" };
// 导入后 data 就是普通 JS 对象

import css from "./styles.css" with { type: "css" };
// 导入后 css 是 CSSStyleSheet 对象
```

`with { type: "json" }` 告诉浏览器用 JSON 解析器处理，不写会报错（默认当 JS 处理）。

## 常见误区

1. **对象比较 `==` 和 `===` 没区别** — 都是比引用，不是比值
2. **导入的值可以重新赋值** — 不行，导入是只读视图，类似 `const`
3. **`export default` 也要用花括号导入** — 不需要，默认导出不带花括号
4. **`import` 写在文件中间会报错** — 不会，`import` 会被提升
5. **循环导入一定报错** — 不一定，异步读取时两个模块都已加载完成就不会
6. **本地 file:// 打开模块 HTML 能运行** — 不能，CORS 错误，需要本地服务器
7. **`.mjs` 文件需要特殊 MIME 类型** — 服务器需要正确配置 `text/javascript`
8. **顶层 await 在任何地方都能用** — 只能在模块中，普通脚本不行

## 跨语言对比

### JS 模块 vs Java 模块系统

| 特性 | JS (ES Modules) | Java |
|------|----------------|------|
| 导出 | `export` | `public` 类/方法 |
| 导入 | `import { x } from "..."` | `import package.Class;` |
| 默认导出 | `export default` | 一个 .java 文件一个 public class |
| 作用域 | 模块独立 | 包（package）隔离 |
| 运行时 | 浏览器原生 + Node.js | JVM 类加载器 |
| 包管理 | npm | Maven |

### JS 模块 vs Python 模块

| 特性 | JS (ES Modules) | Python |
|------|----------------|--------|
| 导出 | 显式 `export` | 文件中所有内容自动导出 |
| 导入 | `import { x } from "mod"` | `from mod import x` |
| 默认导出 | `export default` | 无直接等价 |
| 裸模块名 | 需要 Import Maps | 原生支持（sys.path） |
| 动态导入 | `import("mod")` 返回 Promise | `importlib.import_module()` |

## 速查表

| 对比 | 说明 |
|------|------|
| `export` vs `export default` | 前者需要花括号导入；后者不需要 |
| 静态 `import` vs 动态 `import()` | 前者文件顶部预加载；后者按需加载，返回 Promise |
| `import { x }` vs `import * as obj` | 前者逐个导入；后者全部挂载到对象，自动命名空间 |
| 模块 vs 经典脚本 | 模块：严格模式、独立作用域、自动延迟、顶层 await |
| `.js` vs `.mjs` | 功能相同；`.mjs` 更明确，但服务器 MIME 类型可能不支持 |
| 具名导出 vs 默认导出 | 具名导出可多个，有名称；默认导出只有一个 |
| 导入映射 vs 相对路径 | 前者支持裸模块名和路径重映射；后者需要完整相对路径 |
| `import` vs `with` | `import` 导入 JS 模块；`with { type: "json" }` 声明非 JS 资源类型 |
