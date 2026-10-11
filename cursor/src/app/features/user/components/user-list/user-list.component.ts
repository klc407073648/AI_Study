import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef,
  TrackByFunction
} from '@angular/core';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User, UserRole } from '@core/models/user.interface';
import { UserService } from '@core/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

/**
 * 用户列表组件
 * 演示组件开发最佳实践
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  searchTerm = '';
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    // 配置搜索防抖
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.searchUsers();
      });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 加载用户列表
   */
  loadUsers(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.userService.getUsers({ limit: 50 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('加载用户列表失败:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * 搜索用户
   */
  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    this.userService.searchUsers(this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('搜索用户失败:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * 处理搜索输入
   * @param event 输入事件
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  /**
   * 打开用户表单对话框
   * @param user 用户对象（编辑时传入，新增时为空）
   */
  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { user },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadUsers(); // 刷新列表
        }
      });
  }

  /**
   * 删除用户
   * @param user 要删除的用户
   */
  deleteUser(user: User): void {
    if (confirm(`确定要删除用户 "${user.name}" 吗？`)) {
      this.userService.deleteUser(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('用户删除成功');
            this.loadUsers(); // 刷新列表
          },
          error: (error) => {
            console.error('删除用户失败:', error);
          }
        });
    }
  }

  /**
   * 获取用户角色显示文本
   * @param role 用户角色
   * @returns 角色显示文本
   */
  getRoleDisplayText(role: UserRole): string {
    const roleMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: '管理员',
      [UserRole.USER]: '普通用户',
      [UserRole.MODERATOR]: '版主'
    };
    return roleMap[role] || '未知';
  }

  /**
   * 获取用户状态显示文本
   * @param isActive 用户状态
   * @returns 状态显示文本
   */
  getStatusDisplayText(isActive: boolean): string {
    return isActive ? '活跃' : '禁用';
  }

  /**
   * 获取用户状态CSS类
   * @param isActive 用户状态
   * @returns CSS类名
   */
  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  /**
   * TrackBy函数优化*ngFor性能
   * @param index 索引
   * @param user 用户对象
   * @returns 唯一标识符
   */
  trackByUserId: TrackByFunction<User> = (index: number, user: User): number => {
    return user.id;
  };
}



