import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { setupValidation } from './config/pipes.config';

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    },
  );

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  setupValidation(app);

  setupSwagger(app);

  const port = configService.get<number>('APP_PORT', 3000);
  const host = configService.get<string>('APP_HOST', '0.0.0.0');

  await app.listen(port, host);

  logger.log(`Swagger running at http://${host}:${port}/docs`);
  logger.log(`Server running on http://${host}:${port}`);
}

if (require.main === module) {
  bootstrap();
}
