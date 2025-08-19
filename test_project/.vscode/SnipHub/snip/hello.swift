// Swift Hello World
import Foundation

// 简单打印
print("Hello, World!")

// 使用函数
func sayHello(to name: String) -> String {
    return "Hello, \(name)!"
}

print(sayHello(to: "Swift"))

// 使用类
class Greeter {
    private let name: String
    
    init(name: String) {
        self.name = name
    }
    
    func greet() -> String {
        return "Hello, \(name)!"
    }
}

// 创建实例并调用方法
let greeter = Greeter(name: "Swift OOP")
print(greeter.greet())

// 使用结构体
struct Person {
    var name: String
    var age: Int
    
    func describe() -> String {
        return "\(name) is \(age) years old."
    }
}

let person = Person(name: "Swift Developer", age: 30)
print(person.describe())

// 使用枚举
enum Language {
    case swift, objectiveC, cSharp, java
    
    func description() -> String {
        switch self {
        case .swift:
            return "Swift is developed by Apple"
        case .objectiveC:
            return "Objective-C is the predecessor of Swift"
        case .cSharp:
            return "C# is developed by Microsoft"
        case .java:
            return "Java is developed by Sun Microsystems (now Oracle)"
        }
    }
}

let myFavoriteLanguage = Language.swift
print(myFavoriteLanguage.description())
