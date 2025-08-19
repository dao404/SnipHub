# SnipHub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Frank6.sniphub.svg)](https://marketplace.visualstudio.com/items?itemName=Frank6.sniphub)

A convenient VS Code extension for code snippet management, allowing you to easily define and manage code snippets within your project directory and quickly apply them through intelligent code completion suggestions.

While current AI code generation tools can meet certain development needs, the generated code often fails to align with project-specific architectural designs and coding standards. To prevent code quality degradation and technical debt accumulation, we developed this project. SnipHub enables development teams to preset standard-compliant code snippet templates within projects, supports on-demand usage, and can be shared with team members through Git repositories, thus achieving standardized code reuse and management.

**🌍 README:** [English](README.md) | [中文](README.zh-cn.md)

## ✨ Features

- ✂️ **Quick Creation**: Create code snippets from selected text in editor
- 🎯 **Context Menu**: Right-click menu for quick operations
- 📂 **Auto Organization**: Automatically categorize and store in `.vscode/SnipHub`
- 🔧 **Quick Application**: Apply snippets quickly with customizable prefix via code completion
- 🏷️ **Rich Metadata**: Support for tags and descriptions
- 🌍 **Multilingual**: Support for multiple languages (English, Chinese)
- 📝 **Syntax Highlighting**: Built-in syntax highlighting for .snip files

## 🚀 Getting Started

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "SnipHub"
4. Click Install

### Quick Usage

#### Creating Code Snippets
1. Select code in the editor
2. Right-click and choose "SnipHub: Create .snip File"
3. Configure snippet name, description, and tags

#### Applying Snippets
1. In the editor, type the preset prefix (default: sh) followed by a colon to see available snippets
2. Select the desired snippet to apply it to the current position

#### Managing Snippets
- View all snippets and snippet sets in the SnipHub sidebar
- Use the refresh button to update the list
- Configure extension settings via the settings button

#### Creating Snippet Sets (In Development)
1. Click the SnipHub icon in the Activity Bar
2. Click "Create Snippet Set" and configure name, description, etc.
3. Add files to snippet sets via Explorer right-click menu

## 📖 Usage Guide

### Code Snippets

Support for direct code completion of development language code file content to the target position, or you can use the custom format `.snip` file for code snippets:

- **Code-Configuration Separation**: `set` tag for snippet configuration, `code` tag for code snippet
- **Multiple Languages**: Automatic language detection
- **Custom Completion Names**: Trigger with customizable snippet names
- **Rich Configuration Options**: Name, description, tags, and more

**Supported Custom Options**

| Option | Required | Description |
|:------|:------:|:------|
|name|Yes|Snippet name|
|displayName|No|Snippet display name|
|description|No|Snippet description|
|language|No|Code language|
|tags|No|Code tags|
|updatedAt|No|Update time|

More coming soon...

**Example `.snip` file:**

```snip
<set>
{
  "name": "hello-world",
  "displayName": "Hello World",
  "description": "Create a simple Hello World JavaScript code",
  "language": "javascript",
  "tags": ["javascript", "basic", "example"]
}
</set>
<code language="javascript">
function sayHello() {
  console.log("Hello, World!");
  return "Hello, World!";
}
sayHello();
</code>
```

## ⚙️ Configuration

Access settings via `Ctrl+,` and search for "SnipHub":

| Setting | Default | Description |
|---------|---------|-------------|
| `sniphub.storageLocation` | `.vscode/SnipHub` | Storage location for snippets |
| `sniphub.prefix` | `sh` | Code completion prefix |

## 🛠️ Development

### Prerequisites

- Node.js 16.x or higher
- VS Code 1.74.0 or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/dao404/sniphub.git
cd sniphub

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

### Building

```bash
# Compile for production
npm run vscode:prepublish
```

### Testing

Open the project in VS Code and press `F5` to launch a new Extension Development Host window.

## 🌍 Internationalization

SnipHub supports multiple languages:

- **English** (Default)
- **中文** (Chinese Simplified)

The extension automatically detects your VS Code language setting and displays the appropriate language.

## 📝 File Structure

```
.vscode/SnipHub/
├── snip/              # Individual code snippets (.snip files)
└── packs/             # Snippet sets (snippet collection configuration files)
```
## 🔗 Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sniphub)
- [GitHub Repository](https://github.com/dao404/sniphub)
- [Issue Tracker](https://github.com/dao404/sniphub/issues)
- [Documentation](https://github.com/dao404/sniphub/wiki)


## 📁 Future Development Plans

- Support for snippet set applications composed of multiple snippets, including application configuration and command execution
- MCP Server to provide project snippet resources for AI tools
- Public code snippet distribution
- Welcome to provide development suggestions through issues

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Thanks to myself for developing this project 😄
