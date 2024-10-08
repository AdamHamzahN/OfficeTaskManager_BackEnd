import { IsNotEmpty } from "class-validator";

export class UpdateNamaTeamDto {
    @IsNotEmpty()
    note: string;
}