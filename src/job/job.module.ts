import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Job,Karyawan])],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
