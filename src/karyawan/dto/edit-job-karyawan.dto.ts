import { IsNotEmpty, IsString } from 'class-validator';

export class EditJobDto {
  @IsNotEmpty()
  @IsString()
  job: string; // ID dari job yang akan diperbarui
}
