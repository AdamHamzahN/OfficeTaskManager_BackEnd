import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;
}
