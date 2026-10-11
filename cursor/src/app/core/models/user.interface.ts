/**
 * 用户接口定义
 * 演示TypeScript接口使用最佳实践
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

/**
 * 用户创建请求接口
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

/**
 * 用户更新请求接口
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * 用户列表响应接口
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 用户查询参数接口
 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}



