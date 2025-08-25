# 代码片段文件

<p style="text-indent:2em;">支持多种代码片段文件格式，可以<b>直接使用各语言的代码源文件</b>作为代码片段进行导入使用，也可以使用预定义的专用代码片段文件格式<code>.snip</code>。</p>

## .snip 代码片段文件

<p style="text-indent:2em;">支持使用预定义的代码片段文件，未来该文件类型将会逐步支持更多预设参数</p>

#### 代码片段配置标签: `<set></set>`

<p style="text-indent:2em;">可在标签内使用json格式进行代码片段的相关配置</p>

```json
{
  "id": "meil70yxvrspyksivg9",
  "name": "example1755610553769",
  "displayName": "示例片段1755610553769",
  "description": "这是一个示例代码片段",
  "language": "javascript",
  "cmd": "",
  "tags": [],
  "createdAt": "2025-08-19T13:35:53.769Z"
}
```

**支持的参数**

| 参数 | 必填 | 默认值 | 说明 |
|:-----|:---:|:------:|:----|
|name|否|默认会采用文件名|名称|
|displayName|否||显示名称|
|description|否||代码片段描述|
|language|否||语言|
|cmd|否||命令（将在未来支持）|
|tags|否|默认会采用文件扩展名|代码片段标签（将在未来支持）|
|createdAt|否||代码片段创建时间，随保存时自动创建|


#### 代码片段标签: `<code></code>`

<p style="text-indent:2em;">该标签用来存放代码片段内容</p>