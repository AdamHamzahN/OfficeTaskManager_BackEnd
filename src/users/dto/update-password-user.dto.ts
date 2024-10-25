import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordUserDto{
    @IsNotEmpty()
    current_password: string;

    @IsNotEmpty()
    // @MinLength(8)
    // @MaxLength(20,{message:"Password Maximal 20 karakter "})
    new_password: string;

    @IsNotEmpty()
    confirm_new_password: string;
}