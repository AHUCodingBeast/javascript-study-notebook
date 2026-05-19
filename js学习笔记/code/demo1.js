Promise.resolve().then(() => console.log("microtask"));
setTimeout(() => console.log("macrotask"), 0);
console.log("sync");