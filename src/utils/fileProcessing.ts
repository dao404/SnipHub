import * as vscode from 'vscode';
import { SnippetManager } from '../core/snippetManager';

/**
 * 处理 .snip 文件的解析和加载
 * @param uri .snip 文件的 URI
 * @param snippetManager 片段管理器实例
 */
export async function processSnipFile(uri: vscode.Uri, snippetManager: SnippetManager): Promise<void> {
    try {
        // 读取 .snip 文件内容
        const document = await vscode.workspace.openTextDocument(uri);
        const content = document.getText();
        
        // 解析文件内容为片段格式
        // 这里需要根据 .snip 文件的具体格式来解析
        // 暂时作为占位符实现
        console.log(`正在处理 .snip 文件: ${uri.fsPath}`);
        
        // TODO: 实现具体的 .snip 文件解析逻辑
        // 可能需要解析 JSON 格式或其他特定格式
        
    } catch (error) {
        console.error(`处理 .snip 文件失败: ${uri.fsPath}`, error);
        vscode.window.showErrorMessage(`处理 .snip 文件失败: ${error}`);
    }
}

/**
 * 提取代码块的实用函数
 * @param text 源文本
 * @param type 代码块类型
 */
export function extractCode(text: string, type: string): { blocks: any[], language?: string } {
    const blocks: any[] = [];
    const regex = new RegExp(`<${type}[^>]*>([\\s\\S]*?)</${type}>`, 'gi');
    const languageRegex = /<code[^>]+language=["']([^"']+)["'][^>]*>/i;
    const language = text.match(languageRegex);
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        blocks.push({
            content: match[1],
            startIndex: match.index,
            endIndex: match.index + match[0].length
        });
    }

    return { blocks, language: language ? language[1] : 'plaintext' };
}

/**
 * 应用语言高亮的实用函数
 * @param builder 语义标记构建器
 * @param document 文档
 * @param start 开始位置
 * @param end 结束位置
 * @param language 语言类型
 */
export function applyLanguageHighlighting(
    builder: vscode.SemanticTokensBuilder,
    document: vscode.TextDocument,
    start: vscode.Position,
    end: vscode.Position,
    language: string
): void {
    // 语法高亮现在由 TextMate 语法处理
    // 这个函数保持为空，或者你可以在这里添加额外的语义高亮逻辑
}