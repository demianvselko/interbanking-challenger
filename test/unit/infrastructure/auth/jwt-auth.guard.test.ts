import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
    it('should be defined', () => {
        expect(new JwtAuthGuard()).toBeDefined();
    });

    it('should extend AuthGuard with strategy "jwt"', () => {
        const guard = new JwtAuthGuard();
        expect(guard).toBeInstanceOf(AuthGuard('jwt'));
    });
});
