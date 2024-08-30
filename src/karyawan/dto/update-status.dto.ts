import { IsEnum } from "class-validator";
import { statusProject } from "../entities/karyawan.entity";

export class UpdateStatusKaryawan{
    @IsEnum(statusProject,{message:"pilih available atau unavailable"})
    status_project:statusProject;
}