# Angular学习项目

这是一个基于 `.cursorrules` 规则构建的Angular前端项目，用于学习和演示Angular开发最佳实践。

## 🎯 项目特性

### 📋 遵循的规则
- **TypeScript严格模式**: 使用严格的类型检查
- **OnPush变更检测**: 提高应用性能
- **响应式表单**: 完整的表单验证和处理
- **RxJS最佳实践**: 正确的订阅管理和错误处理
- **模块化架构**: 清晰的代码组织结构
- **Material Design**: 现代化的UI组件库

### 🏗️ 项目结构
```
src/
├── app/
│   ├── core/                 # 核心模块
│   │   ├── services/         # 核心服务
│   │   ├── models/           # 数据模型
│   │   └── index.ts          # 导出文件
│   ├── shared/               # 共享模块
│   │   ├── components/       # 共享组件
│   │   └── index.ts          # 导出文件
│   ├── features/             # 功能模块
│   │   └── user/             # 用户管理功能
│   │       ├── components/   # 功能组件
│   │       ├── user.module.ts
│   │       ├── user-routing.module.ts
│   │       └── index.ts      # 导出文件
│   ├── app.component.*       # 根组件
│   ├── app.module.ts         # 根模块
│   └── app-routing.module.ts # 路由配置
├── environments/             # 环境配置
└── assets/                   # 静态资源
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- Angular CLI >= 17.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

访问 [http://localhost:4200](http://localhost:4200) 查看应用。

### 构建项目
```bash
# 开发环境构建
npm run build

# 生产环境构建
npm run build --configuration=production
```

### 运行测试
```bash
# 单元测试
npm test

# 代码检查
npm run lint
```

## 📚 学习内容

### 1. 组件开发最佳实践
- **OnPush变更检测策略**: 在 `user-list.component.ts` 中演示
- **生命周期管理**: 正确的 `ngOnInit` 和 `ngOnDestroy` 实现
- **TrackBy函数**: 优化 `*ngFor` 性能
- **组件通信**: `@Input` 和 `@Output` 的使用

### 2. 服务层设计
- **HTTP服务**: `api.service.ts` 展示通用API调用模式
- **状态管理**: `user.service.ts` 演示服务层状态管理
- **错误处理**: 统一的错误处理机制
- **依赖注入**: 正确的服务注入和使用

### 3. 表单处理
- **响应式表单**: `user-form.component.ts` 完整示例
- **表单验证**: 内置和自定义验证器
- **错误处理**: 友好的错误信息显示
- **表单状态管理**: 加载、提交、重置状态

### 4. 路由和导航
- **懒加载**: 功能模块的懒加载配置
- **路由守卫**: 页面访问控制
- **路由参数**: 类型安全的路由参数处理

### 5. 样式和UI
- **Material Design**: 现代化UI组件
- **响应式设计**: 移动端适配
- **CSS架构**: 组件化样式组织
- **主题系统**: CSS变量和主题管理

### 6. 测试策略
- **单元测试**: 组件和服务的测试示例
- **测试覆盖率**: 保持80%以上的覆盖率
- **模拟数据**: 测试数据的组织和管理

## 🔧 配置说明

### TypeScript配置
- 严格模式启用
- 路径别名配置
- 编译选项优化

### ESLint配置
- Angular专用规则
- TypeScript规则
- 代码质量检查

### 环境配置
- 开发环境配置
- 生产环境配置
- API端点管理

## 📖 核心规则演示

### 1. 组件开发规则
```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // OnPush策略
})
export class ExampleComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Output() dataChange = new EventEmitter<any>();
  
  private destroy$ = new Subject<void>();  // 订阅管理
  
  // 生命周期管理
  ngOnInit(): void { /* ... */ }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. 服务开发规则
```typescript
@Injectable({
  providedIn: 'root'  // 单例服务
})
export class ApiService {
  constructor(private http: HttpClient) {}
  
  getData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        retry(2),                    // 重试机制
        catchError(this.handleError) // 错误处理
      );
  }
}
```

### 3. 表单处理规则
```typescript
export class FormComponent {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
```

## 🎨 UI组件演示

### 用户列表页面
- 响应式卡片布局
- 搜索和筛选功能
- 加载状态管理
- 空状态处理

### 用户表单对话框
- 完整的表单验证
- 实时错误提示
- 加载状态指示
- 调试信息面板

## 🧪 测试示例

项目包含完整的测试示例：
- 服务层单元测试
- 组件单元测试
- 模拟数据和断言
- 异步操作测试

## 📱 响应式设计

- 移动端优先设计
- 断点适配
- 触摸友好交互
- 性能优化

## 🔍 调试和开发

### 开发工具
- Angular DevTools
- 浏览器开发者工具
- 控制台日志
- 调试信息面板

### 错误处理
- 全局错误处理器
- 用户友好错误信息
- 开发环境详细日志
- 生产环境错误上报

## 📈 性能优化

- OnPush变更检测
- TrackBy函数优化
- 懒加载模块
- Bundle优化
- 虚拟滚动（待实现）

## 🔐 安全性

- XSS防护
- CSRF保护
- 输入验证
- 安全的API调用

## 🌐 国际化准备

- i18n配置
- 多语言支持
- RTL语言支持
- 本地化格式

## 📝 代码质量

- ESLint规则
- Prettier格式化
- 代码审查清单
- 持续集成准备

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

感谢Angular团队和社区提供的优秀框架和工具。

---

**注意**: 这是一个学习项目，展示了基于 `.cursorrules` 的Angular开发最佳实践。在生产环境中使用前，请根据具体需求进行调整和优化。



