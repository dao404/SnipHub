import * as vscode from 'vscode';
import { SnippetManager } from '../core/snippetManager';
import { processSnipFile } from '../utils/fileProcessing';

/**
 * 文件监视器处理器
 * 负责监听 .snip 文件的变化并处理相应的事件
 */
export class FileWatcherHandler {
    private fileWatcher?: vscode.FileSystemWatcher;

    constructor(private snippetManager: SnippetManager) {}

    /**
     * 注册文件监视器
     */
    register(context: vscode.ExtensionContext): void {
        // 监听 .snip 文件变化事件
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.snip');
        
        context.subscriptions.push(
            this.fileWatcher,
            this.fileWatcher.onDidCreate(this.onFileCreated.bind(this)),
            this.fileWatcher.onDidChange(this.onFileChanged.bind(this)),
            this.fileWatcher.onDidDelete(this.onFileDeleted.bind(this))
        );

        // 在扩展激活时扫描现有的 .snip 文件
        this.scanExistingFiles();
    }

    /**
     * 处理文件创建事件
     */
    private async onFileCreated(uri: vscode.Uri): Promise<void> {
        console.log(`检测到新的 .snip 文件: ${uri.fsPath}`);
        await processSnipFile(uri, this.snippetManager);
        this.notifyRefresh();
    }

    /**
     * 处理文件修改事件
     */
    private async onFileChanged(uri: vscode.Uri): Promise<void> {
        console.log(`检测到 .snip 文件变化: ${uri.fsPath}`);
        await processSnipFile(uri, this.snippetManager);
        this.notifyRefresh();
    }

    /**
     * 处理文件删除事件
     */
    private onFileDeleted(uri: vscode.Uri): void {
        console.log(`检测到 .snip 文件删除: ${uri.fsPath}`);
        this.notifyRefresh();
    }

    /**
     * 扫描现有的 .snip 文件
     */
    private async scanExistingFiles(): Promise<void> {
        setTimeout(async () => {
            console.log('开始扫描现有的 .snip 文件...');
            const snipFiles = await vscode.workspace.findFiles('**/*.snip', '**/node_modules/**');
            for (const file of snipFiles) {
                await processSnipFile(file, this.snippetManager);
            }
            if (snipFiles.length > 0) {
                this.notifyRefresh();
                console.log(`已扫描 ${snipFiles.length} 个 .snip 文件`);
            }
        }, 1000); // 延迟1秒执行，确保其他组件已初始化完成
    }

    /**
     * 通知刷新片段列表
     */
    private notifyRefresh(): void {
        vscode.commands.executeCommand('sniphub.internal.refresh');
    }
}
