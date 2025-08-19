// Java Hello World
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // 使用方法
        System.out.println(sayHello("Java"));
        
        // 使用对象
        Greeter greeter = new Greeter("Java OOP");
        System.out.println(greeter.greet());
    }
    
    public static String sayHello(String name) {
        return "Hello, " + name + "!";
    }
}

// Greeter类
class Greeter {
    private String name;
    
    public Greeter(String name) {
        this.name = name;
    }
    
    public String greet() {
        return "Hello, " + name + "!";
    }
}
