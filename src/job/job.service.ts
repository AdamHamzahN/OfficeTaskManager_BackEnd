import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { Karyawan } from '#/karyawan/entities/karyawan.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,

    @InjectRepository(Karyawan)
    private karyawanRepository: Repository<Karyawan>,

  ) { }

  /**
   * Memanggil semua job
   */
  async list(page: number, page_size: number) {
    const skip = (page - 1) * page_size
    const [data, count] = await this.jobRepository.createQueryBuilder('job')
      .leftJoin('karyawan', 'karyawan', 'karyawan.id_job = job.id')
      .addSelect('COUNT(karyawan.id)', 'jumlah_karyawan')
      .groupBy('job.id')
      .skip(skip)
      .take(page_size)
      .orderBy('job.created_at','DESC')
      .getManyAndCount();

    return {
      data,
      count,
    };
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
    const data = await this.jobRepository.findOne({ where: { id } });
    const jumlah_karyawan = await this.karyawanRepository.createQueryBuilder('karyawan')
      .where('karyawan.id_job = :id', { id })
      .getCount();

    return { data, jumlah_karyawan }
  }

  /**
   * Meng-update job
   */
  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.jobRepository.update({ id }, updateJobDto);
    return await this.jobRepository.findOne({ where: { id } });
  }

}
