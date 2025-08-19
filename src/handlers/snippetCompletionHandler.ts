import * as vscode from 'vscode';
import { SnippetManager } from '../core/snippetManager';
import { Snippet, SnipHubConfig } from '../types';
import { t } from '../utils';

/**
 * 代码片段补全提供者
 * 负责提供 sh: 前缀的代码片段补全功能
 */
export class SnippetCompletionHandler {
    constructor(private snippetManager: SnippetManager) {}

    /**
     * 注册补全提供者
     */
    register(context: vscode.ExtensionContext): void {
        const completionProvider = vscode.languages.registerCompletionItemProvider(
            { pattern: '**' }, // 支持所有文件类型
            {
                provideCompletionItems: this.provideCompletionItems.bind(this),
                resolveCompletionItem: this.resolveCompletionItem.bind(this) // 添加这一行
            },
            ':' // 触发字符
        );
        context.subscriptions.push(completionProvider);
    }

    /**
     * 提供补全项
     */
    private async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        
        // 获取用户配置的前缀
        const config = vscode.workspace.getConfiguration('sniphub') as vscode.WorkspaceConfiguration & SnipHubConfig;
        const prefix = config.prefix || 'sh';
        
        // 检查是否匹配 prefix: 格式
        const prefixMatch = new RegExp(`\\b${prefix}:`).exec(linePrefix);
        if (!prefixMatch) {
            return [];
        }

        // 获取所有可用片段
        const snippets = await this.snippetManager.loadAllSnippets();
        if (!snippets.length) {
            return [];
        }

        // 获取已输入的搜索文本
        const searchText = linePrefix.slice(prefixMatch.index + prefixMatch[0].length).toLowerCase();
        // 创建补全项
        return snippets
            .filter(snippet => this.matchesSnippet(snippet, searchText))
            .map(snippet => this.createCompletionItem(snippet, prefixMatch[0]));
    }

    /**
     * 检查片段是否匹配搜索文本
     */
    private matchesSnippet(snippet: Snippet, searchText: string): boolean {
        if (!searchText) return true;
        
        const search = searchText.toLowerCase();
        return (
            snippet.name.toLowerCase().includes(search) ||
            snippet.displayName.toLowerCase().includes(search) ||
            snippet.description.toLowerCase().includes(search) ||
            snippet.tags.some(tag => tag.toLowerCase().includes(search))
        );
    }

    /**
     * 创建补全项
     */
    private createCompletionItem(snippet: Snippet, prefix: string): vscode.CompletionItem {
        const item = new vscode.CompletionItem(snippet.name, vscode.CompletionItemKind.Snippet);
        
        item.detail = snippet.displayName;
        item.documentation = new vscode.MarkdownString()
            .appendMarkdown(snippet.description || t('message.noDescription'))
            .appendMarkdown('\n\n---\n\n')
            .appendCodeblock(snippet.content, snippet.language);
        
        if (snippet.tags.length) {
            item.documentation.appendMarkdown(`\n\ntags: ${snippet.tags.join(', ')}`);
        }

        // 设置补全文本，替换包括前缀的整个输入
        item.insertText = snippet.content;
        item.range = new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, prefix.length + snippet.name.length)
        );
        item.command = {
            command: 'sniphub.importSnippet',
            title: 'Import Snippet',
            arguments: [snippet] // 传递片段内容作为参数
        };
        console.log(`item: ${JSON.stringify(item)}`);
        return item;
    }

    private async resolveCompletionItem(
        item: vscode.CompletionItem,
        token: vscode.CancellationToken
    ): Promise<vscode.CompletionItem> {
        console.log(`Resolving completion item: ${item}`);
        // 添加选中后的处理逻辑
        item.command = {
            command: 'sniphub.onSnippetInserted', // 自定义命令
            title: 'Snippet Inserted',
            arguments: [item.insertText] // 传递参数给命令处理器
        };

        // 可以在这里添加更多的处理逻辑
        // 比如更新使用统计、添加最近使用记录等

        return item;
    }
}
