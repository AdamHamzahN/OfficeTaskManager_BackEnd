    import { User } from "#/users/entities/user.entity";
import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty({ message: "Nama Project tidak boleh kosong" })
    nama_project: string;

    @IsString()
    @IsNotEmpty({ message: "Nama Team tidak boleh kosong" })
    nama_team: string;

    @IsString()
    @IsNotEmpty({ message: "deskripsi tidak boleh kosong" })
    deskripsi: string;

    @IsNotEmpty({ message: "Start Date tidak boleh kosong" })
    start_date: string;

    @IsNotEmpty({ message: "End Date tidak boleh kosong" })
    end_date: string;

    @IsUUID()
    @IsNotEmpty()
    id_team_lead: User;

    file_project: string;
}
 