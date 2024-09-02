import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateNamaTeamDto {
    @IsNotEmpty({message:"masukkan nama team"})
    nama_team: string;
}
