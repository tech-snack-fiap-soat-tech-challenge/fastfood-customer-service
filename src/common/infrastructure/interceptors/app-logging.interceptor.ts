import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppLoggingInterceptor<T = unknown> implements NestInterceptor<T, T> {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    this.logger.debug(`Request: ${method} ${url}`, { context: context.getClass().name });

    return next.handle().pipe(
      tap(() => {
        this.logger.info(`Response: ${method} ${url}`, { context: context.getClass().name });
      }),
      catchError((error) => {
        this.logger.error(error, { context: context.getClass().name });

        return throwError(() => error);
      }),
    );
  }
}
