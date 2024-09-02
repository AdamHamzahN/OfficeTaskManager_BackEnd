import { IsOptional } from "class-validator";

export class UploadHasilProject{
    @IsOptional()
    file_hasil_project: string;
}