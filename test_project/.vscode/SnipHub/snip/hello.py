# Python Hello World
print("Hello, World!")

# 带函数的 Hello World
def say_hello(name):
    return f"Hello, {name}!"

# 带类的 Hello World
class Greeter:
    def __init__(self, name):
        self.name = name
        
    def greet(self):
        return f"Hello, {self.name}!"

# 测试函数和类
print(say_hello("Python"))
greeter = Greeter("Python OOP")
print(greeter.greet())
