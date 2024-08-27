import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from '#/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Role])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
