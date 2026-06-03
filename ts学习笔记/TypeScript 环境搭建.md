# TypeScript 环境搭建

> 目标：在本地搭建完整的 TypeScript 学习环境，可以编译和直接运行 .ts 文件。

---

## 1. 安装 TypeScript 编译器（全局）

```bash
npm install -g typescript
tsc --version  # 验证安装
```

`tsc` 是 TypeScript 编译器，负责把 `.ts` 文件编译成 `.js`。

---

## 2. 配置 tsconfig.json

在项目根目录创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 关键配置说明

| 配置项 | 值 | 为什么 |
| ------ | ------ | ------ |
| `strict` | `true` | **学习阶段必须开**，帮你养成写类型的习惯 |
| `target` | `ES2020` | 现代 JS 环境，支持可选链、空值合并等 |
| `module` | `ESNext` | 使用 ES Module 语法（import/export） |

---

## 3. 两种运行方式

### 方式一：tsc 编译 + node 运行

```bash
tsc -p tsconfig.json
node dist/code/00-hello.js
```

### 方式二：ts-node 直接运行（开发阶段推荐）

```bash
npm install --save-dev ts-node
npx ts-node code/00-hello.ts
```

> **开发阶段用 ts-node**，省去了编译步骤。正式部署时才用 `tsc` 编译。

---

## 4. 目录结构

```
ts学习笔记/
├── code/           # 练习代码（.ts 文件）
│   └── 00-hello.ts
├── dist/           # 编译输出（自动生成）
├── tsconfig.json   # TS 编译器配置
└── package.json
```
