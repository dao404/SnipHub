// C++ Hello World
#include <iostream>
#include <string>

// 函数声明
std::string sayHello(const std::string& name);

// 类声明
class Greeter {
private:
    std::string name;
    
public:
    Greeter(const std::string& n) : name(n) {}
    
    std::string greet() const {
        return "Hello, " + name + "!";
    }
};

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // 使用函数
    std::cout << sayHello("C++") << std::endl;
    
    // 使用类
    Greeter greeter("C++ OOP");
    std::cout << greeter.greet() << std::endl;
    
    return 0;
}

// 函数定义
std::string sayHello(const std::string& name) {
    return "Hello, " + name + "!";
}
