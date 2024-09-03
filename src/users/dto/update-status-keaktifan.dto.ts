import { IsEnum } from "class-validator";
import { StatusKeaktifan } from "../entities/user.entity";

export class UpdateStatusKeaktifan{
    @IsEnum(StatusKeaktifan,{message:"pilih antara active atau inactive"})
    status: StatusKeaktifan
}