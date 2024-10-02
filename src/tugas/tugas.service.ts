import { Injectable } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { statusTugas, Tugas } from './entities/tugas.entity';
import { Repository } from 'typeorm';
import { UpdateStatusTugasDto } from './dto/update-status-tugas.dto';
import { UploadFileBukti } from './dto/upload-file-bukti.dto';
import * as path from 'path';
import * as fs from 'fs';
import { check } from 'prettier';
import { Team } from '#/team/entities/team.entity';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '#/users/entities/user.entity';
import { statusProject } from '#/project/entities/project.entity';


@Injectable()
export class TugasService {
  constructor(
    @InjectRepository(Tugas)
    private tugasRepository: Repository<Tugas>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) { }

  /**
   * Membuat tugas baru
   */
  async create(createTugasDto: CreateTugasDto, file: Express.Multer.File) {
    const checkProject = this.teamRepository.createQueryBuilder('team')

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
      .leftJoin('karyawan.user', 'user')
      .addSelect('user.nama')
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
        if (project.file_bukti !== null) {
          const oldFilePath = path.resolve(project.file_bukti);
          if (fs.existsSync(oldFilePath)) {
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

  async countTugasKaryawan(idKaryawan: string, idProject: string) {
    // Menghitung jumlah tugas berdasarkan karyawan dan proyek
    const countAll = await this.tugasRepository.count({
      where: {
        karyawan: { id: idKaryawan },
        project: { id: idProject },
      },
    });

    const countSelesai = await this.tugasRepository.count({
      where: {
        karyawan: { id: idKaryawan },
        project: { id: idProject },
        status: statusTugas.approved
      },
    });
    return {
      countAll,
      countSelesai,

    }
  }

  async getTugasByProject(id: string) {
    const data = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.project', 'project')
      .where('project.id = :id', { id })
      .getMany();

    return data;
  }
  async getTugasDoneByProject(id: string) {
    return await this.tugasRepository.find({
      where: {
        project: { id: id },
        status: statusTugas.done
      },
      relations: ['project', 'karyawan', 'karyawan.user']
    });
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto) {
    const tugas = await this.tugasRepository.findOneBy({ id });
    tugas.note = updateNoteDto.note;
    return this.tugasRepository.save(tugas);
  }

  async getNewTugas(id: string) {
    const newTugas = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .addSelect('user.nama')
      .where('user.id = :id', { id })
      .orderBy('tugas.updated_at', 'DESC')
      .limit(3)
      .getMany();


    return newTugas;
  }

  // async getTugasByIdUser(id:string){
  //   const newTugas = await this.tugasRepository.createQueryBuilder('tugas')
  //     .leftJoin('tugas.karyawan', 'karyawan')
  //     .leftJoin('karyawan.user', 'user')
  //     .addSelect('user.nama')
  //     .where('user.id = :id', { id })
  //     .getMany();
  // }

  async getTugasKaryawanByProject(id: string) {
    const tugas = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .where('user.id = :id', { id })
      .leftJoin('tugas.project', 'project')
      .andWhere('project.status != :status', { status: statusProject.approved })
      .addSelect(['project.nama_project', 'project.status'])
      .getMany();

    const jumlahSelesai = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .leftJoin('tugas.project', 'project')
      .where('user.id = :id', { id })
      .andWhere('project.status != :statusProjectApproved', { statusProjectApproved: statusProject.approved })
      .andWhere('tugas.status = :statusSelesai', { statusSelesai: statusTugas.approved })
      .getCount();

    const jumlahBelumSelesai = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .leftJoin('tugas.project', 'project')
      .where('user.id = :id', { id })
      .andWhere('project.status != :statusProjectApproved', { statusProjectApproved: statusProject.approved })
      .andWhere('tugas.status != :statusSelesai', { statusSelesai: statusTugas.approved })
      .getCount();

    const result = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .leftJoin('tugas.project', 'project')
      .where('user.id = :id', { id })
      .andWhere('project.status != :statusProjectApproved', { statusProjectApproved: statusProject.approved })
      .select('project.nama_project', 'nama_project') // Alias 'nama_project' untuk kemudahan akses
      .getRawOne();

    const nama_project = result ? result.nama_project : null;

    return {
      tugas,
      jumlahSelesai,
      jumlahBelumSelesai,
      nama_project
    };
  }


}
