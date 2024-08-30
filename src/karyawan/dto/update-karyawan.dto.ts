import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateKaryawanDto {
    @IsNotEmpty({ message: 'email tidak boleh kosong' })
    @IsEmail()
    email: string;

    @IsOptional()
    alamat: string;
}
