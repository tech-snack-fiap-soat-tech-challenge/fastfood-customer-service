import type { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app/app.module';
import { SwaggerConfigService } from '@/setup/services/swagger-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const swaggerConfig = app.get(SwaggerConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  swaggerConfig.createSwaggerDocs(app);

  await app.listen(configService.get('app.port')!);
  return app.getUrl();
}

bootstrap()
  .then((url) => console.log(`\n 🚀 Server is running on ${url} \n`))
  .catch((err) => console.log(`\n 📛 An error occurred in app bootstrap: ${err} \n`));
