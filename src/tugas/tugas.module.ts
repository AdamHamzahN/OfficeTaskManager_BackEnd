import { Module } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { TugasController } from './tugas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tugas } from './entities/tugas.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Team } from '#/team/entities/team.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tugas,Team]),
  MulterModule.register()]
  ,
  controllers: [TugasController],
  providers: [TugasService]
})
export class TugasModule {}
