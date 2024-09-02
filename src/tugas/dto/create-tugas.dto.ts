import { Karyawan } from "#/karyawan/entities/karyawan.entity";
import { Project } from "#/project/entities/project.entity";
import { User } from "#/users/entities/user.entity";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTugasDto {
    @IsNotEmpty({message:"Nama tugas tidak  boleh kosong"})
    @IsString()
    nama_tugas: string;

    @IsNotEmpty({message:"Deskripsi tugas tidak  boleh kosong"})
    @IsString()
    deskripsi_tugas: string;

    @IsNotEmpty({message:"Mohon masukkan deadline"})
    deadline: string;

    @IsNotEmpty({message:"Mohon masukkan id project"})
    id_project: Project;

    @IsNotEmpty({message:"Mohon masukkan Karyawan yang ingin diberi tugas!"})
    id_karyawan:Karyawan;

    // @IsNotEmpty({message:"Mohon masukkan file detail tugas"})
    file_tugas: string;

}
