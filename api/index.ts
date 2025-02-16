import { VercelApiHandler as Handler } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    // Disable bodyParser so Nest can handle it natively
    const app = await NestFactory.create(AppModule, { bodyParser: false });
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
