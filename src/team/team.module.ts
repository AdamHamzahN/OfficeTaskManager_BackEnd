import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';
import { Project } from '#/project/entities/project.entity';
import { TugasService } from '#/tugas/tugas.service';
import { Tugas } from '#/tugas/entities/tugas.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Team,Karyawan,Project,Tugas])],
  controllers: [TeamController],
  providers: [TeamService , TugasService]
})
export class TeamModule {}
