import { AuthController } from '@interface/http/controllers/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController (unit)', () => {
    let controller: AuthController;
    let mockJwt: jest.Mocked<JwtService>;
    let mockConfig: jest.Mocked<ConfigService>;

    beforeEach(() => {
        mockJwt = { sign: jest.fn() } as any;
        mockConfig = {
            get: jest.fn().mockImplementation((key, def) => {
                if (key === 'AUTH_USER') return 'admin';
                if (key === 'AUTH_PASS') return 'admin';
                return def;
            }),
        } as any;

        controller = new AuthController(mockJwt, mockConfig);
    });

    it('should return token if credentials are valid', async () => {
        mockJwt.sign.mockReturnValue('signed-token');

        const response = await controller.login({
            username: 'admin',
            password: 'admin',
        });

        expect(mockJwt.sign).toHaveBeenCalledWith({
            username: 'admin',
            sub: 1,
        });
        expect(response).toEqual({ access_token: 'signed-token' });
    });

    it('should return error if credentials are invalid', async () => {
        const response = await controller.login({
            username: 'wrong',
            password: 'bad',
        });

        expect(mockJwt.sign).not.toHaveBeenCalled();
        expect(response).toEqual({ error: 'Invalid credentials' });
    });
});
