import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { gender } from "../entities/karyawan.entity";
import { Job } from "#/job/entities/job.entity";

export class CreateKaryawanDto {
    //User
    @IsNotEmpty({message:'Username  tidak boleh kosong'})
    username: string;

    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty({message:'Password tidak boleh kosong'})
    password: string;

    @IsNotEmpty({message:'Email tidak boleh kosong'})
    @IsEmail()
    email: string;

    @IsNotEmpty({message:'Nama tidak boleh kosong'})
    nama: string;

    // @IsOptional()
    // @IsNotEmpty()
    // role: Role;

    // @IsNotEmpty()
    // salt:string;

    //Karyawan
    @IsNotEmpty({message:'NIK tidak boleh kosong'})
    nik: string;

    @IsEnum(gender)
    @IsNotEmpty({message:'Jenis Kelamin Tidak boleh kosong'})
    gender: gender;

    @IsOptional()
    job: Job;
    // @IsOptional()
    // alamat: string;

}
