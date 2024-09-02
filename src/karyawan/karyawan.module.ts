import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karyawan } from './entities/karyawan.entity';
import { User } from '#/users/entities/user.entity';
import { Role } from '#/role/entities/role.entity';
import { Job } from '#/job/entities/job.entity';
import { UsersService } from '#/users/users.service';

@Module({
  imports:[TypeOrmModule.forFeature([Karyawan,User,Role,Job])],
  controllers: [KaryawanController],
  providers: [KaryawanService,UsersService]
})
export class KaryawanModule {}
