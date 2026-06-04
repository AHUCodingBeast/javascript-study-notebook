// ============================================================
// TypeScript 学习第九讲 — 进阶综合
// 知识点：装饰器、条件类型、模板字面量类型、infer、声明文件
// ============================================================

// ---------- 1. 装饰器（需 tsconfig 开启 experimentalDecorators） ----------

function log(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`调用 ${key}(${args.join(", ")})`);
        const result = original.apply(this, args);
        console.log(`  → ${result}`);
        return result;
    };
    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number { return a + b; }
}

const calc = new Calculator();
calc.add(3, 5);
// 输出:
// 调用 add(3, 5)
//   → 8

// ---------- 2. 条件类型 ----------

type IsString<T> = T extends string ? "yes" : "no";

const a: IsString<string> = "yes";
const b: IsString<number> = "no";
console.log(`条件类型: IsString<string> = ${a}, IsString<number> = ${b}`);

// ---------- 3. 模板字面量类型 ----------

type EventName = "click" | "change" | "focus";
type EventHandler = `on${Capitalize<EventName>}Handler`;
// = "onClickHandler" | "onChangeHandler" | "onFocusHandler"

const handlers: EventHandler[] = ["onClickHandler", "onChangeHandler", "onFocusHandler"];
console.log(`模板字面量:`, handlers);

// ---------- 4. infer ----------

type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

type PromiseInner = UnpackPromise<Promise<string>>;  // string
type PlainInner = UnpackPromise<number>;            // number

const pi: PromiseInner = "hello";
const pl: PlainInner = 42;
console.log(`infer: Promise<string> → ${pi}, number → ${pl}`);

// ---------- 5. declare（声明外部变量） ----------

declare const API_URL: string;
declare function fetchData(url: string): Promise<{ data: unknown }>;

// 实际运行时这些变量由环境提供（如 HTML 中的 <script> 注入）
console.log(`声明文件: API_URL 类型为 string（运行时由环境注入）`);
