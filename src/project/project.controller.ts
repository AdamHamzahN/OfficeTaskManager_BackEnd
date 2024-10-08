import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, HttpStatus, Put, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateStatusProject } from './dto/update-status.dto';
import { UploadHasilProject } from './dto/upload-bukti.dto';
import { UpdateNamaTeamDto } from './dto/update-nama-team.dto';
import { statusProject } from './entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';
import { UploadFileProject } from './dto/upload-file-tugas.dto';
/***
 * Tambah Project
 * url: http://localhost:3222/project/tambah [ok]
 * 
 * Upload File Project
 *  url: http://localhost:3222/project/:id/upload-file-project [ok]
 * 
 * Memanggil project berdasarkan Id (detail project)
 * url: http://localhost:3222/project/:id/detail-project [ok]
 * 
 * Men update status project
 * url: http://localhost:3222/project/:id/update-status [ok]
 * 
 * Upload File Hasil Project
 * url: http://localhost:3222/project/:id/upload-file-hasil [ok]
 * 
 * Update Nama Team
 * url: http://localhost:3222/project/:id/update-nama-team  [ok]
 * 
 * 3 update project terbaru (super admin)
 * url: http://localhost:3222/project/update-terbaru [ok]
 * 
 * Menghitung jumlah project dalam proses (pending | redo | done |on progress | redo)
 * url: http://localhost:3222/project/count-onprogress [ok]
 * 
 * Menampilkan data project yang sedang dalam proses  (pending | redo | done |on progress | redo)
 * url: http://localhost:3222/project/data-onprogress [ok]
 * 
 * Menghitung jumlah project selesai ( approved )
 * url: http://localhost:3222/project/count-selesai [ok]
 * 
 * Memanggil project berdasarkan status
 * status : pending | on_progress | done | redo | approved
 * url: http://localhost:3222/project?status= [ok]
 * 
 * Memanggil project berdasarkan id team lead (user)
 *  url: http://localhost:3222/project/team-lead/:id [ok]
 * 
 * Menampilkan 3 data update terbaru dari project team lead (berdasarkan id team lead)
 * url: http://localhost:3222/project/team-lead/:id/update-terbaru [ok]
 * 
 * Menampilkan project Team Lead yang sedang dalam proses  (pending | redo | done |on progress | redo)
 * url: http://localhost:3222/project/team-lead/:id/data-onprogress [OK]
 * 
 * Menampilkan data project dari team lead berdasarkan status
 * status : pending | on_progress | done | redo | approved
 * url: http://localhost:3222/project/team-lead/:id/projects?status= [ok]
 */

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }
  /**
   * Tambah Project Baru
   */
  @Put(':id/upload-file-project')
  @UseInterceptors(FileInterceptor('file_project', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/project/file_project';
        // Cek apakah folder sudah ada, jika belum buat folder
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
        'application/pdf', // .pdf
        'application/vnd.ms-excel', //excel
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //spreadsheet
      ];
      const maxSize = 2 * 1024 * 1024; // maximal file 2 MB
      if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new BadRequestException('Hanya File Excel dan PDF saja yang diizinkan'), false);
      } else if (file.size > maxSize) {
        cb(new BadRequestException('File harus dibawah 2 MB'), false);
      } else {
        cb(null, true);
      }
    }
  }))
  async uploadFileProject(
    @Param('id') id: string,
    @Body() UploadFileProject: UploadFileProject,
    @UploadedFile() file: Express.Multer.File) {
    const data = await this.projectService.uploadFileProject(id, UploadFileProject, file);
    return {
      data,
      statusCode: HttpStatus.OK,
      message: 'success',
    }
  }

  @Post('/tambah')
  async createProject(@UploadedFile() file: Express.Multer.File, @Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  /**
   * Memanggil semua Project
   */
  // @Get()
  // async listProject() {
  //   const data = await this.projectService.findAll();
  //   return {
  //     data,
  //     statusCode: HttpStatus.OK,
  //     message: 'success',
  //   };
  // }

  /**
   * Memanggil project berdasarkan Id
   */
  @Get(':id/detail-project')
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
  @Put(':id/update-status')
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
      destination: (req, file, cb) => {
        const uploadPath = './uploads/project/file_hasil_project';
        // Cek apakah folder sudah ada, jika belum buat folder
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

  /**
   * Ambil 3 Project Update Terbaru
   */
  @Get('update-terbaru')
  async updateProjectTerbaru() {
    return await this.projectService.getProjectTerbaru();
  }

  /**
   * Menghitung jumlah project dalam proses (pending | redo | done |on progress | redo)
   */
  @Get('count-onprogress')
  async getHitungProjectDalamProses() {
    const { count } = await this.projectService.getProjectDalamProses();
    return {
      count: count
    };
  }

  /**
   * Menampilkan data project yang sedang dalam proses  (pending | redo | done |on progress | redo)
   */
  @Get('data-onprogress')
  async getDataProjectDalamProses() {
    const { data } = await this.projectService.getProjectDalamProses();
    return data;
  }

  /**
   * Menghitung jumlah project selesai ( approved )
   */
  @Get('count-selesai')
  async getProjectSelesai() {
    return await this.projectService.getProjectSelesai();
  }

  /**
   * Memanggil project berdasarkan status
   * status : pending | on_progress | done | redo | approved 
   */
  @Get()
  async getProjectByStatus(
    @Query('status') status?: string,
  ) {
    if (status) {
      return await this.projectService.getProjectByStatus(status as statusProject);
    } else {
      return await this.projectService.findAll();
    }
  }

  /**
   * Memanggil project berdasarkan id team lead (user) 
   */
  @Get('team-lead/:id')
  async getProjectTeamLead(@Param('id') id: string) {
    return await this.projectService.getProjectTeamLead(id);
  }

  /**
   * Menampilkan 3 data update terbaru dari project team lead (berdasarkan id team lead)
   */
  @Get('team-lead/:id/update-terbaru')
  async getUpdateTerbaruProjectTeamLead(@Param('id') id: string) {
    return await this.projectService.getUpdateProjectLatestTeamLead(id);
  }

  /**
   * Menampilkan project Team Lead yang sedang dalam proses  (pending | redo | done |on progress | redo)
   */
  @Get('team-lead/:id/data-onprogress')
  async getDataProjectTeamLeadDalamProses(@Param('id') id: string) {
    return await this.projectService.getProjectProsesTeamLead(id);
  }

  /**
   * Menampilkan data project dari team lead berdasarkan status
   */
  @Get('team-lead/:id/projects')
  async getProjectTeamLeadByStatus(
    @Param('id') id: string,
    @Query('status') status?: string,
  ) {
    if (status) {
      return await this.projectService.getProjectTeamLeadByStatus(id, status as statusProject);
    }
    return await this.projectService.getProjectProsesTeamLead(id);
  }

  @Get(`karyawan/:id/project-selesai`)
  async getProjectSelesaiKaryawan(@Param('id') id: string) {
    return await this.projectService.getProjectSelesaiKaryawan(id);
  }

  @Get(`karyawan/:id/project-dikerjakan`)
  async getProjectDikerjajanKaryawan(@Param('id') id: string) {
    return await this.projectService.getProjectDikerjakanKaryawan(id);
  }

}
