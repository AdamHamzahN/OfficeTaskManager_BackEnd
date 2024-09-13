import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

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
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

   /**
   * Memanggil semua job
   */
  @Get()
  async listJob() {
      return {
        data: await this.jobService.list(),
        statusCode: HttpStatus.OK,
        message: 'success',
      };  
     
  }

   /**
   * Membuat job baru
   */
  @Post('tambah')
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

    /**
  * memanggil job berdasarkan id
  */
  @Get(':id/detail')
  getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  /**
   * Meng-update job
   */
  @Put(':id/update')
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  
}
