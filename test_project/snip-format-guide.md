# SnipHub 片段文件格式说明

SnipHub 使用特定的 `.snip` 文件格式来定义代码片段。每个 `.snip` 文件由两个主要部分组成：

## 1. `<set>` 标签

`<set>` 标签用于定义片段的元数据，内容为 JSON 格式。

```xml
<set>
{
  "name": "片段名称",
  "description": "片段描述",
  "language": "编程语言标识符",
  "prefix": "使用的前缀"
}
</set>
```

### 属性说明：

- **name**: 片段的显示名称
- **description**: 片段的详细描述
- **language**: 代码片段适用的编程语言 (如 javascript, html, css, typescript 等)
- **prefix**: 用于触发片段的前缀，建议使用 `sh.` 开头

## 2. `<code>` 标签

`<code>` 标签包含了实际的代码片段内容，需要指定语言类型。

```xml
<code lang="javascript">
// 这里是实际的代码内容
function functionName() {
  // 代码内容
  return result;
}
</code>
```

## 完整示例

```
<set>
{
  "name": "React 函数组件",
  "description": "创建一个 React 函数组件",
  "language": "javascriptreact",
  "prefix": "sh.react.component"
}
</set>
<code lang="javascriptreact">
import React from 'react';

const ComponentName = (props) => {
  return (
    <div>
      
    </div>
  );
};

export default ComponentName;
</code>
```

## 使用方法

1. 在编辑器中使用前缀（如 `sh.react.component`）触发代码片段
2. SnipHub 将插入定义好的代码模板

## 注意事项

- 确保 `<set>` 标签中的 JSON 格式正确
- `<code>` 标签必须指定正确的语言类型（lang 属性）
- 代码片段中的缩进将被保留
