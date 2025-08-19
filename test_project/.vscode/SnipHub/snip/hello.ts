// TypeScript Hello World
console.log("Hello, World!");

// 带类型的函数 Hello World
function sayHello(name: string): string {
    return `Hello, ${name}!`;
}

// 类示例
class Greeting {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    greet(): string {
        return `Hello, ${this.name}!`;
    }
}

const greeting = new Greeting("TypeScript");
console.log(greeting.greet());
