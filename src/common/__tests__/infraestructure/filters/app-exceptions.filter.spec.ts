import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';
import { AppExceptionsFilter } from '@/infrastructure/filters/app-exceptions.filter';

describe('AppExceptionsFilter', () => {
  let filter: AppExceptionsFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockHttpArgumentsHost: HttpArgumentsHost;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  const mockTimestamp = '2023-01-01T00:00:00.000Z';
  const mockUrl = '/api/test';

  beforeEach(async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockTimestamp);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: mockUrl,
    };

    mockHttpArgumentsHost = {
      getResponse: jest.fn().mockReturnValue(mockResponse),
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getNext: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpArgumentsHost),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    filter = new AppExceptionsFilter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle EntityNotFoundException with 404 status', () => {
    // Arrange
    const exception = new EntityNotFoundException('User', 'id', '123');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
    expect(mockHttpArgumentsHost.getResponse).toHaveBeenCalled();
    expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      path: mockUrl,
      timestamp: mockTimestamp,
      message: exception.message,
    });
  });

  it('should handle EntityDuplicatedException with 400 status', () => {
    // Arrange
    const exception = new EntityDuplicatedException('User', 'email');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      path: mockUrl,
      timestamp: mockTimestamp,
      message: exception.message,
    });
  });

  it('should handle InvalidInputDataException with 400 status', () => {
    // Arrange
    const exception = new InvalidInputDataException('Customer', 'email is required');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      path: mockUrl,
      timestamp: mockTimestamp,
      message: exception.message,
    });
  });

  it('should handle unknown exceptions with 500 status', () => {
    // Arrange
    const exception = new Error('Unexpected error');

    // Act
    filter.catch(exception, mockArgumentsHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      path: mockUrl,
      timestamp: mockTimestamp,
      message: 'An unexpected error occurred.',
    });
  });
});
