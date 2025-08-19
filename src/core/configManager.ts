import * as vscode from 'vscode';

/**
 * 配置管理器
 * 负责管理扩展的配置项
 */
export class ConfigManager {
    private static readonly EXTENSION_ID = 'sniphub';

    /**
     * 获取片段存储位置
     */
    static getStorageLocation(): string {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<string>('storageLocation', '.vscode/SnipHub');
    }


    /**
     * 设置片段存储位置
     */
    static async setStorageLocation(location: string): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        await config.update('storageLocation', location, vscode.ConfigurationTarget.Workspace);
    }


    static getPrefix(): string {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        return config.get<string>('prefix', 'sh');
    }

    /**
     * 设置代码提示前缀
     */
    static async setPrefix(prefix: string): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.EXTENSION_ID);
        await config.update('prefix', prefix, vscode.ConfigurationTarget.Workspace);
    }

    /**
     * 监听配置变化
     */
    static onConfigurationChanged(callback: (e: vscode.ConfigurationChangeEvent) => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(callback);
    }
}
