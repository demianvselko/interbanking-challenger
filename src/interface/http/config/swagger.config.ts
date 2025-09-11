import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const title = process.env.SWAGGER_TITLE || 'API Docs';
    const description =
        process.env.SWAGGER_DESCRIPTION ||
        'API documentation with Swagger (OpenAPI)';
    const version = process.env.SWAGGER_VERSION || '1.0.0';
    const path = process.env.SWAGGER_PATH || 'docs';

    const config = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token de jwt para el auth',
            },
            'jwt',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(path, app, document);

    Logger.log(`Swagger running at http://localhost:3000/${path}`);
}
