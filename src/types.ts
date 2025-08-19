/**
 * SnipHub 扩展的类型定义文件
 * 定义了片段、片段集等核心数据结构
 */

/**
 * 代码片段接口
 * 表示一个独立的代码片段，包含代码内容和元数据
 */
export interface Snippet {
    /** 唯一标识符 */
    id: string;
    /** 片段名称 */
    name: string;
    /** 片段显示名称 */
    displayName: string;
    /** 片段描述 */
    description: string;
    /** 代码内容 */
    content: string;
    /** 编程语言 */
    language: string;
    /** 标签数组，用于分类和搜索 */
    tags: string[];
    /** 触发前缀，用于代码补全 */
    cmd?: string;
    /** 创建时间 */
    createdAt: Date;
    /** 最后更新时间 */
    updatedAt: Date;
    /** 文件扩展名 */
    extension?: string;
    /** 原始文件路径，用于直接打开文件 */
    filePath?: string;
}

/**
 * 片段集接口
 * 表示一个包含多个文件的项目模板或相关文件集合
 */
export interface Packs {
    /** 唯一标识符 */
    id: string;
    /** 片段集名称 */
    name: string;
    /** 片段集描述 */
    description: string;
    /** 标签数组，用于分类和搜索 */
    tags: string[];
    /** 包含的文件列表 */
    files: SnippetFile[];
    /** 执行命令，应用片段集后可执行的命令 */
    executeCommand?: string;
    /** 应用脚本，应用片段集时执行的脚本 */
    applyScript?: string;
    /** 创建时间 */
    createdAt: Date;
    /** 最后更新时间 */
    updatedAt: Date;
}

/**
 * 片段文件接口
 * 表示片段集中的一个文件
 */
export interface SnippetFile {
    /** 唯一标识符 */
    id: string;
    /** 文件名 */
    name: string;
    /** 显示名称，用于用户界面 */
    displayName: string;
    /** 文件内容 */
    content: string;
    /** 文件语言类型 */
    language: string;
    
    /** 相对路径，用于应用时确定文件位置 */
    relativePath?: string;
}

/**
 * 扩展配置接口
 * 定义了用户可配置的扩展选项
 */
export interface SnipHubConfig {
    /** 片段存储位置 */
    storageLocation: string;
    /** 代码提示前缀 */
    prefix: string;
}

/**
 * 项目类型枚举
 * 用于区分不同类型的树视图项目
 */
export enum ItemType {
    /** 代码片段 */
    Snippet = 'snippet',
    /** 片段集 */
    Packs = 'packs',
    /** 片段文件 */
    SnippetFile = 'snippetFile'
}
