import { Module } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { TugasController } from './tugas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tugas } from './entities/tugas.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Tugas])],
  controllers: [TugasController],
  providers: [TugasService]
})
export class TugasModule {}
