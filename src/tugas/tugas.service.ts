import { Injectable } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tugas } from './entities/tugas.entity';
import { Repository } from 'typeorm';
import { UpdateStatusTugasDto } from './dto/update-status-tugas.dto';
import { UploadFileBukti } from './dto/upload-file-bukti.dto';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class TugasService {
  constructor(
    @InjectRepository(Tugas)
    private tugasRepository: Repository<Tugas>,
  ) { }

  /**
   * Membuat tugas baru
   */
  async create(createTugasDto: CreateTugasDto, file: Express.Multer.File) {
    const tugas = new Tugas();
    tugas.nama_tugas = createTugasDto.nama_tugas;
    tugas.deskripsi_tugas = createTugasDto.deskripsi_tugas;
    tugas.deadline = new Date(createTugasDto.deadline);
    tugas.project = createTugasDto.id_project;
    tugas.karyawan = createTugasDto.id_karyawan;
    tugas.file_tugas = file?.path;

    return await this.tugasRepository.save(tugas);
  }

  /**
   * Memanggil semua tugas
   */
  async findAll() {
    const [data, count] = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.karyawan', 'karyawan')
      .leftJoinAndSelect('tugas.project', 'project')
      .getManyAndCount();
    return {
      data,
      count,
    };
  }

  /**
   * Memanggil tugas berdasarkan Id
   */
  async findOne(id: string) {
    const project = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.karyawan', 'karyawan')
      .leftJoinAndSelect('tugas.project', 'project')
      .where('tugas.id = :id', { id })
      .getOne();

    return project;
  }

  /**
   * Update Status tugas
   */
  async updateStatusTugas(id: string, updateStatusTugasDto: UpdateStatusTugasDto) {
    const tugas = await this.tugasRepository.findOneBy({ id });
    tugas.status = updateStatusTugasDto.status;

    return this.tugasRepository.save(tugas);
  }

  /**
   * Upload File Bukti hasil pengerjaan tugas
   */
  async uploadFileBukti(id: string, uploadFileBukti: UploadFileBukti, file: Express.Multer.File) {
    try {
      const project = await this.tugasRepository.findOneBy({ id });
      if (uploadFileBukti) {
        if (project.file_bukti) {
          const oldFilePath = path.resolve(project.file_bukti);

          if (fs.existsSync(oldFilePath)) {
            // Hapus file lama
            fs.unlinkSync(oldFilePath);
          }
        }
        // Buat file baru
        project.file_bukti = file.path;
        // Simpan perubahan ke database
        const data = await this.tugasRepository.save(project);
        return {
          data,
          message: 'File bukti berhasil diunggah.'
        };
      } else {
        return { message: 'UploadFileBukti tidak valid.' };
      }
    } catch (error) {
      console.error('Error saat mengunggah file bukti:', error);
      throw new Error('Gagal mengunggah file bukti.');  
    }
  }

  async getTugasByKaryawan(id: string) {
    return await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.karyawan', 'karyawan')
      .leftJoinAndSelect('tugas.project', 'project')
      .where('karyawan.id = :id', { id })
      .getMany();
  }

  async getTugasByTeamLead(id: string) {
    const data = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where('user.id = :id', { id: id })
      .orderBy('tugas.updated_at', 'DESC') 
      .limit(3).getMany()

      return data;
  }
  


}
