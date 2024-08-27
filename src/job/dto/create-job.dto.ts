import { IsNotEmpty } from "class-validator";

export class CreateJobDto {
    @IsNotEmpty({ message: 'nama job tidak boleh kosong' })
    nama_job:string;

    @IsNotEmpty({ message: 'deskripsi tidak boleh kosong' })
    deskripsi_job:string;
}
