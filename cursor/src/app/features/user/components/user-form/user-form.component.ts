import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@core/models/user.interface';
import { UserService } from '@core/services/user.service';
import { environment } from '@environments/environment';

/**
 * 用户表单组件数据接口
 */
export interface UserFormData {
  user?: User;
}

/**
 * 用户表单组件
 * 演示响应式表单最佳实践
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  loading = false;
  isEditMode = false;
  environment = environment;
  
  // 用户角色选项
  roleOptions = [
    { value: UserRole.USER, label: '普通用户' },
    { value: UserRole.MODERATOR, label: '版主' },
    { value: UserRole.ADMIN, label: '管理员' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData
  ) {
    this.isEditMode = !!this.data?.user;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化表单
   */
  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailDomainValidator
      ]],
      role: [UserRole.USER, [Validators.required]],
      isActive: [true]
    });
  }

  /**
   * 填充表单数据（编辑模式）
   */
  private populateForm(): void {
    const user = this.data.user!;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  }

  /**
   * 自定义邮箱域名验证器
   * @param control 表单控件
   * @returns 验证结果
   */
  private emailDomainValidator(control: AbstractControl): { [key: string]: any } | null {
    const email = control.value;
    if (!email) return null;

    // 允许的域名列表
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'company.com'];
    const domain = email.split('@')[1];
    
    if (domain && !allowedDomains.includes(domain.toLowerCase())) {
      return { invalidDomain: { value: domain } };
    }
    
    return null;
  }

  /**
   * 获取表单控件
   * @param controlName 控件名称
   * @returns 表单控件
   */
  getControl(controlName: string): AbstractControl {
    return this.userForm.get(controlName)!;
  }

  /**
   * 检查字段是否有错误
   * @param controlName 控件名称
   * @returns 是否有错误
   */
  hasError(controlName: string): boolean {
    const control = this.getControl(controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * 获取字段错误信息
   * @param controlName 控件名称
   * @returns 错误信息
   */
  getErrorMessage(controlName: string): string {
    const control = this.getControl(controlName);
    
    if (control.errors?.['required']) {
      return `${this.getFieldLabel(controlName)}是必填项`;
    }
    
    if (control.errors?.['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(controlName)}至少需要${requiredLength}个字符`;
    }
    
    if (control.errors?.['maxlength']) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(controlName)}不能超过${requiredLength}个字符`;
    }
    
    if (control.errors?.['email']) {
      return '请输入有效的邮箱地址';
    }
    
    if (control.errors?.['invalidDomain']) {
      const domain = control.errors['invalidDomain'].value;
      return `不支持的邮箱域名: ${domain}`;
    }
    
    return '';
  }

  /**
   * 获取字段标签
   * @param controlName 控件名称
   * @returns 字段标签
   */
  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      name: '姓名',
      email: '邮箱',
      role: '角色',
      isActive: '状态'
    };
    return labels[controlName] || controlName;
  }

  /**
   * 提交表单
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.cdr.markForCheck();

      const formValue = this.userForm.value;
      
      if (this.isEditMode) {
        this.updateUser(formValue);
      } else {
        this.createUser(formValue);
      }
    } else {
      // 标记所有字段为已触摸，以显示验证错误
      this.markFormGroupTouched();
    }
  }

  /**
   * 创建用户
   * @param userData 用户数据
   */
  private createUser(userData: CreateUserRequest): void {
    this.userService.createUser(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newUser) => {
          console.log('用户创建成功:', newUser);
          this.dialogRef.close(newUser);
        },
        error: (error) => {
          console.error('创建用户失败:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * 更新用户
   * @param userData 用户数据
   */
  private updateUser(userData: UpdateUserRequest): void {
    const userId = this.data.user!.id;
    
    this.userService.updateUser(userId, userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          console.log('用户更新成功:', updatedUser);
          this.dialogRef.close(updatedUser);
        },
        error: (error) => {
          console.error('更新用户失败:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * 标记表单组为已触摸
   */
  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * 取消操作
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * 重置表单
   */
  onReset(): void {
    this.userForm.reset();
    this.userForm.patchValue({
      role: UserRole.USER,
      isActive: true
    });
  }

  /**
   * 获取所有表单错误（用于调试）
   * @returns 表单错误对象
   */
  getFormErrors(): Record<string, ValidationErrors | null> {
    const errors: Record<string, ValidationErrors | null> = {};
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
