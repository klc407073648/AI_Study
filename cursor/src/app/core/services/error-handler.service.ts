import { Injectable, ErrorHandler } from '@angular/core';
import { environment } from '@environments/environment';

/**
 * 全局错误处理器
 * 演示错误处理最佳实践
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('全局错误:', error);
    
    // 在开发环境中显示详细错误信息
    if (environment.enableLogging) {
      console.group('🚨 错误详情');
      console.error('错误类型:', error.constructor.name);
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
      console.groupEnd();
    }

    // 发送错误到日志服务（生产环境）
    if (environment.production) {
      this.logErrorToService(error);
    }

    // 显示用户友好的错误消息
    this.showUserFriendlyMessage(error);
  }

  /**
   * 记录错误到日志服务
   * @param error 错误对象
   */
  private logErrorToService(error: any): void {
    // 这里可以集成第三方日志服务，如Sentry
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // 发送到日志服务
    // this.loggingService.logError(errorInfo);
  }

  /**
   * 显示用户友好的错误消息
   * @param error 错误对象
   */
  private showUserFriendlyMessage(error: any): void {
    let userMessage = '抱歉，发生了意外错误，请稍后重试';
    
    if (error.message?.includes('网络')) {
      userMessage = '网络连接异常，请检查网络设置';
    } else if (error.message?.includes('权限')) {
      userMessage = '权限不足，请联系管理员';
    } else if (error.message?.includes('超时')) {
      userMessage = '请求超时，请稍后重试';
    }

    // 这里可以显示Toast通知或模态框
    console.warn('用户友好提示:', userMessage);
  }
}



