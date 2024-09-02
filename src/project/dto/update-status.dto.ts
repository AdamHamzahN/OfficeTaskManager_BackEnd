import { IsEnum, IsNotEmpty } from "class-validator";
import { statusProject } from "../entities/project.entity";

export class UpdateStatusProject{
    @IsNotEmpty()
    @IsEnum(statusProject)
    status_project: statusProject;

}