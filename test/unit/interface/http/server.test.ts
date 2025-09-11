import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { bootstrap } from '@interface/http/server';
import { setupValidation } from '@interface/http/config/pipes.config';
import { setupSwagger } from '@interface/http/config/swagger.config';

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));
jest.mock('@nestjs/platform-fastify', () => ({
  FastifyAdapter: jest.fn(),
}));

jest.mock('@interface/http/config/pipes.config');
jest.mock('@interface/http/config/swagger.config');

describe('bootstrap', () => {
  let mockApp: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn()
        .mockImplementation((key, def) => {
          if (key === 'APP_PORT') return 3001;
          if (key === 'APP_HOST') return '127.0.0.1';
          return def;
        }),
    };

    mockApp = {
      get: jest.fn().mockReturnValue(mockConfigService),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    jest.clearAllMocks();
  });

  it('should create Nest app with FastifyAdapter and global ValidationPipe', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(FastifyAdapter),
      { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
    );

    expect(mockApp.get).toHaveBeenCalledWith(ConfigService);
    expect(mockApp.listen).toHaveBeenCalledWith(3001, '127.0.0.1');
    expect(setupValidation).toHaveBeenCalledWith(mockApp);
    expect(setupSwagger).toHaveBeenCalledWith(mockApp);
  });
});
