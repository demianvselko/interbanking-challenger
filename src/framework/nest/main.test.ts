import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@framework/nest/app.module';
import { bootstrap } from '@framework/nest/main';

jest.mock('@nestjs/core', () => ({
    NestFactory: { create: jest.fn() },
}));

describe('bootstrap', () => {
    let listenMock: jest.Mock;
    let useGlobalPipesMock: jest.Mock;

    beforeEach(() => {
        listenMock = jest.fn();
        useGlobalPipesMock = jest.fn();

        (NestFactory.create as jest.Mock).mockResolvedValue({
            useGlobalPipes: useGlobalPipesMock,
            listen: listenMock,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create Nest app and set validation pipes', async () => {
        await bootstrap();

        expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
        expect(useGlobalPipesMock).toHaveBeenCalledWith(expect.any(ValidationPipe));
        expect(listenMock).toHaveBeenCalledWith(expect.any(Number));
    });
});
