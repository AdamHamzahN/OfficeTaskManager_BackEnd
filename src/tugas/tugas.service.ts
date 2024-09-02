import { Injectable } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { UpdateTugasDto } from './dto/update-tugas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tugas } from './entities/tugas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TugasService {
  constructor(
    @InjectRepository(Tugas)
    private tugasRepository: Repository<Tugas>,
  ){}


  async create(createTugasDto: CreateTugasDto,file:Express.Multer.File) {
    const tugas = new Tugas();
    tugas.nama_tugas = createTugasDto.nama_tugas;
    tugas.deskripsi_tugas = createTugasDto.deskripsi_tugas;
    tugas.deadline = new Date(createTugasDto.deadline);
    tugas.project = createTugasDto.id_project;
    tugas.karyawan = createTugasDto.id_karyawan;
    tugas.file_tugas = file?.path;

    return await this.tugasRepository.save(tugas);
  }

  async findAll() {
    const [data, count] = await this.tugasRepository.createQueryBuilder('tugas')
    .leftJoinAndSelect('tugas.karyawan', 'karyawan')
    .leftJoinAndSelect('tugas.project','project')
    .getManyAndCount();
    return {
      data,
      count,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} tugas`;
  }

  update(id: number, updateTugasDto: UpdateTugasDto) {
    return `This action updates a #${id} tugas`;
  }

  remove(id: number) {
    return `This action removes a #${id} tugas`;
  }
}
