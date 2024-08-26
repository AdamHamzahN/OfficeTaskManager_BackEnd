import { PartialType } from '@nestjs/swagger';
import { CreateKaryawanDto } from './create-karyawan.dto';

export class UpdateKaryawanDto extends PartialType(CreateKaryawanDto) {}
