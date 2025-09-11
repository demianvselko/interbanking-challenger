import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    private readonly user: string;
    private readonly pass: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.user = this.configService.get<string>('AUTH_USER', 'hackme');
        this.pass = this.configService.get<string>('AUTH_PASS', 'please');
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        if (body.username !== this.user || body.password !== this.pass) {
            return { error: 'Invalid credentials' };
        }

        const payload = { username: body.username, sub: 1 };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
