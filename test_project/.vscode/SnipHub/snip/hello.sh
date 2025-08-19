#!/bin/bash
# Shell脚本 Hello World

# 简单的打印
echo "Hello, World!"

# 使用变量
name="Shell"
echo "Hello, $name!"

# 定义一个函数
say_hello() {
    local recipient="$1"
    echo "Hello, $recipient!"
}

# 调用函数
say_hello "Bash Script"

# 条件语句
if [ "$name" = "Shell" ]; then
    echo "我们正在学习 Shell 脚本"
else
    echo "我们不在学习 Shell 脚本"
fi

# 循环
echo "计数从1到5:"
for i in {1..5}; do
    echo "数字 $i"
done

# 数组
languages=("Bash" "Python" "JavaScript" "Ruby")
echo "我熟悉的编程语言:"
for (( i=0; i<${#languages[@]}; i++ )); do
    echo "$((i+1)). ${languages[$i]}"
done
