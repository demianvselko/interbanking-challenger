import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { setupValidation } from '@interface/http/config/pipes.config';
import { AppModule } from '@interface/http/app.module';
import { setupSwagger } from '@interface/http/config/swagger.config';
import { bootstrap } from '@interface/http/server';



jest.mock('@nestjs/core', () => ({
    NestFactory: { create: jest.fn() },
}));
jest.mock('@nestjs/platform-fastify', () => ({
    FastifyAdapter: jest.fn(),
}));
jest.mock('@nestjs/common', () => {
    const actual = jest.requireActual('@nestjs/common');
    return {
        ...actual,
        Logger: jest.fn().mockImplementation(() => ({
            log: jest.fn(),
        })),
    };
});
jest.mock('@interface/http/config/swagger.config');
jest.mock('@interface/http/config/pipes.config');


describe('bootstrap (integration)', () => {
    let mockApp: any;
    let mockConfigService: any;

    beforeEach(() => {
        mockConfigService = {
            get: jest.fn()
                .mockImplementationOnce((key, def) => (key === 'APP_PORT' ? 4000 : def))
                .mockImplementationOnce((key, def) => (key === 'APP_HOST' ? '127.0.0.1' : def)),
        };

        mockApp = {
            get: jest.fn().mockReturnValue(mockConfigService),
            listen: jest.fn().mockResolvedValue(undefined),
        };

        (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
        (setupValidation as jest.Mock).mockImplementation(() => { });
        (setupSwagger as jest.Mock).mockImplementation(() => { });
        jest.clearAllMocks();
    });

    it('should create app, setup validation, swagger and listen on host/port', async () => {
        await bootstrap();

        expect(NestFactory.create).toHaveBeenCalledWith(
            AppModule,
            expect.any(FastifyAdapter),
            { logger: ['error', 'warn', 'log', 'debug', 'verbose'] },
        );

        expect(mockApp.get).toHaveBeenCalledWith(ConfigService);
        expect(setupValidation).toHaveBeenCalledWith(mockApp);
        expect(setupSwagger).toHaveBeenCalledWith(mockApp);

        expect(mockApp.listen).toHaveBeenCalledWith(4000, '127.0.0.1');
    });
});
