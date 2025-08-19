// Rust Hello World
fn main() {
    // 基本 Hello World
    println!("Hello, World!");
    
    // 使用函数
    println!("{}", say_hello("Rust"));
    
    // 使用结构体和方法
    let greeter = Greeter::new("Rust OOP");
    println!("{}", greeter.greet());
    
    // 使用向量
    let languages = vec!["Rust", "C++", "Go", "TypeScript"];
    println!("我熟悉的语言:");
    for (i, lang) in languages.iter().enumerate() {
        println!("{}. {}", i+1, lang);
    }
}

// 一个简单的函数
fn say_hello(name: &str) -> String {
    format!("Hello, {}!", name)
}

// 定义一个结构体
struct Greeter {
    name: String,
}

// 为结构体实现方法
impl Greeter {
    // 构造函数
    fn new(name: &str) -> Greeter {
        Greeter {
            name: name.to_string(),
        }
    }
    
    // 问候方法
    fn greet(&self) -> String {
        format!("Hello, {}!", self.name)
    }
}
