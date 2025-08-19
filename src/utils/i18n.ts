import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 国际化工具类
 * 负责加载和管理多语言文本
 */
export class I18n {
    private static instance: I18n;
    private translations: { [key: string]: string } = {};
    private currentLocale: string = 'zh-cn';

    private constructor(private context: vscode.ExtensionContext) {
        this.init();
    }

    /**
     * 获取单例实例
     */
    public static getInstance(context?: vscode.ExtensionContext): I18n {
        if (!I18n.instance && context) {
            I18n.instance = new I18n(context);
        }
        return I18n.instance;
    }

    /**
     * 初始化国际化
     */
    private init(): void {
        // 获取 VS Code 的语言设置
        const locale = vscode.env.language.toLowerCase();
        
        // 根据 VS Code 语言设置选择对应的语言文件
        if (locale.startsWith('zh')) {
            this.currentLocale = 'zh-cn';
        } else {
            this.currentLocale = 'en';
        }
        
        this.loadTranslations();
    }

    /**
     * 加载翻译文件
     */
    private loadTranslations(): void {
        try {
            const translationPath = path.join(
                this.context.extensionPath,
                'i18n',
                `${this.currentLocale}.json`
            );
            
            if (fs.existsSync(translationPath)) {
                const content = fs.readFileSync(translationPath, 'utf8');
                this.translations = JSON.parse(content);
            } else {
                console.warn(`Translation file not found: ${translationPath}`);
                // 如果找不到对应语言文件，回退到中文
                if (this.currentLocale !== 'zh-cn') {
                    const fallbackPath = path.join(
                        this.context.extensionPath,
                        'i18n',
                        'zh-cn.json'
                    );
                    if (fs.existsSync(fallbackPath)) {
                        const content = fs.readFileSync(fallbackPath, 'utf8');
                        this.translations = JSON.parse(content);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    /**
     * 获取翻译文本
     * @param key 翻译键
     * @param args 格式化参数
     * @returns 翻译后的文本
     */
    public t(key: string, ...args: any[]): string {
        let text = this.translations[key] || key;
        
        // 支持参数替换，如 {0}, {1} 等
        if (args.length > 0) {
            args.forEach((arg, index) => {
                text = text.replace(`{${index}}`, String(arg));
            });
        }
        
        return text;
    }

    /**
     * 获取当前语言
     */
    public getCurrentLocale(): string {
        return this.currentLocale;
    }

    /**
     * 手动切换语言（可选功能）
     */
    public switchLanguage(locale: string): void {
        this.currentLocale = locale;
        this.loadTranslations();
    }
}

/**
 * 全局翻译函数，简化调用
 * 在使用前需要先初始化 I18n.getInstance(context)
 */
export function t(key: string, ...args: any[]): string {
    return I18n.getInstance().t(key, ...args);
}
