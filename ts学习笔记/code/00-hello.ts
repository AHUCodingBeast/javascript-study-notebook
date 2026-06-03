interface User {
    name: string;
    admin: boolean;
}

// 第一个参数是 this 类型声明（运行时不传参）
function checkAdmin(this: User) {
    return this.admin;
}

function checkAdmin2(u:User) {
    return u.admin;
}

const user: User = { name: "张三", admin: true };
// 用的是函数对象的 call 方法
checkAdmin.call(user);  // 用 call/apply 绑定 this
checkAdmin2(user)

// npx ts-node ./00-hello.ts