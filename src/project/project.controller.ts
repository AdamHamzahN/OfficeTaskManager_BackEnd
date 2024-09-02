import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, HttpStatus, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateStatusProject } from './dto/update-status.dto';
import { UploadHasilProject } from './dto/upload-bukti.dto';
import { UpdateNamaTeamDto } from './dto/update-nama-team.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  /**
   * Tambah Project Baru
   */
  @Post('tambah')
  @UseInterceptors(FileInterceptor('file_project', {
    storage: diskStorage({
      destination: './uploads/project/file_project',
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${filename}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const maxSize = 2 * 1024 * 1024; // maximal file 2 MB
      if (file.mimetype !== 'application/vnd.ms-excel' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(new BadRequestException('Hanya File Excel saja yang diizinkan'), false);
      } else if (file.size > maxSize) {
        cb(new BadRequestException('File harus dibawah 2 MB'), false);
      } else {
        cb(null, true);
      }
    }
  }))
  async createProject(@UploadedFile() file: Express.Multer.File, @Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto, file);
  }

  /**
   * Memanggil semua Project
   */
  @Get()
  async listProject() {
    const { data, count } = await this.projectService.findAll();
    return {
      data,
      count,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Memanggil team berdasarkan Id
   */
  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    const data = await this.projectService.findOne(id);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
  /**
   * Update Status Project 
   */
  @Put(':id/update-status-project')
  async updateStatusProject(@Param('id') id: string, @Body() updateStatusProjectDto: UpdateStatusProject) {
    const data = await this.projectService.updateStatus(id, updateStatusProjectDto);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Upload file hasil project
   */
  @Put(':id/upload-file-hasil')
  @UseInterceptors(FileInterceptor('file_hasil_project', {
    storage: diskStorage({
      destination: './uploads/project/file_hasil_project',
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
    @Body() uploadFileHasil: UploadHasilProject,
    @UploadedFile() file: Express.Multer.File) {
    const data = await this.projectService.uploadHasil(id, uploadFileHasil, file);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  /**
   * Update Nama Team
   */
  @Put(':id/update-nama-team')
  async updateNamaTeam(@Param('id') id: string, @Body() updateNamaTeam: UpdateNamaTeamDto) {
    const data = await this.projectService.updateNamaTeam(id, updateNamaTeam);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }
}

