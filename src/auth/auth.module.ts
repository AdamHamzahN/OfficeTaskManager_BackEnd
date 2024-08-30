import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#/users/entities/user.entity';
import { UsersService } from '#/users/users.service';
import { Role } from '#/role/entities/role.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([User,Role])],
  controllers: [AuthController],
  providers: [AuthService,UsersService,JwtService],
  exports: [AuthService, UsersService]
})
export class AuthModule {}
