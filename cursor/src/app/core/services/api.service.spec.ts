import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiService } from './api.service';
import { environment } from '@environments/environment';

/**
 * API服务单元测试
 * 演示服务测试最佳实践
 */
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET请求', () => {
    it('应该成功发送GET请求', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = 'test';

      service.get(endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('应该在网络错误时处理错误', () => {
      const endpoint = 'test';
      const errorMessage = '网络错误';

      service.get(endpoint).subscribe({
        next: () => fail('应该抛出错误'),
        error: (error) => {
          expect(error.message).toContain('网络错误');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      req.flush(errorMessage, { 
        status: 500, 
        statusText: 'Server Error' 
      });
    });
  });

  describe('POST请求', () => {
    it('应该成功发送POST请求', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = 'test';
      const requestData = { name: 'Test' };

      service.post(endpoint, requestData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(requestData);
      req.flush(mockData);
    });
  });

  describe('PUT请求', () => {
    it('应该成功发送PUT请求', () => {
      const mockData = { id: 1, name: 'Updated' };
      const endpoint = 'test/1';
      const requestData = { name: 'Updated' };

      service.put(endpoint, requestData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(requestData);
      req.flush(mockData);
    });
  });

  describe('DELETE请求', () => {
    it('应该成功发送DELETE请求', () => {
      const endpoint = 'test/1';

      service.delete(endpoint).subscribe(data => {
        expect(data).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('错误处理', () => {
    it('应该处理HTTP错误响应', () => {
      const endpoint = 'test';
      
      service.get(endpoint).subscribe({
        next: () => fail('应该抛出错误'),
        error: (error) => {
          expect(error.message).toContain('服务器错误');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      req.flush('Error', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });

    it('应该处理客户端错误', () => {
      const endpoint = 'test';
      
      service.get(endpoint).subscribe({
        next: () => fail('应该抛出错误'),
        error: (error) => {
          expect(error.message).toContain('客户端错误');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/${endpoint}`);
      req.error(new ErrorEvent('Network error'));
    });
  });
});



