let pair: [string, number] = ["张三", 25];
console.log(pair[0])
console.log(pair[1])
pair.push(3);  // OK（TS 4.x 之后允许 push）
//console.log(pair[2])