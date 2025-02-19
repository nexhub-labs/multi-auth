// api/index.ts
import { VercelApiHandler as Handler } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { setupCors } from 'cors/cors';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    // Disable bodyParser so Nest can handle it natively
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    const configService = app.get(ConfigService);
    setupCors(app, configService); // Apply your CORS configuration
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

const handler: Handler = async (req, res) => {
  const server = await bootstrapServer();
  server(req, res);
};

export default handler;
