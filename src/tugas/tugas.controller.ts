import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, HttpStatus, Put } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateStatusTugasDto } from './dto/update-status-tugas.dto';
import { UploadFileBukti } from './dto/upload-file-bukti.dto';

@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService

  ) {}

  /**
   * Tambah tugas
   */
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
  async createTugas(@Body() createTugasDto: CreateTugasDto, @UploadedFile() file: Express.Multer.File) {
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

  /**
   * Memanggil semua tugas
   */
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

  /**
   * Memanggil tugas berdasarkan Id
   */
  @Get(':id')
  async getTugasById(@Param('id') id: string) {
    const data = await this.tugasService.findOne(id);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Update Status Tugas
   */
  @Put(':id/update-status-tugas')
  async updateStatusProject(@Param('id') id: string, @Body() updateStatusTugasDto: UpdateStatusTugasDto) {
    const data = await this.tugasService.updateStatusTugas(id, updateStatusTugasDto);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Upload File Bukti hasil pengerjaan tugas
   */
  @Put(':id/upload-file-bukti')
  @UseInterceptors(FileInterceptor('file_bukti', {
    storage: diskStorage({
      destination: './uploads/tugas/file_bukti',
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${filename}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const maxSize = 2 * 1024 * 1024; // maximal file 2 MB
      if (file.mimetype !== 'application/pdf') {
        cb(new BadRequestException('Hanya File Pdf saja yang diizinkan'), false);
      } else if (file.size > maxSize) {
        cb(new BadRequestException('File harus dibawah 2 MB'), false);
      } else {
        cb(null, true);
      }
    }
  }))
  async uploadFileHasil(@Param('id') id: string,
    @Body() uploadFileBukti : UploadFileBukti,
    @UploadedFile() file: Express.Multer.File) {
    const data = await this.tugasService.uploadFileBukti(id, uploadFileBukti, file);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

}
