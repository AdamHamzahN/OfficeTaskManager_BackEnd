import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) { }

  /**
   * Memanggil semua job
   */
  async list() {
    return this.jobRepository.find();
  }
  /**
   * Membuat job baru
   */
  async create(createJobDto: CreateJobDto) {
    const jobNew = this.jobRepository.create(createJobDto);
    await this.jobRepository.save(jobNew);
    return jobNew;
  }

  /**
  * memanggil job berdasarkan id
  */
  async getJobById(id: string) {
    return await this.jobRepository.findOne({ where: { id } });
  }

  /**
   * Meng-update job
   */
  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.jobRepository.update({ id }, updateJobDto);
    return await this.jobRepository.findOne({ where: { id } });
  }

}
