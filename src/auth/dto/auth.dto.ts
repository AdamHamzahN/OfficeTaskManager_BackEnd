// import { IsNotEmpty, IsString } from "class-validator";

// export class AuthDto{
//     @IsString()
//     @IsNotEmpty()
//     username: string;

//     @IsString()
//     @IsNotEmpty()
//     password: string;
// }

// coba2
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}