/**
 * SnipHub 测试项目 - 主 JavaScript 文件
 * 这是一个用于测试 SnipHub 扩展的示例 JavaScript 文件
 */

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面已加载完成！');
    
    // 初始化应用
    initApp();
    
    // 设置表单提交事件
    setupFormHandler();
});

/**
 * 初始化应用
 */
function initApp() {
    // 示例函数 - 可以用于测试代码片段
    const codeContainer = document.querySelector('.code-container code');
    if (codeContainer) {
        // 添加一些示例代码
        codeContainer.textContent = `// 这是一个测试函数
function calculateSum(a, b) {
    return a + b;
}

// 使用箭头函数
const multiply = (a, b) => a * b;

// 类的例子
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(num) {
        this.result += num;
        return this;
    }
    
    subtract(num) {
        this.result -= num;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}`;
    }
    
    // 添加版本信息
    const header = document.querySelector('header');
    if (header) {
        const versionInfo = document.createElement('div');
        versionInfo.className = 'version-info';
        versionInfo.textContent = '版本: 1.0.0';
        header.appendChild(versionInfo);
    }
}

/**
 * 设置表单处理器
 */
function setupFormHandler() {
    const form = document.getElementById('sample-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const formValues = {};
            
            for (const [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // 显示表单数据
            alert(`表单提交成功！\n姓名: ${formValues.name}\n邮箱: ${formValues.email}`);
            console.log('表单数据:', formValues);
            
            // 清空表单
            form.reset();
        });
    }
}
