# SnipHub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/sniphub.svg)](https://marketplace.visualstudio.com/items?itemName=sniphub)

A convenient VS Code extension for code snippet management, allowing you to easily define and manage code snippets within your project directory and quickly apply them through intelligent code completion suggestions.

While current AI code generation tools can meet certain development needs, the generated code often fails to align with project-specific architectural designs and coding standards. To prevent code quality degradation and technical debt accumulation, we developed this project. SnipHub enables development teams to preset standard-compliant code snippet templates within projects, supports on-demand usage, and can be shared with team members through Git repositories, thus achieving standardized code reuse and management.

**🌍 Language:** [English](README.md) | [中文](README.zh-cn.md)

## ✨ Features

- 🔧 **Quick Access**: Access management interface through the sidebar
- ✂️ **Smart Creation**: Create code snippets from selected text in editor
- 📁 **Snippet Sets**: Create and manage multi-file templates
- 🎯 **Context Menu**: Right-click menu for quick operations
- 📂 **Auto Organization**: Automatically categorize and store in `.vscode/SnipHub`
- 🏷️ **Rich Metadata**: Support for tags and descriptions
- 🌍 **Multilingual**: Support for multiple languages (English, Chinese)
- 🔍 **IntelliSense**: Code completion with customizable prefix
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

Code snippets are reusable code blocks stored in `.snip` files. They support:

- **Multiple Languages**: Automatic language detection
- **Variable Placeholders**: VS Code snippet syntax support
- **Rich Metadata**: Name, description, tags, and more
- **IntelliSense Integration**: Trigger with customizable prefix

Example `.snip` file:

**Code Snippet Type:**
```snip
<set>
{
  "name": "react-component",
  "displayName": "React Functional Component",
  "description": "Creates a basic React functional component",
  "language": "javascript",
  "tags": ["react", "component", "jsx"]
}
</set>
<code language="javascript">
import React from 'react';

const ${1:ComponentName} = () => {
  return (
    <div>
      ${2:// Component content}
    </div>
  );
};

export default ${1:ComponentName};
</code>
```

**Snippet Set Type:**
```snip
<set>
{
  "name": "react-project-template",
  "displayName": "React Project Template",
  "description": "Complete React project structure with components and styles",
  "tags": ["react", "template", "project"]
}
</set>
<code language="javascript" path="src/App.js">
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>${1:App Title}</h1>
    </div>
  );
}

export default App;
</code>
<code language="css" path="src/App.css">
.App {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
</code>
<code language="json" path="package.json">
{
  "name": "${1:project-name}",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
</code>
```

### Snippet Sets

Snippet sets are collections of files that work together as templates. Perfect for:

- **Project Templates**: Complete project structures
- **Component Libraries**: Related components and styles
- **Configuration Sets**: Multiple config files
- **Documentation Templates**: README, docs, and guides

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
├── packs/             # Snippet sets (folders with multiple files)
└── config/            # Configuration files
```
##  Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sniphub)
- [GitHub Repository](https://github.com/dao404/sniphub)
- [Issue Tracker](https://github.com/dao404/sniphub/issues)
- [Documentation](https://github.com/dao404/sniphub/wiki)


## Future Development Plans

- Support for snippet set applications composed of multiple snippets, including application configuration and command execution
- MCP Server to provide project snippet resources for AI tools
- Public code snippet distribution

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Thanks to myself for developing this project 😄
