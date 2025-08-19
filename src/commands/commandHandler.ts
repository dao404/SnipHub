import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { SnippetManager } from '../core/snippetManager';
import { SnippetWebviewProvider } from '../views/webviewProvider';
import { FileSnipHandler } from '../handlers/fileSnipHandler';
import { Snippet } from '../types';
import { t } from '../utils/i18n';

/**
 * 命令处理器类
 * 包含所有命令的具体实现逻辑
 */
export class CommandHandler {
    constructor(
        private context: vscode.ExtensionContext,
        private snippetManager: SnippetManager,
        private webviewProvider: SnippetWebviewProvider,
        private fileSnipHandler: FileSnipHandler
    ) {}

    /**
     * 显示片段管理器
     */
    showSnippetManager() {
        this.webviewProvider.showSnippetManager();
    }

    /**
     * 创建片段集
     */
    createPacks() {
        this.webviewProvider.showCreatePacks();
    }

    /**
     * 添加文件到片段集
     */
    async addFileToPacks(uri: vscode.Uri) {
        try {
            // 读取文件内容
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();
            // 提取文件名
            const fileName = uri.fsPath.split('\\').pop() || uri.fsPath.split('/').pop() || 'unknown';
            
            // 打开添加文件到片段集的界面
            this.webviewProvider.showAddFileToPacks(content, fileName, document.languageId);
        } catch (error) {
            vscode.window.showErrorMessage(t('message.fileReadError', error));
        }
    }

    /**
     * 刷新片段列表
     */
    refreshSnippets() {
        // 通过事件通知刷新，避免直接依赖 SnippetExplorerProvider
        vscode.commands.executeCommand('sniphub.internal.refresh');
        vscode.window.showInformationMessage(t('message.snippetsRefreshed'));
    }

    /**
     * 打开扩展设置
     */
    openSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', 'sniphub');
    }

    /**
     * 创建 .snip 文件
     */
    async createSnipFile() {
        await this.fileSnipHandler.createExampleSnipFile();
    }

    /**
     * 从选中内容创建 .snip 文件
     */
    async createSnipFromSelection() {
        await this.fileSnipHandler.createSnipFromSelection();
    }

    /**
     * 创建下拉菜单
     */
    async createSnippetDropdown() {
        // 定义下拉菜单选项
        const options = [
            {
                label: t('quickPick.createSnipFile.label'),
                description: t('quickPick.createSnipFile.description'),
                command: 'sniphub.createSnipFile'
            },
            {
                label: t('quickPick.createPacks.label'),
                description: t('quickPick.createPacks.description'),
                command: 'sniphub.createPacks'
            },
            // {
            //     label: t('quickPick.showSnippetManager.label'),
            //     description: t('quickPick.showSnippetManager.description'),
            //     command: 'sniphub.showSnippetManager'
            // }
        ];

        // 显示快速选择菜单
        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: t('quickPick.selectOperation'),
            matchOnDescription: true  // 允许通过描述文本进行搜索
        });

        // 执行选中的命令
        if (selected) {
            vscode.commands.executeCommand(selected.command);
        }
    }

    /**
     * 在工作区中打开文件
     * 根据片段信息中的文件路径直接打开原始文件
     */
    async openFileInWorkspace(snippet: Snippet) {
        try {
            if (!snippet.filePath) {
                vscode.window.showErrorMessage(t('message.cannotDetermineFilePath', snippet.name));
                return;
            }

            // 检查文件是否存在
            if (!await fs.pathExists(snippet.filePath)) {
                vscode.window.showErrorMessage(t('message.fileNotExists', snippet.filePath));
                return;
            }

            // 尝试打开文件
            const uri = vscode.Uri.file(snippet.filePath);
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);
        } catch (error) {
            console.error('Error opening file:', error);
            vscode.window.showErrorMessage(t('message.fileOpenError', error));
        }
    }

    /**
     * 应用片段
     * 直接将片段内容插入到当前编辑器
     */
    async applySnippet(snippet: Snippet) {
        if (!snippet || !snippet.content) {
            vscode.window.showErrorMessage(t('message.invalidSnippet'));
            return;
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage(t('message.noActiveEditor'));
            return;
        }

        const position = editor.selection.active;
        const line = editor.document.lineAt(position.line);
        const lineText = line.text;
        
        const prefix = vscode.workspace.getConfiguration('sniphub').get<string>('prefix', 'sh');

        const index = lineText.lastIndexOf(prefix + ':', position.character);
        console.log(`Line text: ${lineText}, Position: ${position.line}:${position.character}, Index: ${index}`);

        // 找到前缀，需要替换前缀以及后续的命令
        const prefixEnd = lineText.indexOf(' ', index);
        const endPos = prefixEnd !== -1 ? prefixEnd : position.character;
        
        // 创建需要替换的范围
        const replaceStart = new vscode.Position(position.line, index);
        const replaceEnd = new vscode.Position(position.line, endPos);
        const range = new vscode.Range(replaceStart, replaceEnd);
        
        try {
            // 否则使用片段内容
            await editor.edit(editBuilder => {
                editBuilder.replace(range, ''); // 先删除前缀
            });
            await editor.insertSnippet(new vscode.SnippetString(snippet.content), replaceStart);
        } catch (error) {
            console.error('Error applying snippet:', error);
            vscode.window.showErrorMessage(t('message.snippetApplyError', error));
        }
    }

}
