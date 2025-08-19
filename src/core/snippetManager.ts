import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Snippet, Packs, SnipHubConfig } from '../types';
import { SnipCreate } from '../utils/snipCreate';

export class SnippetManager {
    private readonly context: vscode.ExtensionContext;
    private readonly storageDir: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.storageDir = this.getStorageDirectory();
        // 不在构造函数中自动创建目录，而是在需要时才创建
    }

    private getStorageDirectory(): string {
        const config = vscode.workspace.getConfiguration('sniphub') as vscode.WorkspaceConfiguration & SnipHubConfig;
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        
        if (workspaceFolder) {
            return path.join(workspaceFolder.uri.fsPath, config.storageLocation);
        } else {
            // 如果没有工作区，使用扩展的全局存储目录
            return path.join(this.context.globalStorageUri.fsPath, 'snippets');
        }
    }

    /**
     * 确保存储目录存在
     * 创建必要的目录结构：snippets（JSON格式）、packs（片段集）、snip（.snip格式）
     * 只在真正需要保存文件时才调用，避免创建无用的目录
     */
    private async ensureStorageDirectory(): Promise<void> {
        try {
            await fs.ensureDir(this.storageDir);
            // 直接使用配置的存储目录，不再创建二级目录
            await fs.ensureDir(this.storageDir);  // 添加 snip 目录
        } catch (error) {
            vscode.window.showErrorMessage(`创建存储目录失败: ${error}`);
        }
    }

    /**
     * 保存代码片段到存储目录
     * 将片段对象序列化为 JSON 格式并保存到 snippets 目录
     * @param snippet 要保存的片段对象
     */
    async saveSnippet(snippet: Snippet): Promise<void> {
        try {
            // 确保存储目录存在（只在保存时创建）
            await this.ensureStorageDirectory();
            
            const snippetPath = path.join(this.storageDir, `${snippet.name}.snip`);
            await fs.writeFile(snippetPath, SnipCreate.generateSnipFileContent(snippet), { encoding: 'utf8' });
            vscode.window.showInformationMessage(`片段 "${snippet.name}" 已保存`);
        } catch (error) {
            vscode.window.showErrorMessage(`保存片段失败: ${error}`);
            throw error;
        }
    }

    /**
     * 保存片段集到存储目录
     * 将片段集对象序列化为 JSON 格式并保存到 packs 目录
     * @param packs 要保存的片段集对象
     */
    async savePacks(packs: Packs): Promise<void> {
        try {
            // 确保存储目录存在（只在保存时创建）
            await this.ensureStorageDirectory();
            
            const packsPath = path.join(this.storageDir, `${packs.id}.pack.json`);
            await fs.writeJson(packsPath, packs, { spaces: 2 });
            vscode.window.showInformationMessage(`片段集 "${packs.name}" 已保存`);
        } catch (error) {
            vscode.window.showErrorMessage(`保存片段集失败: ${error}`);
            throw error;
        }
    }

    /**
     * 加载所有片段，包括 JSON 文件和 .snip 文件
     * 扫描 snippets 目录和 snip 子目录中的所有片段文件
     * @returns 按更新时间排序的片段数组
     */
    async loadAllSnippets(): Promise<Snippet[]> {
        try {
            const snippets: Snippet[] = [];

            // 加载 snip 目录下的所有文件，包括所有子目录
            const snipDir = path.join(this.storageDir, 'snip');
            if (await fs.pathExists(snipDir)) {
                // 递归加载所有子目录中的所有文件
                await this.loadSnippetsFromDirectory(snipDir, snippets);
            }

            return snippets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } catch (error) {
            console.error('加载片段失败:', error);
            return [];
        }
    }
    
    /**
     * 递归加载目录中的所有文件
     * @param directory 要扫描的目录路径
     * @param snippets 用于存储加载的片段的数组
     */
    private async loadSnippetsFromDirectory(directory: string, snippets: Snippet[]): Promise<void> {
        try {
            const entries = await fs.readdir(directory, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(directory, entry.name);
                
                if (entry.isDirectory()) {
                    // 递归处理子目录
                    await this.loadSnippetsFromDirectory(fullPath, snippets);
                } else if (entry.isFile()) {
                    // 处理所有文件
                    if (entry.name.endsWith('.snip')) {
                        // 处理 .snip 文件
                        const snippet = await this.parseSnipFile(fullPath);
                        if (snippet) {
                            snippets.push(snippet);
                        }
                    } else {
                        // 处理其他类型的文件
                        const snippet = await this.processRegularFile(fullPath);
                        if (snippet) {
                            snippets.push(snippet);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`加载目录 ${directory} 中的片段失败:`, error);
        }
    }

    /**
     * 加载所有片段集
     * 扫描 packs 目录中的所有 JSON 文件并反序列化为片段集对象
     * @returns 按更新时间排序的片段集数组
     */
    async loadAllPacks(): Promise<Packs[]> {
        try {
            const packsDir = path.join(this.storageDir, 'packs');
            if (!await fs.pathExists(packsDir)) {
                return [];
            }
            
            const files = await fs.readdir(packsDir);
            const packs: Packs[] = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(packsDir, file);
                    const pack = await fs.readJson(filePath) as Packs;
                    packs.push(pack);
                }
            }

            return packs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } catch (error) {
            console.error('加载片段集失败:', error);
            return [];
        }
    }

    /**
     * 删除指定的代码片段
     * 从 snippets 目录中删除对应的 JSON 文件
     * @param id 要删除的片段ID
     */
    async deleteSnippet(id: string): Promise<void> {
        try {
            const snippetPath = path.join(this.storageDir, 'snippets', `${id}.json`);
            await fs.remove(snippetPath);
            vscode.window.showInformationMessage('片段已删除');
        } catch (error) {
            vscode.window.showErrorMessage(`删除片段失败: ${error}`);
            throw error;
        }
    }

    /**
     * 删除指定的片段集
     * 从 packs 目录中删除对应的 JSON 文件
     * @param id 要删除的片段集ID
     */
    async deletePacks(id: string): Promise<void> {
        try {
            const packsPath = path.join(this.storageDir, 'packs', `${id}.json`);
            await fs.remove(packsPath);
            vscode.window.showInformationMessage('片段集已删除');
        } catch (error) {
            vscode.window.showErrorMessage(`删除片段集失败: ${error}`);
            throw error;
        }
    }

    /**
     * 解析 .snip 文件
     * 从 .snip 文件中提取 <code> 和 <set> 标签内容，创建片段对象
     * @param filePath .snip 文件的完整路径
     * @returns 解析后的片段对象，解析失败返回 null
     */
    private async parseSnipFile(filePath: string): Promise<Snippet | null> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            
            // 解析 <code> 和 <set> 标签，支持从 <code> 的 language 属性解析语言
            const codeMatch = content.match(/<code(?:\s+language=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/code>/);
            const setMatch = content.match(/<set[^>]*>([\s\S]*?)<\/set>/);
            console.log(`codeMatch0: ${codeMatch ? codeMatch[0] : 'null'}, codeMatch1: ${codeMatch ? codeMatch[1] : 'null'}, codeMatch2: ${codeMatch ? codeMatch[2] : 'null'}`);
            if (!codeMatch || !setMatch) {
                console.warn(`文件 ${filePath} 格式不正确，缺少 <code> 或 <set> 标签`);
                return null;
            }
            
            const codeLanguageFromTag = (codeMatch[1] || '').trim();
            const codeContent = codeMatch[2].trim();
            let snippetConfig;
            
            try {
                snippetConfig = JSON.parse(setMatch[1].trim());
            } catch (error) {
                console.error(`文件 ${filePath} 中的 <set> 配置格式错误:`, error);
                return null;
            }
            
            // 获取文件统计信息
            const stats = await fs.stat(filePath);
            const fileName = path.basename(filePath, '.snip');
            
            // 语言优先级：<code language> > <set>.language > 'plaintext'
            const resolvedLanguage = codeLanguageFromTag || snippetConfig.language || 'plaintext';
            
            // 创建片段对象
            const snippet: Snippet = {
                id: snippetConfig.id || this.generateId(),
                name: snippetConfig.name || fileName,
                displayName: snippetConfig.displayName || fileName,
                description: snippetConfig.description || '',
                content: codeContent,
                language: resolvedLanguage,
                tags: snippetConfig.tags || [],
                cmd: snippetConfig.cmd || '',
                createdAt: new Date(snippetConfig.createdAt || stats.birthtime),
                updatedAt: new Date(stats.mtime),
                extension: 'snip', // 添加扩展名信息
                filePath: filePath // 保存原始文件路径
            };
            
            return snippet;
        } catch (error) {
            console.error(`解析 .snip 文件失败: ${filePath}`, error);
            return null;
        }
    }

    /**
     * 处理常规文件（非 .snip 格式）
     * 直接读取文件内容并创建片段对象
     * @param filePath 文件的完整路径
     * @returns 创建的片段对象，失败返回 null
     */
    private async processRegularFile(filePath: string): Promise<Snippet | null> {
        try {
            // 读取文件内容
            const content = await fs.readFile(filePath, 'utf-8');
            
            // 获取文件信息
            const stats = await fs.stat(filePath);
            const fileName = path.basename(filePath);
            const fileExt = path.extname(filePath).slice(1); // 去掉扩展名前的点
            
            // 根据文件扩展名判断语言
            let language = 'plaintext';
            
            // 常见文件扩展名到语言的映射
            const langMap: Record<string, string> = {
                'js': 'javascript',
                'ts': 'typescript',
                'jsx': 'javascriptreact',
                'tsx': 'typescriptreact',
                'html': 'html',
                'css': 'css',
                'scss': 'scss',
                'sass': 'sass',
                'less': 'less',
                'json': 'json',
                'md': 'markdown',
                'py': 'python',
                'java': 'java',
                'c': 'c',
                'cpp': 'cpp',
                'cs': 'csharp',
                'go': 'go',
                'php': 'php',
                'rb': 'ruby',
                'rs': 'rust',
                'sh': 'shell',
                'bat': 'bat',
                'ps1': 'powershell',
                'sql': 'sql',
                'xml': 'xml',
                'yaml': 'yaml',
                'yml': 'yaml'
            };
            
            // 根据扩展名获取语言
            if (fileExt && fileExt in langMap) {
                language = langMap[fileExt];
            }
            
            // 创建片段对象
            const snippet: Snippet = {
                id: this.generateId(),
                name: fileName,
                displayName: fileName,
                description: `File from ${path.relative(this.storageDir, filePath)}`,
                content: content,
                language: language,
                tags: [fileExt], // 使用扩展名作为标签
                cmd: '',
                createdAt: new Date(stats.birthtime),
                updatedAt: new Date(stats.mtime),
                extension: fileExt, // 保存文件扩展名
                filePath: filePath // 保存原始文件路径
            };
            
            return snippet;
        } catch (error) {
            console.error(`处理文件失败: ${filePath}`, error);
            return null;
        }
    }

    /**
     * 生成唯一ID
     * 使用时间戳和随机数组合生成唯一标识符
     * @returns 唯一ID字符串
     */
    generateId(): string {
        return SnipCreate.generateId();
    }

    /**
     * 获取存储目录路径
     * 返回当前配置的片段存储目录完整路径
     * @returns 存储目录的绝对路径
     */
    getStorageDirectoryPath(): string {
        return this.storageDir;
    }
}
