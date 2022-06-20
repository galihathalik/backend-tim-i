import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentUtils } from './utils/enviroment.utils';
import AppConfig, { ServerConfig } from './config/app.config';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ohome API Docs')
    .setDescription('Ohome API documentation collection')
    .setVersion('1.0')
    .build();

  // const configCustomSwagger: SwaggerCustomOptions = {
  //   swaggerOptions: { docExpansion: 'none' },
  // };

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const isProduction = new EnvironmentUtils().isProduction();

  if (!isProduction) {
    SwaggerModule.setup('docs', app, document);
  }

  const serverConfig: ServerConfig = AppConfig().server;
  await app.listen(serverConfig.port);
}
bootstrap();
