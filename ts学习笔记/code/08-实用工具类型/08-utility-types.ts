// ============================================================
// TypeScript 学习第八讲 — 实用工具类型（Utility Types）
// 知识点：Partial, Required, Readonly, Pick, Omit, Record,
//          Exclude, Extract, ReturnType, Parameters
// ============================================================

// ---------- 基础接口 ----------
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// ---------- 1. Partial<T> — 全部变可选 ----------
function updateUser(id: number, updates: Partial<User>) {
    console.log(`Partial — 更新用户 ${id}:`, updates);
}
updateUser(1, { name: "新名字" });
updateUser(1, { name: "李四", email: "li@test.com" });

// ---------- 2. Required<T> — 全部变必填 ----------
interface Config {
    host?: string;
    port?: number;
    timeout?: number;
}

function validate(cfg: Config): Required<Config> {
    return {
        host: cfg.host ?? "localhost",
        port: cfg.port ?? 8080,
        timeout: cfg.timeout ?? 5000,
    };
}
const fullCfg = validate({ port: 3000 });
console.log(`Required — 完整配置:`, fullCfg);

// ---------- 3. Readonly<T> — 全部变只读 ----------
const frozen: Readonly<User> = {
    id: 1, name: "张三", email: "z@test.com", password: "***"
};
// frozen.name = "李四";  // ❌ 编译错误 — Cannot assign to 'name'

// ---------- 4. Pick<T, K> — 挑几个属性 ----------
type PublicUser = Pick<User, "id" | "name" | "email">;
const pub: PublicUser = { id: 1, name: "张三", email: "z@test.com" };
console.log(`Pick — 公开用户:`, pub);

// ---------- 5. Omit<T, K> — 排除几个属性 ----------
type CreateUserInput = Omit<User, "id">;
const input: CreateUserInput = {
    name: "王五", email: "w@test.com", password: "123456",
};
console.log(`Omit — 创建输入:`, input);

// ---------- 6. Record<K, T> — 键值映射 ----------
type Role = "admin" | "user" | "guest";
const rolePermissions: Record<Role, { canRead: boolean; canWrite: boolean }> = {
    admin: { canRead: true, canWrite: true },
    user:  { canRead: true, canWrite: false },
    guest: { canRead: false, canWrite: false },
};
console.log(`Record — admin 权限:`, rolePermissions.admin);

// ---------- 7. Exclude / Extract ----------
type T0 = Exclude<"a" | "b" | "c", "a">;       // "b" | "c"
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// ---------- 8. ReturnType / Parameters ----------
function getUser(id: number) {
    return { id, name: "张三" };
}
type Ret = ReturnType<typeof getUser>;  // { id: number; name: string }
type Args = Parameters<typeof getUser>; // [number]

const example: Ret = { id: 99, name: "测试" };
console.log(`ReturnType — 返回类型示例:`, example);
