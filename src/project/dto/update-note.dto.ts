import { IsNotEmpty } from "class-validator";

export class UpdateNoteDto {
    @IsNotEmpty()
    note: string;
}