// ============================================================
// JavaScript 学习第七讲 — 索引集合（数组）
// 知识点：创建数组、length、push/pop/unshift/shift、
//          slice/splice、map/filter/reduce/find/every/some、sort
// ============================================================

// ---------- 1. 创建数组 ----------
const arr1 = [1, 2, 3];             // 推荐：字面量
const arr2 = Array.of(3);           // [3] — 安全方式
const arr3 = new Array(3);          // [ <3 empty items> ] — 不推荐
console.log("字面量:", arr1);
console.log("Array.of(3):", arr2);
console.log("new Array(3):", arr3);

// ---------- 2. length ----------
const nums = [10, 20, 30, 40, 50];
nums.length = 2;   // 截断
console.log(`length=2: [${nums}]`);  // [10, 20]
nums.length = 0;   // 清空
console.log(`length=0: [${nums}]`);  // []

// ---------- 3. 添加/删除 ----------
nums.push(1, 2, 3, 4, 5);
console.log(`push 后: [${nums}]`);
console.log(`pop 返回值: ${nums.pop()}`);    // 5
console.log(`shift 返回值: ${nums.shift()}`); // 1
nums.unshift(0);
console.log(`unshift(0) 后: [${nums}]`);

// ---------- 4. slice vs splice ----------
const letters = ["a", "b", "c", "d"];
console.log("\n--- slice vs splice ---");
console.log(`原数组: [${letters}]`);
console.log(`slice(1, 3): [${letters.slice(1, 3)}]`);  // ["b", "c"]，原数组不变
console.log(`slice 后: [${letters}]`);

const moreLetters = [...letters];  // 拷贝
const removed = moreLetters.splice(1, 2);
console.log(`splice(1, 2) 返回: [${removed}]`);  // ["b", "c"]
console.log(`splice 后: [${moreLetters}]`);      // ["a", "d"] — 被修改！

// ---------- 5. at() ----------
console.log(`\narr.at(-1): ${[10, 20, 30].at(-1)}`);  // 30

// ---------- 6. 迭代方法 ----------
const nums2 = [1, 2, 3, 4, 5];
console.log("\n--- 迭代方法 ---");

console.log(`map(x*2): [${nums2.map(x => x * 2)}]`);
console.log(`filter(x>3): [${nums2.filter(x => x > 3)}]`);
console.log(`find(x>3): ${nums2.find(x => x > 3)}`);
console.log(`every(x>0): ${nums2.every(x => x > 0)}`);
console.log(`some(x>3): ${nums2.some(x => x > 3)}`);
console.log(`reduce(sum): ${nums2.reduce((a, b) => a + b, 0)}`);

// forEach — 注意返回值是 undefined
const result = nums2.forEach(x => x * 2);
console.log(`forEach 返回值: ${result}`);  // undefined

// ---------- 7. sort ----------
console.log("\n--- sort ---");
console.log(`默认 sort [10,2,1]: [${[10, 2, 1].sort()}]`);  // [1, 10, 2] — 按字符串排！
console.log(`比较函数 [10,2,1]: [${[10, 2, 1].sort((a, b) => a - b)}]`);  // [1, 2, 10]

// ---------- 8. 其他 ----------
console.log("\n--- 其他方法 ---");
console.log(`join("-"): ${["a", "b", "c"].join("-")}`);   // "a-b-c"
console.log(`concat: [${[1].concat([2, 3])}]`);           // [1, 2, 3]
console.log(`reverse: [${[1, 2, 3].reverse()}]`);         // [3, 2, 1]
