import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Snippet } from '../types';
import { SnipCreate } from '../utils/snipCreate';

/**
 * 文件片段处理器
 * 负责处理 .snip 文件的创建、监听和解析
 * 提供用户手动创建 .snip 文件的支持功能
 */
export class FileSnipHandler {
    private readonly context: vscode.ExtensionContext;
    private readonly storageDir: string;

    constructor(context: vscode.ExtensionContext, storageDir: string) {
        this.context = context;
        this.storageDir = storageDir;
    }

    /**
     * 创建示例 .snip 文件
     * 在 snip 目录下创建一个示例文件，帮助用户了解格式
     * @param name 文件名（不包含扩展名）
     * @param displayName 显示名称
     * @param language 编程语言
     * @param cmd 命令（可选）
     * @param content 代码内容
     * @param description 描述
     */
    async createExampleSnipFile(
        name: string = 'example' + Date.now(),
        displayName: string = '示例片段' + Date.now(),
        language: string = 'javascript',
        content: string = 'console.log("Hello, SnipHub!");',
        cmd: string = '',
        description: string = '这是一个示例代码片段'
    ): Promise<void> {
        try {
            const snipDir = path.join(this.storageDir, 'snip');
            // 只在创建文件时才确保目录存在
            await fs.ensureDir(snipDir);

            const fileName = `${name}.snip`;
            const filePath = path.join(snipDir, fileName);

            // 检查文件是否已存在
            if (await fs.pathExists(filePath)) {
                const choice = await vscode.window.showWarningMessage(
                    `文件 ${fileName} 已存在，是否覆盖？`,
                    '覆盖', '取消'
                );
                if (choice !== '覆盖') {
                    return;
                }
            }

            // 生成 .snip 文件内容
            const snipContent = SnipCreate.generateSnipFileContentFromParams({
                name: name,
                displayName: displayName,
                description: description,
                language: language,
                content: content,
                cmd: cmd,
                tags: [],
                createdAt: new Date()
            });
            
            await fs.writeFile(filePath, snipContent, 'utf-8');
            
            // 打开文件供用户编辑
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
            
            vscode.window.showInformationMessage(`已创建示例 .snip 文件: ${fileName}`);
        } catch (error) {
            vscode.window.showErrorMessage(`创建 .snip 文件失败: ${error}`);
        }
    }

    /**
     * 验证 .snip 文件格式
     * 检查文件是否包含必需的 <code> 和 <set> 标签
     * @param filePath 文件路径
     * @returns 验证结果和错误信息
     */
    async validateSnipFile(filePath: string): Promise<{ valid: boolean; error?: string }> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            
            const codeMatch = content.match(/<code[^>]*>([\s\S]*?)<\/code>/);
            const setMatch = content.match(/<set[^>]*>([\s\S]*?)<\/set>/);
            
            if (!codeMatch) {
                return { valid: false, error: '缺少 <code> 标签' };
            }
            
            if (!setMatch) {
                return { valid: false, error: '缺少 <set> 标签' };
            }
            
            try {
                JSON.parse(setMatch[1].trim());
            } catch (error) {
                return { valid: false, error: `<set> 标签中的 JSON 格式错误: ${error}` };
            }
            
            return { valid: true };
        } catch (error) {
            return { valid: false, error: `读取文件失败: ${error}` };
        }
    }

    /**
     * 从选中文本创建 .snip 文件
     * 基于当前编辑器中的选中内容创建新的 .snip 文件
     */
    async createSnipFromSelection(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('没有活动的编辑器');
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage('请先选择要创建片段的代码');
            return;
        }

        const selectedText = editor.document.getText(selection);
        const languageId = editor.document.languageId;

        // 请求用户输入片段名称
        const name = await vscode.window.showInputBox({
            prompt: '请输入片段名称',
            placeHolder: '例如: my-snippet',
            validateInput: (value) => {
                if (!value.trim()) {
                    return '片段名称不能为空';
                }
                if (!/^[a-zA-Z0-9\-_\s]+$/.test(value)) {
                    return '片段名称只能包含字母、数字、连字符、下划线和空格';
                }
                return null;
            }
        });

        if (!name) {
            return;
        }

        // 请求用户输入描述
        const description = await vscode.window.showInputBox({
            prompt: '请输入片段描述（可选）',
            placeHolder: '例如: 这是一个示例代码片段'
        });

        await this.createExampleSnipFile(
            name.trim(),
            name.trim(),
            languageId,
            selectedText,
            '',  // cmd 参数为空
            description || ''  // description 参数
        );
    }
}
