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
            const stringSalt = salt.replace(/-/g,'')
            const inputPassword = authDto.password;
            const { password } = user;
            
            const hashInputPassword = this.userService.hashPassword(inputPassword, stringSalt);

            const isPasswordCorrect = password == hashInputPassword;
            if (user && isPasswordCorrect){
                const { password, ...result } = user;
                const payload = { sub:user.id , username:user.username , role:user.role.nama };
                return {
                    ...result,
                    access_token : await this.jwtService.signAsync(payload,{
                        secret:'secrettoken1234',
                        expiresIn:'24h',
                    })
                };
            }
            throw new UnauthorizedException('Invalid password');
        }
        throw new UnauthorizedException('user tidak ditemukan');
    }
}
