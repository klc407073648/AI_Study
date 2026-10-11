import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * 加载组件
 * 演示可复用组件设计最佳实践
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  @Input() message = '加载中...';
  @Input() diameter = 50;
  @Input() showMessage = true;
  @Input() overlay = false;
}



