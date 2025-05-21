import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly configService: ConfigService) {}

  createSwaggerDocs(application: INestApplication) {
    const appConfig = this.configService.get('app');

    const document = SwaggerModule.createDocument(
      application,
      new DocumentBuilder()
        .setTitle(appConfig.pkgName)
        .setDescription(appConfig.pkgDescription)
        .setVersion(appConfig.pkgVersion)
        .build(),
    );

    SwaggerModule.setup('/docs', application, document, {
      swaggerOptions: {
        filter: true,
        docExpansion: 'none',
        displayRequestDuration: true,
      },
    });
  }
}
