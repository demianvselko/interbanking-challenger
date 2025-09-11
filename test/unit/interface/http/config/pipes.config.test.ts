import { setupValidation } from '@interface/http/config/pipes.config';

jest.mock('@nestjs/common', () => {
    const actual = jest.requireActual('@nestjs/common');
    return {
        ...actual,
        ValidationPipe: jest.fn().mockImplementation((options) => ({
            options,
        })),
    };
});

describe('setupValidation', () => {
    let mockApp: { useGlobalPipes: jest.Mock };

    beforeEach(() => {
        mockApp = { useGlobalPipes: jest.fn() };
        jest.clearAllMocks();
    });

    it('should register ValidationPipe with correct options', () => {
        setupValidation(mockApp as any);

        expect(mockApp.useGlobalPipes).toHaveBeenCalledTimes(1);

        const pipeInstance = mockApp.useGlobalPipes.mock.calls[0][0];
        expect(pipeInstance.options).toEqual({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        });
    });
});
