import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { TerminusModule } from '@nestjs/terminus';

import settings from '@/app/setup/settings';
import { WinstonConfigService } from '@/app/setup/services/winston-config.service';
import { TypeOrmConfigService } from '@/app/setup/services/typeorm-config.service';
import { SwaggerConfigService } from '@/app/setup/services/swagger-config.service';
import { HealthController } from '@/app/setup/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [settings],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [SwaggerConfigService],
  exports: [SwaggerConfigService],
})
export class SetupModule {}
