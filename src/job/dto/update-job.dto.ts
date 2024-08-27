import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
    @IsNotEmpty({ message: 'nama job tidak boleh kosong' })
    nama_job:string;

    @IsNotEmpty({ message: 'deskripsi tidak boleh kosong' })
    deskripsi_job:string;
}

