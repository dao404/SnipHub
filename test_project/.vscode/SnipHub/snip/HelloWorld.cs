// C# Hello World
using System;

namespace HelloWorldApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            
            // 使用方法
            Console.WriteLine(SayHello("C#"));
            
            // 使用类
            var greeter = new Greeter("C# OOP");
            Console.WriteLine(greeter.Greet());
        }
        
        static string SayHello(string name)
        {
            return $"Hello, {name}!";
        }
    }
    
    class Greeter
    {
        private string _name;
        
        public Greeter(string name)
        {
            _name = name;
        }
        
        public string Greet()
        {
            return $"Hello, {_name}!";
        }
    }
}
