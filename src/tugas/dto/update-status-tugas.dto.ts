import { IsEnum, IsNotEmpty } from 'class-validator';
import { statusTugas } from '../entities/tugas.entity';

export class UpdateStatusTugasDto {
    @IsNotEmpty()
    @IsEnum(statusTugas)
    status:statusTugas;
}
