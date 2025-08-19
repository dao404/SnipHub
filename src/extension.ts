import * as vscode from 'vscode';

// 导入核心模块
import { SnippetManager } from './core/snippetManager';
import { ConfigManager } from './core/configManager';

// 导入视图模块
import { SnippetExplorerProvider } from './views/snippetExplorer';
import { SnippetWebviewProvider } from './views/webviewProvider';

// 导入处理器模块
import { FileSnipHandler } from './handlers/fileSnipHandler';
import { FileWatcherHandler } from './handlers/fileWatcherHandler';
import { SnippetCompletionHandler } from './handlers/snippetCompletionHandler';

// 导入命令模块
import { registerCommands } from './commands/commandRegistry';
import { CommandHandler } from './commands/commandHandler';

// 导入语言支持模块
import { SemanticTokensProvider } from './language/semanticTokensProvider';

// 导入国际化工具
import { I18n, t } from './utils/i18n';

/**
 * 扩展激活函数
 * 当 VS Code 检测到激活事件时调用此函数
 * 负责初始化所有组件并注册命令和事件监听器
 * @param context VS Code 扩展上下文，提供扩展生命周期管理
 */
export function activate(context: vscode.ExtensionContext) {
    // 初始化国际化
    I18n.getInstance(context);
    console.log(t('message.extensionActivated'));

    // 初始化核心组件
    const snippetManager = new SnippetManager(context);
    
    // 初始化视图组件
    const snippetExplorerProvider = new SnippetExplorerProvider(snippetManager);
    vscode.window.createTreeView('sniphub.snippetExplorer', {
        treeDataProvider: snippetExplorerProvider,
        showCollapseAll: true
    });

    const webviewProvider = new SnippetWebviewProvider(context, snippetManager);

    // 初始化处理器组件
    const fileSnipHandler = new FileSnipHandler(context, snippetManager.getStorageDirectoryPath());

    const fileWatcherHandler = new FileWatcherHandler(snippetManager);
    const snippetCompletionHandler = new SnippetCompletionHandler(snippetManager);

    // 初始化命令处理器
    const commandHandler = new CommandHandler(
        context,
        snippetManager,
        webviewProvider,
        fileSnipHandler
    );

    // 注册所有组件
    registerCommands(context, commandHandler);

    fileWatcherHandler.register(context);
    snippetCompletionHandler.register(context);
    SemanticTokensProvider.register(context);

    // 注册内部刷新命令，用于各组件间通信
    const internalRefreshCommand = vscode.commands.registerCommand('sniphub.internal.refresh', () => {
        snippetExplorerProvider.refresh();
    });
    context.subscriptions.push(internalRefreshCommand);

    // 监听配置变化事件
    const configChangeListener = ConfigManager.onConfigurationChanged((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration('sniphub')) {
            snippetExplorerProvider.refresh();
        }
    });
    context.subscriptions.push(configChangeListener);
}

/**
 * 扩展停用函数
 * 当扩展被停用时调用，用于清理资源
 */
export function deactivate() {
    console.log(t('message.extensionDeactivated'));
}
