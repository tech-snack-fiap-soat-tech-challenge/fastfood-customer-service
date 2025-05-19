import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

@Catch(Error)
export class AppExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    switch (exception.constructor) {
      case EntityNotFoundException:
        response.status(404).json({
          statusCode: 404,
          path: request.url,
          timestamp: new Date().toISOString(),
          message: exception.message,
        });
        break;

      case EntityDuplicatedException:
        response.status(400).json({
          statusCode: 400,
          path: request.url,
          timestamp: new Date().toISOString(),
          message: exception.message,
        });
        break;

      case InvalidInputDataException:
        response.status(400).json({
          statusCode: 400,
          path: request.url,
          timestamp: new Date().toISOString(),
          message: exception.message,
        });
        break;

      default:
        response.status(500).json({
          statusCode: 500,
          path: request.url,
          timestamp: new Date().toISOString(),
          message: 'An unexpected error occurred.',
        });
        break;
    }
  }
}
