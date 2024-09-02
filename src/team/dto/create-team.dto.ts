import { Karyawan } from "#/karyawan/entities/karyawan.entity";
import { Project } from "#/project/entities/project.entity";
import { IsNotEmpty } from "class-validator";

export class CreateTeamDto {
    @IsNotEmpty()
    id_karyawan:Karyawan

    @IsNotEmpty()
    id_project:Project
}
