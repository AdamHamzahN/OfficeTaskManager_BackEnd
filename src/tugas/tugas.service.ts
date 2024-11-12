import { Injectable } from '@nestjs/common';
import { CreateTugasDto } from './dto/create-tugas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { statusTugas, Tugas } from './entities/tugas.entity';
import { Repository } from 'typeorm';
import { UpdateStatusTugasDto } from './dto/update-status-tugas.dto';
import { UploadFileBukti } from './dto/upload-file-bukti.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Team } from '#/team/entities/team.entity';
import { UpdateNoteDto } from './dto/update-note.dto';
import { statusProject } from '#/project/entities/project.entity';
import { UploadFileTugas } from './dto/upload-file-tugas';


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
  async create(createTugasDto: CreateTugasDto) {
    const tugas = new Tugas();
    tugas.nama_tugas = createTugasDto.nama_tugas;
    tugas.deskripsi_tugas = createTugasDto.deskripsi_tugas;
    tugas.deadline = new Date(createTugasDto.deadline);
    tugas.project = createTugasDto.id_project;
    tugas.karyawan = createTugasDto.id_karyawan;

    return await this.tugasRepository.save(tugas);
  }

  async uploadFileTugas(id: string, uploadFileTugas: UploadFileTugas, file: Express.Multer.File) {
    try {
      const project = await this.tugasRepository.findOneBy({ id });
      if (uploadFileTugas) {
        // Buat file baru
        project.file_tugas = file.path;
        const data = await this.tugasRepository.save(project);
        return {
          data,
          message: 'File Tugas berhasil diunggah.'
        };
      } else {
        return { message: 'File tidak valid.' };
      }
    } catch (error) {
      console.error('Error saat mengunggah file bukti:', error);
      throw new Error('Gagal mengunggah file bukti.');
    }
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

  async getTugasByKaryawan(id: string, page: number, page_size: number) {
    const skip = (page - 1) * page_size;
    const [data, count] = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.karyawan', 'karyawan')
      .leftJoinAndSelect('karyawan.user','user')
      .leftJoinAndSelect('tugas.project', 'project')
      .where('karyawan.id = :id', { id })
      .skip(skip)
      .take(page_size)
      .orderBy('tugas.created_at', 'DESC')
      .getManyAndCount();
    return { data, count }
  }

  async getTugasByTeamLead(id: string) {
    const data = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoinAndSelect('tugas.project', 'project')
      .leftJoinAndSelect('project.user', 'user')
      .where('user.id = :id', { id: id })
      .orderBy('tugas.updated_at', 'DESC')
      .select(['tugas.nama_tugas', 'tugas.status', 'tugas.updated_at', 'user.nama', 'project.nama_project'])
      .limit(3).getMany()

    return data;
  }

  async countTugasKaryawan(idKaryawan: string, idProject: string) {
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

  async getTugasByProject(id: string, page: number, page_size: number) {
    const skip = (page - 1) * page_size;
    const [data, count] = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.project', 'project')
      .where('project.id = :id', { id })
      .skip(skip)
      .take(page_size)
      .orderBy('tugas.created_at', 'DESC')
      .getManyAndCount();

    return { data, count };
  }

  async getTugasDoneByProject(id: string) {
    const tugas = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.project', 'project')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .where('project.id = :id', { id })
      .andWhere('tugas.status = :status', { status: statusTugas.done })
      .select([
        'tugas',
        'project.id', 'project.nama_project',
        'karyawan.id', 'user.nama',
      ])
      .getMany();

    return tugas;
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
      .where('user.id = :id', { id })
      .orderBy('tugas.updated_at', 'ASC')
      .select(['tugas.nama_tugas', 'tugas.status', 'tugas.updated_at'])
      .limit(3)
      .getMany();

    return newTugas;
  }

  async getTugasKaryawanByProject(id: string) {
    const tugas = await this.tugasRepository.createQueryBuilder('tugas')
    .leftJoin('tugas.project', 'project') 
    .leftJoin('tugas.karyawan', 'karyawan') 
    .leftJoin('karyawan.user', 'user') 
    .where('user.id = :id', { id }) 
    .andWhere('project.status != :status', { status: statusProject.approved }) 
    .select([
        'tugas.id',
        'tugas.nama_tugas',
        'tugas.updated_at',
        'tugas.status',
        'tugas.deadline',
        'project.nama_project',
        'project.status'
    ])
    .orderBy('tugas.updated_at', 'DESC') 
    .take(3)
    .getMany();


    const jumlahSelesai = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('karyawan.team','team')
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

    const result = await this.teamRepository.createQueryBuilder('team')
      .leftJoin('team.karyawan', 'karyawan')
      .leftJoin('karyawan.user', 'user')
      .leftJoin('team.project', 'project')
      .where('user.id = :id', { id })
      .andWhere('project.status != :statusProjectApproved', { statusProjectApproved: statusProject.approved })
      .select(['project.nama_project AS nama_project', 'project.id AS id_project'])
      .getRawOne();

    const nama_project = result ? result.nama_project : null;
    const id_project = result ? result.id_project : null;

    return {
      tugas,
      jumlahSelesai,
      jumlahBelumSelesai,
      nama_project,
      id_project
    };
  }

  async getTugasProjectKaryawanByIdUser(id: string,id_project:string,page:number,page_size:number) {
    const skip = (page - 1) * page_size;
    const [data,count] = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoinAndSelect('karyawan.user', 'user')
      .leftJoin('tugas.project','project')
      .where('user.id = :id', { id })
      .andWhere('project.id = :id_project',{id_project})
      .addSelect('user.id', 'user.nama')
      .skip(skip)
      .take(page_size)
      .orderBy('tugas.created_at', 'DESC')
      .getManyAndCount();
    return {data,count};
  }

  async getTugasKaryawanBelumSelesai(id: string,id_project:string, page: number, page_size: number) {
    const skip = (page - 1) * page_size;
    const [data, count] = await this.tugasRepository.createQueryBuilder('tugas')
      .leftJoin('tugas.karyawan', 'karyawan')
      .leftJoin('tugas.project','project')
      .leftJoinAndSelect('karyawan.user', 'user')
      .where('user.id = :id', { id })
      .andWhere('tugas.status !=:status', { status: statusTugas.approved || statusTugas.done })
      .andWhere('project.id =:id_project',{id_project})
      .addSelect('user.id', 'user.nama',)
      .skip(skip)
      .take(page_size)
      .orderBy('tugas.updated_at', 'DESC')
      .getManyAndCount();
    return { data, count };
  }
}
