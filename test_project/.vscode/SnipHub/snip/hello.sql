-- SQL Hello World

-- 创建一个简单的表
CREATE TABLE hello_world (
    id INT PRIMARY KEY,
    language VARCHAR(50),
    message VARCHAR(100),
    created_date DATE
);

-- 插入一些数据
INSERT INTO hello_world (id, language, message, created_date)
VALUES
    (1, 'English', 'Hello, World!', CURRENT_DATE),
    (2, '中文', '你好，世界！', CURRENT_DATE),
    (3, '日本語', 'こんにちは世界！', CURRENT_DATE),
    (4, 'Español', '¡Hola, Mundo!', CURRENT_DATE),
    (5, 'Français', 'Bonjour le Monde!', CURRENT_DATE);

-- 查询数据
SELECT * FROM hello_world;

-- 按语言筛选
SELECT language, message
FROM hello_world
WHERE language = 'English';

-- 使用函数和表达式
SELECT 
    language,
    message,
    UPPER(message) AS upper_message,
    LENGTH(message) AS message_length
FROM hello_world
ORDER BY message_length DESC;
