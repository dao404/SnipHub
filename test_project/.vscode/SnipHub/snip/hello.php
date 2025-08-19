<?php
// PHP Hello World
echo "Hello, World!\n";

// 带函数的 Hello World
function sayHello($name) {
    return "Hello, $name!";
}

echo sayHello("PHP") . "\n";

// 带类的 Hello World
class Greeter {
    private $name;
    
    public function __construct($name) {
        $this->name = $name;
    }
    
    public function greet() {
        return "Hello, {$this->name}!";
    }
}

// 创建实例并调用方法
$greeter = new Greeter("PHP OOP");
echo $greeter->greet() . "\n";

// 使用数组
$languages = ["PHP", "HTML", "JavaScript", "CSS"];
foreach ($languages as $lang) {
    echo "I know $lang!\n";
}
?>
