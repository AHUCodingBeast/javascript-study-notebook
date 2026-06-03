// ============================================================
// TypeScript 环境搭建 — 演示
// 知识点：tsc 编译、tsconfig.json 配置、ts-node 直接运行
// ============================================================

// 1. 安装 TypeScript 编译器（全局）
//    npm install -g typescript
//    tsc --version

// 2. 配置 tsconfig.json（项目根目录）
//    {
//      "compilerOptions": {
//        "target": "ES2020",
//        "module": "ESNext",
//        "strict": true,
//        "outDir": "./dist",
//        "esModuleInterop": true,
//        "skipLibCheck": true,
//        "sourceMap": true
//      },
//      "include": ["./**/*.ts"]
//    }

// 3. 运行方式

// 方式一：tsc 编译 + node 运行
//    tsc -p tsconfig.json
//    node dist/code/00-hello.js

// 方式二：ts-node 直接运行（推荐）
//    npm install --save-dev ts-node
//    npx ts-node code/00-hello.ts

// ---------- 演示：TypeScript 类型检查 ----------

// 打开 strict: true 后，以下代码会有类型检查：

function greet(name: string): string {
    return `Hello, ${name}!`;
}

greet("张三");    // ✅ OK
// greet(42);     // ❌ Argument of type 'number' is not assignable to parameter of type 'string'

// 导出供其他文件使用
export {};
