# Ruby Hello World
puts "Hello, World!"

# 带方法的 Hello World
def say_hello(name)
  "Hello, #{name}!"
end

puts say_hello("Ruby")

# 带类的 Hello World
class Greeter
  def initialize(name)
    @name = name
  end
  
  def greet
    "Hello, #{@name}!"
  end
end

# 创建实例并调用方法
greeter = Greeter.new("Ruby OOP")
puts greeter.greet

# 使用代码块
5.times do |i|
  puts "#{i+1}. Hello from Ruby!"
end
