import * as vscode from 'vscode';
import { CommandHandler } from './commandHandler';

/**
 * 命令注册器
 * 负责将所有命令注册到 VS Code 扩展上下文中
 */
export function registerCommands(
    context: vscode.ExtensionContext,
    commandHandler: CommandHandler
): void {
    const commands = [
        // 显示片段管理器 - 打开主要的管理界面
        vscode.commands.registerCommand('sniphub.showSnippetManager', () => {
            commandHandler.showSnippetManager();
        }),

        // 创建片段集 - 打开创建片段集的表单
        vscode.commands.registerCommand('sniphub.createPacks', () => {
            commandHandler.createPacks();
        }),

        // 添加文件到片段集 - 资源管理器右键菜单功能
        vscode.commands.registerCommand('sniphub.addFileToPacks', async (uri: vscode.Uri) => {
            await commandHandler.addFileToPacks(uri);
        }),

        // 刷新片段列表 - 重新加载所有片段数据
        vscode.commands.registerCommand('sniphub.refreshSnippets', () => {
            commandHandler.refreshSnippets();
        }),

        // 打开扩展设置 - 快速访问配置选项
        vscode.commands.registerCommand('sniphub.openSettings', () => {
            commandHandler.openSettings();
        }),

        // sh: 前缀片段应用命令 - 支持通过 sh:片段名 快速应用片段
        vscode.commands.registerCommand('sniphub.applySnippetByName', async (snippetName: string) => {
            await commandHandler.applySnippetByName(snippetName);
        }),

        // 创建 .snip 文件 - 支持用户手动创建 .snip 格式的片段文件
        vscode.commands.registerCommand('sniphub.createSnipFile', async () => {
            await commandHandler.createSnipFile();
        }),

        // 从选中内容创建 .snip 文件 - 基于选中文本创建 .snip 文件
        vscode.commands.registerCommand('sniphub.createSnipFromSelection', async () => {
            await commandHandler.createSnipFromSelection();
        }),

        // 创建下拉菜单 - 顶部工具栏的主要入口
        vscode.commands.registerCommand('sniphub.createSnippetDropdown', async () => {
            await commandHandler.createSnippetDropdown();
        }),

        // 在工作区中直接打开文件 - 从片段浏览器中直接打开文件
        vscode.commands.registerCommand('sniphub.openFileInWorkspace', async (snippet: any) => {
            await commandHandler.openFileInWorkspace(snippet);
        })
    ];

    // 将所有命令注册到扩展上下文中，确保扩展停用时能正确清理
    commands.forEach(command => context.subscriptions.push(command));
}
