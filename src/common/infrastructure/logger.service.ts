import { Injectable, Scope, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private metadata?: Record<string, string>;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  setContext(context: string): void {
    this.metadata = { context };
  }

  error(info: string): void {
    this.logger.error(info, this.metadata);
  }

  warn(info: string): void {
    this.logger.warn(info, this.metadata);
  }

  info(info: string): void {
    this.logger.info(info, this.metadata);
  }

  debug(info: string): void {
    this.logger.debug(info, this.metadata);
  }
}
