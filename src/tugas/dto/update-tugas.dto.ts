import { PartialType } from '@nestjs/swagger';
import { CreateTugasDto } from './create-tugas.dto';

export class UpdateTugasDto extends PartialType(CreateTugasDto) {}
