import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put, HttpException, Query } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { EditJobDto } from './dto/edit-job-karyawan.dto';
import { UpdateStatusKaryawan } from './dto/update-status.dto';
import { UpdateStatusKeaktifan } from '#/users/dto/update-status-keaktifan.dto';
/**
 * Memanggil semua karyawan
 * url: http://localhost:3222/karyawan [ok]
 * 
 * Menambah data karyawan baru 
 * url: http://localhost:3222/karyawan/tambah [ok]
 * 
 * Menampilkan data karyawan berdasarkan Id (detail Karyawan)
 * url: http://localhost:3222/karyawan/:id/detail [ok]
 * 
 * Meng update job karyawan
 * url: http://localhost:3222/karyawan/:id/update-job [ok]
 * 
 * Meng update profile
 * url: http://localhost:3222/karyawan/:id/update-profile [ok]
 * 
 * Meng update status project karyawan (available | unavailable)
 * url: http://localhost:3222/karyawan/:id/update-status-project [ok]
 * 
 * Meng update status keaktifan (active | inactive)
 * url: http://localhost:3222/karyawan/:id/update-status-keaktifan [ok]
 * 
 */
@Controller('karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) { }
  
  /**
   * Memanggil semua karyawan
   */
  @Get()
  async findAll(@Query('page') page:number,@Query('page_size') page_size:number) {
    return {
      data : await this.karyawanService.findAll(page,page_size),
      statusCode: HttpStatus.OK,
      message:'success',
    };
  }

  /**
   * Membuat Karyawan Baru
   */
  @Post('tambah')
  async createKaryawan(@Body() createKaryawanDto: CreateKaryawanDto) {
    const karyawan = await this.karyawanService.createKaryawan(createKaryawanDto);
    return {
      data: karyawan,
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  /**
   * Memanggil Karyawan berdasarkan Id (untuk detail karyawan)
   */
  @Get(':id/detail')
  async detailKaryawan(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.karyawanService.findOne(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
  /**
   * Update Job Karyawan
   */
  @Put(':id/update-job')
  async updateJob(@Param('id') id: string, @Body() editJobDto: EditJobDto) {
    return {
      data: await this.karyawanService.updateJob(id, editJobDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  /**
   * Update Profile Karyawan
   */
  @Put(':id/update-profile')
  async updateProfileKaryawan(@Param('id') id: string, @Body() updateKaryawanDto: UpdateKaryawanDto) {
    return {
      data: await this.karyawanService.updateProfile(id, updateKaryawanDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
  
  /**
   * Update Status Project (available / unavailable)
   */
  @Put(':id/update-status-project')
  async UpdateStatusProject(@Param('id') id: string, @Body() updateStatus:UpdateStatusKaryawan){
    return {
      data: await this.karyawanService.updateStatusProject(id, updateStatus),
      statusCode: HttpStatus.OK,
      message:'success',
    }
  }

  /**
   * Update Status Keaktifan (active / inactive)
   */
  @Put(':id/update-status-keaktifan')
  async UpdateStatusKaryawan(@Param('id') id: string, @Body() status:UpdateStatusKeaktifan){
    return {
      data: await this.karyawanService.updateStatusKaryawan(id, status),
      statusCode: HttpStatus.OK,
      message:'success',
    }
  }

  @Get('/status-available')
  async getKaryawanAvailable(){
      return this.karyawanService.getKaryawanAvailable()
  }

}
