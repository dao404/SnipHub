import * as vscode from 'vscode';

/**
 * .snip 文件解析器
 * 支持解析带有 <set> 和 <code> 标签的 .snip 文件格式
 */
export class SnipFileParser {
    /**
     * 解析 .snip 文件内容
     * @param content .snip 文件的原始内容
     * @returns 解析后的片段对象
     */
    static parse(content: string): {
        metadata: any;
        code?: string;
        language?: string;
    } | null {
        try {
            // 匹配 <set> 标签内的 JSON 内容
            const setMatch = content.match(/<set>\s*([\s\S]*?)\s*<\/set>/);
            if (!setMatch) {
                throw new Error('Missing <set> tag');
            }

            const metadata = JSON.parse(setMatch[1]);

            // 如果是代码片段类型，匹配 <code> 标签
            if (metadata.type === 'code') {
                const codeMatch = content.match(/<code(?:\s+language=["']([^"']+)["'])?\s*>([\s\S]*?)<\/code>/);
                if (!codeMatch) {
                    throw new Error('Missing <code> tag for code snippet');
                }

                return {
                    metadata,
                    code: codeMatch[2].trim(),
                    language: codeMatch[1] || metadata.language
                };
            }

            // 片段集类型只需要元数据
            return {
                metadata
            };

        } catch (error) {
            console.error('Error parsing .snip file:', error);
            return null;
        }
    }

    /**
     * 生成 .snip 文件内容
     * @param metadata 元数据对象
     * @param code 代码内容（仅用于代码片段）
     * @param language 语言标识（可选）
     * @returns 格式化的 .snip 文件内容
     */
    static generate(metadata: any, code?: string, language?: string): string {
        let content = '<set>\n';
        content += JSON.stringify(metadata, null, 2);
        content += '\n</set>';

        if (metadata.type === 'code' && code) {
            content += '\n<code';
            if (language || metadata.language) {
                content += ` language="${language || metadata.language}"`;
            }
            content += '>\n';
            content += code;
            content += '\n</code>';
        }

        return content;
    }

    /**
     * 验证 .snip 文件格式
     * @param content 文件内容
     * @returns 验证结果
     */
    static validate(content: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // 检查 <set> 标签
        if (!content.includes('<set>') || !content.includes('</set>')) {
            errors.push('Missing <set> tags');
        }

        try {
            const parsed = this.parse(content);
            if (!parsed) {
                errors.push('Failed to parse file content');
                return { isValid: false, errors };
            }

            const { metadata } = parsed;

            // 验证必需字段
            if (!metadata.type) {
                errors.push('Missing required field: type');
            }
            if (!metadata.name) {
                errors.push('Missing required field: name');
            }
            if (!metadata.displayName) {
                errors.push('Missing required field: displayName');
            }

            // 验证类型特定字段
            if (metadata.type === 'code') {
                if (!content.includes('<code>') || !content.includes('</code>')) {
                    errors.push('Code snippet missing <code> tags');
                }
            } else if (metadata.type === 'set') {
                if (!metadata.files || !Array.isArray(metadata.files)) {
                    errors.push('Snippet set missing files array');
                }
            } else {
                errors.push(`Unknown snippet type: ${metadata.type}`);
            }

        } catch (error) {
            errors.push(`JSON parsing error: ${error}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 从现有代码创建代码片段
     * @param code 代码内容
     * @param language 语言
     * @param name 片段名称
     * @param displayName 显示名称
     * @param description 描述
     * @param tags 标签
     * @returns .snip 文件内容
     */
    static createCodeSnippet(
        code: string,
        language: string,
        name: string,
        displayName: string,
        description?: string,
        tags: string[] = []
    ): string {
        const metadata = {
            type: 'code',
            name,
            displayName,
            description: description || `${displayName} code snippet`,
            language,
            tags
        };

        return this.generate(metadata, code, language);
    }

    /**
     * 创建片段集
     * @param name 片段集名称
     * @param displayName 显示名称
     * @param description 描述
     * @param files 文件列表
     * @param tags 标签
     * @returns .snip 文件内容
     */
    static createSnippetSet(
        name: string,
        displayName: string,
        description: string,
        files: { path: string; content: string }[],
        tags: string[] = []
    ): string {
        const metadata = {
            type: 'set',
            name,
            displayName,
            description,
            tags,
            files
        };

        return this.generate(metadata);
    }
}
