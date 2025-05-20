import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppExceptionsFilter } from '@/infrastructure/filters/app-exceptions.filter';
import { AppLoggingInterceptor } from '@/infrastructure/interceptors/app-logging.interceptor';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppLoggingInterceptor,
    },
  ],
})
export class CommonModule {}
