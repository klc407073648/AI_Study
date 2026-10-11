import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserListResponse, 
  UserQueryParams 
} from '../models/user.interface';

/**
 * 用户服务
 * 演示服务层最佳实践和状态管理
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // 公共Observable，供组件订阅
  public readonly users$ = this.usersSubject.asObservable();
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns Observable<UserListResponse>
   */
  getUsers(params: UserQueryParams = {}): Observable<UserListResponse> {
    const queryString = this.buildQueryString(params);
    
    return this.apiService.get<UserListResponse>(`users${queryString}`)
      .pipe(
        tap(response => {
          // 更新本地状态
          this.usersSubject.next(response.users);
        })
      );
  }

  /**
   * 根据ID获取用户
   * @param id 用户ID
   * @returns Observable<User>
   */
  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`users/${id}`)
      .pipe(
        tap(user => {
          // 更新当前用户状态
          this.currentUserSubject.next(user);
        })
      );
  }

  /**
   * 创建用户
   * @param userData 用户数据
   * @returns Observable<User>
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.apiService.post<User>('users', userData)
      .pipe(
        tap(newUser => {
          // 更新本地用户列表
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next([...currentUsers, newUser]);
        })
      );
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param userData 更新数据
   * @returns Observable<User>
   */
  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, userData)
      .pipe(
        tap(updatedUser => {
          // 更新本地状态
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.map(user => 
            user.id === id ? updatedUser : user
          );
          this.usersSubject.next(updatedUsers);
          
          // 如果是当前用户，也更新当前用户状态
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.id === id) {
            this.currentUserSubject.next(updatedUser);
          }
        })
      );
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns Observable<void>
   */
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`users/${id}`)
      .pipe(
        tap(() => {
          // 从本地状态中移除用户
          const currentUsers = this.usersSubject.value;
          const filteredUsers = currentUsers.filter(user => user.id !== id);
          this.usersSubject.next(filteredUsers);
          
          // 如果是当前用户，清空当前用户状态
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.id === id) {
            this.currentUserSubject.next(null);
          }
        })
      );
  }

  /**
   * 搜索用户
   * @param searchTerm 搜索词
   * @returns Observable<User[]>
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    if (!searchTerm.trim()) {
      return this.users$;
    }
    
    return this.users$.pipe(
      map(users => 
        users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * 获取当前用户
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * 设置当前用户
   * @param user 用户对象
   */
  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * 构建查询字符串
   * @param params 查询参数
   * @returns 查询字符串
   */
  private buildQueryString(params: UserQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.role) queryParams.set('role', params.role);
    if (params.isActive !== undefined) queryParams.set('isActive', params.isActive.toString());
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}



