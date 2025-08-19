# Change Log

All notable changes to the "SnipHub" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Multilingual support (English, Chinese, Japanese, Korean)
- Comprehensive README documentation in multiple languages
- International user interface
- Enhanced error messages with localization
- Language-specific welcome messages

### Changed
- Updated package.json with internationalization placeholders
- Improved project structure for better maintainability
- Enhanced TypeScript configuration

### Fixed
- Code organization and module exports

## [0.0.1] - 2025-08-17

### Added
- Initial release of SnipHub
- Code snippet management functionality
- Snippet sets (multi-file templates)
- VS Code sidebar integration
- Context menus for quick operations
- Automatic storage in `.vscode/SnipHub`
- IntelliSense integration with customizable prefix
- Syntax highlighting for .snip files
- File watcher for real-time updates
- Configuration options for storage location and prefix

### Features
- Create snippets from selected text
- Create and manage snippet sets
- Drag and drop file operations
- Tag and description support
- Language-specific snippet detection
- Visual tree view for snippet management
- Quick pick dropdown for operations

### Technical
- TypeScript implementation
- Modular architecture
- Event-driven design
- VS Code TreeDataProvider integration
- Custom language support for .snip files
- JSON schema validation for snippet files
