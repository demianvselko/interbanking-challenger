import { AppLogger } from '@interface/http/config/logger.config';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/common', () => {
    const actual = jest.requireActual('@nestjs/common');
    return {
        ...actual,
        Logger: jest.fn().mockImplementation(() => ({
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        })),
    };
});

describe('AppLogger', () => {
    let appLogger: AppLogger;
    let mockLogger: jest.Mocked<Logger>;

    beforeEach(() => {
        appLogger = new AppLogger();
        mockLogger = (Logger as unknown as jest.Mock).mock.results[0].value;
        jest.clearAllMocks();
    });

    it('should call Logger.log', () => {
        appLogger.log('test message');
        expect(mockLogger.log).toHaveBeenCalledWith('test message');
    });

    it('should call Logger.error', () => {
        appLogger.error('error message', 'stacktrace');
        expect(mockLogger.error).toHaveBeenCalledWith('error message', 'stacktrace');
    });

    it('should call Logger.warn', () => {
        appLogger.warn('warn message');
        expect(mockLogger.warn).toHaveBeenCalledWith('warn message');
    });

    it('should call Logger.debug', () => {
        appLogger.debug('debug message');
        expect(mockLogger.debug).toHaveBeenCalledWith('debug message');
    });

    it('should call Logger.verbose', () => {
        appLogger.verbose('verbose message');
        expect(mockLogger.verbose).toHaveBeenCalledWith('verbose message');
    });
});
