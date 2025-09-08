import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { bootstrap } from './server';

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));

describe('bootstrap', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    console.log = jest.fn();
  });

  it('should create Nest app with FastifyAdapter and global ValidationPipe', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(
      AppModule,
      expect.any(FastifyAdapter),
    );

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        isTransformEnabled: true,
        validatorOptions: expect.objectContaining({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      }),
    );

    expect(mockApp.listen).toHaveBeenCalledWith(3000, '0.0.0.0');
  });
});
