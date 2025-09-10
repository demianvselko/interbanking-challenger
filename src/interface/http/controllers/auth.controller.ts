import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService: JwtService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        if (body.username !== 'admin' || body.password !== 'admin') {
            return { error: 'Invalid credentials' };
        }

        const payload = { username: body.username, sub: 1 };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
