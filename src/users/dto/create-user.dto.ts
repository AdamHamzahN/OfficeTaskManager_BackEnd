import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { StatusKeaktifan } from '../entities/user.entity';
import { Role } from '#/role/entities/role.entity';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;
    
    // @MinLength(6)
    // @MaxLength(20)
    // @IsNotEmpty({message:'Password tidak boleh kosong'})
    password?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    nama: string;

    @IsOptional()
    // @IsNotEmpty()
    role: Role;

    salt:string;

    

}
