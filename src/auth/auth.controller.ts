import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
/**
 * Login
 * url: http://localhost/3222/auth/login [ok]
 */
@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}

    @Post('login')
    async login(@Body() authDto : AuthDto){
        return this.authService.login(authDto);
    }
}
