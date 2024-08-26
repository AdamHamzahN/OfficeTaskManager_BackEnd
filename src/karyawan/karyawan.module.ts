import { Module } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { KaryawanController } from './karyawan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karyawan } from './entities/karyawan.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Karyawan])],
  controllers: [KaryawanController],
  providers: [KaryawanService]
})
export class KaryawanModule {}
