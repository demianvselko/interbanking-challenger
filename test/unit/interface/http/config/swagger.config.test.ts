import { setupSwagger } from '@interface/http/config/swagger.config';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

jest.mock('@nestjs/swagger', () => ({
    DocumentBuilder: jest.fn().mockImplementation(() => {
        return {
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setVersion: jest.fn().mockReturnThis(),
            addBearerAuth: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue('config'),
        };
    }),
    SwaggerModule: {
        createDocument: jest.fn().mockReturnValue('document'),
        setup: jest.fn(),
    },
}));

jest.spyOn(Logger, 'log').mockImplementation(() => { });

describe('setupSwagger', () => {
    const mockApp = {} as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call SwaggerModule.createDocument and setup with defaults', () => {
        delete process.env.SWAGGER_TITLE;
        delete process.env.SWAGGER_DESCRIPTION;
        delete process.env.SWAGGER_VERSION;
        delete process.env.SWAGGER_PATH;

        setupSwagger(mockApp);

        expect(SwaggerModule.createDocument).toHaveBeenCalledWith(mockApp, 'config');
        expect(SwaggerModule.setup).toHaveBeenCalledWith('docs', mockApp, 'document');
        expect(Logger.log).toHaveBeenCalledWith(
            'Swagger running at http://localhost:3000/docs',
        );
    });

    it('should use environment variables if provided', () => {
        process.env.SWAGGER_TITLE = 'Custom Title';
        process.env.SWAGGER_DESCRIPTION = 'Custom Desc';
        process.env.SWAGGER_VERSION = '9.9.9';
        process.env.SWAGGER_PATH = 'swagger-path';

        setupSwagger(mockApp);

        expect(SwaggerModule.setup).toHaveBeenCalledWith(
            'swagger-path',
            mockApp,
            'document',
        );
        expect(Logger.log).toHaveBeenCalledWith(
            'Swagger running at http://localhost:3000/swagger-path',
        );
    });
});
