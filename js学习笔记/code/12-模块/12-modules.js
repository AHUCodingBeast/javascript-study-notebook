// ============================================================
// JavaScript 学习第十二讲 — 模块
// 知识点：export/import、默认导出、动态加载、模块聚合
//
// 注意：本文件不能直接 node 运行，需要 ES Module 环境。
// 查看代码示例即可，实际项目中放在 .js 或 .mjs 文件中。
// ============================================================

// ========== 示例：导出 ==========
// --- utils.js ---
/*
export const PI = 3.14;
export function add(a, b) { return a + b; }
*/

// --- math.js ---
/*
export default function multiply(a, b) { return a * b; }
*/

// ========== 示例：导入 ==========

// --- main.js ---

// 具名导入（必须用花括号，名字必须一致）
// import { PI, add } from "./utils.js";
// console.log(PI);           // 3.14
// console.log(add(1, 2));    // 3

// 默认导入（不用花括号，名字随意）
// import multiply from "./math.js";
// console.log(multiply(3, 4));  // 12

// 混合导入
// import Shape, { name, draw } from "./shape.js";

// 模块对象
// import * as utils from "./utils.js";
// console.log(utils.PI);
// console.log(utils.add(1, 2));

// ---------- 动态加载 ----------
// import() 返回 Promise，可以按需加载
async function loadModule() {
    const module = await import("./utils.js");
    // module.PI
    // module.add(1, 2)
    console.log("动态加载模块:", Object.keys(module));
}

// ---------- 模块聚合（Re-export） ----------
// --- shapes.js ---
/*
export { default as Circle } from "./circle.js";
export { default as Square } from "./square.js";
*/

// --- main.js ---
// import { Circle, Square } from "./shapes.js";

// ---------- 静态 import vs 动态 import() 对比 ----------
// 静态 import:
//   - 位置：文件顶部
//   - 加载时机：预加载
//   - 返回值：直接获得绑定
//
// 动态 import():
//   - 位置：任何地方
//   - 加载时机：按需加载
//   - 返回值：Promise → 模块对象
