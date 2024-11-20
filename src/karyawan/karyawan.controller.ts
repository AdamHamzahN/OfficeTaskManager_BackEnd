import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put, HttpException, Query, UseGuards } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { EditJobDto } from './dto/edit-job-karyawan.dto';
import { UpdateStatusKaryawan } from './dto/update-status.dto';
import { UpdateStatusKeaktifan } from '#/users/dto/update-status-keaktifan.dto';
import { JwtAuthGuard } from '#/auth/jwt-auth.guard';
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

@UseGuards(JwtAuthGuard)
@Controller('karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) { }

  /**
   * Memanggil semua karyawan
   */
  @Get()
  async findAll(@Query('page') page: number, @Query('page_size') page_size: number) {
    return await this.karyawanService.findAll(page, page_size);
  }

  /**
   * Membuat Karyawan Baru
   */
  @Post('tambah')
  async createKaryawan(@Body() createKaryawanDto: CreateKaryawanDto) {
    try {
      await this.karyawanService.createKaryawan(createKaryawanDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
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
    try {
      await this.karyawanService.updateJob(id, editJobDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Update Profile Karyawan
   */
  @Put(':id/update-profile')
  async updateProfileKaryawan(@Param('id') id: string, @Body() updateKaryawanDto: UpdateKaryawanDto) {
    try {
      await this.karyawanService.updateProfile(id, updateKaryawanDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Update Status Project (available / unavailable)
   */
  @Put(':id/update-status-project')
  async UpdateStatusProject(@Param('id') id: string, @Body() updateStatus: UpdateStatusKaryawan) {
    try {
      await this.karyawanService.updateStatusProject(id, updateStatus);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    } catch (error) {
      return error
    }
  }

  /**
   * Update Status Keaktifan (active / inactive)
   */
  @Put(':id/update-status-keaktifan')
  async UpdateStatusKaryawan(@Param('id') id: string, @Body() status: UpdateStatusKeaktifan) {
    try{
      await this.karyawanService.updateStatusKaryawan(id, status);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    }catch(error){
      return error;
    }
  }

  @Get('/status-available')
  async getKaryawanAvailable() {
    return this.karyawanService.getKaryawanAvailable()
  }

  @Get(':id/karyawan-by-id-user')
  async getKaryawanByIdUser(@Param('id') id: string) {
    return this.karyawanService.getKaryawanByIdUser(id);
  }
}
