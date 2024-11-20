import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '#/auth/jwt-auth.guard';

/**
 * Memanggil semua job
 * url: http://localhost:3222/job [ok]
 *  
 * Membuat job baru
 * url: http://localhost:3222/job/tambah [ok]
 * 
 * Memanggil Job berdasarkan Id (detail job)
 * url: http://localhost:3222/job/:id/detail [ok]
 * 
 * Mengupdate Job
 * url: http://localhost:3222/job/:id/update [ok] 
 */

@UseGuards(JwtAuthGuard)
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  /**
  * Memanggil semua job
  */
  @Get()
  async listJob(@Query('page') page: number, @Query('page_size') page_size: number) {
    return await this.jobService.list(page, page_size);
  }

  @Get('/get-all')
  async getJob() {
    return await this.jobService.getAll()
  }
  /**
  * Membuat job baru
  */
  @Post('tambah')
  async create(@Body() createJobDto: CreateJobDto) {
    try {
      await this.jobService.create(createJobDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    } catch (error) {
      return error;
    }
  }

  /**
* memanggil job berdasarkan id
*/
  @Get(':id/detail')
  async getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  /**
   * Meng-update job
   */
  @Put(':id/update')
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    try {
      await this.jobService.update(id, updateJobDto);
      return{
        statusCode: HttpStatus.OK,
        message: 'success',
      }
    }catch(error){
      return error;
    }
  }

}
