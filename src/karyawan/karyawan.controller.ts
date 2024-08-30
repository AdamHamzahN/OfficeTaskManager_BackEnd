import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseUUIDPipe, Put, HttpException } from '@nestjs/common';
import { KaryawanService } from './karyawan.service';
import { CreateKaryawanDto } from './dto/create-karyawan.dto';
import { UpdateKaryawanDto } from './dto/update-karyawan.dto';
import { EditJobDto } from './dto/edit-job-karyawan.dto';
import { UpdateStatusKaryawan } from './dto/update-status.dto';

@Controller('karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) { }
  
  /**
   * Memanggil semua karyawan
   */
  @Get()
  async findAll() {
    return await this.karyawanService.findAll();
  }

  /**
   * Membuat Karyawan Baru
   */
  @Post('/tambah')
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
  @Get(':id')
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
  @Put(':id/edit-job')
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
  @Put(':id/edit-profile')
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
  @Put(':id/edit-status-project')
  async UpdateStatusProject(@Param('id') id: string, @Body() updateStatus:UpdateStatusKaryawan){
    return {
      data: await this.karyawanService.updateStatusProject(id, updateStatus),
      statusCode: HttpStatus.OK,
      message:'success',
    }
  }

}
