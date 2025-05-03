import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@/app/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), CommonModule, CqrsModule],
  controllers: [],
  providers: [],
})
export class CustomerModule {}
