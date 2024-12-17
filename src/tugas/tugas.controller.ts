import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, HttpStatus, Put, Query, UseGuards } from '@nestjs/common';
import { TugasService } from './tugas.service';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateStatusTugasDto } from './dto/update-status-tugas.dto';
import { UploadFileBukti } from './dto/upload-file-bukti.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UploadFileTugas } from './dto/upload-file-tugas';
import { JwtAuthGuard } from '#/auth/jwt-auth.guard';


/**
 * Menambah Tugas
 * url:http://localhost:3222/tugas/tambah
 * 
 * Menampilkan semua tugas
 * url:http://localhost:3222/tugas
 * 
 * Menampilkan detail tugas
 * url:http://localhost:3222/tugas/:id/detail
 * 
 * Meng upadate status tugas
 * url:http://localhost:3222/tugas/:id/update-status-tugas
 * 
 * Mengupload file bukti hasil pengerjaan tugas
 * url:http://localhost:3222/tugas:id/upload-file-bukti
 * 
 * Hitung tugas karyawan berdasarkan 
 * url:http://localhost:3222/tugas/:idKaryawan/project/:idProject/count-tugas
 */

@UseGuards(JwtAuthGuard)
@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService

  ) { }

  /**
   * Tambah tugas
   */
  @Put(':id/upload-file-tugas')
  @UseInterceptors(FileInterceptor('file_tugas', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/tugas/file_tugas';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${filename}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'application/pdf' // .pdf
      ];
      const maxSize = 2 * 1024 * 1024; // maksimal file 2 MB

      if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new BadRequestException('Hanya File PDF yang diizinkan'), false);
      } else if (file.size > maxSize) {
        cb(new BadRequestException('File harus dibawah 2 MB'), false);
      } else {
        cb(null, true);
      }
    }
  }))
  async uploadFileTugas(
    @Param('id') id: string,
    @Body() uploadFileTugas: UploadFileTugas,
    @UploadedFile() file: Express.Multer.File) {
    const data = await this.tugasService.uploadFileTugas(id, uploadFileTugas, file);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  @Post('tambah')
  async createTugas(@Body() createTugasDto: CreateTugasDto) {
    try {
      const createTugas = await this.tugasService.create(createTugasDto);
      return {
        data: createTugas,
        statusCode: 201,
        message: 'success',
      };
    } catch (error) {
      return error;
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
   * Memanggil tugas berdasarkan Id (detail tugas)
   */
  @Get(':id/detail')
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
    try {
      await this.tugasService.updateStatusTugas(id, updateStatusTugasDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Upload File Bukti hasil pengerjaan tugas
   */
  @Put(':id/upload-file-bukti')
  @UseInterceptors(FileInterceptor('file_bukti', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/tugas/file_bukti';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
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
    @Body() uploadFileBukti: UploadFileBukti,
    @UploadedFile() file: Express.Multer.File) {
    try {
      await this.tugasService.uploadFileBukti(id, uploadFileBukti, file);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * Menampilkan tugas berdasarkan id karyawan
   */
  @Get(':id/tugas-karyawan')
  async getTugasByKaryawan(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('page_size') page_size: number
  ) {
    return await this.tugasService.getTugasByKaryawan(id, page, page_size);
  }

  @Get('team-lead/:id/update-terbaru')
  async getTugasByTeamLead(@Param('id') id: string) {
    return await this.tugasService.getTugasByTeamLead(id);
  }

  @Get(':idKaryawan/project/:idProject/count-tugas')
  async countTugasKaryawan(@Param('idKaryawan') idKaryawan: string, @Param('idProject') idProject: string) {
    // return 'a';
    return await this.tugasService.countTugasKaryawan(idKaryawan, idProject);
  }

  @Get(':id/tugas-project')
  async getTugasByProject(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('page_size') page_size: number
  ) {
    return await this.tugasService.getTugasByProject(id, page, page_size);
  }


  @Get(':id/tugas-selesai')
  async getTugasDoneByID(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('page_size') page_size: number) {
    return await this.tugasService.getTugasDoneByProject(id,page,page_size);
  }

  @Put(':id/update-note')
  async updateNote(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    try {
      await this.tugasService.updateNote(id, updateNoteDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    } catch (error) {
      return error;
    }
  }

  @Get(':id/karyawan/tugas-terbaru')
  async updateTugasTerbaru(@Param('id') id: string) {
    return await this.tugasService.getNewTugas(id)
  }

  @Get(':id/karyawan/tugas-project')
  async getTugasKaryawanByProject(@Param('id') id: string) {
    return await this.tugasService.getTugasKaryawanByProject(id)
  }

  @Get(':id/karyawan/:id_project/tugas-karyawan')
  async getTugasKaryawanByIdUser(
    @Param('id') id: string,
    @Param('id_project') id_project: string,
    @Query('page') page: number,
    @Query('page_size') page_size: number
  ) {
    return await this.tugasService.getTugasProjectKaryawanByIdUser(id, id_project, page, page_size);
  }

  @Get(':id/karyawan/:id_project/tugas-karyawan-belum-selesai')
  async getTugasKaryawanBelumSelesai(
    @Param('id') id: string,
    @Param('id_project') id_project: string,
    @Query('page') page: number,
    @Query('page_size') page_size: number) {
    return await this.tugasService.getTugasKaryawanBelumSelesai(id, id_project, page, page_size);
  }
}
