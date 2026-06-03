# JS 学习第十二讲 - 模块

> 来源：[MDN JavaScript 指南 — Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

---

## 核心概念

- 模块是一种将 JS 程序拆分为可按需导入的单独文件的机制
- 使用 `export` 导出，`import` 导入
- 模块有独立作用域，不会污染全局

---

## 知识点详解

### 1. 导出与导入

**具名导出（Named Exports）：**

```javascript
// utils.js
export const PI = 3.14;
export function add(a, b) { return a + b; }

// 导入时必须用花括号，名字必须一致
import { PI, add } from "./utils.js";
```

**默认导出（Default Export）：**

```javascript
// math.js
export default function multiply(a, b) { return a * b; }

// 导入时不用花括号，名字可以随便起
import multiply from "./math.js";
```

**混合导入：**

```javascript
import Shape, { name, draw } from "./shape.js";
```

### 2. 模块对象 — import * as

```javascript
import * as Shape from "./shape.js";
Shape.draw();
Shape.name;
```

### 3. 动态加载 — import()

```javascript
// 按需加载，返回 Promise
const module = await import("./square.js");
module.Square;  // 类需要 Module.ClassName 访问
```

| 特性 | 静态 import | 动态 import() |
| ------ | ------ | ---------------- |
| 位置 | 文件顶部 | 任何地方 |
| 加载时机 | 预加载 | 按需加载 |
| 返回值 | 直接获得绑定 | Promise → 模块对象 |

### 4. 合并模块（Re-export）

```javascript
// shapes.js — 聚合子模块
export { default as Circle } from "./circle.js";
export { default as Square } from "./square.js";

// main.js — 只需一行
import { Circle, Square } from "./shapes.js";
```

---

## 常见误区

1. 导入的值不能重新赋值 — 导入是只读视图，类似 `const`
2. `export default` 不用花括号导入 — 默认导出不带花括号
3. 本地 file:// 打开模块 HTML 不能运行 — 需要本地服务器

---

## JS 模块 vs Java 模块系统

| 特性 | JS (ES Modules) | Java |
| ------ | ---------------- | ------ |
| 导出 | `export` | `public` 类/方法 |
| 导入 | `import { x } from "..."` | `import package.Class;` |
| 默认导出 | `export default` | 一个 .java 文件一个 public class |
