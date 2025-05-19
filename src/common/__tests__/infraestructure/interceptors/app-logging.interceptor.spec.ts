import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { lastValueFrom, of, throwError } from 'rxjs';
import { Logger } from 'winston';

import { AppLoggingInterceptor } from '@/infrastructure/interceptors/app-logging.interceptor';

describe('AppLoggingInterceptor', () => {
  let interceptor: AppLoggingInterceptor;
  let mockLogger: jest.Mocked<Logger>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  const mockMethod = 'GET';
  const mockUrl = '/api/test';
  const mockClassName = 'TestController';

  beforeEach(async () => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: mockMethod,
          url: mockUrl,
        }),
      }),
      getClass: jest.fn().mockReturnValue({ name: mockClassName }),
    } as unknown as jest.Mocked<ExecutionContext>;

    mockCallHandler = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<CallHandler>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLoggingInterceptor,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    interceptor = module.get<AppLoggingInterceptor>(AppLoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log debug message on request', () => {
    // Arrange
    mockCallHandler.handle.mockReturnValue(of({}));

    // Act
    interceptor.intercept(mockExecutionContext, mockCallHandler);

    // Assert
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.getClass).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith(`Request: ${mockMethod} ${mockUrl}`, { context: mockClassName });
  });

  it('should log info message on successful response', async () => {
    // Arrange
    const responseData = { data: 'test' };
    mockCallHandler.handle.mockReturnValue(of(responseData));

    // Act
    const result$ = interceptor.intercept(mockExecutionContext, mockCallHandler);
    await lastValueFrom(result$);

    // Assert
    expect(mockLogger.info).toHaveBeenCalledWith(`Response: ${mockMethod} ${mockUrl}`, { context: mockClassName });
  });

  it('should log error message on exception', async () => {
    // Arrange
    const testError = new Error('Test error');
    mockCallHandler.handle.mockReturnValue(throwError(() => testError));

    // Act & Assert
    try {
      await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBe(testError);
      expect(mockLogger.error).toHaveBeenCalledWith(testError, { context: mockClassName });
    }
  });

  it('should rethrow the error after logging it', async () => {
    // Arrange
    const testError = new Error('Test error');
    mockCallHandler.handle.mockReturnValue(throwError(() => testError));

    // Act & Assert
    await expect(lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler))).rejects.toBe(testError);
  });
});
