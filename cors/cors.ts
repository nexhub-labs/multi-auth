import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { corsConfig } from './cors.config';

/**
 * Configures CORS settings for a NestJS application.
 *
 * @param {INestApplication} app - The NestJS application instance.
 * @param {ConfigService} configService - The ConfigService instance to retrieve configuration values.
 */
export function setupCors(app: INestApplication, configService: ConfigService) {
  const environment = configService.get<string>('NODE_ENV') || 'development';
  const corsSettings = corsConfig[environment];

  if (!corsSettings) {
    throw new Error(`CORS configuration for environment "${environment}" not found`);
  }

  app.enableCors(corsSettings);
}