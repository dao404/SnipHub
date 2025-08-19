package main

import (
	"fmt"
)

// sayHello 返回问候语
func sayHello(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

// Greeter 结构体
type Greeter struct {
	Name string
}

// Greet 方法
func (g Greeter) Greet() string {
	return fmt.Sprintf("Hello, %s!", g.Name)
}

func main() {
	// 基本 Hello World
	fmt.Println("Hello, World!")

	// 使用函数
	fmt.Println(sayHello("Go"))

	// 使用结构体和方法
	greeter := Greeter{Name: "Go OOP"}
	fmt.Println(greeter.Greet())

	// 使用切片
	languages := []string{"Go", "Python", "JavaScript", "Rust"}
	fmt.Println("我熟悉的语言:")
	for i, lang := range languages {
		fmt.Printf("%d. %s\n", i+1, lang)
	}
}
