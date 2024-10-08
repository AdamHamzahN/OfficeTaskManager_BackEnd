import { IsNotEmpty } from 'class-validator';

export class UpdateNamaTeamDto {
    @IsNotEmpty({message:"masukkan nama team"})
    nama_team: string;
}
