import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { UsersService } from '#/users/users.service';
import { Role } from '#/role/entities/role.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ 
      secret: 'secrettoken1234',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtService ,JwtStrategy],
  exports: [AuthService, UsersService]
})
export class AuthModule { }
