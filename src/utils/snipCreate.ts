import * as vscode from 'vscode';
import { Snippet } from '../types';
import { t } from './i18n';

export class SnipCreate {
  public static currentPanel: SnipCreate | undefined;
  private readonly _panel: vscode.WebviewPanel;
  
  public static createOrShow(extensionUri: vscode.Uri, filePath?: string) {
    const column = vscode.window.activeTextEditor?.viewColumn;
    
    if (SnipCreate.currentPanel) {
      SnipCreate.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'snippetCreator',
      t('webview.snipCreate.title'),
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri]
      }
    );

    SnipCreate.currentPanel = new SnipCreate(panel, extensionUri, filePath);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    private readonly filePath?: string
  ) {
    this._panel = panel;
    
    // 异步设置 webview 内容
    this._setWebviewContent(extensionUri);
    
    // 处理来自 Webview 的消息
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'saveSnippet':
            await this._saveSnip(message.data);
            return;
        }
      },
      undefined
    );
  }

  /**
   * 异步设置 webview 内容
   */
  private async _setWebviewContent(extensionUri: vscode.Uri): Promise<void> {
    this._panel.webview.html = await this._getHtmlForWebview(extensionUri);
  }

  private async _saveSnip(data: any) {
    // 生成 .snip 文件内容
    const snippetContent = this._generateSnippetContent(data);
    
    // 确定保存路径
    const savePath = this.filePath 
      ? vscode.Uri.file(this.filePath).with({ path: `${this.filePath}.snip` })
      : await this._getSaveLocation();
    
    // 写入文件
    await vscode.workspace.fs.writeFile(
      savePath,
      Buffer.from(snippetContent, 'utf8')
    );

    vscode.window.showInformationMessage(t('messages.snippetSaved', { path: savePath.fsPath }));
    this._panel.dispose();
  }

  private _generateSnippetContent(data: any): string {
    // 如果有variables字段，需要特殊处理
    if (data.variables) {
      return `<set>
{
  "id": "${SnipCreate.generateId()}",
  "name": "${data.name}",
  "displayName": "${data.displayName || data.name}",
  "cmd": "${data.cmd || ''}",
  "language": "${data.language}",
  "description": "${data.description}",
  "tags": [],
  "variables": ${JSON.stringify(data.variables, null, 2)},
  "createdAt": "${new Date().toISOString()}"
}
</set>

<code language="${data.language}">
${data.codeContent || ''}
</code>`;
    }
    
    // 否则使用标准的工具函数
    return SnipCreate.generateSnipFileContentFromParams({
      name: data.name,
      displayName: data.displayName || data.name,
      description: data.description || '',
      language: data.language || 'plaintext',
      content: data.codeContent || '',
      cmd: data.cmd || '',
      tags: [],
      createdAt: new Date()
    });
  }

  private async _getSaveLocation(): Promise<vscode.Uri> {
    const uri = await vscode.window.showSaveDialog({
      filters: { 'Snippet Files': ['snippet'] },
      defaultUri: vscode.Uri.file('new-snippet.snip')
    });
    
    if (!uri) throw new Error(t('errors.noSaveLocation'));
    return uri;
  }

  private async _getHtmlForWebview(extensionUri: vscode.Uri): Promise<string> {
    // 获取当前文件内容（如果是从文件创建）
    let initialCode = '';
    if (this.filePath) {
      try {
        const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(this.filePath));
        initialCode = Buffer.from(fileContent).toString('utf8');
      } catch (error) {
        console.error(t('errors.readFileFailed'), error);
      }
    }

    // 创建 Webview HTML 内容
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('webview.snipCreate.title')}</title>
      <style>
        /* 样式代码... */
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${t('webview.snipCreate.title')}</h1>

        <div class="form-group">
          <label>${t('webview.snipCreate.snippetName')}</label>
          <input type="text" id="snippetName" placeholder="${t('webview.snipCreate.snippetNamePlaceholder')}">
        </div>
        
        <div class="form-group">
          <label>${t('webview.snipCreate.snippetLanguage')}</label>
          <select id="snippetLanguage">
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>${t('webview.snipCreate.snippetDescription')}</label>
          <textarea id="snippetDescription" rows="2"></textarea>
        </div>
        
        <div class="form-group">
          <label>${t('webview.snipCreate.snippetCode')}</label>
          <textarea id="snippetCode" rows="10">${initialCode}</textarea>
        </div>
        
        <div class="variables-section">
          <h3>${t('webview.snipCreate.variablesSection')}</h3>
          <div id="variablesContainer">
            <div class="variable-item">
              <input type="text" placeholder="${t('webview.snipCreate.variableNamePlaceholder')}" class="variable-name">
              <select class="variable-transform">
                <option value="none">${t('webview.snipCreate.variableTransformNone')}</option>
                <option value="camelCase">${t('webview.snipCreate.variableTransformCamelCase')}</option>
                <option value="PascalCase">${t('webview.snipCreate.variableTransformPascalCase')}</option>
                <option value="kebab-case">${t('webview.snipCreate.variableTransformKebabCase')}</option>
                <option value="UPPER_CASE">${t('webview.snipCreate.variableTransformUpperCase')}</option>
              </select>
              <input type="text" placeholder="${t('webview.snipCreate.variableDefaultPlaceholder')}" class="variable-default">
            </div>
          </div>
          <button id="addVariable">+ ${t('webview.snipCreate.addVariable')}</button>
        </div>
        
        <div class="actions">
          <button id="saveButton">${t('webview.snipCreate.saveSnippet')}</button>
          <button id="cancelButton">${t('webview.snipCreate.cancel')}</button>
        </div>
      </div>
      
      <script>
        // Webview JavaScript 逻辑...
        const vscode = acquireVsCodeApi();
        
        document.getElementById('saveButton').addEventListener('click', () => {
          const snippetData = {
            name: document.getElementById('snippetName').value,
            language: document.getElementById('snippetLanguage').value,
            description: document.getElementById('snippetDescription').value,
            codeContent: document.getElementById('snippetCode').value,
            variables: []
          };
          
          // 收集变量信息
          document.querySelectorAll('.variable-item').forEach(item => {
            const name = item.querySelector('.variable-name').value;
            const transform = item.querySelector('.variable-transform').value;
            const defaultValue = item.querySelector('.variable-default').value;
            
            if (name) {
              snippetData.variables.push({
                name,
                transform,
                default: defaultValue
              });
            }
          });
          
          vscode.postMessage({
            command: 'saveSnippet',
            data: snippetData
          });
        });
        
        document.getElementById('addVariable').addEventListener('click', () => {
          const container = document.getElementById('variablesContainer');
          const newItem = document.createElement('div');
          newItem.className = 'variable-item';
          newItem.innerHTML = \`
            <input type="text" placeholder="${t('webview.snipCreate.variableNamePlaceholder')}" class="variable-name">
            <select class="variable-transform">
              <option value="none">${t('webview.snipCreate.variableTransformNone')}</option>
              <option value="camelCase">${t('webview.snipCreate.variableTransformCamelCase')}</option>
              <option value="PascalCase">${t('webview.snipCreate.variableTransformPascalCase')}</option>
              <option value="kebab-case">${t('webview.snipCreate.variableTransformKebabCase')}</option>
              <option value="UPPER_CASE">${t('webview.snipCreate.variableTransformUpperCase')}</option>
            </select>
            <input type="text" placeholder="${t('webview.snipCreate.variableDefaultPlaceholder')}" class="variable-default">
          \`;
          container.appendChild(newItem);
        });
      </script>
    </body>
    </html>`;
  }

  /**
   * 生成 .snip 文件的标准内容格式
   * @param snippet 片段对象
   * @returns .snip 文件的格式化内容
   */
  static generateSnipFileContent(snippet: Snippet): string {
    const config = {
      id: snippet.id,
      name: snippet.name,
      displayName: snippet.displayName || snippet.name,
      description: snippet.description,
      language: snippet.language,
      cmd: snippet.cmd || '',
      tags: snippet.tags || [],
      createdAt: snippet.createdAt.toISOString()
    };

    return `<set>
${JSON.stringify(config, null, 2)}
</set>

<code language="${snippet.language}">
${snippet.content}
</code>`;
  }

  /**
   * 生成 .snip 文件内容（基于参数对象）
   * @param params 片段参数对象
   * @returns .snip 文件的格式化内容
   */
  static generateSnipFileContentFromParams(params: {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    language?: string;
    content?: string;
    cmd?: string;
    tags?: string[];
    createdAt?: Date;
  }): string {
    // 验证必填字段
    if (!params.name || params.name.trim() === '') {
      throw new Error(t('errors.snippetNameRequired'));
    }

    const config = {
      id: params.id || SnipCreate.generateId(),
      name: params.name.trim(),
      displayName: params.displayName || params.name.trim(),
      description: params.description || '',
      language: params.language || 'plaintext',
      cmd: params.cmd || '',
      tags: params.tags || [],
      createdAt: (params.createdAt || new Date()).toISOString()
    };

    return `<set>
${JSON.stringify(config, null, 2)}
</set>

<code language="${config.language}">
${params.content || ''}
</code>`;
  }

  /**
   * 生成唯一ID
   * 使用时间戳和随机数组合生成唯一标识符
   * @returns 唯一ID字符串
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}