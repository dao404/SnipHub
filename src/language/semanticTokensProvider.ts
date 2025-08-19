import * as vscode from 'vscode';
import { extractCode, applyLanguageHighlighting } from '../utils/fileProcessing';

/**
 * 语义标记提供器
 * 为 .snip 文件提供语法高亮支持
 */
export class SemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    /**
     * 注册语义标记提供器
     */
    static register(context: vscode.ExtensionContext): void {
        const provider = new SemanticTokensProvider();
        const registration = vscode.languages.registerDocumentSemanticTokensProvider(
            { language: 'snip' },
            provider,
            new vscode.SemanticTokensLegend(['keyword', 'string', 'number', 'comment', 'operator'], [])
        );
        context.subscriptions.push(registration);
    }

    /**
     * 提供文档语义标记
     */
    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.SemanticTokens {
        const tokensBuilder = new vscode.SemanticTokensBuilder();
        const text = document.getText();

        // 检测 <code> 块并应用语言高亮（基于每个块的 language 属性）
        const codeRes = extractCode(text, 'code');
        const language = codeRes.language || 'plaintext';
        codeRes.blocks.forEach(block => {
            const startPos = document.positionAt(block.startIndex);
            const endPos = document.positionAt(block.endIndex);
            applyLanguageHighlighting(tokensBuilder, document, startPos, endPos, language);
        });

        return tokensBuilder.build();
    }
}
