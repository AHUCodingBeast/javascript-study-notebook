# TypeScript 环境搭建

> 目标：在本地搭建完整的 TypeScript 学习环境，可以编译和直接运行 .ts 文件。

---

## 1. 前置条件

确保已安装 Node.js 和 npm：

```bash
node --version   # 需要已安装 Node.js
npm --version    # npm 随 Node.js 一起安装
```

> 如果没有安装，去 [nodejs.org](https://nodejs.org/) 下载 LTS 版本，或使用 nvm 管理多版本。

---

## 2. 安装 TypeScript 编译器（全局）

```bash
npm install -g typescript
```

验证安装：

```bash
tsc --version
# 输出示例：Version 6.0.3
```

`tsc` 是 TypeScript 编译器，负责把 `.ts` 文件编译成浏览器和 Node.js 能理解的 `.js` 文件。

---

## 3. 创建项目目录

```bash
mkdir TypeScript学习笔记
cd TypeScript学习笔记
mkdir code        # 存放练习代码
```

---

## 4. 配置 tsconfig.json

在项目根目录创建 `tsconfig.json`，告诉 tsc 如何编译：

```json
{
  "compilerOptions": {
    "target": "ES2020",                    // 编译目标：ES2020
    "module": "ESNext",                    // 模块系统：ESNext
    "moduleResolution": "bundler",         // 模块解析策略
    "outDir": "./dist",                    // 编译输出目录
    "rootDir": ".",                        // 源码根目录
    "strict": true,                        // 开启所有严格类型检查（重要！）
    "esModuleInterop": true,               // 允许 import 默认导入 CommonJS 模块
    "skipLibCheck": true,                  // 跳过 .d.ts 类型声明文件的检查
    "forceConsistentCasingInFileNames": true,  // 文件名大小写一致
    "resolveJsonModule": true,             // 允许 import JSON 文件
    "sourceMap": true,                     // 生成 source map（调试用）
    "noEmitOnError": false,                // 编译出错时也输出（学习阶段方便调试）

    // 严格检查子项
    "noImplicitAny": true,                 // 禁止隐式 any
    "strictNullChecks": true,              // 严格 null 检查
    "noImplicitReturns": true,             // 函数必须覆盖所有返回值路径
    "noFallthroughCasesInSwitch": true     // switch 不能穿透
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 关键配置说明

| 配置项 | 值 | 为什么 |
|--------|------|--------|
| `strict` | `true` | **学习阶段必须开**，帮你养成写类型的习惯 |
| `noImplicitAny` | `true` | 强制你显式声明类型，不能偷懒 |
| `strictNullChecks` | `true` | 防止 null/undefined 错误，JS 最常见的 bug 来源 |
| `target` | `ES2020` | 现代 JS 环境，支持可选链、空值合并等 |
| `module` | `ESNext` | 使用 ES Module 语法（import/export） |

---

## 5. 两种运行方式

### 方式一：tsc 编译 + node 运行（生产环境常用）

```bash
# 编译所有 .ts 文件
tsc -p tsconfig.json

# 运行编译后的 JS
node dist/code/00-hello.js
```

### 方式二：ts-node 直接运行（开发阶段推荐）

```bash
# 在项目根目录安装 ts-node
npm install --save-dev ts-node

# 直接运行 .ts 文件，无需手动编译
npx ts-node code/00-hello.ts
```

> **开发阶段用 ts-node**，省去了编译步骤。正式部署时才用 `tsc` 编译。

---

## 6. 验证环境

创建 `code/00-hello.ts`：

```typescript
// TypeScript 环境验证 - Hello World
const greeting: string = "Hello, TypeScript!";
console.log(greeting);

// 测试类型检查
function add(a: number, b: number): number {
    return a + b;
}

const result: number = add(10, 20);
console.log(`10 + 20 = ${result}`);

// 测试接口
interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: "张三",
    age: 25,
};

console.log(`${person.name} 今年 ${person.age} 岁`);
```

运行：

```bash
# 方式一
tsc -p tsconfig.json && node dist/code/00-hello.js

# 方式二（推荐）
npx ts-node code/00-hello.ts
```

输出：

```
Hello, TypeScript!
10 + 20 = 30
张三 今年 25 岁
```

---

## 7. VS Code 配置

VS Code 原生支持 TypeScript，但确保：

1. **TypeScript 版本**：项目使用本地安装的 TS（底部状态栏 → 选择版本 → "Use Workspace Version"）
2. **推荐插件**：
   - TypeScript 已内置，无需额外安装
   - 可安装 `ESLint` 插件配合 TypeScript lint

---

## 8. 常见问题

### Q: `tsc` 命令找不到？

```bash
# 全局安装路径可能没在 PATH 中
npm config get prefix
# 确保该目录在你的 PATH 环境变量中
```

### Q: 编译时报 `Cannot find name`？

检查是否开启了 `strict: true`，TS 会更严格地检查类型声明。学习阶段建议开着。

### Q: 编译后 JS 文件在哪？

在 `tsconfig.json` 中 `outDir` 指定的目录，默认是 `./dist`。

---

## 9. 目录结构

```
TypeScript学习笔记/
├── code/                    # 练习代码（.ts 文件）
│   └── 00-hello.ts
├── dist/                    # 编译输出（自动生成）
│   └── code/
│       └── 00-hello.js
├── node_modules/            # 依赖包
├── package.json
├── package-lock.json
└── tsconfig.json            # TS 编译器配置
```
