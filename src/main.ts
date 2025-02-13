import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { setupCors } from 'cors/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  setupCors(app, configService);

  app.use(cookieParser())

  await app.listen(process.env.MULTI_AUTH_PORT ?? 3000);
}
bootstrap();
