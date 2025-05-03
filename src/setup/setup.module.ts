import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { TerminusModule } from '@nestjs/terminus';

import settings from '@/setup/settings';
import { HealthController } from '@/setup/controllers/health.controller';
import { WinstonConfigService } from '@/setup/services/winston-config.service';
import { TypeOrmConfigService } from '@/setup/services/typeorm-config.service';
import { SwaggerConfigService } from '@/setup/services/swagger-config.service';

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
