# TS 学习第九讲 - 进阶综合（装饰器 / 条件类型 / 声明文件）

> 来源：[TypeScript Handbook — Advanced](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 1. 装饰器 Decorators（ES 提案，TS 5.0+）

装饰器是 `@decorator` 语法，用来给类/方法/属性添加额外行为。类似 Java 的注解 `@Override`、`@Deprecated`。

### 启用

在 `tsconfig.json` 中开启：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 装饰器工厂

```typescript
// 类装饰器 — 接收构造函数，返回新的构造函数
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
    console.log(`${constructor.name} 已被密封`);
}

@sealed
class Greeter {
    greet() { return "Hello!"; }
}
// 输出: Greeter 已被密封
```

### 方法装饰器

```typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function(...args: any[]) {
        console.log(`调用 ${key}(${args})`);
        const result = original.apply(this, args);
        console.log(`  → ${result}`);
        return result;
    };
    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number) { return a + b; }
}

const calc = new Calculator();
calc.add(3, 5);
// 输出:
// 调用 add(3,5)
//   → 8
```

### 属性装饰器

```typescript
function Min(value: number) {
    return function(target: any, propertyKey: string) {
        let _val: number = target[propertyKey];
        Object.defineProperty(target, propertyKey, {
            get() { return _val; },
            set(v: number) {
                if (v < value) throw new Error(`${propertyKey} 不能小于 ${value}`);
                _val = v;
            }
        });
    };
}

class Config {
    @Min(1)
    timeout = 5000;
}

const cfg = new Config();
// cfg.timeout = 0;  // ❌ Error: timeout 不能小于 1
```

> Java 对比：类似 `@Min(1)` 校验注解，配合 AOP 或框架实现验证逻辑。

---

## 2. 条件类型（Conditional Types）

语法：`T extends U ? X : Y`，类似类型层面的三元表达式。

```typescript
// 判断 T 是否是字符串
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;   // "yes"
type B = IsString<number>;   // "no"
```

### 常见场景：排除 null/undefined

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null>;  // string
```

> Java 没有直接对应，但可以理解为编译期的 `instanceof` 判断。

---

## 3. 模板字面量类型（Template Literal Types）

在类型层面拼接字符串，结合条件类型可以做很强大的类型推导。

```typescript
// 事件名规范：onClick, onChange, onFocus
type EventName = "click" | "change" | "focus";

// 生成对应的回调函数名
type EventHandler = `on${Capitalize<EventName>}Handler`;
// = "onClickHandler" | "onChangeHandler" | "onFocusHandler"

const handlers: Record<EventHandler, Function> = {
    onClickHandler: () => console.log("clicked"),
    onChangeHandler: () => console.log("changed"),
    onFocusHandler: () => console.log("focused"),
};
```

> Java 没有这个能力，Java 的字符串拼接只能在运行期做。

---

## 4. infer 关键字

在条件类型中用 `infer` 做类型推断，类似模式匹配。

```typescript
// 提取 Promise 的内部类型
type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

type A = UnpackPromise<Promise<string>>;  // string
type B = UnpackPromise<number>;           // number

// 提取函数返回值
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function fn() { return { x: 1, y: 2 }; }
type Ret = MyReturnType<typeof fn>;  // { x: number; y: number }
```

> Java 对比：类似泛型方法中的类型推断，但 TS 是在编译期类型层面做。

---

## 5. 声明文件（.d.ts）

为没有类型的 JS 库提供类型声明。

```typescript
// lodash.d.ts — 为 lodash 库声明类型
declare module "lodash" {
    export function chunk<T>(array: T[], size: number): T[][];
    export function debounce<T extends Function>(func: T, wait: number): T;
    export const VERSION: string;
}
```

### 安装第三方类型声明

```bash
npm install --save-dev @types/lodash
npm install --save-dev @types/node
```

### `declare` 关键字

```typescript
// 声明全局变量（JS 中存在的，TS 不知道）
declare const API_URL: string;
declare function fetchData(url: string): Promise<any>;

// 使用
fetchData(API_URL);  // ✅ TS 能识别
```

---

## 6. tsconfig.json 常用配置速查

```json
{
  "compilerOptions": {
    "target": "ES2020",         // 编译到哪个 JS 版本
    "module": "ESNext",         // 模块系统
    "strict": true,             // 开启所有严格检查（推荐）
    "noImplicitAny": true,     // 不允许隐式 any
    "strictNullChecks": true,  // 严格 null 检查
    "esModuleInterop": true,   // 兼容 CommonJS/ESM
    "skipLibCheck": true,      // 跳过 .d.ts 检查
    "outDir": "./dist",        // 输出目录
    "rootDir": "./src",        // 源码目录
    "declaration": true,       // 生成 .d.ts 文件
    "sourceMap": true          // 生成 source map
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 关键配置说明

| 配置 | 含义 | 推荐值 |
|------|------|--------|
| `strict` | 开启所有严格检查 | ✅ `true`（新项目必须开） |
| `noImplicitAny` | 禁止隐式 any | ✅ `true` |
| `strictNullChecks` | null/undefined 单独检查 | ✅ `true` |
| `skipLibCheck` | 跳过第三方库类型检查 | ✅ `true`（加速编译） |

---

## 速查表

| 特性 | 语法 | 用途 |
|------|------|------|
| 装饰器 | `@decorator` | 给类/方法/属性添加行为 |
| 条件类型 | `T extends U ? X : Y` | 类型层面的 if/else |
| 模板字面量 | `` `on${Capitalize<T>}` `` | 类型字符串拼接 |
| infer | `T extends Promise<infer R>` | 类型推断/提取 |
| declare | `declare const x: string` | 声明外部变量/函数 |
| .d.ts | 声明文件 | 为 JS 库提供类型 |

---

## 快速自测（问答参考答案）

<details>
<summary>1. `@decorator` 在 Java 中对应的概念是什么？</summary>

Java 注解（Annotation），如 `@Override`、`@Deprecated`。TS 装饰器功能更强，可以修改目标的行为。
</details>

<details>
<summary>2. `T extends U ? X : Y` 的含义是什么？</summary>

条件类型：如果 T 能赋值给 U，则类型是 X，否则是 Y。类似三元运算符，但作用于类型层面。
</details>

<details>
<summary>3. `infer` 的作用是什么？</summary>

在条件类型中提取类型的一部分。比如从 `Promise<string>` 中提取出 `string`。
</details>

<details>
<summary>4. 什么情况下需要写 `.d.ts` 文件？</summary>

当使用的 JS 库没有类型声明时，需要手动写 `.d.ts` 让 TS 知道这些库的类型。现在大部分流行库都有 `@types/xxx` 包。
</details>

<details>
<summary>5. `strict: true` 包含了哪些检查？</summary>

`noImplicitAny`、`strictNullChecks`、`strictFunctionTypes`、`strictBindCallApply`、`strictPropertyInitialization`、`noImplicitThis`、`alwaysStrict` 等。
</details>
