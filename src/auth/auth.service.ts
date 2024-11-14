import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '#/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(authDto: AuthDto) {
        const user = await this.userService.getUserByUsername(authDto.username);
        if (user) { 
            const salt = user.salt;
            const stringSalt = salt.replace(/-/g, '')
            const inputPassword = authDto.password;
            const { password } = user;

            const hashInputPassword = this.userService.hashPassword(inputPassword, stringSalt);

            const isPasswordCorrect = password == hashInputPassword;
            if (user && isPasswordCorrect) {
                const { password, ...result } = user;
                const expiry_time = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
                const payload = { sub: user.id, username: user.username, role: user.role.nama };
                return {
                    data: {
                        user:payload,
                        access_token: await this.jwtService.signAsync(payload, {
                            secret: 'secrettoken1234',
                            expiresIn: '7d',
                        }),
                        expires_in: expiry_time,
                    },
                    status: 200,
                    message: 'login success'
                };
            }
            else{
                return {
                    statusCode: 401,
                    message: 'password salah'
                }
            }
        }
        else{
            return {
                statusCode: 401,
                message: 'username salah'
            }
        }
    }
}
