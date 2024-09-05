import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { MulterModule } from '@nestjs/platform-express';
import { User } from '#/users/entities/user.entity';
import { KaryawanService } from '#/karyawan/karyawan.service';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';
import { RoleService } from '#/role/role.service';
import { Role } from '#/role/entities/role.entity';
import { Job } from '#/job/entities/job.entity';
import { JobService } from '#/job/job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User ,Karyawan]),
    MulterModule.register(),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
