import { Test } from '@nestjs/testing';
import {
    INestApplication,
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Controller('protected')
class ProtectedController {
    @UseGuards(JwtAuthGuard)
    @Get()
    getProtected() {
        return { msg: 'ok' };
    }
}

class MockJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: () => null,
            secretOrKey: 'test-secret',
        });
    }

    async validate() {
        return null;
    }
}

describe('JwtAuthGuard (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [ProtectedController],
            providers: [JwtAuthGuard, MockJwtStrategy],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should block request without token', async () => {
        const res = await request(app.getHttpServer()).get('/protected');
        expect(res.status).toBe(401);
    });
});
