import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { UserListComponent } from './user-list.component';
import { UserService } from '@core/services/user.service';
import { User, UserRole } from '@core/models/user.interface';

/**
 * 用户列表组件单元测试
 * 演示组件测试最佳实践
 */
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: UserRole.ADMIN,
      isActive: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers', 'deleteUser', 'searchUsers'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('组件初始化', () => {
    it('应该在初始化时加载用户列表', () => {
      userService.getUsers.and.returnValue(of({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 50
      }));

      component.ngOnInit();

      expect(userService.getUsers).toHaveBeenCalledWith({ limit: 50 });
      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBeFalse();
    });

    it('应该在加载失败时处理错误', () => {
      const error = new Error('加载失败');
      userService.getUsers.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(component.loading).toBeFalse();
    });
  });

  describe('搜索功能', () => {
    beforeEach(() => {
      userService.getUsers.and.returnValue(of({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 50
      }));
      component.ngOnInit();
    });

    it('应该处理搜索输入', () => {
      const searchResults = [mockUsers[0]];
      userService.searchUsers.and.returnValue(of(searchResults));

      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', {
        value: '张三',
        writable: false
      });

      component.onSearchInput(inputEvent);

      expect(component.searchTerm).toBe('张三');
    });

    it('应该在搜索词为空时重新加载所有用户', () => {
      userService.getUsers.and.returnValue(of({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 50
      }));

      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', {
        value: '',
        writable: false
      });

      component.onSearchInput(inputEvent);

      expect(userService.getUsers).toHaveBeenCalled();
    });
  });

  describe('用户操作', () => {
    beforeEach(() => {
      userService.getUsers.and.returnValue(of({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 50
      }));
      component.ngOnInit();
    });

    it('应该打开用户表单对话框', () => {
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      dialog.open.and.returnValue(mockDialogRef);

      component.openUserForm();

      expect(dialog.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          width: '600px',
          disableClose: true
        })
      );
    });

    it('应该删除用户', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      userService.deleteUser.and.returnValue(of(undefined));
      userService.getUsers.and.returnValue(of({
        users: [mockUsers[1]],
        total: 1,
        page: 1,
        limit: 50
      }));

      component.deleteUser(mockUsers[0]);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it('应该在用户取消确认时跳过删除', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteUser(mockUsers[0]);

      expect(userService.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('工具方法', () => {
    it('应该返回正确的角色显示文本', () => {
      expect(component.getRoleDisplayText(UserRole.USER)).toBe('普通用户');
      expect(component.getRoleDisplayText(UserRole.ADMIN)).toBe('管理员');
      expect(component.getRoleDisplayText(UserRole.MODERATOR)).toBe('版主');
    });

    it('应该返回正确的状态显示文本', () => {
      expect(component.getStatusDisplayText(true)).toBe('活跃');
      expect(component.getStatusDisplayText(false)).toBe('禁用');
    });

    it('应该返回正确的状态CSS类', () => {
      expect(component.getStatusClass(true)).toBe('status-active');
      expect(component.getStatusClass(false)).toBe('status-inactive');
    });

    it('应该正确实现trackBy函数', () => {
      expect(component.trackByUserId(0, mockUsers[0])).toBe(1);
      expect(component.trackByUserId(1, mockUsers[1])).toBe(2);
    });
  });

  describe('生命周期', () => {
    it('应该在组件销毁时清理订阅', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});



