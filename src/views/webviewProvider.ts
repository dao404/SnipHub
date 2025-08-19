import * as vscode from 'vscode';
import { SnippetManager } from '../core/snippetManager';
import { Snippet, Packs, SnippetFile } from '../types';

export class SnippetWebviewProvider {
    private readonly context: vscode.ExtensionContext;
    private readonly snippetManager: SnippetManager;
    private currentPanel: vscode.WebviewPanel | undefined;

    constructor(context: vscode.ExtensionContext, snippetManager: SnippetManager) {
        this.context = context;
        this.snippetManager = snippetManager;
    }

    public showSnippetManager(): void {
        if (this.currentPanel) {
            this.currentPanel.reveal();
            return;
        }

        this.currentPanel = vscode.window.createWebviewPanel(
            'sniphubManager',
            'SnipHub 管理器',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.currentPanel.webview.html = this.getWebviewContent('manager');
        this.setupWebviewMessageHandling();

        this.currentPanel.onDidDispose(() => {
            this.currentPanel = undefined;
        });
    }

    public showCreatePacks(): void {
        this.showWebview('createPacks', '创建片段集');
    }

    public showAddFileToPacks(content: string, fileName: string, language: string): void {
        this.showWebview('addFileToPacks', '添加文件到片段集', { content, fileName, language });
    }

    private showWebview(type: string, title: string, data?: any): void {
        if (this.currentPanel) {
            this.currentPanel.reveal();
        } else {
            this.currentPanel = vscode.window.createWebviewPanel(
                'sniphub',
                title,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            this.currentPanel.onDidDispose(() => {
                this.currentPanel = undefined;
            });
        }

        this.currentPanel.webview.html = this.getWebviewContent(type, data);
        this.setupWebviewMessageHandling();
    }

    private setupWebviewMessageHandling(): void {
        if (!this.currentPanel) {
            return;
        }

        this.currentPanel.webview.onDidReceiveMessage(async (message: any) => {
            switch (message.command) {
                case 'saveSnippet':
                    await this.handleSaveSnippet(message.data);
                    break;
                case 'savePacks':
                    await this.handleSavePacks(message.data);
                    break;
                case 'loadSnippets':
                    await this.handleLoadSnippets();
                    break;
                case 'loadPacks':
                    await this.handleLoadPacks();
                    break;
                case 'deleteSnippet':
                    await this.handleDeleteSnippet(message.id);
                    break;
                case 'deletePacks':
                    await this.handleDeletePacks(message.id);
                    break;
            }
        });
    }

    private async handleSaveSnippet(data: any): Promise<void> {
        try {
            const snippet: Snippet = {
                id: this.snippetManager.generateId(),
                name: data.name,
                displayName: data.displayName || '',
                description: data.description || '',
                content: data.content,
                language: data.language,
                tags: data.tags || [],
                cmd: data.cmd,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await this.snippetManager.saveSnippet(snippet);
            this.sendMessage({ command: 'snippetSaved', success: true });
        } catch (error) {
            this.sendMessage({ command: 'snippetSaved', success: false, error: String(error) });
        }
    }

    private async handleSavePacks(data: any): Promise<void> {
        try {
            const packs: Packs = {
                id: this.snippetManager.generateId(),
                name: data.name,
                description: data.description || '',
                tags: data.tags || [],
                files: data.files || [],
                executeCommand: data.executeCommand,
                applyScript: data.applyScript,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await this.snippetManager.savePacks(packs);
            this.sendMessage({ command: 'packsaved', success: true });
        } catch (error) {
            this.sendMessage({ command: 'packsaved', success: false, error: String(error) });
        }
    }

    private async handleLoadSnippets(): Promise<void> {
        try {
            const snippets = await this.snippetManager.loadAllSnippets();
            this.sendMessage({ command: 'snippetsLoaded', data: snippets });
        } catch (error) {
            this.sendMessage({ command: 'snippetsLoaded', success: false, error: String(error) });
        }
    }

    private async handleLoadPacks(): Promise<void> {
        try {
            const packs = await this.snippetManager.loadAllPacks();
            this.sendMessage({ command: 'packsLoaded', data: packs });
        } catch (error) {
            this.sendMessage({ command: 'packsLoaded', success: false, error: String(error) });
        }
    }

    private async handleDeleteSnippet(id: string): Promise<void> {
        try {
            await this.snippetManager.deleteSnippet(id);
            this.sendMessage({ command: 'snippetDeleted', success: true, id });
        } catch (error) {
            this.sendMessage({ command: 'snippetDeleted', success: false, error: String(error) });
        }
    }

    private async handleDeletePacks(id: string): Promise<void> {
        try {
            await this.snippetManager.deletePacks(id);
            this.sendMessage({ command: 'packsDeleted', success: true, id });
        } catch (error) {
            this.sendMessage({ command: 'packsDeleted', success: false, error: String(error) });
        }
    }

    private sendMessage(message: any): void {
        if (this.currentPanel) {
            this.currentPanel.webview.postMessage(message);
        }
    }

    private getWebviewContent(type: string, data?: any): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnipHub</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
        }
        textarea {
            height: 150px;
            resize: vertical;
        }
        .code-textarea {
            height: 300px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .button-group {
            margin-top: 20px;
        }
        .tabs {
            display: flex;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }
        .tab.active {
            border-bottom-color: var(--vscode-focusBorder);
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .snippet-list {
            list-style: none;
            padding: 0;
        }
        .snippet-item {
            padding: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: var(--vscode-panel-background);
        }
        .snippet-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .snippet-description {
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
        }
        .snippet-tags {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .snippet-actions {
            display: flex;
            gap: 10px;
        }
        .delete-button {
            background-color: var(--vscode-errorForeground);
        }
        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .toolbar h1 {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        ${this.getContentByType(type, data)}
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        ${this.getScriptByType(type)}
    </script>
</body>
</html>`;
    }

    private getContentByType(type: string, data?: any): string {
        switch (type) {
            case 'manager':
                return this.getManagerContent();
            case 'createPacks':
                return this.getCreatePacksContent();
            case 'addFileToPacks':
                return this.getAddFileToPacksContent(data);
            default:
                return '<h1>未知页面</h1>';
        }
    }

    private getManagerContent(): string {
        return `
            <div class="toolbar">
                <h1>SnipHub 管理器</h1>
                <div>
                    <button onclick="createPacks()">创建片段集</button>
                    <button onclick="refreshData()">刷新</button>
                </div>
            </div>
            
            <div class="tabs">
                <div class="tab active" onclick="switchTab('snip')">代码片段</div>
                <div class="tab" onclick="switchTab('packs')">片段集</div>
            </div>
            
            <div id="snippets-tab" class="tab-content active">
                <ul id="snip-list" class="snip-list">
                    <li>加载中...</li>
                </ul>
            </div>
            
            <div id="packs-tab" class="tab-content">
                <ul id="packs-list" class="packs-list">
                    <li>加载中...</li>
                </ul>
            </div>
        `;
    }

    private getCreatePacksContent(): string {
        return `
            <div class="toolbar">
                <h1>创建片段集</h1>
            </div>
            
            <form id="snippet-set-form">
                <div class="form-group">
                    <label for="displayName">片段集名称*</label>
                    <input type="text" id="displayName" name="displayName" required>
                </div>
                
                <div class="form-group">
                    <label for="description">描述</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="executeCommand">执行命令</label>
                    <input type="text" id="executeCommand" name="executeCommand" placeholder="例如: npm start">
                </div>
                
                <div class="form-group">
                    <label for="applyScript">应用脚本</label>
                    <textarea id="applyScript" name="applyScript" placeholder="片段集应用时执行的脚本"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="tags">标签（逗号分隔）</label>
                    <input type="text" id="tags" name="tags" placeholder="例如: template, project, boilerplate">
                </div>
                
                <div class="button-group">
                    <button type="submit">保存片段集</button>
                    <button type="button" onclick="window.close()">取消</button>
                </div>
            </form>
        `;
    }

    private getAddFileToPacksContent(data: any): string {
        return `
            <div class="toolbar">
                <h1>添加文件到片段集</h1>
            </div>
            
            <p>文件: <strong>${data.fileName}</strong></p>
            
            <form id="add-file-form">
                <div class="form-group">
                    <label for="packselect">选择片段集</label>
                    <select id="packselect" name="packsId" required>
                        <option value="">正在加载片段集...</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>文件内容预览</label>
                    <textarea readonly class="code-textarea">${this.escapeHtml(data?.content || '')}</textarea>
                </div>
                
                <div class="button-group">
                    <button type="submit">添加到片段集</button>
                    <button type="button" onclick="window.close()">取消</button>
                </div>
            </form>
        `;
    }

    private getScriptByType(type: string): string {
        switch (type) {
            case 'manager':
                return this.getManagerScript();
            case 'createPacks':
                return this.getCreatepackscript();
            case 'addFileToPacks':
                return this.getAddFileTopackscript();
            default:
                return '';
        }
    }

    private getManagerScript(): string {
        return `
            function switchTab(tabName) {
                document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                document.querySelector(\`[onclick="switchTab('\${tabName}')"]\`).classList.add('active');
                document.getElementById(tabName + '-tab').classList.add('active');
            }
            
            function createPacks() {
                vscode.postMessage({ command: 'createPacks' });
            }
            
            function refreshData() {
                loadSnippets();
                loadPacks();
            }
            
            function loadSnippets() {
                vscode.postMessage({ command: 'loadSnippets' });
            }
            
            function loadPacks() {
                vscode.postMessage({ command: 'loadPacks' });
            }
            
            function deleteSnippet(id) {
                if (confirm('确定要删除这个片段吗？')) {
                    vscode.postMessage({ command: 'deleteSnippet', id });
                }
            }
            
            function deletePacks(id) {
                if (confirm('确定要删除这个片段集吗？')) {
                    vscode.postMessage({ command: 'deletePacks', id });
                }
            }
            
            // 监听来自扩展的消息
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'snippetsLoaded':
                        displaySnippets(message.data);
                        break;
                    case 'packsLoaded':
                        displayPacks(message.data);
                        break;
                    case 'snippetDeleted':
                        if (message.success) {
                            loadSnippets();
                        }
                        break;
                    case 'packsDeleted':
                        if (message.success) {
                            loadPacks();
                        }
                        break;
                }
            });
            
            function displaySnippets(snippets) {
                const list = document.getElementById('snip-list');
                if (snippets.length === 0) {
                    list.innerHTML = '<li>暂无代码片段</li>';
                    return;
                }
                
                list.innerHTML = snippets.map(snippet => \`
                    <li class="snippet-item">
                        <div class="snippet-title">\${snippet.name}</div>
                        <div class="snippet-description">\${snippet.description || '无描述'}</div>
                        <div class="snippet-tags">
                            \${snippet.tags.map(tag => \`<span class="tag">\${tag}</span>\`).join('')}
                        </div>
                        <div class="snippet-actions">
                            <button onclick="deleteSnippet('\${snippet.id}')" class="delete-button">删除</button>
                        </div>
                    </li>
                \`).join('');
            }
            
            function displayPacks(packs) {
                const list = document.getElementById('packs-list');
                if (packs.length === 0) {
                    list.innerHTML = '<li>暂无片段集</li>';
                    return;
                }
                
                list.innerHTML = packs.map(packs => \`
                    <li class="snippet-item">
                        <div class="snippet-title">\${packs.name}</div>
                        <div class="snippet-description">\${packs.description || '无描述'}</div>
                        <div class="snippet-tags">
                            \${packs.tags.map(tag => \`<span class="tag">\${tag}</span>\`).join('')}
                        </div>
                        <div>文件数量: \${packs.files.length}</div>
                        <div class="snippet-actions">
                            <button onclick="deletePacks('\${packs.id}')" class="delete-button">删除</button>
                        </div>
                    </li>
                \`).join('');
            }
            
            // 页面加载时获取数据
            loadSnippets();
            loadPacks();
        `;
    }

    private getCreatepackscript(): string {
        return `
            document.getElementById('snippet-set-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    executeCommand: formData.get('executeCommand'),
                    applyScript: formData.get('applyScript'),
                    tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                    files: []
                };
                
                vscode.postMessage({ command: 'savePacks', data });
            });
            
            // 监听保存结果
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'packsaved') {
                    if (message.success) {
                        alert('片段集保存成功！');
                        document.getElementById('snippet-set-form').reset();
                    } else {
                        alert('保存失败: ' + message.error);
                    }
                }
            });
        `;
    }

    private getAddFileTopackscript(): string {
        return `
            // 加载片段集列表
            vscode.postMessage({ command: 'loadPacks' });
            
            // 监听片段集加载结果
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'packsLoaded') {
                    const select = document.getElementById('packselect');
                    if (message.data.length === 0) {
                        select.innerHTML = '<option value="">暂无片段集，请先创建</option>';
                    } else {
                        select.innerHTML = '<option value="">请选择片段集</option>' +
                            message.data.map(set => \`<option value="\${set.id}">\${set.name}</option>\`).join('');
                    }
                }
            });
            
            document.getElementById('add-file-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('添加文件到片段集功能正在开发中...');
            });
        `;
    }

    private escapeHtml(text: string): string {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
