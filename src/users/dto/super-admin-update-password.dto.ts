import { IsString, MinLength } from 'class-validator';

export class SuperAdminUpdatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
