import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateKaryawanDto {
    @IsOptional()
    alamat: string;
}
