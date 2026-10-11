import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { Title } from '@angular/platform-browser';

/**
 * 根组件
 * 演示应用级组件最佳实践
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular学习项目';
  currentRoute = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.setupRouterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 设置路由订阅
   */
  private setupRouterSubscription(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updatePageTitle(event.url);
      });
  }

  /**
   * 更新页面标题
   * @param url 当前URL
   */
  private updatePageTitle(url: string): void {
    let title = this.title;
    
    if (url.includes('/users')) {
      title = '用户管理 - ' + title;
    }
    
    this.titleService.setTitle(title);
  }
}
