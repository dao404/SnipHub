/**
 * SnipHub 测试项目 - TypeScript 工具类
 */

/**
 * 用户接口定义
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    active: boolean;
}

/**
 * 项目设置接口定义
 */
export interface ProjectSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    autoSave: boolean;
}

/**
 * 用户工具类
 */
export class UserUtils {
    /**
     * 获取用户全名
     * @param user 用户对象
     * @returns 格式化的用户全名
     */
    static getFullName(user: User): string {
        return `${user.name} (${user.role})`;
    }
    
    /**
     * 判断用户是否有管理权限
     * @param user 用户对象
     * @returns 是否有管理权限
     */
    static hasAdminRights(user: User): boolean {
        return user.role === 'admin' && user.active;
    }
    
    /**
     * 创建新用户
     * @param name 用户名
     * @param email 电子邮箱
     * @param role 用户角色
     * @returns 新的用户对象
     */
    static createUser(name: string, email: string, role: User['role'] = 'user'): User {
        return {
            id: Math.floor(Math.random() * 10000),
            name,
            email,
            role,
            active: true
        };
    }
}

/**
 * 工具函数 - 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
        const targetValue = (result as any)[key];
        const sourceValue = (source as any)[key];
        
        if (isObject(targetValue) && isObject(sourceValue)) {
            (result as any)[key] = deepMerge(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
            (result as any)[key] = sourceValue;
        }
    });
    
    return result;
}

/**
 * 判断值是否为对象
 * @param value 要检查的值
 * @returns 是否为对象
 */
function isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 格式化日期
 * @param date 日期对象
 * @param format 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
