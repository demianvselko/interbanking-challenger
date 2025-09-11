import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import * as jwt from 'jsonwebtoken';

describe('JwtStrategy (unit)', () => {
    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    it('should be defined', () => {
        const strategy = new JwtStrategy();
        expect(strategy).toBeDefined();
    });

    it('should return user object with sub and username in validate', async () => {
        const strategy = new JwtStrategy();
        const payload = { sub: '123', username: 'john' };

        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: '123', username: 'john' });
    });

    it('should validate token with secret from env variable', async () => {
        process.env.JWT_SECRET = 'test-secret';
        const strategy = new JwtStrategy();

        const token = jwt.sign({ sub: '123', username: 'john' }, 'test-secret');
        const decoded: any = jwt.verify(token, 'test-secret');

        const result = await strategy.validate(decoded);
        expect(result).toEqual({ userId: '123', username: 'john' });
    });

    it('should validate token with default secret if env not set', async () => {
        const strategy = new JwtStrategy();

        const token = jwt.sign({ sub: '456', username: 'jane' }, 'dont_hack_me_please');
        const decoded: any = jwt.verify(token, 'dont_hack_me_please');

        const result = await strategy.validate(decoded);
        expect(result).toEqual({ userId: '456', username: 'jane' });
    });
});
