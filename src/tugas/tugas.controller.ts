import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, HttpStatus } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { UpdateTugasDto } from './dto/update-tugas.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService) { }


  @Post('tambah')
  @UseInterceptors(FileInterceptor('file_tugas', {
    storage: diskStorage({
      destination: './uploads/tugas/file_tugas',
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${filename}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/pdf' // .pdf
      ];
      const maxSize = 2 * 1024 * 1024; // maksimal file 2 MB

      if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new BadRequestException('Hanya File Excel dan PDF yang diizinkan'), false);
      } else if (file.size > maxSize) {
        cb(new BadRequestException('File harus dibawah 2 MB'), false);
      } else {
        cb(null, true);
      }
    }
  }))
  async create(@Body() createTugasDto: CreateTugasDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const data = await this.tugasService.create(createTugasDto, file);
      return {
        data,
        statusCode: 201,
        message: 'success',
      };
    } catch (e) {
      return e;
    }
}


  @Get()
  async listTugas() {
    const { data, count } = await this.tugasService.findAll();
    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tugasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTugasDto: UpdateTugasDto) {
    return this.tugasService.update(+id, updateTugasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tugasService.remove(+id);
  }
}
