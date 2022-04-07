import 'dotenv/config'; 
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidUnknownValues: true,
    transform: true
  }));
  await app.listen(port);

  Logger.log(`Running on Localhost:${port}`, 'Running Port');
}
bootstrap();
