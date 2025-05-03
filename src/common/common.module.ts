import { Module } from '@nestjs/common';

import { LoggerService } from '@/common/infrastructure/logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
