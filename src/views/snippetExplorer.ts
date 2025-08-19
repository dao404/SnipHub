import * as vscode from 'vscode';
import { SnippetManager } from '../core/snippetManager';
import { Snippet, Packs, ItemType } from '../types';
import { t } from '../utils/i18n';

/**
 * SnipHub 侧边栏树视图数据提供者
 * 负责构建和管理片段资源管理器的树结构
 * 实现 VS Code 的 TreeDataProvider 接口
 */
export class SnippetExplorerProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
    /** 树数据变化事件发射器，用于通知 VS Code 刷新树视图 */
    private _onDidChangeTreeData: vscode.EventEmitter<SnippetTreeItem | undefined | null | void> = new vscode.EventEmitter<SnippetTreeItem | undefined | null | void>();
    
    /** 树数据变化事件，VS Code 会监听此事件来更新界面 */
    readonly onDidChangeTreeData: vscode.Event<SnippetTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * 构造函数
     * @param snippetManager 片段管理器实例，用于获取片段数据
     */
    constructor(private snippetManager: SnippetManager) {}

    /**
     * 刷新树视图
     * 触发树数据变化事件，使 VS Code 重新渲染整个树
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * 获取树项目的显示信息
     * VS Code 会调用此方法来获取每个树节点的显示属性
     * @param element 树项目元素
     * @returns 返回 VS Code 树项目对象
     */
    getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
        return element;
    }

    /**
     * 获取树节点的子项目
     * 这是构建树结构的核心方法，VS Code 会递归调用此方法构建完整的树
     * @param element 父节点元素，如果为 undefined 则表示获取根节点
     * @returns 子节点数组的 Promise
     */
    async getChildren(element?: SnippetTreeItem): Promise<SnippetTreeItem[]> {
        // 根节点：返回两个主分类
        if (!element) {
            return [
                new SnippetTreeItem(
                    t('treeView.snippets'),
                    vscode.TreeItemCollapsibleState.Expanded,  // 默认展开
                    ItemType.Snippet,
                    undefined,
                    'snippet-category'  // 上下文值，用于标识节点类型
                ),
                new SnippetTreeItem(
                    t('treeView.packs'),
                    vscode.TreeItemCollapsibleState.Expanded,  // 默认展开
                    ItemType.Packs,
                    undefined,
                    'packs-category'  // 上下文值，用于标识节点类型
                )
            ];
        }

        // 代码片段分类节点：返回所有代码片段
        if (element.contextValue === 'snippet-category') {
            const snippets = await this.snippetManager.loadAllSnippets();
            return snippets.map(snippet => 
                new SnippetTreeItem(
                    snippet.displayName + " (" + snippet.name + " - " + snippet.language + ")",
                    vscode.TreeItemCollapsibleState.None,  // 片段项目不可展开
                    ItemType.Snippet,
                    snippet,  // 将片段数据传递给树项目
                    'snippet-item'
                )
            );
        }

        // 片段集分类节点：返回所有片段集
        if (element.contextValue === 'packs-category') {
            const packs = await this.snippetManager.loadAllPacks();
            return packs.map(packs => 
                new SnippetTreeItem(
                    packs.name,
                    vscode.TreeItemCollapsibleState.Collapsed,  // 片段集默认折叠，点击后展开文件列表
                    ItemType.Packs,
                    packs,  // 将片段集数据传递给树项目
                    'packs-item'
                )
            );
        }

        // 片段集项目节点：返回片段集中的所有文件
        if (element.contextValue === 'packs-item' && element.data) {
            const packs = element.data as Packs;
            return packs.files.map(file => 
                new SnippetTreeItem(
                    file.displayName,
                    vscode.TreeItemCollapsibleState.None,  // 文件项目不可展开
                    ItemType.SnippetFile,
                    file,  // 将文件数据传递给树项目
                    'snippet-file-item'
                )
            );
        }

        // 默认情况：返回空数组
        return [];
    }
}

/**
 * 树视图中的单个项目类
 * 继承自 VS Code 的 TreeItem 类，表示树中的一个节点
 * 每个节点可以是分类、片段、片段集或文件
 */
export class SnippetTreeItem extends vscode.TreeItem {
    /**
     * 构造函数
     * @param label 显示的标签文本
     * @param collapsibleState 折叠状态（可展开、已折叠、不可折叠）
     * @param itemType 项目类型（片段、片段集、文件等）
     * @param data 关联的数据对象（可选）
     * @param contextValue 上下文值，用于菜单显示和命令执行的条件判断
     */
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly itemType: ItemType,
        public readonly data?: Snippet | Packs | any,
        public readonly contextValue?: string
    ) {
        // 调用父类构造函数
        super(label, collapsibleState);

        // 设置树项目的各种显示属性
        this.tooltip = this.getTooltip();        // 鼠标悬停时显示的提示文本
        this.description = this.getDescription(); // 项目右侧显示的描述文本
        this.iconPath = this.getIcon();          // 项目图标
        this.contextValue = contextValue;        // 上下文值，用于右键菜单等

        // 为片段和片段集添加点击命令
        // 当用户点击这些项目时，会打开片段管理器
        if (contextValue === 'snippet-item' || contextValue === 'packs-item') {
            this.command = {
                command: 'sniphub.showSnippetManager',  // 要执行的命令ID
                title: '查看详情',                          // 命令标题
                arguments: [this.data]                     // 传递给命令的参数
            };
        }
    }

    /**
     * 获取鼠标悬停时显示的提示文本
     * @returns 包含名称和描述的提示字符串
     */
    private getTooltip(): string {
        if (this.data) {
            const item = this.data as Snippet | Packs;
            return `${item.name}\n${item.description || ''}`;
        }
        return this.label;
    }

    /**
     * 获取项目右侧显示的描述文本
     * 主要显示标签信息，如果有标签则显示标签列表
     * @returns 描述字符串，通常是标签的逗号分隔列表
     */
    private getDescription(): string {
        if (this.data) {
            const item = this.data as Snippet | Packs;
            if (item.tags && item.tags.length > 0) {
                return item.tags.join(', ');
            }
        }
        return '';
    }

    /**
     * 根据项目类型获取对应的图标
     * 使用 VS Code 内置的主题图标，确保与编辑器主题一致
     * @returns VS Code 主题图标对象
     */
    private getIcon(): vscode.ThemeIcon {
        switch (this.contextValue) {
            case 'snippet-category':
                return new vscode.ThemeIcon('code');           // 代码图标 - 代表代码片段分类
            case 'packs-category':
                return new vscode.ThemeIcon('folder');         // 文件夹图标 - 代表片段集分类
            case 'snippet-item':
                return new vscode.ThemeIcon('symbol-snippet'); // 片段图标 - 代表单个代码片段
            case 'packs-item':
                return new vscode.ThemeIcon('folder-opened');  // 打开的文件夹图标 - 代表片段集
            case 'snippet-file-item':
                return new vscode.ThemeIcon('file');           // 文件图标 - 代表片段集中的文件
            default:
                return new vscode.ThemeIcon('question');       // 问号图标 - 未知类型的默认图标
        }
    }
}
